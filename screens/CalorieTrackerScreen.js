import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useApp } from '../context/AppContext';
import { supabase } from '../utils/supabase';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const CalorieTrackerScreen = () => {
  const { user, isGuest, addCalorieEntry, getCalorieEntries, getMonthlyCalories, getYearlyCalories } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [calories, setCalories] = useState('');
  const [todayCalories, setTodayCalories] = useState(0);
  const [viewMode, setViewMode] = useState('day'); // 'day', 'month', 'year'
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (isGuest || !user?.id) {
      return;
    }

    loadTodayCalories();
    if (viewMode === 'month') {
      loadMonthlyData();
    } else if (viewMode === 'year') {
      loadYearlyData();
    }
  }, [selectedDate, viewMode, user?.id, isGuest]);

  // Set up real-time subscription for calorie entries
  useEffect(() => {
    if (isGuest || !user?.id) {
      return;
    }

    let channel;

    try {
      // Create a channel for real-time updates
      channel = supabase
        .channel(`calorie-entries-changes-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*', // Listen to INSERT, UPDATE, and DELETE
            schema: 'public',
          table: 'calorie_tracker',
            filter: `user_id=eq.${user.id}`, // Only listen to changes for current user
          },
          (payload) => {
            console.log('Calorie entry changed:', payload.eventType, payload.new || payload.old);
            
            // Reload data based on current view mode
            // For day view, always reload (might be viewing a different date)
            // For month/year views, reload to update charts
            if (viewMode === 'day') {
              loadTodayCalories();
            } else if (viewMode === 'month') {
              loadMonthlyData();
            } else if (viewMode === 'year') {
              loadYearlyData();
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Real-time subscription active for calorie entries');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Real-time subscription error');
          } else {
            console.log('Real-time subscription status:', status);
          }
        });

      subscriptionRef.current = channel;
    } catch (error) {
      console.error('Error setting up real-time subscription:', error);
    }

    // Cleanup subscription on unmount or when user changes
    return () => {
      if (subscriptionRef.current) {
        try {
          supabase.removeChannel(subscriptionRef.current);
          subscriptionRef.current = null;
        } catch (error) {
          console.error('Error removing subscription:', error);
        }
      }
    };
  }, [user?.id, isGuest, viewMode, selectedDate]);

  const loadTodayCalories = async () => {
    if (isGuest || !user?.id) {
      return;
    }

    try {
      const entry = await getCalorieEntries(selectedDate, selectedDate);
      if (entry && entry.length > 0) {
        setTodayCalories(entry[0].calories);
        setCalories(entry[0].calories.toString());
      } else {
        setTodayCalories(0);
        setCalories('');
      }
    } catch (error) {
      console.error('Error loading today calories:', error);
    }
  };

  const loadMonthlyData = async () => {
    if (isGuest || !user?.id) {
      return;
    }

    try {
      const data = await getMonthlyCalories();
      setMonthlyData(data);
    } catch (error) {
      console.error('Error loading monthly data:', error);
    }
  };

  const loadYearlyData = async () => {
    if (isGuest || !user?.id) {
      return;
    }

    try {
      const data = await getYearlyCalories();
      setYearlyData(data);
    } catch (error) {
      console.error('Error loading yearly data:', error);
    }
  };

  const handleSave = async () => {
    const caloriesValue = calories.trim();
    
    if (!caloriesValue) {
      Alert.alert('Error', 'Please enter a calorie amount');
      return;
    }

    const caloriesNum = parseInt(caloriesValue);
    if (isNaN(caloriesNum) || caloriesNum < 0) {
      Alert.alert('Error', 'Please enter a valid positive number');
      return;
    }

    try {
      // Save the calorie entry
      await addCalorieEntry(selectedDate, caloriesNum);
      
      // Immediately update the display with the saved value
      setTodayCalories(caloriesNum);
      
      // Reload data to ensure consistency
      await loadTodayCalories();
      
      // Reload chart data if in month/year view
      if (viewMode === 'month') {
        await loadMonthlyData();
      } else if (viewMode === 'year') {
        await loadYearlyData();
      }
      
      // Show success feedback
      Alert.alert('Success', `Saved ${caloriesNum} calories for ${formatDate(selectedDate)}`);
    } catch (error) {
      console.error('Error saving calories:', error);
      Alert.alert('Error', error.message || 'Failed to save calories. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getMonthLabels = () => {
    const labels = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      labels.push(date.getDate().toString());
    }
    return labels;
  };

  const getYearLabels = () => {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  };

  if (isGuest) {
    return (
      <View style={styles.container}>
        <View style={styles.guestMessage}>
          <Text style={styles.guestText}>Please log in to track your calories</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Calorie Tracker</Text>

      {/* View Mode Selector */}
      <View style={styles.viewModeContainer}>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'day' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('day')}
        >
          <Text style={[styles.viewModeText, viewMode === 'day' && styles.viewModeTextActive]}>Day</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'month' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('month')}
        >
          <Text style={[styles.viewModeText, viewMode === 'month' && styles.viewModeTextActive]}>Month</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'year' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('year')}
        >
          <Text style={[styles.viewModeText, viewMode === 'year' && styles.viewModeTextActive]}>Year</Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'day' && (
        <>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Date:</Text>
            <TextInput
              mode="outlined"
              value={selectedDate}
              onChangeText={setSelectedDate}
              style={styles.dateInput}
              theme={{
                colors: {
                  primary: '#00C896',
                  text: '#FFFFFF',
                  placeholder: '#9CA3AF',
                  background: '#1A1F35',
                },
              }}
            />
            <Text style={styles.dateFormatted}>{formatDate(selectedDate)}</Text>
          </View>

          <View style={styles.calorieCard}>
            <Text style={styles.calorieLabel}>Calories Consumed Today</Text>
            <Text style={styles.calorieValue}>{todayCalories}</Text>
            <Text style={styles.calorieUnit}>kcal</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              label="Enter Calories"
              value={calories}
              onChangeText={setCalories}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              contentStyle={styles.inputText}
              theme={{
                colors: {
                  primary: '#00C896',
                  text: '#FFFFFF',
                  placeholder: '#9CA3AF',
                  background: '#1A1F35',
                },
              }}
            />
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
              labelStyle={styles.saveButtonLabel}
            >
              Save Calories
            </Button>
          </View>
        </>
      )}

      {viewMode === 'month' && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Last 30 Days</Text>
          {monthlyData.length > 0 ? (
            <LineChart
              data={{
                labels: getMonthLabels(),
                datasets: [
                  {
                    data: monthlyData.map(d => d.calories || 0),
                    color: (opacity = 1) => `rgba(0, 200, 150, ${opacity})`,
                    strokeWidth: 2,
                  },
                ],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#1A1F35',
                backgroundGradientFrom: '#1A1F35',
                backgroundGradientTo: '#0A0F23',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 200, 150, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#00C896',
                },
              }}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>No data available for the last 30 days</Text>
            </View>
          )}
        </View>
      )}

      {viewMode === 'year' && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>This Year (Monthly Average)</Text>
          {yearlyData.length > 0 ? (
            <LineChart
              data={{
                labels: getYearLabels(),
                datasets: [
                  {
                    data: yearlyData.map(d => d.avgCalories || 0),
                    color: (opacity = 1) => `rgba(0, 200, 150, ${opacity})`,
                    strokeWidth: 2,
                  },
                ],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#1A1F35',
                backgroundGradientFrom: '#1A1F35',
                backgroundGradientTo: '#0A0F23',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 200, 150, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#00C896',
                },
              }}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>No data available for this year</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F23',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  viewModeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#1A1F35',
    borderRadius: 12,
    padding: 4,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  viewModeButtonActive: {
    backgroundColor: '#00C896',
  },
  viewModeText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  viewModeTextActive: {
    color: '#FFFFFF',
  },
  dateContainer: {
    marginBottom: 24,
  },
  dateLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  dateInput: {
    backgroundColor: '#1A1F35',
    marginBottom: 8,
  },
  dateFormatted: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  calorieCard: {
    backgroundColor: '#1A1F35',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  calorieLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  calorieValue: {
    color: '#00C896',
    fontSize: 48,
    fontWeight: 'bold',
  },
  calorieUnit: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1A1F35',
    marginBottom: 16,
  },
  inputText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  saveButton: {
    backgroundColor: '#00C896',
    paddingVertical: 8,
  },
  saveButtonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  chartContainer: {
    marginTop: 20,
  },
  chartTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyChart: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1F35',
    borderRadius: 16,
  },
  emptyChartText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  guestMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  guestText: {
    color: '#9CA3AF',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default CalorieTrackerScreen;

