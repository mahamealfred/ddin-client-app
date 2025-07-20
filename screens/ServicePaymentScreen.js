import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Animated,
  Easing,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import { Ionicons } from '@expo/vector-icons';

import AppBackground from '../components/AppBackground';
import { useTheme } from '../themes/ThemeContext';

export default function ServicePaymentScreen({ navigation, route }) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [allContacts, setAllContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const { theme } = useTheme();

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
  }, [step]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        const valid = data.filter(c => c.phoneNumbers && c.phoneNumbers.length > 0);
        setAllContacts(valid);
      } else {
        Alert.alert('Permission Denied', 'Access to contacts was denied.');
      }
    })();
  }, []);

  const validatePhone = () => /^(07[2-9]\d{7})$/.test(phone);

  const nextStep = () => {
    if (step === 1 && !validatePhone()) {
      Alert.alert('Invalid Phone Number', 'Enter a valid MTN phone number.');
      return;
    }
    setStep(step + 1);
    Keyboard.dismiss();
  };

  const handleConfirm = () => {
    Alert.alert('Payment Submitted', `Paying ${amount} RWF for ${route.params?.service}`);
    navigation.goBack();
  };

  const handlePhoneChange = (text) => {
    setPhone(text);
    if (text.length >= 2) {
      const query = text.toLowerCase();
      const matches = allContacts.filter(contact =>
        contact.phoneNumbers.some(p => p.number.replace(/\s/g, '').includes(query)) ||
        contact.name.toLowerCase().includes(query)
      );
      setFilteredContacts(matches);
    } else {
      setFilteredContacts([]);
    }
  };

  const handleSelectContact = (number) => {
    setPhone(number.replace(/\s/g, ''));
    setFilteredContacts([]);
    Keyboard.dismiss();
  };

  return (
    <AppBackground>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={styles.header}>{route.params?.service || 'Service'} Payment</Text>

        <Animated.View style={{ opacity: fadeAnim }}>
          {step === 1 && (
            <>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={handlePhoneChange}
                placeholder="Type phone number or name"
                keyboardType="default"
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                placeholderTextColor="#999"
              />
              {isInputFocused && filteredContacts.length > 0 && (
                <FlatList
                  style={styles.dropdown}
                  data={filteredContacts}
                  keyExtractor={(item) => item.id}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.contactItem}
                      onPress={() => handleSelectContact(item.phoneNumbers[0].number)}
                    >
                      <Text style={styles.contactName}>{item.name}</Text>
                      <Text style={styles.contactNumber}>{item.phoneNumbers[0].number}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
              <TouchableOpacity style={styles.button} onPress={nextStep}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.label}>Amount (RWF)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="Enter amount"
                placeholderTextColor="#999"
              />
              <Text style={styles.label}>Reference</Text>
              <TextInput
                style={styles.input}
                value={reference}
                onChangeText={setReference}
                placeholder="e.g. Meter number / Tax ID"
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.button} onPress={nextStep}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.summary}>Confirm Payment</Text>
              <Text style={styles.confirmItem}>Service: {route.params?.service}</Text>
              <Text style={styles.confirmItem}>Phone: {phone}</Text>
              <Text style={styles.confirmItem}>Amount: RWF {amount}</Text>
              <Text style={styles.confirmItem}>Reference: {reference}</Text>
              <TouchableOpacity style={styles.buttonConfirm} onPress={handleConfirm}>
                <Text style={styles.buttonText}>Confirm Payment</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#f8882b',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  dropdown: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: -5,
    marginBottom: 10,
  },
  contactItem: {
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
  },
  contactNumber: {
    fontSize: 14,
    color: '#666',
  },
  summary: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  confirmItem: {
    fontSize: 16,
    marginBottom: 6,
    color: '#444',
  },
  button: {
    backgroundColor: '#f8882b',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonConfirm: {
    backgroundColor: '#0a7f36',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
