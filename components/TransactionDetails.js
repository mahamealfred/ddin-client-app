import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Footer from '../components/Footer';
import { useTheme } from '../themes/ThemeContext';

export default function TransactionDetails({ route, navigation }) {
  const { transaction } = route.params;
  const { theme } = useTheme();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'success':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'failed':
        return '#dc3545';
      default:
        return theme.text;
    }
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <FontAwesome5 name="receipt" size={28} color={theme.primary} />
          <Text style={[styles.header, { color: theme.text }]}>Transaction Details</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
          <DetailRow label="Service" value={transaction.service} theme={theme} />
          <DetailRow label="Amount" value={`RWF ${transaction.amount}`} theme={theme} />
          <DetailRow
            label="Status"
            value={transaction.status}
            valueColor={getStatusColor(transaction.status)}
            theme={theme}
          />
          <DetailRow label="Transaction ID" value={transaction.id} theme={theme} />
          <DetailRow label="Date" value={transaction.date || 'N/A'} theme={theme} />
          <DetailRow label="Customer" value={transaction.customer || 'N/A'} theme={theme} />
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.footer}>
        <Footer navigation={navigation} />
      </View>
    </View>
  );
}

function DetailRow({ label, value, valueColor, theme }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <Text style={[styles.value, { color: valueColor || theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 10,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
