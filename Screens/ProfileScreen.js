import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { auth } from '../firebase/config';

const ProfileScreen = ({ navigation }) => {
  const user = auth.currentUser;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await auth.signOut();
              navigation.replace('Login'); // or navigation.navigate depending on stack
            } catch (error) {
              Alert.alert('Logout Error', error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        }}
        style={styles.avatar}
      />
      <Text style={styles.name}>
        {user?.displayName || 'Pizza Lover'}
      </Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>UID:</Text>
        <Text style={styles.value}>{user?.uid}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf0',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#f39c12',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  email: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  label: {
    fontWeight: 'bold',
    color: '#34495e',
  },
  value: {
    marginTop: 5,
    color: '#7f8c8d',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
