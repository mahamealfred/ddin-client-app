import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/Footer';
import AppBackground from '../components/AppBackground';
import { useTheme } from '../themes/ThemeContext';
import { logout } from '../utils/auth';


export default function ProfileScreen({ navigation }) {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme.mode === 'dark';

  const user = {
    name: 'Alfred Mahame',
    email: 'alfred@example.com',
    phone: '+250 788 123 456',
    avatar: 'https://i.pravatar.cc/150?img=12',
  };

  // ✅ Logout Handler
  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }], 
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppBackground>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.header, { backgroundColor: isDarkMode ? '#292542cc' : '#191233cc' }]}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <Text style={[styles.name, { color: theme.text }]}>{user.name}</Text>
            <Text style={[styles.email, { color: theme.text }]}>{user.email}</Text>
            <Text style={[styles.phone, { color: theme.primary }]}>{user.phone}</Text>
          </View>

          <View style={styles.actions}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Account Settings</Text>

            <View style={[styles.actionItem, { backgroundColor: theme.card }]}>
              <Ionicons name="moon-outline" size={24} color={theme.primary} />
              <Text style={[styles.actionLabel, { color: theme.text, flex: 1, marginLeft: 15 }]}>
                Dark Mode
              </Text>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                thumbColor={theme.primary}
              />
            </View>

            <ProfileAction
              icon="person-outline"
              label="Edit Profile"
              onPress={() => alert('Edit Profile')}
              theme={theme}
            />
            <ProfileAction
              icon="lock-closed-outline"
              label="Change Password"
              onPress={() => alert('Change Password')}
              theme={theme}
            />
            {/* ✅ Logout Action */}
            <ProfileAction
            
  icon="log-out-outline"
  label="Logout"
  onPress={async () => {
    await logout();
  }}
  theme={theme}
/>
          
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={styles.footer}>
          <Footer navigation={navigation} />
        </View>
      </View>
    </AppBackground>
  );
}

function ProfileAction({ icon, label, onPress, theme }) {
  return (
    <TouchableOpacity
      style={[styles.actionItem, { backgroundColor: theme.card }]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={24} color={theme.primary} />
      <Text style={[styles.actionLabel, { color: theme.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: { paddingBottom: 120 },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
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
  name: { fontSize: 24, fontWeight: '700', marginTop: 15 },
  email: { fontSize: 14, marginTop: 2 },
  phone: { fontSize: 14, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  actions: { marginTop: 30, paddingHorizontal: 20 },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  actionLabel: { fontSize: 16, marginLeft: 15, fontWeight: '500' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
