import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useApp } from '../context/AppContext';
import QuestionCard from '../components/QuestionCard';

const TrendingScreen = () => {
  const { getTrendingQuestions, voteQuestion, votedQuestions } = useApp();
  const trendingQuestions = getTrendingQuestions();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Trending Answers
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Top supported fitness answers from the community
        </Text>

        {trendingQuestions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  subtitle: {
    marginBottom: 24,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
  },
});

export default TrendingScreen;

