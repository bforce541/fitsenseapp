import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
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
  const { addQuestion, voteQuestion, questions, incrementQuestionsAsked } = useApp();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [lastQuestionText, setLastQuestionText] = useState(null);

  // Watch for the new question in the questions array
  useEffect(() => {
    if (lastQuestionText && questions.length > 0) {
      const found = questions.find(q => q.question === lastQuestionText);
      if (found && found.id !== currentQuestionId) {
        setCurrentQuestionId(found.id);
        console.log('✅ Question ID found from questions array:', found.id);
      }
    }
  }, [questions, lastQuestionText, currentQuestionId]);

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
    setCurrentQuestionId(null); // Reset previous question ID

    try {
      const aiAnswer = await askOpenAI(question);
      setAnswer(aiAnswer);
      
      // INCREMENT QUESTIONS ASKED IMMEDIATELY - SIMPLE!
      incrementQuestionsAsked();
      console.log('✅ Questions Asked incremented after AI answer');
      
      setLastQuestionText(question); // Store question text to find it later
      const result = await addQuestion(question, aiAnswer);
      // Store the question ID so we can vote on it
      if (result && result.id) {
        setCurrentQuestionId(result.id);
        console.log('✅ Question ID stored for voting:', result.id);
      }
      // If result doesn't have id, useEffect will find it from questions array
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Ask a Question</Text>
        <Text style={styles.subtitle}>Your fitness questions, answered by AI</Text>

        <View style={styles.presetContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.presetScrollContent}
          >
            {PRESET_QUESTIONS.map((preset, index) => (
              <TouchableOpacity
                key={index}
                style={styles.presetChip}
                onPress={() => handlePresetQuestion(preset)}
              >
                <Text style={styles.presetChipText}>{preset}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputCard}>
          <TextInput
            placeholder="Type your question..."
            value={question}
            onChangeText={setQuestion}
            mode="flat"
            multiline
            numberOfLines={6}
            style={styles.textInput}
            contentStyle={styles.textInputContent}
            theme={{
              colors: {
                primary: '#00C896',
                text: '#1F2937',
                placeholder: '#9CA3AF',
                background: '#FFFFFF',
              },
            }}
          />
        </View>

        <TouchableOpacity
          style={[styles.askButton, (loading || !question.trim()) && styles.askButtonDisabled]}
          onPress={handleAskAI}
          disabled={loading || !question.trim()}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.askButtonText}>Ask</Text>
          )}
        </TouchableOpacity>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00C896" />
            <Text style={styles.loadingText}>Getting AI response...</Text>
          </View>
        )}

        {answer && (
          <View style={styles.responseCard}>
            <Text style={styles.responseTitle}>AI Response</Text>
            <Text style={styles.responseText}>{answer}</Text>
            <View style={styles.feedbackContainer}>
              <TouchableOpacity 
                style={styles.feedbackButton}
                onPress={() => {
                  if (currentQuestionId) {
                    voteQuestion(currentQuestionId, 'support');
                  }
                }}
              >
                <Text style={styles.feedbackButtonText}>👍 Helpful</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.feedbackButton, styles.feedbackButtonRed]}
                onPress={() => {
                  if (currentQuestionId) {
                    voteQuestion(currentQuestionId, 'dontSupport');
                  }
                }}
              >
                <Text style={[styles.feedbackButtonText, styles.feedbackButtonTextRed]}>👎 Not Helpful</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  presetContainer: {
    marginBottom: 20,
  },
  presetScrollContent: {
    paddingRight: 20,
  },
  presetChip: {
    backgroundColor: '#1A1F35',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  presetChipText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  textInput: {
    backgroundColor: 'transparent',
    minHeight: 120,
  },
  textInputContent: {
    color: '#1F2937',
    fontSize: 16,
  },
  askButton: {
    backgroundColor: '#1A1F35',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  askButtonDisabled: {
    opacity: 0.5,
  },
  askButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 12,
    fontSize: 14,
  },
  responseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  responseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    marginBottom: 20,
  },
  feedbackContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  feedbackButton: {
    flex: 1,
    backgroundColor: '#00C896',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  feedbackButtonRed: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF5A5F',
  },
  feedbackButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  feedbackButtonTextRed: {
    color: '#FF5A5F',
  },
});

export default AskAIScreen;
