import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Text,
  StatusBar,
} from 'react-native';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('SignIn');
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Animated.View style={{ alignItems: 'center', opacity: fadeAnim }}>
        <Image
          source={require('../assets/logo.png')} // Replace with your actual logo
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Moola</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Clean white background
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 15,
  },
  tagline: {
  fontSize: 18,
  color: '#2C3E50', // A strong, elegant dark blue-gray tone
  fontWeight: '600',
  letterSpacing: 1,
  fontStyle: 'italic',
  textAlign: 'center',
  marginTop: 10,
  opacity: 0.9,
},

});
