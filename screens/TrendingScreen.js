import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../context/AppContext';

const TrendingScreen = () => {
  const {
    questions,
    voteQuestion,
    votedQuestions,
    getTrendingQuestions,
    incrementSupportsGiven,
  } = useApp();

  // Track local vote counts and voted state for placeholder questions
  const [localVoteCounts, setLocalVoteCounts] = useState({});
  const [localVoted, setLocalVoted] = useState({});

  // Local placeholder questions if real ones are empty
  const placeholders = [
    {
      id: 'p1',
      question: 'Is intermittent fasting good for students?',
      answer: 'Intermittent fasting may help with weight management and mental clarity, but students should ensure they maintain adequate nutrition and energy for studying. It\'s best to start gradually and consult with a healthcare provider.',
      supports: 42,
      dontSupports: 3,
    },
    {
      id: 'p2',
      question: 'Can I gain muscle on a vegan diet?',
      answer: 'Yes, you can absolutely gain muscle on a vegan diet! Focus on consuming enough protein from sources like lentils, tofu, tempeh, beans, quinoa, and plant-based protein supplements. Ensure you\'re in a caloric surplus and following a progressive resistance training program.',
      supports: 35,
      dontSupports: 2,
    },
    {
      id: 'p3',
      question: 'Is stretching before workouts beneficial?',
      answer: 'Dynamic stretching before workouts improves range of motion and prepares your muscles for activity. However, static stretching before exercise may reduce performance. Save static stretching for after your workout as part of your cool-down routine.',
      supports: 28,
      dontSupports: 1,
    },
  ];

  // Use memoized data that updates when questions change
  const dataToShow = useMemo(() => {
    const trending = getTrendingQuestions();
    const data = trending.length > 0 ? trending : placeholders;

    // Apply local vote counts to the data
    return data.map(item => {
      const localVotes = localVoteCounts[item.id];
      if (localVotes) {
        return {
          ...item,
          supports: (item.supports || 0) + (localVotes.support || 0),
          dontSupports: (item.dontSupports || 0) + (localVotes.dontSupport || 0),
        };
      }
      return item;
    });
  }, [questions, getTrendingQuestions, localVoteCounts]);

  const handleVote = (id, type) => {
    // Check if it's a placeholder question
    const isPlaceholder = placeholders.some(p => p.id === id);

    // Prevent voting multiple times
    if (isPlaceholder) {
      if (localVoted[id]) {
        console.log('Already voted on this placeholder question');
        return;
      }
    } else {
      if (votedQuestions[id]) {
        console.log('Already voted on this question');
        return;
      }
    }

    if (isPlaceholder) {
      // Handle placeholder votes locally
      console.log('Voting on placeholder question:', id, type);

      // Mark as voted
      setLocalVoted(prev => ({ ...prev, [id]: type }));

      // Update vote counts
      setLocalVoteCounts(prev => {
        const current = prev[id] || { support: 0, dontSupport: 0 };
        const updated = {
          ...prev,
          [id]: {
            ...current,
            [type === 'support' ? 'support' : 'dontSupport']:
              (current[type === 'support' ? 'support' : 'dontSupport'] || 0) + 1,
          },
        };
        return updated;
      });

      // Update profile if support
      if (type === 'support') {
        incrementSupportsGiven();
      }
    } else {
      // Handle real question votes
      console.log('Voting on real question:', id, type);
      voteQuestion(id, type);
    }
  };

  const renderItem = ({ item }) => {
    // Check if voted (either in context or locally for placeholders)
    const isPlaceholder = placeholders.some(p => p.id === item.id);
    const hasVotedContext = !!votedQuestions[item.id];
    const hasVotedLocal = isPlaceholder && !!localVoted[item.id];
    const hasVoted = hasVotedContext || hasVotedLocal;

    const supportsCount = item.supports || 0;
    const dontSupportsCount = item.dontSupports || 0;

    return (
      <View style={styles.card}>
        <Text style={styles.question}>{item.question}</Text>
        <Text style={styles.answer}>{item.answer}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBadge}>
            <Text style={styles.statEmoji}>👍</Text>
            <Text style={styles.statCount}>{supportsCount}</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statEmoji}>👎</Text>
            <Text style={styles.statCount}>{dontSupportsCount}</Text>
          </View>
        </View>

        {hasVoted ? (
          <View style={styles.votedContainer}>
            <Text style={styles.votedText}>✓ You've already voted</Text>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.supportButton}
              onPress={() => handleVote(item.id, 'support')}
              activeOpacity={0.7}
            >
              <Text style={styles.supportButtonText}>👍 Helpful</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dontSupportButton}
              onPress={() => handleVote(item.id, 'dontSupport')}
              activeOpacity={0.7}
            >
              <Text style={styles.dontSupportButtonText}>👎 Not Helpful</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>🔥 Trending Questions</Text>
        <Text style={styles.subtitle}>Top supported fitness answers from the community</Text>
      </View>
      <FlatList
        data={dataToShow}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F23',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
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
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 24,
  },
  answer: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 16,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  statEmoji: {
    fontSize: 16,
  },
  statCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  buttonRow: {
    flexDirection: 'row',
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
  supportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
  dontSupportButtonText: {
    color: '#FF5A5F',
    fontSize: 14,
    fontWeight: '600',
  },
  votedContainer: {
    marginTop: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  votedText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});

export default TrendingScreen;
