import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ServiceCard from '../components/ServiceCard';
import TransactionCard from '../components/TransactionCard';
import Footer from '../components/Footer';
import AppBackground from '../components/AppBackground'; // 🔥 Import wrapper
import { useTheme } from '../themes/ThemeContext';

const SERVICES = [
  { label: 'Buy Airtime', icon: 'phone-portrait' },
  { label: 'Electricity', icon: 'flash' },
  { label: 'RRA Payment', icon: 'document-text' },
  { label: 'Water', icon: 'water' },
  { label: 'Internet', icon: 'wifi' },
];

const TRANSACTIONS = [
  { id: '1', service: 'Electricity', amount: 5000, status: 'Success' },
  { id: '2', service: 'Airtime', amount: 1000, status: 'Success' },
  { id: '3', service: 'RRA', amount: 15000, status: 'Pending' },
  { id: '4', service: 'Startime', amount: 15000, status: 'Pending' },
];

export default function HomeScreen({ navigation }) {
  const [showBalance, setShowBalance] = useState(false);
   const { theme } = useTheme();

const navigateToService = (label) => {
  switch (label) {
    case 'Buy Airtime':
      navigation.navigate('AirtimePurchase');
      break;
    case 'Electricity':
      navigation.navigate('ElectricityPayment');
      break;
    case 'RRA Payment':
      navigation.navigate('RRAPayment');
      break;
    case 'Water':
      navigation.navigate('WaterPayment');
      break;
    case 'Internet':
      navigation.navigate('InternetPayment');
      break;
    default:
      console.warn('No screen found for:', label);
  }
};
  return (
    <AppBackground>
      <View style={[styles.screenContainer, {backgroundColor: theme.background} ]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Balance Banner */}
          <View style={styles.banner}>
            <Text style={styles.balanceLabel}>Your Moola Balance</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balance}>
                {showBalance ? 'RWF 35,000' : 'RWF ******'}
              </Text>
              <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                <Ionicons
                  name={showBalance ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#fff"
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Services Section */}
          <Text style={styles.sectionTitle}>Services</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {SERVICES.map((service, index) => (
              <ServiceCard
                key={index}
  icon={service.icon}
  label={service.label}
  onPress={() => navigateToService(service.label)}

              />
            ))}
          </ScrollView>

          {/* Recent Transactions */}
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <View>
            {TRANSACTIONS.map((item) => (
              <TransactionCard
                key={item.id}
                item={item}
                onPressDetails={() =>
                  navigation.navigate('TransactionDetails', { transaction: item })
                }
              />
            ))}
          </View>

          <View style={{ height: 80 }} />
        </ScrollView>

        {/* Fixed Footer */}
        <View style={styles.footer}>
          <Footer navigation={navigation} />
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: 100,
    padding: 5,
  },
  banner: {
    backgroundColor: '#f8882b',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    marginTop: 10,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#fff',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  balance: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 15,
    color: "#f8882b",
  },
  horizontalScroll: {
    marginVertical: 0,
    paddingLeft: 15,
  },
});
