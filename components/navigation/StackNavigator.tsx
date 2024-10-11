import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EmergencyAlertSystem from '@/app/(tabs)/alert';
import PreviousAlertsScreen from '@/app/(tabs)/PreviousAlertsScreen'; // Import your screen here

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (

      <Stack.Navigator initialRouteName="EmergencyAlertSystem">
        <Stack.Screen name="EmergencyAlertSystem" component={EmergencyAlertSystem} />
        <Stack.Screen name="PreviousAlertsScreen" component={PreviousAlertsScreen} />

      </Stack.Navigator>


  );
}
