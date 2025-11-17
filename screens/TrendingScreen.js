import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useApp } from '../context/AppContext';
import QuestionCard from '../components/QuestionCard';

const TrendingScreen = () => {
  const { getTrendingQuestions, voteQuestion, votedQuestions } = useApp();
  const trendingQuestions = getTrendingQuestions();

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Trending AI Answers</Text>
        <Text style={styles.subtitle}>Top supported fitness answers from the community</Text>

        {trendingQuestions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No questions yet. Ask a question to get started!
            </Text>
          </View>
        ) : (
          trendingQuestions.map((item) => (
            <QuestionCard
              key={item.id}
              question={item.question}
              answer={item.answer}
              supports={item.supports}
              dontSupports={item.dontSupports}
              questionId={item.id}
              onVote={voteQuestion}
              hasVoted={!!votedQuestions[item.id]}
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
