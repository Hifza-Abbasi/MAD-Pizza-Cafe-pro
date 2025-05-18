import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, Image,TouchableOpacity
} from 'react-native';
import { auth, db } from '../firebase/config';
import { useNavigation } from '@react-navigation/native';

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      const snapshot = await db
        .collection('orders')
        .doc(userId)
        .collection('orders')
        .orderBy('createdAt', 'desc')
        .get();

      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderTitle}>🧾 Order ID: {item.id.slice(0, 8)}</Text>
      <Text style={styles.orderTotal}>Total: ${item.total}</Text>
      <Text style={styles.orderDate}>
        {item.createdAt?.toDate().toLocaleString() || 'Date not available'}
      </Text>
      <FlatList
        data={item.items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text>Qty: {item.quantity}</Text>
              <Text>${parseFloat(item.price).toFixed(2)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>You haven't placed any orders yet.</Text>
        }
        
      />
      <TouchableOpacity
  style={{
    backgroundColor: '#27ae60',
    padding: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30,
  }}
  onPress={() => navigation.navigate('Payment')}
>
  <Text style={{ color: '#fff', fontWeight: 'bold' }}>💳 Make Payment</Text>
</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fefefe' },
  orderCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
  orderTitle: { fontWeight: 'bold', fontSize: 16 },
  orderTotal: { color: '#2ecc71', fontSize: 16, marginVertical: 4 },
  orderDate: { fontSize: 12, color: '#999' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 8,
  },
  image: { width: 60, height: 60, borderRadius: 8 },
  itemDetails: { marginLeft: 10 },
  itemName: { fontWeight: 'bold' },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
    fontSize: 16,
  },
});

export default OrderScreen;
