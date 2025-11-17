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
    // Check for existing Supabase session
    checkAuthSession();
    loadData();
    subscribeToQuestions();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email,
        });
        setIsGuest(false);
        loadUserStats(session.user.id);
      } else {
        setUser(null);
        setIsGuest(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
      const channel = supabase.channel('questions-changes');
      supabase.removeChannel(channel);
    };
  }, []);

  const checkAuthSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email,
        });
        setIsGuest(false);
        await AsyncStorage.setItem('user', JSON.stringify({
          id: session.user.id,
          email: session.user.email,
        }));
        await AsyncStorage.setItem('isGuest', 'false');
        await loadUserStats(session.user.id);
      } else {
        // Check for local guest/user data
        const storedUser = await AsyncStorage.getItem('user');
        const storedGuest = await AsyncStorage.getItem('isGuest');
        if (storedUser && storedGuest === 'true') {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsGuest(true);
        }
      }
    } catch (error) {
      console.error('Error checking auth session:', error);
    }
  };

  const loadData = async () => {
    try {
      // Load local settings and guest status first (fast)
      const storedSettings = await AsyncStorage.getItem('settings');
      const storedGuest = await AsyncStorage.getItem('isGuest');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedSettings) setSettings(JSON.parse(storedSettings));
      if (storedGuest === 'true') setIsGuest(true);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Load stats in background
        loadUserStats(userData.id).catch(e => console.log('Stats load error:', e));
      }

      // Set loading to false early so UI can render
      setLoading(false);

      // Load questions in background (may fail if Supabase not set up)
      loadQuestions().catch(e => console.log('Questions load error:', e));
      
      // Load user's votes if logged in (in background)
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.id && storedGuest !== 'true') {
          loadUserVotes(userData.id).catch(e => console.log('Votes load error:', e));
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Always set loading to false even on error
      setLoading(false);
    }
  };

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100); // Limit to prevent large queries

      if (error) {
        // If table doesn't exist, just continue with empty array
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.log('Questions table not found - using empty array');
          setQuestions([]);
          return;
        }
        throw error;
      }
      if (data) {
        // Transform snake_case to camelCase for components
        const transformed = data.map(q => ({
          id: q.id,
          question: q.question,
          answer: q.answer,
          supports: q.supports || 0,
          dontSupports: q.dont_supports || 0, // Map to camelCase
          userId: q.user_id,
          userEmail: q.user_email,
          createdAt: q.created_at,
        }));
        setQuestions(transformed);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      // Set empty array on error so app doesn't hang
      setQuestions([]);
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
    try {
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
        try {
          supabase.removeChannel(channel);
        } catch (e) {
          console.log('Error removing channel:', e);
        }
      };
    } catch (error) {
      console.log('Error setting up subscription:', error);
      // Continue without subscription if it fails
      return () => {};
    }
  };

  const signUp = async (email, password) => {
    try {
      console.log('Calling supabase.auth.signUp...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log('Supabase signUp response:', { data, error });

      if (error) {
        console.error('Supabase signUp error:', error);
        return { user: null, error: error.message };
      }

      // Note: Supabase may require email confirmation
      // If email confirmation is enabled, data.user will be null until confirmed
      // For now, we'll proceed if we get a session or user
      if (data.user || data.session) {
        const user = data.user || data.session?.user;
        if (user) {
          setUser({
            id: user.id,
            email: user.email,
          });
          setIsGuest(false);
          await AsyncStorage.setItem('user', JSON.stringify({
            id: user.id,
            email: user.email,
          }));
          await AsyncStorage.setItem('isGuest', 'false');
          await loadUserStats(user.id);
          return { user, error: null };
        }
      }

      // If email confirmation is required, user might be null but signup succeeded
      if (data.user === null && !error) {
        return { 
          user: null, 
          error: 'Please check your email to confirm your account. Then try logging in.' 
        };
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: error.message || 'Failed to create account' };
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
        });
        setIsGuest(false);
        await AsyncStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
        }));
        await AsyncStorage.setItem('isGuest', 'false');
        await loadUserStats(data.user.id);
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsGuest(false);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('isGuest');
    } catch (error) {
      console.error('Sign out error:', error);
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
      if (!user?.id && !isGuest) {
        throw new Error('Must be logged in to add questions');
      }

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
            user_email: user.email || '',
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

  // Calorie tracking functions
  const addCalorieEntry = async (date, calories) => {
    try {
      if (isGuest || !user?.id) {
        throw new Error('Must be logged in to track calories');
      }

      // First, try to update existing entry for this date
      const { data: existingData, error: checkError } = await supabase
        .from('calorie_entries')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', date)
        .single();

      let result;
      if (existingData) {
        // Update existing entry
        const { data, error } = await supabase
          .from('calorie_entries')
          .update({
            calories: calories,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingData.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Insert new entry
        const { data, error } = await supabase
          .from('calorie_entries')
          .insert({
            user_id: user.id,
            date: date,
            calories: calories,
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }

      return result;
    } catch (error) {
      console.error('Error adding calorie entry:', error);
      throw error;
    }
  };

  const getCalorieEntries = async (startDate, endDate) => {
    try {
      if (isGuest || !user?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('calorie_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting calorie entries:', error);
      return [];
    }
  };

  const getMonthlyCalories = async () => {
    try {
      if (isGuest || !user?.id) {
        return [];
      }

      const now = new Date();
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('calorie_entries')
        .select('date, calories')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .lte('date', now.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      // Fill in missing dates with 0 calories
      const result = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const entry = data?.find(d => d.date === dateStr);
        result.push({
          date: dateStr,
          calories: entry ? entry.calories : 0,
        });
      }

      return result;
    } catch (error) {
      console.error('Error getting monthly calories:', error);
      return [];
    }
  };

  const getYearlyCalories = async () => {
    try {
      if (isGuest || !user?.id) {
        return [];
      }

      const now = new Date();
      const yearStart = new Date(now.getFullYear(), 0, 1);

      const { data, error } = await supabase
        .from('calorie_entries')
        .select('date, calories')
        .eq('user_id', user.id)
        .gte('date', yearStart.toISOString().split('T')[0])
        .lte('date', now.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      // Group by month and calculate average
      const monthlyData = {};
      data?.forEach(entry => {
        const date = new Date(entry.date);
        const month = date.getMonth();
        if (!monthlyData[month]) {
          monthlyData[month] = { total: 0, count: 0 };
        }
        monthlyData[month].total += entry.calories;
        monthlyData[month].count += 1;
      });

      // Create array with all 12 months
      const result = [];
      for (let month = 0; month < 12; month++) {
        if (monthlyData[month]) {
          result.push({
            month: month,
            avgCalories: Math.round(monthlyData[month].total / monthlyData[month].count),
          });
        } else {
          result.push({
            month: month,
            avgCalories: 0,
          });
        }
      }

      return result;
    } catch (error) {
      console.error('Error getting yearly calories:', error);
      return [];
    }
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
        signUp,
        login,
        signOut,
        loginAsGuest,
        addQuestion,
        voteQuestion,
        updateSettings,
        getTrendingQuestions,
        addCalorieEntry,
        getCalorieEntries,
        getMonthlyCalories,
        getYearlyCalories,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
