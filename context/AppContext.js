import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';

const CALORIE_TABLE = 'calorie_tracker';
const AppContext = createContext();

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};

export const AppProvider = ({ children }) => {
  // USER
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  // LOCAL DEMO STATS (NO SUPABASE)
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [supportsGiven, setSupportsGiven] = useState(0);

  // QUESTIONS + VOTES
  const [questions, setQuestions] = useState([]);
  const [votedQuestions, setVotedQuestions] = useState({});

  // SETTINGS
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    privacy: true,
  });

  const [loading, setLoading] = useState(true);

  // -----------------------------------------
  // LOAD SESSION + LOCAL STATS
  // -----------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const guestFlag = await AsyncStorage.getItem("isGuest");
        const storedStats = await AsyncStorage.getItem("local_stats");

        if (storedUser) setUser(JSON.parse(storedUser));
        if (guestFlag === "true") setIsGuest(true);

        if (storedStats) {
          const parsed = JSON.parse(storedStats);
          setQuestionsAsked(parsed.questionsAsked ?? 0);
          setSupportsGiven(parsed.supportsGiven ?? 0);
        }

        setLoading(false);
      } catch (err) {
        console.log("load error:", err);
        setLoading(false);
      }
    };
    load();
  }, []);

  // -----------------------------------------
  // SAVE LOCAL STATS
  // -----------------------------------------
  const saveStats = async (qa, sg) => {
    // Don't set state here - state is already updated by the increment functions
    // Just save to storage
    await AsyncStorage.setItem("local_stats", JSON.stringify({ questionsAsked: qa, supportsGiven: sg }));
  };

  // Auto-save stats whenever they change
  useEffect(() => {
    if (questionsAsked > 0 || supportsGiven > 0) {
      saveStats(questionsAsked, supportsGiven).catch(err => console.log('Auto-save error:', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsAsked, supportsGiven]);

  // -----------------------------------------
  // AUTH FUNCTIONS
  // -----------------------------------------
  const loginAsGuest = async () => {
    const guest = { id: "guest_" + Date.now(), email: "guest" };
    setUser(guest);
    setIsGuest(true);
    await AsyncStorage.setItem("user", JSON.stringify(guest));
    await AsyncStorage.setItem("isGuest", "true");
  };

  const signOut = async () => {
    try {
      console.log('🔄 Starting logout process...');

      // Clear all user state FIRST (synchronous) - this triggers navigation
      setUser(null);
      setIsGuest(false);

      // Reset fully for demo
      setQuestionsAsked(0);
      setSupportsGiven(0);
      setVotedQuestions({});
      setQuestions([]);

      console.log('✅ User state cleared - user:', null, 'isGuest:', false);

      // Then do async cleanup (don't wait for these)
      supabase.auth.signOut().catch(() => { });
      AsyncStorage.removeItem("user").catch(() => { });
      AsyncStorage.removeItem("isGuest").catch(() => { });
      AsyncStorage.removeItem("local_stats").catch(() => { });

      console.log('✅ Logout complete - should navigate to login screen');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear state even if there's an error
      setUser(null);
      setIsGuest(false);
      throw error;
    }
  };

  // -----------------------------------------
  // STAT INCREMENTS FOR DEMO
  // -----------------------------------------
  const incrementQuestionsAsked = () => {
    // Use functional update to avoid stale state
    setQuestionsAsked(prev => {
      const newCount = prev + 1;
      console.log('✅ Questions Asked incremented:', newCount);
      return newCount;
    });
  };

  const incrementSupportsGiven = () => {
    // Use functional update to avoid stale state
    setSupportsGiven(prev => {
      const newCount = prev + 1;
      console.log('✅ Supports Given incremented:', newCount);
      return newCount;
    });
  };

  // -----------------------------------------
  // LOAD QUESTIONS FROM SUPABASE
  // -----------------------------------------
  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error || !data) {
        setQuestions([]);
        return;
      }

      const cleaned = data.map(q => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        supports: q.supports || 0,
        dontSupports: q.dont_supports || 0,
        userId: q.user_id,
        userEmail: q.user_email,
        createdAt: q.created_at,
      }));

      setQuestions(cleaned);
    } catch (err) {
      console.log("loadQuestions error:", err);
      setQuestions([]);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  // -----------------------------------------
  // ADD QUESTION (AI ASK)
  // -----------------------------------------
  const addQuestion = async (question, answer) => {
    const entry = {
      question,
      answer,
      supports: 0,
      dont_supports: 0,
      user_id: isGuest ? null : user?.id,
      user_email: isGuest ? "guest" : user?.email,
    };

    try {
      const { data, error } = await supabase
        .from("questions")
        .insert([entry])
        .select()
        .single();

      if (error) throw error;

      const newQ = {
        id: data.id,
        question: data.question,
        answer: data.answer,
        supports: data.supports || 0,
        dontSupports: data.dont_supports || 0,
        userId: data.user_id,
        userEmail: data.user_email,
        createdAt: data.created_at,
      };

      setQuestions(prev => [newQ, ...prev]);

      // Return the question so caller can use the ID
      return newQ;
    } catch (err) {
      console.log("addQuestion error:", err);
      throw err;
    }
  };

  // -----------------------------------------
  // VOTE (UPDATE QUESTION + PROFILE)
  // -----------------------------------------
  const voteQuestion = async (questionId, voteType) => {
    if (votedQuestions[questionId]) return;

    // Update UI instantly
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? {
            ...q,
            supports:
              voteType === "support" ? (q.supports || 0) + 1 : q.supports,
            dontSupports:
              voteType === "dontSupport" ? (q.dontSupports || 0) + 1 : q.dontSupports,
          }
          : q
      )
    );

    setVotedQuestions(prev => ({ ...prev, [questionId]: voteType }));

    // UPDATE PROFILE STAT IF SUPPORT
    if (voteType === "support") {
      incrementSupportsGiven();
    }

    // Save vote to DB (fire + forget)
    if (!isGuest && user?.id) {
      supabase.from("votes").insert({
        question_id: questionId,
        user_id: user.id,
        vote_type: voteType === "support" ? "support" : "dont_support",
      })
        .catch(err => console.log("vote save error:", err));
    }
  };

  // -----------------------------------------
  // SETTINGS UPDATE
  // -----------------------------------------
  const updateSettings = async newSettings => {
    setSettings(newSettings);
    await AsyncStorage.setItem("settings", JSON.stringify(newSettings));
  };

  // -----------------------------------------
  // GET TRENDING
  // -----------------------------------------
  const getTrendingQuestions = () => {
    return [...questions].sort((a, b) => b.supports - a.supports).slice(0, 10);
  };

  // -----------------------------------------
  // CALORIE TRACKER FUNCTIONS
  // -----------------------------------------
  const addCalorieEntry = async (date, calories) => {
    try {
      if (isGuest || !user?.id) {
        throw new Error('Must be logged in to track calories');
      }

      // Check if entry exists for this date
      const { data: existingData, error: checkError } = await supabase
        .from(CALORIE_TABLE)
        .select('id')
        .eq('user_id', user.id)
        .eq('date', date)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let result;
      if (existingData && existingData.id) {
        // Update existing entry
        const { data, error } = await supabase
          .from(CALORIE_TABLE)
          .update({ calories: calories, updated_at: new Date().toISOString() })
          .eq('id', existingData.id)
          .select()
          .single();
        if (error) throw error;
        result = data;
      } else {
        // Insert new entry
        const { data, error } = await supabase
          .from(CALORIE_TABLE)
          .insert({ user_id: user.id, date: date, calories: calories })
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
        .from(CALORIE_TABLE)
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
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];
      const endDate = now.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from(CALORIE_TABLE)
        .select('date, calories')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
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
      const startDate = yearStart.toISOString().split('T')[0];
      const endDate = now.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from(CALORIE_TABLE)
        .select('date, calories')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) throw error;

      // Group by month and calculate average
      const monthlyData = {};
      (data || []).forEach(entry => {
        const month = new Date(entry.date).getMonth();
        if (!monthlyData[month]) {
          monthlyData[month] = { total: 0, count: 0 };
        }
        monthlyData[month].total += entry.calories || 0;
        monthlyData[month].count += 1;
      });

      return Object.keys(monthlyData).map(month => ({
        month: parseInt(month),
        avgCalories: Math.round(monthlyData[month].total / monthlyData[month].count),
      }));
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
        signOut,
        loginAsGuest,
        addQuestion,
        voteQuestion,
        updateSettings,
        getTrendingQuestions,
        incrementQuestionsAsked,
        incrementSupportsGiven,
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
