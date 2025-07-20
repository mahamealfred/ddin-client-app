// navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TransactionDetails from '../components/TransactionDetails';
import ServicePaymentScreen from '../screens/ServicePaymentScreen';
import AirtimePurchaseScreen from '../screens/services/AirtimePurchaseScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="TransactionDetails" component={TransactionDetails} />
      <Stack.Screen name="ServicePayment" component={ServicePaymentScreen} />
      <Stack.Screen name="AirtimePurchase" component={AirtimePurchaseScreen} />
    </Stack.Navigator>
  );
}
