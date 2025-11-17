import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { useApp } from '../context/AppContext';

const LoginScreen = ({ navigation }) => {
  const { signUp, login, loginAsGuest } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;
      if (isSignUp) {
        console.log('Attempting sign up...');
        result = await signUp(email, password);
        console.log('Sign up result:', result);
      } else {
        console.log('Attempting login...');
        result = await login(email, password);
        console.log('Login result:', result);
      }

      if (result.error) {
        setError(result.error);
        console.error('Auth error:', result.error);
      } else if (result.user) {
        console.log('Auth successful, navigating...');
        // Small delay to ensure state updates
        setTimeout(() => {
          navigation.replace('Main');
        }, 100);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
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
        <Text style={styles.title}>FitSense</Text>
        <Text style={styles.subtitle}>Log in to continue your fitness journey</Text>

        <View style={styles.inputContainer}>
          <TextInput
            label="Email or Username"
            value={email}
            onChangeText={setEmail}
            mode="flat"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            contentStyle={styles.inputContent}
            theme={{
              colors: {
                primary: '#00C896',
                text: '#FFFFFF',
                placeholder: '#9CA3AF',
                background: '#1A1F35',
              },
            }}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="flat"
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
                color="#9CA3AF"
              />
            }
            style={styles.input}
            contentStyle={styles.inputContent}
            theme={{
              colors: {
                primary: '#00C896',
                text: '#FFFFFF',
                placeholder: '#9CA3AF',
                background: '#1A1F35',
              },
            }}
          />
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.loginButton, (!email || !password || loading) && styles.loginButtonDisabled]}
          onPress={handleSubmit}
          disabled={!email || !password || loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Login'}
          </Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.linkText}>
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin}>
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F23',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 48,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1A1F35',
    borderRadius: 12,
    marginBottom: 16,
    height: 56,
  },
  inputContent: {
    color: '#FFFFFF',
  },
  loginButton: {
    backgroundColor: '#00C896',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#1A1F35',
    opacity: 0.5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  linkText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  linkSeparator: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  guestButton: {
    paddingVertical: 16,
  },
  guestButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  errorContainer: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LoginScreen;
