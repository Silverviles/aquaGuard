import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons for the delete icon

const initialAlerts = [
  { id: 1, message: 'Water contamination in Kaduwela.', date: '2024-10-01' },
  { id: 2, message: 'Pipeline leakage detected in Weliwita road.', date: '2024-09-29' },
  { id: 3, message: 'Water supply disruption in Malabe.', date: '2024-09-25' },
  { id: 4, message: 'Pipeline leakage detected in Pittugala.', date: '2024-08-23' },
  { id: 5, message: 'Water supply disruption in Kothalawala.', date: '2024-08-02' }, // The alert that wasn't showing
];

export default function PreviousAlertsScreen() {
  const [alerts, setAlerts] = useState(initialAlerts); // Use state to handle alerts list

  const deleteAlert = (id: number) => {
    // Function to delete an alert
    const updatedAlerts = alerts.filter(alert => alert.id !== id);
    setAlerts(updatedAlerts);
  };

  return (
    <ImageBackground
      source={require('@/assets/images/header-bg.jpg')}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Previous Alerts</Text>
        {alerts.map((alert) => (
          <View key={alert.id} style={styles.alertContainer}>
            <View style={styles.alertContent}>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.alertDate}>{alert.date}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteAlert(alert.id)} style={styles.deleteButton}>
              {/* Wrap the Icon in a Text component */}
              <Text>
                <Icon name="trash-outline" size={24} color="#FF6347" /> {/* Trash Icon */}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContainer: {
    flexGrow: 1, // Ensures ScrollView content can grow and is scrollable
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay for readability
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ADD8E6',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Adds a subtle shadow
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  alertContainer: {
    flexDirection: 'row', // Align delete button and alert message in a row
    justifyContent: 'space-between',
    alignItems: 'center', // Align vertically
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3, // Adds shadow on Android
  },
  alertContent: {
    flex: 1, // Make the text container fill available space
  },
  alertMessage: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
  },
  alertDate: {
    fontSize: 14,
    color: '#888888',
    marginTop: 8,
  },
  deleteButton: {
    padding: 5,
  },
});
