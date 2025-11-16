import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useApp } from '../context/AppContext';

const LoginScreen = ({ navigation }) => {
  const { login, loginAsGuest } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email && password) {
      await login(email, password);
      navigation.replace('Main');
    }
  };

  const handleGuestLogin = async () => {
    await loginAsGuest();
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text variant="displaySmall" style={styles.title}>
          FitSense
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Your AI Fitness Companion
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              disabled={!email || !password}
            >
              Login
            </Button>
            <Button
              mode="outlined"
              onPress={handleGuestLogin}
              style={styles.guestButton}
            >
              Continue as Guest
            </Button>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  card: {
    elevation: 4,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 4,
  },
  guestButton: {
    paddingVertical: 4,
  },
});

export default LoginScreen;

