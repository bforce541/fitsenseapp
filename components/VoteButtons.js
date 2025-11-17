import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const VoteButtons = ({ questionId, onVote }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.supportButton}
        onPress={() => onVote(questionId, 'support')}
      >
        <Text style={styles.supportButtonText}>👍 Helpful</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.dontSupportButton}
        onPress={() => onVote(questionId, 'dontSupport')}
      >
        <Text style={styles.dontSupportButtonText}>👎 Not Helpful</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  supportButton: {
    flex: 1,
    backgroundColor: '#00C896',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dontSupportButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF5A5F',
  },
  supportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  dontSupportButtonText: {
    color: '#FF5A5F',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default VoteButtons;
