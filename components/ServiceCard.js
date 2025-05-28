import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ServiceCard({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.card} 
    onPress={onPress}
    >
      <Ionicons name={icon} size={32} color="#f8882b" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 15,
  alignItems: 'center',
  justifyContent: 'center',
  width: 100,
  height: 100,
  marginRight: 12,  // space between cards
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 3,
},
  label: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
});
