// import React, { useState, useCallback } from 'react';
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
  TouchableOpacity, Alert
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase/config';
import firebase from 'firebase/compat/app';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchCartItems();
    }, [])
  );

  const fetchCartItems = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      const snapshot = await db
        .collection('cartItems')
        .doc(userId)
        .collection('items')
        .get();

      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(items);
    } catch (error) {
      console.error('Fetch cart error:', error);
    }
  };

  const updateQuantity = async (itemId, change) => {
    const userId = auth.currentUser?.uid;
    const itemRef = db.collection('cartItems').doc(userId).collection('items').doc(itemId);

    try {
      const itemSnap = await itemRef.get();
      if (itemSnap.exists) {
        const currentQty = itemSnap.data().quantity || 0;
        const newQty = currentQty + change;

        if (newQty <= 0) {
          await itemRef.delete();
        } else {
          await itemRef.update({ quantity: newQty });
        }
        fetchCartItems();
      }
    } catch (error) {
      console.error('Update quantity error:', error);
    }
  };

  const removeItem = async (itemId) => {
    const userId = auth.currentUser?.uid;
    try {
      await db.collection('cartItems').doc(userId).collection('items').doc(itemId).delete();
      fetchCartItems();
    } catch (error) {
      console.error('Remove item error:', error);
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number'
        ? item.price
        : parseFloat(item.price) || 0;
      const quantity = typeof item.quantity === 'number'
        ? item.quantity
        : parseInt(item.quantity) || 0;
      return total + price * quantity;
    }, 0).toFixed(2);
  };

  const completeOrder = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to the cart before ordering.');
      return;
    }

    try {
      const order = {
        items: cartItems,
        total: getTotal(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      await db
        .collection('orders')
        .doc(userId)
        .collection('orders')
        .add(order);

      // Clear the cart
      const batch = db.batch();
      cartItems.forEach(item => {
        const itemRef = db.collection('cartItems').doc(userId).collection('items').doc(item.id);
        batch.delete(itemRef);
      });
      await batch.commit();

      setCartItems([]);
      Alert.alert('Order Complete', 'Your order has been placed!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Order'),
        },
      ]);
    } catch (error) {
      console.error('Order error:', error);
      Alert.alert('Error', 'Could not complete order.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{item.name || 'Unnamed Item'}</Text>
        <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
        <Text>Quantity: {item.quantity}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.qtyButton}>
            <Text style={styles.qtyText}>➖</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.qtyButton}>
            <Text style={styles.qtyText}>➕</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteButton}>
            <Text style={styles.deleteText}>🗑️ Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Your cart is empty.</Text>}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {cartItems.length > 0 && (
        <>
          <View style={styles.totalBox}>
            <Text style={styles.totalText}>Total: ${getTotal()}</Text>
          </View>
          <TouchableOpacity style={styles.orderButton} onPress={completeOrder}>
            <Text style={styles.orderButtonText}>✅ Complete Order</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffaf0', padding: 10 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    elevation: 3,
  },
  image: { width: 100, height: 100, borderRadius: 8 },
  details: { flex: 1, marginLeft: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
  price: { fontSize: 16, color: '#666', marginVertical: 4 },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  qtyButton: {
    backgroundColor: '#f39c12',
    padding: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  qtyText: { color: '#fff', fontSize: 18 },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 6,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  deleteText: { color: '#fff' },
  totalBox: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#2ecc71',
    padding: 14,
    borderRadius: 30,
  },
  totalText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  orderButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 50,
  },
});

export default CartScreen;

// import {
//   View, Text, StyleSheet, FlatList, Image,
//   TouchableOpacity, Alert
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { auth, db } from '../firebase/config';
// import firebase from 'firebase/compat/app';

// const CartScreen = () => {
//   const [cartItems, setCartItems] = useState([]);

//   useFocusEffect(
//     useCallback(() => {
//       fetchCartItems();
//     }, [])
//   );

//   const fetchCartItems = async () => {
//     const userId = auth.currentUser?.uid;
//     if (!userId) return;

//     try {
//       const snapshot = await db
//         .collection('cartItems')
//         .doc(userId)
//         .collection('items')
//         .get();

//       const items = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setCartItems(items);
//     } catch (error) {
//       console.error('Fetch cart error:', error);
//     }
//   };

//   const updateQuantity = async (itemId, change) => {
//     const userId = auth.currentUser?.uid;
//     const itemRef = db.collection('cartItems').doc(userId).collection('items').doc(itemId);

//     try {
//       const itemSnap = await itemRef.get();
//       if (itemSnap.exists) {
//         const currentQty = itemSnap.data().quantity || 0;
//         const newQty = currentQty + change;

//         if (newQty <= 0) {
//           await itemRef.delete();
//         } else {
//           await itemRef.update({ quantity: newQty });
//         }
//         fetchCartItems();
//       }
//     } catch (error) {
//       console.error('Update quantity error:', error);
//     }
//   };

//   const removeItem = async (itemId) => {
//     const userId = auth.currentUser?.uid;
//     try {
//       await db.collection('cartItems').doc(userId).collection('items').doc(itemId).delete();
//       fetchCartItems();
//     } catch (error) {
//       console.error('Remove item error:', error);
//     }
//   };

//   const getTotal = () => {
//     return cartItems.reduce((total, item) => {
//       const price = typeof item.price === 'number'
//         ? item.price
//         : parseFloat(item.price) || 0;
//       const quantity = typeof item.quantity === 'number'
//         ? item.quantity
//         : parseInt(item.quantity) || 0;
//       return total + price * quantity;
//     }, 0).toFixed(2);
//   };

//   const completeOrder = async () => {
//     const userId = auth.currentUser?.uid;
//     if (!userId) return;

//     if (cartItems.length === 0) {
//       Alert.alert('Empty Cart', 'Please add items to the cart before ordering.');
//       return;
//     }

//     try {
//       const order = {
//         items: cartItems,
//         total: getTotal(),
//         createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//       };

//       await db
//         .collection('orders')
//         .doc(userId)
//         .collection('orders')
//         .add(order);

//       // Clear cart
//       const batch = db.batch();
//       cartItems.forEach(item => {
//         const itemRef = db.collection('cartItems').doc(userId).collection('items').doc(item.id);
//         batch.delete(itemRef);
//       });
//       await batch.commit();

//       setCartItems([]);
//       Alert.alert('Order Complete', 'Your order has been placed!');
//     } catch (error) {
//       console.error('Order error:', error);
//       Alert.alert('Error', 'Could not complete order.');
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Image source={{ uri: item.image }} style={styles.image} />
//       <View style={styles.details}>
//         <Text style={styles.title}>{item.name || 'Unnamed Item'}</Text>
//         <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
//         <Text>Quantity: {item.quantity}</Text>
//         <View style={styles.buttonRow}>
//           <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.qtyButton}>
//             <Text style={styles.qtyText}>➖</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.qtyButton}>
//             <Text style={styles.qtyText}>➕</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteButton}>
//             <Text style={styles.deleteText}>🗑️ Remove</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={cartItems}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         ListEmptyComponent={<Text style={styles.empty}>Your cart is empty.</Text>}
//         contentContainerStyle={{ paddingBottom: 120 }}
//       />

//       {cartItems.length > 0 && (
//         <>
//           <View style={styles.totalBox}>
//             <Text style={styles.totalText}>Total: ${getTotal()}</Text>
//           </View>
//           <TouchableOpacity style={styles.orderButton} onPress={completeOrder}>
//             <Text style={styles.orderButtonText}>✅ Complete Order</Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fffaf0', padding: 10 },
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 10,
//     marginBottom: 12,
//     elevation: 3,
//   },
//   image: { width: 100, height: 100, borderRadius: 8 },
//   details: { flex: 1, marginLeft: 10 },
//   title: { fontSize: 18, fontWeight: 'bold' },
//   price: { fontSize: 16, color: '#666', marginVertical: 4 },
//   buttonRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 6,
//   },
//   qtyButton: {
//     backgroundColor: '#f39c12',
//     padding: 6,
//     borderRadius: 6,
//     marginRight: 8,
//   },
//   qtyText: { color: '#fff', fontSize: 18 },
//   deleteButton: {
//     backgroundColor: '#e74c3c',
//     padding: 6,
//     borderRadius: 6,
//     marginLeft: 'auto',
//   },
//   deleteText: { color: '#fff' },
//   totalBox: {
//     position: 'absolute',
//     bottom: 80,
//     alignSelf: 'center',
//     backgroundColor: '#2ecc71',
//     padding: 14,
//     borderRadius: 30,
//   },
//   totalText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
//   orderButton: {
//     position: 'absolute',
//     bottom: 20,
//     alignSelf: 'center',
//     backgroundColor: '#3498db',
//     paddingVertical: 14,
//     paddingHorizontal: 30,
//     borderRadius: 30,
//   },
//   orderButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   empty: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#777',
//     marginTop: 50,
//   },
// });

// export default CartScreen;
