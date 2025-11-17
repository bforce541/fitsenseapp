import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import VoteButtons from './VoteButtons';

const QuestionCard = ({ question, answer, supports, dontSupports, questionId, onVote, hasVoted }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.questionText}>{question}</Text>
      <Text style={styles.answerText}>{answer}</Text>
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statButton}>
          <Text style={styles.statButtonText}>👍 {supports}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statButton}>
          <Text style={styles.statButtonText}>👎 {dontSupports}</Text>
        </TouchableOpacity>
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
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  answerText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  statButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  votedText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default QuestionCard;
