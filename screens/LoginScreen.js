import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { useApp } from '../context/AppContext';

const LoginScreen = ({ navigation }) => {
  const { login, loginAsGuest } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

        <TouchableOpacity
          style={[styles.loginButton, (!email || !password) && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={!email || !password}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <TouchableOpacity>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
          <Text style={styles.linkSeparator}> • </Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Create Account</Text>
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
});

export default LoginScreen;
