import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { debounce } from 'lodash';
import api from '../utils/api';

export default function SignUpScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    identity: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newErrors.email = 'Invalid email address';
      }
      if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    } else if (step === 2) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
    } else if (step === 3) {
      if (!formData.identity) {
        newErrors.identity = 'ID is required';
      }
      if (!formData.phoneNumber.match(/^\d{10,15}$/)) {
        newErrors.phoneNumber = 'Phone number must be 10–15 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Debounced check for username availability
  const checkUsernameExists = useCallback(
    debounce(async (username) => {
      try {
        const res = await api.get(`/auth/find/${username}`);
        if (res.data.success === true) {
          setErrors((prev) => ({ ...prev, username: 'Username is already taken' }));
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.username;
            return newErrors;
          });
        }
      } catch (error) {
        //console.error('Username check failed:', error?.response?.data.message || error.message);
      }
    }, 500),
    []
  );

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    if (key === 'username' && value.length >= 3) {
      checkUsernameExists(value);
    }

    if (errors[key]) {
      validateStep();
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSignUp = async () => {
    if (validateStep()) {
      setLoading(true);
      setMessage('');
      try {
        const response = await api.post('/auth/register', formData);
        if (response.status === 201 || response.status === 200) {
          setMessage('Account created successfully!');
          setTimeout(() => {
            navigation.navigate('SignIn');
          }, 1500);
        }
      } catch (error) {
        console.log('error:', error);
        if (error.response) {
          setMessage(error.response.data.message || 'Registration failed');
        } else if (error.request) {
          setMessage('No response from server. Check your connection.');
        } else {
          setMessage('Error: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/logo.png')}
        style={styles.bg}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.avoid}
        >
          <View style={styles.centerContainer}>
            <Animatable.View animation="fadeInUp" duration={800} style={styles.card}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to get started</Text>

              {message !== '' && (
                <Text
                  style={{
                    color: message.includes('successfully') ? 'green' : 'red',
                    textAlign: 'center',
                    marginBottom: 10,
                  }}
                >
                  {message}
                </Text>
              )}

              {step === 1 && (
                <>
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="#999"
                    style={styles.input}
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(text) => handleChange('email', text)}
                  />
                  {errors.email && <Text style={styles.error}>{errors.email}</Text>}

                  <TextInput
                    placeholder="Username"
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={formData.username}
                    onChangeText={(text) => handleChange('username', text)}
                  />
                  {errors.username && <Text style={styles.error}>{errors.username}</Text>}

                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#999"
                    style={styles.input}
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(text) => handleChange('password', text)}
                  />
                  {errors.password && <Text style={styles.error}>{errors.password}</Text>}
                </>
              )}

              {step === 2 && (
                <>
                  <TextInput
                    placeholder="First Name"
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={formData.firstName}
                    onChangeText={(text) => handleChange('firstName', text)}
                  />
                  {errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}

                  <TextInput
                    placeholder="Last Name"
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={formData.lastName}
                    onChangeText={(text) => handleChange('lastName', text)}
                  />
                  {errors.lastName && <Text style={styles.error}>{errors.lastName}</Text>}
                </>
              )}

              {step === 3 && (
                <>
                  <TextInput
                    placeholder="ID Number"
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={formData.identity}
                    onChangeText={(text) => handleChange('identity', text)}
                  />
                  {errors.identity && <Text style={styles.error}>{errors.identity}</Text>}

                  <TextInput
                    placeholder="Phone Number"
                    placeholderTextColor="#999"
                    style={styles.input}
                    keyboardType="phone-pad"
                    value={formData.phoneNumber}
                    onChangeText={(text) => handleChange('phoneNumber', text)}
                  />
                  {errors.phoneNumber && <Text style={styles.error}>{errors.phoneNumber}</Text>}
                </>
              )}

              <View style={{ marginTop: 10 }}>
                {step > 1 && (
                  <TouchableOpacity onPress={handleBack}>
                    <Text style={styles.linkBold}>Back</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={step === 3 ? handleSignUp : handleNext}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Please wait...' : step === 3 ? 'Sign Up' : 'Next'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.link}>
                  Already have an account?{' '}
                  <Text style={styles.linkBold}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { flex: 1 },
  avoid: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#191233',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    paddingLeft: 15,
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#f8882b',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 25,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
  },
  linkBold: {
    color: '#191233',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginBottom: 5,
    marginLeft: 5,
  },
});
