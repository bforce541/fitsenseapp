import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [supportsGiven, setSupportsGiven] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [votedQuestions, setVotedQuestions] = useState({});
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    privacy: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    subscribeToQuestions();
  }, []);

  const loadData = async () => {
    try {
      // Load local settings and guest status
      const storedSettings = await AsyncStorage.getItem('settings');
      const storedGuest = await AsyncStorage.getItem('isGuest');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedSettings) setSettings(JSON.parse(storedSettings));
      if (storedGuest === 'true') setIsGuest(true);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        await loadUserStats(userData.id);
      }

      // Load all questions from Supabase
      await loadQuestions();
      
      // Load user's votes if logged in
      if (user?.id && !isGuest) {
        await loadUserVotes(user.id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        // Transform snake_case to camelCase for components
        const transformed = data.map(q => ({
          id: q.id,
          question: q.question,
          answer: q.answer,
          supports: q.supports,
          dontSupports: q.dont_supports, // Map to camelCase
          userId: q.user_id,
          userEmail: q.user_email,
          createdAt: q.created_at,
        }));
        setQuestions(transformed);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const loadUserStats = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      
      if (data) {
        setQuestionsAsked(data.questions_asked || 0);
        setSupportsGiven(data.supports_given || 0);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const loadUserVotes = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('question_id, vote_type')
        .eq('user_id', userId);

      if (error) throw error;
      
      if (data) {
        const votesMap = {};
        data.forEach(vote => {
          votesMap[vote.question_id] = vote.vote_type === 'support' ? 'support' : 'dontSupport';
        });
        setVotedQuestions(votesMap);
      }
    } catch (error) {
      console.error('Error loading votes:', error);
    }
  };

  const subscribeToQuestions = () => {
    const channel = supabase
      .channel('questions-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'questions' },
        (payload) => {
          loadQuestions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const login = async (email, password) => {
    try {
      // For now, simple login without Supabase Auth
      // You can upgrade to Supabase Auth later
      const userData = { email, id: `user_${Date.now()}` };
      setUser(userData);
      setIsGuest(false);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('isGuest', 'false');
      
      // Initialize user stats if doesn't exist
      await loadUserStats(userData.id);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginAsGuest = async () => {
    setIsGuest(true);
    const guestUser = { id: `guest_${Date.now()}`, email: 'guest' };
    setUser(guestUser);
    await AsyncStorage.setItem('isGuest', 'true');
    await AsyncStorage.setItem('user', JSON.stringify(guestUser));
  };

  const addQuestion = async (question, answer) => {
    try {
      const newQuestion = {
        question,
        answer,
        supports: 0,
        dont_supports: 0,
        user_id: isGuest ? null : user?.id,
        user_email: isGuest ? 'guest' : user?.email,
      };

      const { data, error } = await supabase
        .from('questions')
        .insert([newQuestion])
        .select()
        .single();

      if (error) throw error;

      // Transform and update local state
      const transformedQuestion = {
        id: data.id,
        question: data.question,
        answer: data.answer,
        supports: data.supports,
        dontSupports: data.dont_supports,
        userId: data.user_id,
        userEmail: data.user_email,
        createdAt: data.created_at,
      };
      setQuestions([transformedQuestion, ...questions]);
      
      // Update user stats if not guest
      if (!isGuest && user?.id) {
        const newCount = questionsAsked + 1;
        setQuestionsAsked(newCount);
        
        await supabase
          .from('user_stats')
          .upsert({
            user_id: user.id,
            user_email: user.email,
            questions_asked: newCount,
            supports_given: supportsGiven,
          }, { onConflict: 'user_id' });
      } else {
        setQuestionsAsked(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error adding question:', error);
      throw error;
    }
  };

  const voteQuestion = async (questionId, voteType) => {
    try {
      // Check if already voted
      if (votedQuestions[questionId]) {
        return;
      }

      // For guests, store vote locally only
      if (isGuest) {
        const updatedQuestions = questions.map(q => {
          if (q.id === questionId) {
            return {
              ...q,
              supports: voteType === 'support' ? q.supports + 1 : q.supports,
              dont_supports: voteType === 'dontSupport' ? q.dont_supports + 1 : q.dont_supports,
            };
          }
          return q;
        });
        setQuestions(updatedQuestions);
        setVotedQuestions({ ...votedQuestions, [questionId]: voteType });
        if (voteType === 'support') {
          setSupportsGiven(prev => prev + 1);
        }
        return;
      }

      // For logged-in users, save to Supabase
      if (!user?.id) return;

      // Insert vote
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          question_id: questionId,
          user_id: user.id,
          vote_type: voteType === 'support' ? 'support' : 'dont_support',
        });

      if (voteError) throw voteError;

      // Update question vote counts
      const question = questions.find(q => q.id === questionId);
      if (question) {
        const updateData = {};
        if (voteType === 'support') {
          updateData.supports = question.supports + 1;
        } else {
          updateData.dont_supports = (question.dontSupports || 0) + 1;
        }

        const { error: updateError } = await supabase
          .from('questions')
          .update(updateData)
          .eq('id', questionId);

        if (updateError) throw updateError;
      }

      // Update local state
      setVotedQuestions({ ...votedQuestions, [questionId]: voteType });
      
      if (voteType === 'support') {
        const newCount = supportsGiven + 1;
        setSupportsGiven(newCount);
        
        await supabase
          .from('user_stats')
          .upsert({
            user_id: user.id,
            user_email: user.email,
            questions_asked: questionsAsked,
            supports_given: newCount,
          }, { onConflict: 'user_id' });
      }

      // Reload questions to get updated counts
      await loadQuestions();
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    }
  };

  const updateSettings = async (newSettings) => {
    setSettings(newSettings);
    await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
  };

  const getTrendingQuestions = () => {
    return [...questions]
      .sort((a, b) => b.supports - a.supports)
      .slice(0, 10);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isGuest,
        questionsAsked,
        supportsGiven,
        questions,
        votedQuestions,
        settings,
        loading,
        login,
        loginAsGuest,
        addQuestion,
        voteQuestion,
        updateSettings,
        getTrendingQuestions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
