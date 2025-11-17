import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './context/AppContext';
import LoginScreen from './screens/LoginScreen';
import AskAIScreen from './screens/AskAIScreen';
import ProfileScreen from './screens/ProfileScreen';
import TrendingScreen from './screens/TrendingScreen';
import SettingsScreen from './screens/SettingsScreen';
import CalorieTrackerScreen from './screens/CalorieTrackerScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A0F23',
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#00C896',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="AskAI"
        component={AskAIScreen}
        options={{
          title: 'Ask AI',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="robot" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Trending"
        component={TrendingScreen}
        options={{
          title: 'Trending',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="trending-up" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Calories"
        component={CalorieTrackerScreen}
        options={{
          title: 'Calories',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="fire" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, isGuest, loading } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user && !isGuest ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AppContent = () => {
  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
};

export default function App() {
  return (
    <PaperProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </PaperProvider>
  );
}
