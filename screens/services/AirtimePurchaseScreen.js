import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import AppBackground from '../../components/AppBackground';
import { useTheme } from '../../themes/ThemeContext';
import api from '../../utils/api';

export default function AirtimePurchaseScreen() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [trxId, setTrxId] = useState('');
  const [hasFloat, setHasFloat] = useState(false); // unused here but can be toggled
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' | 'failed'
  const { theme } = useTheme();

  const phoneRegex = /^07[2,3,8,9]\d{7}$/;

  const formatPhone = (num) => {
    const digits = num.replace(/\D/g, '');
    if (digits.startsWith('250')) return `+${digits}`;
    if (digits.startsWith('07')) return `+25${digits}`;
    return `+${digits}`;
  };

  const validatePhoneNumber = async (number) => {
    const fullNumber = formatPhone(number);
    setLoading(true);
    try {
      const response = await api.post('/clients/validation/validate/vendor', {
        customerAccountNumber: fullNumber,
        serviceType: 'airtime',
      });

      if (response.data?.success) {
        setPhoneNumber(fullNumber);
        setTrxId(response.data?.data.trxId);
        setStep(2);
        setErrors({});
      } else {
        setErrors({ phoneNumber: response.data?.message || 'Validation failed' });
      }
    } catch (error) {
      setErrors({ phoneNumber: error.response?.data?.message || 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const sendAirtime = async (method) => {
    if (!amount || isNaN(amount) || Number(amount) < 100) {
      setErrors({ amount: 'Enter a valid amount (min 100)' });
      return;
    }

    setLoading(true);
    setErrors({});
    setPaymentStatus(null);
    try {
      const response = await api.post('/clients/payment/execute/vendor', {
        phoneNumber,
        amount,
        currencySymbol: 'Rwf',
        serviceType: 'airtime',
        trxId:trxId,
      });

      if (response.data?.success) {
        setPaymentStatus('success');
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
    
      setErrors(error.response.data.message)
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!phoneRegex.test(phoneNumber.slice(-10))) {
      setErrors({ phoneNumber: 'Enter a valid Rwandan phone number' });
      return;
    }
    await validatePhoneNumber(phoneNumber);
  };

  const searchContacts = async (input) => {
    setSearchQuery(input);
    const digitsOnly = input.replace(/\D/g, '');

    if (phoneRegex.test(digitsOnly)) {
      setPhoneNumber(digitsOnly);
      setFilteredContacts([]);
      return;
    }

    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') return;

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    const results = data.filter(
      (c) =>
        c.name?.toLowerCase().includes(input.toLowerCase()) &&
        c.phoneNumbers?.length > 0
    );

    setFilteredContacts(results);
  };

  const selectContact = async (contact) => {
    const number = contact.phoneNumbers?.[0]?.number?.replace(/\D/g, '');
    if (number) {
      setSearchQuery(contact.name);
      setFilteredContacts([]);
      await validatePhoneNumber(number);
    }
  };

  const renderStatusMessage = () => {
    if (paymentStatus === 'success') {
      return (
        <Animatable.View animation="fadeInDown" style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={60} color="green" />
          <Text style={styles.successText}>Payment Successful</Text>
        </Animatable.View>
      );
    } else if (paymentStatus === 'failed') {
      return (
        <Animatable.View animation="shake" style={styles.failedContainer}>
          <Ionicons name="close-circle" size={60} color="red" />
          <Text style={styles.failedText}>{errors}</Text>
        </Animatable.View>
      );
    }
    return null;
  };

  return (
    <AppBackground>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <KeyboardAvoidingView
          style={styles.inner}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Animatable.View animation="fadeInUp" duration={800} style={styles.card}>
            {step === 1 && (
              <>
                <Text style={styles.title}>Step 1: Enter Phone or Search</Text>
                <TextInput
                  placeholder="Search name or enter phone number"
                  style={styles.input}
                  value={searchQuery}
                  onChangeText={(text) => {
                    setPhoneNumber('');
                    setErrors({});
                    searchContacts(text);
                  }}
                  onSubmitEditing={handleNext}
                />

                {filteredContacts.length > 0 && (
                  <FlatList
                    data={filteredContacts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => selectContact(item)}
                      >
                        <Text>{item.name}</Text>
                        <Text style={{ color: '#888' }}>
                          {item.phoneNumbers?.[0]?.number}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                )}

                {loading && <ActivityIndicator size="small" color="#f8882b" style={{ marginVertical: 10 }} />}
                {errors.phoneNumber && <Text style={styles.error}>{errors.phoneNumber}</Text>}

                <TouchableOpacity style={styles.button} onPress={handleNext} disabled={loading}>
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 2 && (
              <>
                <Text style={styles.title}>Step 2: Enter Amount</Text>

                <Text style={styles.subtitle}>Sending to:</Text>
                <Text style={styles.selectedPhone}>{phoneNumber}</Text>

                <TextInput
                  placeholder="Amount (RWF)"
                  style={styles.input}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
                {errors.amount && <Text style={styles.error}>{errors.amount}</Text>}

                <Text style={styles.subtitle}>Select Payment Method:</Text>

                {hasFloat && (
                  <TouchableOpacity
                    style={styles.paymentOption}
                    onPress={() => sendAirtime('float')}
                  >
                    <Text>Moola Balance</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.paymentOption}
                  onPress={() => sendAirtime('momo')}
                  disabled={loading}
                >
                  <Text>MTN Mobile Money</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStep(1)} style={styles.backButton}>
                  <Text style={styles.backText}>← Go Back</Text>
                </TouchableOpacity>

                {loading && <ActivityIndicator size="large" color="#f8882b" style={{ marginTop: 15 }} />}
                {renderStatusMessage()}
              </>
            )}
          </Animatable.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    elevation: 5,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#191233', marginBottom: 20 },
  subtitle: { fontSize: 14, marginBottom: 5, color: '#666' },
  selectedPhone: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  error: { color: 'red', fontSize: 13, marginBottom: 10 },
  button: {
    backgroundColor: '#f8882b',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
  paymentOption: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginVertical: 6,
    backgroundColor: '#fff3ea',
  },
  contactItem: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 5,
  },
  backButton: { marginTop: 15, alignSelf: 'center' },
  backText: { color: '#f8882b', fontWeight: '500' },
  successContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  successText: {
    color: 'green',
    fontSize: 18,
    marginTop: 10,
    fontWeight: '600',
  },
  failedContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  failedText: {
    color: 'red',
    fontSize: 18,
    marginTop: 10,
    fontWeight: '600',
  },
});
