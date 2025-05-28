import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import ServiceCard from '../components/ServiceCard';
import TransactionCard from '../components/TransactionCard';
import Footer from '../components/Footer';

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

export default function HomeScreen({ navigation,item, onPressDetails }) {
  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.balanceLabel}>Your Balance</Text>
          <Text style={styles.balance}>RWF 35,000</Text>
        </View>

        {/* Services */}
        <Text style={styles.sectionTitle}>Services</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {SERVICES.map((service, index) => (
  <ServiceCard
    key={index}
    icon={service.icon}
    label={service.label}
    onPress={() => navigation.navigate('ServicePayment', { service: service.label })}
  />
))}

        </ScrollView>

        {/* Transactions */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <View>
          {TRANSACTIONS.map((item) => (
            <TransactionCard 
            key={item.id} 
            item={item}  
            onPressDetails={(item) => navigation.navigate('TransactionDetails', { transaction: item })}
            />
          ))}
        </View>

        {/* Add bottom padding so content doesn't hide under footer */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Footer stays fixed */}
      <View style={styles.footer}>
        <Footer navigation={navigation} />
      </View>
    </View>
   
  );
}

const styles = StyleSheet.create({
   screenContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // allow scroll behind footer
    padding: 5,
  },
  
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 120, // prevent overlap
  },
  banner: {
  
    backgroundColor: '#191233',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    marginTop: 10,
  },
   balanceLabel: {
    fontSize: 16,
    color: '#f8882b',
  },
  balance: {
    color: '#f8882b',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 15,
  },
  horizontalScroll: {
    marginVertical: 0,
    paddingLeft: 15,
  },
 
});
