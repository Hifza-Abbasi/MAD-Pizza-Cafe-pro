import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebase/config';
import firebase from 'firebase/compat/app';

const PaymentScreen = () => {
  const [latestOrder, setLatestOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const fetchLatestOrder = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      try {
        const snapshot = await db
          .collection('orders')
          .doc(userId)
          .collection('orders')
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setLatestOrder({ id: doc.id, ...doc.data() });

          const paymentSnapshot = await db
            .collection('payments')
            .doc(userId)
            .collection('records')
            .where('orderId', '==', doc.id)
            .limit(1)
            .get();

          if (!paymentSnapshot.empty) {
            setPaymentStatus(paymentSnapshot.docs[0].data().status);
          }
        }
      } catch (error) {
        console.error('Payment fetch error:', error);
      }

      setLoading(false);
    };

    fetchLatestOrder();
  }, []);

  const makePayment = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId || !latestOrder) return;

    try {
      await db.collection('payments').doc(userId).collection('records').add({
        orderId: latestOrder.id,
        amount: latestOrder.total,
        status: 'Paid',
        paidAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      setPaymentStatus('Paid');
      Alert.alert('Success', 'Payment completed!');
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Could not process payment.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!latestOrder) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>No recent orders found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Latest Order</Text>
        <Text style={styles.value}>Order ID: {latestOrder.id}</Text>
        <Text style={styles.value}>Amount: ${latestOrder.total}</Text>
        <Text style={[styles.status, paymentStatus === 'Paid' ? styles.paid : styles.pending]}>
          Status: {paymentStatus || 'Pending'}
        </Text>
      </View>

      {paymentStatus !== 'Paid' && (
        <TouchableOpacity style={styles.payBtn} onPress={makePayment}>
          <Text style={styles.payBtnText}>💳 Pay Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfaf6', padding: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    elevation: 4,
  },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  value: { fontSize: 16, marginVertical: 4 },
  status: { fontSize: 16, marginTop: 10, fontWeight: 'bold' },
  paid: { color: 'green' },
  pending: { color: 'orange' },
  payBtn: {
    backgroundColor: '#27ae60',
    marginTop: 30,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  payBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: { fontSize: 16, color: '#888' },
});

export default PaymentScreen;
