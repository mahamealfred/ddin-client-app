import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function TransactionDetails({ route }) {
  const { transaction } = route.params;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'success':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'failed':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <FontAwesome5 name="receipt" size={28} color="#007bff" />
        <Text style={styles.header}>Transaction Details</Text>
      </View>

      <View style={styles.card}>
        <DetailRow label="Service" value={transaction.service} />
        <DetailRow label="Amount" value={`RWF ${transaction.amount}`} />
        <DetailRow label="Status" value={transaction.status} valueColor={getStatusColor(transaction.status)} />
        <DetailRow label="Transaction ID" value={transaction.id} />
        <DetailRow label="Date" value={transaction.date || 'N/A'} />
        <DetailRow label="Customer" value={transaction.customer || 'N/A'} />
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value, valueColor = '#333' }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f7',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 10,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'right',
  },
});
