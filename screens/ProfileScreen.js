import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useApp } from '../context/AppContext';

const ProfileScreen = () => {
  const { user, isGuest, questionsAsked, supportsGiven, signOut } = useApp();

  // Log stats for debugging
  useEffect(() => {
    console.log('📊 Profile Stats Updated:', { questionsAsked, supportsGiven });
  }, [questionsAsked, supportsGiven]);

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔄 Starting logout...');
              await signOut();
              console.log('✅ Logout completed - should navigate to login');
            } catch (error) {
              console.error('❌ Logout error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Note: We don't reload stats on focus for demo - use local state only
  // Stats update immediately via context state, no need to reload from storage

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {isGuest ? 'G' : user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
          <Text style={styles.username}>
            {isGuest ? 'Guest User' : user?.email || 'User'}
          </Text>
          {isGuest && (
            <Text style={styles.guestLabel}>Guest Mode</Text>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{questionsAsked}</Text>
            <Text style={styles.statLabel}>Questions Asked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{supportsGiven}</Text>
            <Text style={styles.statLabel}>Supports Given</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00C896',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  guestLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#00C896',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF5A5F',
  },
  logoutButtonText: {
    color: '#FF5A5F',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;

