import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Button, ImageBackground, TouchableOpacity } from 'react-native';
import MapViewComponent from '@/components/MapViewComponent';
import { firestore } from '@/config/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

interface AlertInfo {
  location: {
    latitude: number;
    longitude: number;
  };
  message: string;
}

export default function EmergencyAlertSystem() {
  const [alert, setAlert] = useState<AlertInfo | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Subscribe to alerts in Firestore
    const alertsRef = collection(firestore, 'alerts');

    const unsubscribe = onSnapshot(alertsRef, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const alertData = change.doc.data() as AlertInfo;
          setAlert(alertData);
          Alert.alert('Emergency Alert', alertData.message);
        }
      });
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  return (
    <ImageBackground
      source={require('@/assets/images/alertback.jpg')} // Set your background image path here
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <Text style={styles.header}>Emergency Alerts</Text>
        {alert ? (
          <>
            <Text style={styles.alertMessage}>{alert.message}</Text>
            <MapViewComponent location={alert.location} />
          </>
        ) : (
          <Text style={styles.noAlert}>No alerts in your area</Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PreviousAlertsScreen')}
        >
          <Text style={styles.buttonText}>View Previous Alerts</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay for readability
    width: '100%',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28, // Increase font size for better readability
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 50,
    textAlign: 'center',
     shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
  },
  alertMessage: {
    fontSize: 18, // Make text smaller but readable
    color: '#ff4d4d', // Red color for emphasis
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  noAlert: {
    fontSize: 18,
    color: '#90EE90', // Light green for positive message
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007BFF', // Bright blue button for contrast
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50, // Rounded button for modern look
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Shadow effect for better depth perception
  },
  buttonText: {
    color: '#fff',
    fontSize: 18, // Make text bigger for accessibility
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
