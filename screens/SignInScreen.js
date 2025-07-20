import React, { useState } from 'react';
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
import api from '../utils/api'; // Make sure this points to your Axios instance
import { storeTokens } from '../utils/auth';
import eventBus from '../utils/eventBus';


export default function SignInScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (username.trim().length < 3) {
      newErrors.username = 'Invalid username';
      valid = false;
    }

    if (password.trim().length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignIn = async () => {
    if (validate()) {
      setLoading(true);
      setMessage('');
      try {
        const response = await api.post('/auth/login', {
          username,
          password,
        });

        if (response.status === 200) {
          const { accessToken, refreshToken } = response.data;
          await storeTokens({ accessToken, refreshToken });

          // Inside your login success block
          setMessage('Login successful!');
          eventBus.emit('LOGIN_SUCCESS');
        }
      } catch (error) {
        if (error.response) {
          setMessage(error.response.data.message || 'Login failed');
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
          style={styles.keyboardAvoid}
        >
          <View style={styles.centerWrapper}>
            <Animatable.View animation="fadeInUp" duration={800} style={styles.card}>
              <Text style={styles.title}>Welcome Back to Moola</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>

              {message !== '' && (
                <Text
                  style={{
                    color: message.includes('successful') ? 'green' : 'red',
                    textAlign: 'center',
                    marginBottom: 10,
                  }}
                >
                  {message}
                </Text>
              )}

              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Username"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (errors.username) validate();
                  }}
                />
                {errors.username && <Text style={styles.error}>{errors.username}</Text>}

                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#999"
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) validate();
                    }}
                  />
                  <TouchableOpacity
                    style={styles.toggle}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.error}>{errors.password}</Text>}
              </View>

              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={handleSignIn}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.link}>
                  Don't have an account? <Text style={styles.linkBold}>Sign Up</Text>
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
  container: {
    flex: 1,
  },
  bg: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    width: '100%',
    maxWidth: 400,
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
  inputContainer: {
    marginBottom: 20,
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
  passwordContainer: {
    position: 'relative',
  },
  toggle: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  toggleText: {
    color: '#f8882b',
    fontSize: 14,
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
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginBottom: 5,
    marginLeft: 5,
  },
});
