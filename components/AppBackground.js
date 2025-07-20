// components/AppBackground.js
import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function AppBackground({ children }) {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/logo.png')} // same background as SignInScreen
        style={styles.bg}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <Animatable.View animation="fadeInUp" duration={800} style={styles.content}>
            {children}
          </Animatable.View>
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
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
});
