import { Alert } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from '../config/firebaseConfig'; // Import Firestore instance

const NotificationManager = {
  listenToAlerts: (onAlertReceived: Function) => {
    const alertsRef = collection(firestore, 'alerts');

    const unsubscribe = onSnapshot(alertsRef, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const alertData = change.doc.data();
          onAlertReceived({
            location: {
              latitude: alertData.location.latitude,
              longitude: alertData.location.longitude,
            },
            message: alertData.message,
          });
          // Trigger a notification
          Alert.alert('Emergency Alert', alertData.message);
        }
      });
    });

    // Return unsubscribe to stop listening to updates if needed
    return unsubscribe;
  },
};

export default NotificationManager;
