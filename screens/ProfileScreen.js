import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';
import { useApp } from '../context/AppContext';

const ProfileScreen = () => {
  const { user, isGuest, questionsAsked, supportsGiven } = useApp();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Avatar.Text
            size={80}
            label={isGuest ? 'G' : user?.email?.charAt(0).toUpperCase() || 'U'}
            style={styles.avatar}
          />
          <Text variant="headlineMedium" style={styles.name}>
            {isGuest ? 'Guest User' : user?.email || 'User'}
          </Text>
          {isGuest && (
            <Text variant="bodySmall" style={styles.guestLabel}>
              Guest Mode
            </Text>
          )}
        </View>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.statsTitle}>
              Your Stats
            </Text>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text variant="displaySmall" style={styles.statNumber}>
                  {questionsAsked}
                </Text>
                <Text variant="bodyMedium" style={styles.statLabel}>
                  Questions Asked
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="displaySmall" style={styles.statNumber}>
                  {supportsGiven}
                </Text>
                <Text variant="bodyMedium" style={styles.statLabel}>
                  Supports Given
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.infoTitle}>
              About FitSense
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              FitSense helps you get instant AI-powered answers to your fitness and health questions. Ask questions, get expert advice, and support helpful answers from the community.
            </Text>
          </Card.Content>
        </Card>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  avatar: {
    backgroundColor: '#2196F3',
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  guestLabel: {
    color: '#666',
    fontStyle: 'italic',
  },
  statsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  statsTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#2196F3',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    color: '#666',
    textAlign: 'center',
  },
  infoCard: {
    elevation: 2,
  },
  infoTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  infoText: {
    color: '#666',
    lineHeight: 22,
  },
});

export default ProfileScreen;

