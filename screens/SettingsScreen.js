import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Switch, List } from 'react-native-paper';
import { useApp } from '../context/AppContext';

const SettingsScreen = () => {
  const { settings, updateSettings } = useApp();

  const handleToggle = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    updateSettings(newSettings);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Settings
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <List.Item
              title="Notifications"
              description="Receive push notifications"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={settings.notifications}
                  onValueChange={(value) => handleToggle('notifications', value)}
                />
              )}
            />
            <List.Item
              title="Dark Mode"
              description="Enable dark theme"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={settings.darkMode}
                  onValueChange={(value) => handleToggle('darkMode', value)}
                />
              )}
            />
            <List.Item
              title="Privacy"
              description="Keep your data private"
              left={(props) => <List.Icon {...props} icon="shield-lock" />}
              right={() => (
                <Switch
                  value={settings.privacy}
                  onValueChange={(value) => handleToggle('privacy', value)}
                />
              )}
            />
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.infoTitle}>
              App Information
            </Text>
            <Text variant="bodySmall" style={styles.infoText}>
              Version: 1.0.0
            </Text>
            <Text variant="bodySmall" style={styles.infoText}>
              FitSense - AI Fitness Companion
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
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
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
    marginBottom: 4,
  },
});

export default SettingsScreen;

