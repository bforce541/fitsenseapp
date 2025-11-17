import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { useApp } from '../context/AppContext';

const TrendingScreen = () => {
  const {
    questions,
    voteQuestion,
    votedQuestions,
    getTrendingQuestions,
  } = useApp();

  // Local placeholder questions if real ones are empty
  const placeholders = [
    {
      id: 'p1',
      question: 'Is intermittent fasting good for students?',
      answer: 'Intermittent fasting may help with weight management and mental clarity...',
      supports: 42,
    },
    {
      id: 'p2',
      question: 'Can I gain muscle on a vegan diet?',
      answer: 'Yes, by consuming enough protein from lentils, tofu, beans, and supplements...',
      supports: 35,
    },
    {
      id: 'p3',
      question: 'Is stretching before workouts beneficial?',
      answer: 'Dynamic stretching before workouts improves range of motion...',
      supports: 28,
    },
  ];

  const dataToShow = questions.length > 0 ? getTrendingQuestions() : placeholders;

  const handleVote = (id, type) => {
    // Prevent voting multiple times
    if (votedQuestions[id]) return;
    voteQuestion(id, type);
  };

  const renderItem = ({ item }) => {
    const hasVoted = !!votedQuestions[item.id];
    return (
      <View style={styles.card}>
        <Text style={styles.question}>{item.question}</Text>
        <Text style={styles.answer}>{item.answer}</Text>
        <View style={styles.footer}>
          <Text style={styles.supports}>Supports: {item.supports || 0}</Text>
          {hasVoted ? (
            <Text style={styles.votedText}>Already Voted</Text>
          ) : (
            <View style={styles.buttons}>
              <Pressable
                style={({ pressed }) => [
                  styles.voteBtn,
                  { backgroundColor: pressed ? '#c1f0c1' : '#90ee90' },
                ]}
                onPress={() => handleVote(item.id, 'support')}
              >
                <Text>👍</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.voteBtn,
                  { backgroundColor: pressed ? '#f0c1c1' : '#f08080' },
                ]}
                onPress={() => handleVote(item.id, 'dontSupport')}
              >
                <Text>👎</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🔥 Trending Questions</Text>
      <FlatList
        data={dataToShow}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  supports: {
    fontSize: 13,
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  voteBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  votedText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#888',
  },
});

export default TrendingScreen;
