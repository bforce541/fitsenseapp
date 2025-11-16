import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text, Card, Chip } from 'react-native-paper';
import { useApp } from '../context/AppContext';
import { askOpenAI } from '../utils/openai';

const PRESET_QUESTIONS = [
  'How many calories should I eat per day?',
  'What is the best workout for weight loss?',
  'How much protein do I need daily?',
  'What are the best exercises for building muscle?',
  'How often should I exercise per week?',
  'What is the best diet for beginners?',
];

const AskAIScreen = () => {
  const { addQuestion } = useApp();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePresetQuestion = (preset) => {
    setQuestion(preset);
  };

  const handleAskAI = async () => {
    if (!question.trim()) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }

    setLoading(true);
    setAnswer('');

    try {
      const aiAnswer = await askOpenAI(question);
      setAnswer(aiAnswer);
      await addQuestion(question, aiAnswer);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Ask AI
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Get instant fitness and health advice
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Preset Questions
            </Text>
            <View style={styles.chipContainer}>
              {PRESET_QUESTIONS.map((preset, index) => (
                <Chip
                  key={index}
                  onPress={() => handlePresetQuestion(preset)}
                  style={styles.chip}
                  mode="outlined"
                >
                  {preset}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Your Question"
              value={question}
              onChangeText={setQuestion}
              mode="outlined"
              multiline
              numberOfLines={4}
              placeholder="Ask anything about fitness or health..."
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={handleAskAI}
              style={styles.button}
              disabled={loading || !question.trim()}
              loading={loading}
            >
              Ask AI
            </Button>
          </Card.Content>
        </Card>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Getting AI response...</Text>
          </View>
        )}

        {answer && (
          <Card style={styles.answerCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.answerTitle}>
                AI Response
              </Text>
              <Text style={styles.answerText}>{answer}</Text>
            </Card.Content>
          </Card>
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
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    paddingVertical: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  answerCard: {
    marginTop: 16,
    elevation: 2,
    backgroundColor: '#e3f2fd',
  },
  answerTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  answerText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
});

export default AskAIScreen;

