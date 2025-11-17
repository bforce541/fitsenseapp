import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useApp } from '../context/AppContext';
import QuestionCard from '../components/QuestionCard';

// Placeholder fitness questions for when there are no real questions
const PLACEHOLDER_QUESTIONS = [
  {
    id: 'placeholder-1',
    question: 'How many calories should I eat per day?',
    answer: 'The number of calories you need depends on several factors including your age, gender, activity level, and fitness goals. Generally, adult women need 1,800-2,400 calories per day, while adult men need 2,200-3,000 calories. For weight loss, aim for a 500-750 calorie deficit. For muscle gain, add 300-500 calories above maintenance. Use a TDEE calculator to find your specific needs.',
    supports: 42,
    dontSupports: 3,
    isPlaceholder: true,
  },
  {
    id: 'placeholder-2',
    question: 'What is the best workout for weight loss?',
    answer: 'The best workout for weight loss combines cardio and strength training. High-intensity interval training (HIIT) is particularly effective, burning calories both during and after your workout. Aim for 150 minutes of moderate cardio or 75 minutes of vigorous cardio per week, plus 2-3 strength training sessions. Consistency is more important than intensity - find activities you enjoy and can stick with long-term.',
    supports: 38,
    dontSupports: 5,
    isPlaceholder: true,
  },
  {
    id: 'placeholder-3',
    question: 'How much protein do I need daily?',
    answer: 'For active individuals, aim for 0.7-1 gram of protein per pound of body weight (1.6-2.2 grams per kilogram). If you weigh 150 lbs, that\'s 105-150 grams daily. Spread protein intake throughout the day - aim for 20-30 grams per meal. Good sources include lean meats, fish, eggs, dairy, legumes, and protein powders. Protein helps with muscle repair, satiety, and maintaining muscle mass during weight loss.',
    supports: 35,
    dontSupports: 2,
    isPlaceholder: true,
  },
  {
    id: 'placeholder-4',
    question: 'What are the best exercises for building muscle?',
    answer: 'Compound movements are most effective for building muscle: squats, deadlifts, bench press, overhead press, and rows. These exercises work multiple muscle groups simultaneously. Aim for 3-4 sets of 6-12 reps with progressive overload (gradually increasing weight or reps). Include 2-3 strength training sessions per week, allowing 48 hours rest between working the same muscle groups. Proper form and nutrition are equally important.',
    supports: 31,
    dontSupports: 4,
    isPlaceholder: true,
  },
  {
    id: 'placeholder-5',
    question: 'How often should I exercise per week?',
    answer: 'For general health, aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week, plus 2 days of strength training. For fitness goals, 3-5 days per week is ideal. Allow 1-2 rest days for recovery. Listen to your body - quality workouts are better than pushing through fatigue. Consistency beats intensity - it\'s better to exercise 30 minutes daily than 2 hours once a week.',
    supports: 28,
    dontSupports: 1,
    isPlaceholder: true,
  },
];

const TrendingScreen = () => {
  const { getTrendingQuestions, voteQuestion, votedQuestions, questions } = useApp();
  const [displayQuestions, setDisplayQuestions] = useState([]);

  useEffect(() => {
    const realQuestions = getTrendingQuestions();
    if (realQuestions.length > 0) {
      setDisplayQuestions(realQuestions);
    } else {
      // Show placeholder questions when no real questions exist
      setDisplayQuestions(PLACEHOLDER_QUESTIONS);
    }
  }, [questions, getTrendingQuestions]);

  const handleVote = async (questionId, voteType) => {
    // Don't allow voting on placeholder questions
    const question = displayQuestions.find(q => q.id === questionId);
    if (question?.isPlaceholder) {
      return;
    }
    await voteQuestion(questionId, voteType);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Trending AI Answers</Text>
        <Text style={styles.subtitle}>Top supported fitness answers from the community</Text>

        {displayQuestions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No questions yet. Ask a question to get started!
            </Text>
          </View>
        ) : (
          displayQuestions.map((item) => (
            <QuestionCard
              key={item.id}
              question={item.question}
              answer={item.answer}
              supports={item.supports}
              dontSupports={item.dontSupports}
              questionId={item.id}
              onVote={handleVote}
              hasVoted={!!votedQuestions[item.id] || item.isPlaceholder}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F23',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 16,
  },
});

export default TrendingScreen;
