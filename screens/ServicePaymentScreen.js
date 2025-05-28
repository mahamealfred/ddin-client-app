import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import * as Contacts from 'expo-contacts';

export default function ServicePaymentScreen({ navigation, route }) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [allContacts, setAllContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Fetch contacts once
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

  const validatePhone = () => {
    const phoneRegex = /^(07[2-9]\d{7})$/;
    return phoneRegex.test(phone);
  };

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

  // Filter contacts by name or number
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
    <View style={styles.container}>
      <Text style={styles.header}>{route.params?.service || 'Service'} Payment</Text>

      {step === 1 && (
        <View>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={handlePhoneChange}
            placeholder="Type phone number or name"
            keyboardType="default"
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
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

          <View style={styles.spacer} />
          <Button title="Next" onPress={nextStep} />
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={styles.label}>Amount (RWF)</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
          />
          <Text style={styles.label}>Reference</Text>
          <TextInput
            style={styles.input}
            value={reference}
            onChangeText={setReference}
            placeholder="e.g. Meter number / Tax ID"
          />
          <Button title="Next" onPress={nextStep} />
        </View>
      )}

      {step === 3 && (
        <View>
          <Text style={styles.summary}>Confirm Payment</Text>
          <Text>Service: {route.params?.service}</Text>
          <Text>Phone: {phone}</Text>
          <Text>Amount: RWF {amount}</Text>
          <Text>Reference: {reference}</Text>
          <Button title="Confirm Payment" onPress={handleConfirm} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 10,
  },
  summary: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  contactItem: {
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  contactName: { fontSize: 16, fontWeight: '500' },
  contactNumber: { fontSize: 14, color: '#666' },
  dropdown: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: -10,
    marginBottom: 10,
  },
  spacer: { height: 10 },
});
