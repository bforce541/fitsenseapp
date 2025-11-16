import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import VoteButtons from './VoteButtons';

const QuestionCard = ({ question, answer, supports, dontSupports, questionId, onVote, hasVoted }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.questionText}>{question}</Text>
        <Text style={styles.answerText}>{answer}</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>👍 {supports} | 👎 {dontSupports}</Text>
        </View>
        {!hasVoted && (
          <VoteButtons
            questionId={questionId}
            onVote={onVote}
          />
        )}
        {hasVoted && (
          <Text style={styles.votedText}>You've already voted on this question</Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 12,
  },
  statsContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#888',
  },
  votedText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default QuestionCard;

