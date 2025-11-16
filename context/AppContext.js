import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedQuestions = await AsyncStorage.getItem('questions');
      const storedVotes = await AsyncStorage.getItem('votedQuestions');
      const storedStats = await AsyncStorage.getItem('userStats');
      const storedSettings = await AsyncStorage.getItem('settings');
      const storedGuest = await AsyncStorage.getItem('isGuest');

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedGuest === 'true') setIsGuest(true);
      if (storedQuestions) setQuestions(JSON.parse(storedQuestions));
      if (storedVotes) setVotedQuestions(JSON.parse(storedVotes));
      if (storedStats) {
        const stats = JSON.parse(storedStats);
        setQuestionsAsked(stats.questionsAsked || 0);
        setSupportsGiven(stats.supportsGiven || 0);
      }
      if (storedSettings) setSettings(JSON.parse(storedSettings));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const login = async (email, password) => {
    const userData = { email, id: Date.now().toString() };
    setUser(userData);
    setIsGuest(false);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    await AsyncStorage.setItem('isGuest', 'false');
  };

  const loginAsGuest = async () => {
    setIsGuest(true);
    setUser({ id: `guest_${Date.now()}`, email: 'guest' });
    await AsyncStorage.setItem('isGuest', 'true');
    await AsyncStorage.setItem('user', JSON.stringify({ id: `guest_${Date.now()}`, email: 'guest' }));
  };

  const addQuestion = async (question, answer) => {
    const newQuestion = {
      id: Date.now().toString(),
      question,
      answer,
      supports: 0,
      dontSupports: 0,
      createdAt: new Date().toISOString(),
      userId: user?.id || 'guest',
    };
    const updatedQuestions = [newQuestion, ...questions];
    setQuestions(updatedQuestions);
    setQuestionsAsked(prev => prev + 1);
    await AsyncStorage.setItem('questions', JSON.stringify(updatedQuestions));
    await AsyncStorage.setItem('userStats', JSON.stringify({
      questionsAsked: questionsAsked + 1,
      supportsGiven,
    }));
  };

  const voteQuestion = async (questionId, voteType) => {
    if (votedQuestions[questionId]) {
      return; // Already voted
    }

    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          supports: voteType === 'support' ? q.supports + 1 : q.supports,
          dontSupports: voteType === 'dontSupport' ? q.dontSupports + 1 : q.dontSupports,
        };
      }
      return q;
    });

    setQuestions(updatedQuestions);
    setVotedQuestions({ ...votedQuestions, [questionId]: voteType });
    
    if (voteType === 'support') {
      setSupportsGiven(prev => prev + 1);
    }

    await AsyncStorage.setItem('questions', JSON.stringify(updatedQuestions));
    await AsyncStorage.setItem('votedQuestions', JSON.stringify({ ...votedQuestions, [questionId]: voteType }));
    await AsyncStorage.setItem('userStats', JSON.stringify({
      questionsAsked,
      supportsGiven: voteType === 'support' ? supportsGiven + 1 : supportsGiven,
    }));
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

