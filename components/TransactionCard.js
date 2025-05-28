
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function TransactionCard({ item, onPressDetails }) {
  const getServiceIcon = (service) => {
  switch (service.toLowerCase()) {
    case 'electricity':
      return 'bolt'; // ⚡
    case 'airtime':
      return 'mobile-alt'; // 📱
    case 'rra':
    case 'tax':
      return 'file-invoice-dollar'; // 🧾
    case 'water':
      return 'tint'; // 💧
    default:
      return 'money-bill-wave'; // 💵 fallback icon
  }
};
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
    <TouchableOpacity style={styles.card} onPress={() => onPressDetails(item)}>
      <View style={styles.iconContainer}>
  <FontAwesome5 name={getServiceIcon(item.service)} size={24} color="#f8882b" />
</View>

      <View style={styles.detailsContainer}>
        <View style={styles.topRow}>
          <Text style={styles.service}>{item.service}</Text>
          <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.amount}>RWF {item.amount}</Text>
          <View style={styles.viewButton}>
            <Text style={styles.viewText}>View</Text>
            <MaterialIcons name="chevron-right" size={20} color="#191233" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: '#e9f1ff',
    padding: 12,
    borderRadius: 50,
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  service: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  
  },
  amount: {
    fontSize: 15,
    color: '#555',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewText: {
    fontSize: 15,
    color: '#191233',
    marginRight: 4,
    fontWeight: '500',
  },
});
