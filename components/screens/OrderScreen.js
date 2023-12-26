import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../../config/supabase';
import { useNavigation } from '@react-navigation/native';

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();

  const fetchOrders = async () => {
    try {
      const session = await supabase.auth.getSession();
      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        const email = user.email;
        const { data, error } = await supabase
          .from('Orders')
          .select('*')
          .eq('email', email)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []); // Fetch orders on initial component mount

  useEffect(() => {
    // Fetch orders whenever the orders state changes
    fetchOrders();
  }, [orders]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderBlock} onPress={() => handleOrderClick(item)}>
      <Text style={styles.orderTitle}>{formatDate(item.created_at)}</Text>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.orderDetailsContainer}>
        <OrderDetail label="Location" value={item.currentLocation} />
        <OrderDetail label="Area" value={item.selectedArea} />
        <OrderDetail label="Phone Number" value={item.phoneNumber} />
        <OrderDetail label="User Name" value={item.userName} />
        <OrderDetail label="Payment Method" value={item.paymentMethod} />
        <OrderDetail label="Total Price" value={`CFA ${item.totalPrice.toFixed(2)}`} />
        <OrderDetail label="Items" value={renderItems(item.items)} />
      </ScrollView>
    </TouchableOpacity>
  );

  const renderItems = (items) => (
    <View style={styles.itemsContainer}>
      {Object.entries(items).map(([itemName, quantity]) => (
        <Text key={itemName} style={styles.itemDetail}>{`${itemName}: ${quantity}`}</Text>
      ))}
    </View>
  );

  const handleOrderClick = (order) => {
    navigation.navigate('UpdateOrder', { order });
    console.log('Order clicked:', order);
    // Implement navigation or any action when an order block is clicked
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const OrderDetail = ({ label, value }) => (
    <View style={styles.orderDetailContainer}>
      <Text style={styles.orderLabel}>{label}:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={styles.orderValue}>{value}</Text>
      </ScrollView>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#F5F5F5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#088F8F',
    },
    orderList: {
      flexGrow: 1,
    },
    orderBlock: {
      backgroundColor: '#fff',
      padding: 20,
      marginBottom: 15,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    orderTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#088F8F',
    },
    orderDetailsContainer: {
      maxHeight: 200,
    },
    orderDetailContainer: {
      flexDirection: 'row',
      marginBottom: 5,
    },
    orderLabel: {
      fontWeight: 'bold',
      marginRight: 5,
      color: '#333',
    },
    orderValue: {
      flex: 1,
      color: '#333',
    },
    itemsContainer: {
      marginTop: 10,
    },
    itemDetail: {
      color: '#088F8F',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.orderList}
      />
    </View>
  );
};

export default OrderScreen;
