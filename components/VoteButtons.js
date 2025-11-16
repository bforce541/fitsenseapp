import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const VoteButtons = ({ questionId, onVote }) => {
  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => onVote(questionId, 'support')}
        style={[styles.button, styles.supportButton]}
        icon="thumb-up"
      >
        Support
      </Button>
      <Button
        mode="outlined"
        onPress={() => onVote(questionId, 'dontSupport')}
        style={[styles.button, styles.dontSupportButton]}
        icon="thumb-down"
      >
        Don't Support
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  supportButton: {
    backgroundColor: '#4CAF50',
  },
  dontSupportButton: {
    borderColor: '#f44336',
  },
});

export default VoteButtons;

