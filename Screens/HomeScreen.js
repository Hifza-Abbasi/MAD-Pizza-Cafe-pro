import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { auth } from '../firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [userEmail, setUserEmail] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('userToken');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/pizza1.jpeg')} style={styles.logo} />

      <Text style={styles.welcome}>Welcome to Pizza Café!</Text>
      <Text style={styles.subText}>Logged in as: {userEmail}</Text>

      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Menu')}>
        <Text style={styles.buttonText}>🍕 View Menu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Cart')}>
        <Text style={styles.buttonText}>🛒 View Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Order')}>
        <Text style={styles.buttonText}>📦 My Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.buttonText}>👤 Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Payment')}>
        <Text style={styles.buttonText}>💳 Payment</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuButton, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fffaf0',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
    borderRadius: 80,
  },
  welcome: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#d35400',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
  },
  menuButton: {
    backgroundColor: '#f39c12',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 6,
    width: '90%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default HomeScreen;
