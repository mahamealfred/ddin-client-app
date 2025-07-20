import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Footer({ navigation }) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home-outline" size={24} color="#f8882b" />
        <Text style={styles.footerLabel}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.middleButton} onPress={() => alert('Central Action')}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="person-outline" size={24} color="#f8882b" />
        <Text style={styles.footerLabel}>Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: 'rgba(25, 18, 51, 0.9)', // semi-transparent dark
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    zIndex: 100,
  },
  footerButton: {
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 12,
    color: '#f1f1f1',
    marginTop: 2,
  },
  middleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8882b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    transform: [{ translateY: -20 }],
  },
});
