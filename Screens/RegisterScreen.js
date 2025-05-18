// screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { auth } from '../firebase/config';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }

    try {
      await auth.createUserWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Account created. You can now log in.');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Registration Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.switchText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fffaf0'
  },
  title: {
    fontSize: 26, fontWeight: 'bold', marginBottom: 30, color: '#d35400',
  },
  input: {
    width: '100%', padding: 14, backgroundColor: '#f0f0f0', borderRadius: 10, marginBottom: 15, fontSize: 16,
  },
  button: {
    backgroundColor: '#e67e22', padding: 14, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 20,
  },
  buttonText: {
    color: '#fff', fontSize: 17, fontWeight: '600',
  },
  switchText: {
    fontSize: 14, color: '#2980b9',
  },
});

export default RegisterScreen;
