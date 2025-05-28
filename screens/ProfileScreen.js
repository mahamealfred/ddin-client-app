import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/Footer';

export default function ProfileScreen({ navigation }) {
  const user = {
    name: 'Alfred Mahame',
    email: 'alfred@example.com',
    phone: '+250 788 123 456',
    avatar: 'https://i.pravatar.cc/150?img=12',
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.phone}>{user.phone}</Text>
        </View>

        {/* Account Actions */}
        <View style={styles.actions}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <ProfileAction icon="person-outline" label="Edit Profile" onPress={() => alert('Edit Profile')} />
          <ProfileAction icon="lock-closed-outline" label="Change Password" onPress={() => alert('Change Password')} />
          <ProfileAction icon="log-out-outline" label="Logout" onPress={() => alert('Logged out')} />
        </View>
      </ScrollView>

      {/* Footer */}
      <Footer navigation={navigation} />
    </View>
  );
}

function ProfileAction({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <Ionicons name={icon} size={24} color="#f8882b" />
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#191233',
    paddingVertical: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#f8882b',
  },
  name: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
    marginTop: 15,
  },
  email: {
    fontSize: 14,
    color: '#dcdcdc',
    marginTop: 2,
  },
  phone: {
    fontSize: 14,
    color: '#f8882b',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  actions: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  actionLabel: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
    fontWeight: '500',
  },
});
