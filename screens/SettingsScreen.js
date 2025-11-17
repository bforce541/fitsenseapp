import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Text } from 'react-native-paper';
import { useApp } from '../context/AppContext';

const SettingsScreen = () => {
  const { settings, updateSettings } = useApp();

  // Safety check - ensure settings exists
  const safeSettings = settings || {
    notifications: true,
    darkMode: false,
    privacy: true,
  };

  const handleToggle = (key, value) => {
    const newSettings = { ...safeSettings, [key]: value };
    updateSettings(newSettings);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>

        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>Receive push notifications</Text>
            </View>
            <Switch
              value={safeSettings.notifications}
              onValueChange={(value) => handleToggle('notifications', value)}
              trackColor={{ false: '#374151', true: '#00C896' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Enable dark theme</Text>
            </View>
            <Switch
              value={safeSettings.darkMode}
              onValueChange={(value) => handleToggle('darkMode', value)}
              trackColor={{ false: '#374151', true: '#00C896' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Privacy</Text>
              <Text style={styles.settingDescription}>Keep your data private</Text>
            </View>
            <Switch
              value={safeSettings.privacy}
              onValueChange={(value) => handleToggle('privacy', value)}
              trackColor={{ false: '#374151', true: '#00C896' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>App Information</Text>
          <Text style={styles.infoText}>Version: 1.0.0</Text>
          <Text style={styles.infoText}>FitSense - AI Fitness Companion</Text>
        </View>
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
    marginBottom: 24,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  settingLeft: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 20,
    marginRight: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
});

export default SettingsScreen;
