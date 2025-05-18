// import React, { useEffect, useState } from 'react';
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { auth, db } from '../firebase/config';

const MenuScreen = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState([]);

  // Refresh data every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchMenuItems();
    }, [])
  );

  const fetchMenuItems = async () => {
    try {
      const snapshot = await db.collection('menuItems').get();
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu:', error);
      Alert.alert('Error', 'Could not load menu.');
    }
  };

  const addToCart = async (item) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    const itemRef = db
      .collection('cartItems')
      .doc(userId)
      .collection('items')
      .doc(item.id);

    try {
      const docSnap = await itemRef.get();

      if (docSnap.exists) {
        await itemRef.update({
          quantity: docSnap.data().quantity + 1,
        });
      } else {
        await itemRef.set({
          name: item.Name,
          price: item.Price,
          image: item.Image,
          quantity: 1,
        });
      }

      Alert.alert('Success', `${item.Name} added to cart`);
    } catch (error) {
      console.error('Add to cart error:', error);
      Alert.alert('Error', 'Could not add to cart');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.Image }} style={styles.image} />
      <Text style={styles.title}>{item.Name}</Text>
      <Text style={styles.description}>{item.Description}</Text>
      <Text style={styles.price}>
        {item.Price ? `Price: $${Number(item.Price).toFixed(2)}` : 'Price N/A'}
      </Text>

      <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
        <Text style={styles.addButtonText}>➕ Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
        <Text style={styles.cartButtonText}>🛒 View Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffaf0', padding: 10 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    elevation: 4,
  },
  image: { width: '100%', height: 180, borderRadius: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  description: { fontSize: 14, color: '#555', marginTop: 4 },
  price: { fontSize: 16, fontWeight: 'bold', marginVertical: 6 },
  addButton: {
    backgroundColor: '#f39c12',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 30,
  },
  cartButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default MenuScreen;

// import {
//   View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert,
// } from 'react-native';
// import { auth, db } from '../firebase/config';

// const MenuScreen = ({ navigation }) => {
//   const [menuItems, setMenuItems] = useState([]);

//   useEffect(() => {
//     fetchMenuItems();
//   }, []);

//   const fetchMenuItems = async () => {
//     try {
//       const snapshot = await db.collection('menuItems').get();
//       const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setMenuItems(items);
//     } catch (error) {
//       console.error('Error fetching menu:', error);
//       Alert.alert('Error', 'Could not load menu.');
//     }
//   };

//   const addToCart = async (item) => {
//     const userId = auth.currentUser?.uid;
//     if (!userId) {
//       Alert.alert('Error', 'User not logged in');
//       return;
//     }

//     const itemRef = db
//       .collection('cartItems')
//       .doc(userId)
//       .collection('items')
//       .doc(item.id);

//     try {
//       const docSnap = await itemRef.get();

//       if (docSnap.exists) {
//         // Item already in cart → update quantity
//         await itemRef.update({
//           quantity: docSnap.data().quantity + 1,
//         });
//       } else {
//         // New item
//         await itemRef.set({
//           name: item.Name,
//           price: item.Price,
//           image: item.Image,
//           quantity: 1,
//         });
//       }

//       Alert.alert('Success', `${item.Name} added to cart`);
//     } catch (error) {
//       console.error('Add to cart error:', error);
//       Alert.alert('Error', 'Could not add to cart');
//     }
//   };

//  const renderItem = ({ item }) => (
//   <View style={styles.card}>
//     <Image source={{ uri: item.Image }} style={styles.image} />
//     <Text style={styles.title}>{item.Name}</Text>
//     <Text style={styles.description}>{item.Description}</Text>
//     <Text style={styles.price}>
//       {item.Price ? `Price: $${Number(item.Price).toFixed(2)}` : 'Price N/A'}
//     </Text>

//     <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
//       <Text style={styles.addButtonText}>➕ Add to Cart</Text>
//     </TouchableOpacity>
//   </View>
// );


//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={menuItems}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 100 }}
//       />

//       <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
//         <Text style={styles.cartButtonText}>🛒 View Cart</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fffaf0', padding: 10 },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 16,
//     elevation: 4,
//   },
//   image: { width: '100%', height: 180, borderRadius: 10 },
//   title: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
//   description: { fontSize: 14, color: '#555', marginTop: 4 },
//   price: { fontSize: 16, fontWeight: 'bold', marginVertical: 6 },
//   addButton: {
//     backgroundColor: '#f39c12',
//     padding: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//   cartButton: {
//     position: 'absolute',
//     bottom: 20,
//     alignSelf: 'center',
//     backgroundColor: '#2ecc71',
//     padding: 15,
//     borderRadius: 30,
//   },
//   cartButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
// });

// export default MenuScreen;
