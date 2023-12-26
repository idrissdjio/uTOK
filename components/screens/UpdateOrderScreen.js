import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { supabase } from '../../config/supabase';

const UpdateOrderScreen = ({ route, navigation }) => {
  const [order, setOrder] = useState(route.params?.order);
  const [updatedOrder, setUpdatedOrder] = useState({ ...order }); // Track changes before updating
  const [itemsForm, setItemsForm] = useState([]);

  useEffect(() => {
    // Update the local state when the route params change (e.g., when navigating back from another screen)
    setOrder(route.params?.order);
    setUpdatedOrder({ ...order });
    setItemsForm(order.items ? Object.entries(order.items) : []);
  }, [route.params?.order]);

  const handleUpdateOrder = async () => {
    try {
      // Convert the dynamic form data back to a JSON file for the items field
      const updatedItems = itemsForm.reduce((acc, [itemName, quantity]) => {
        acc[itemName] = quantity;
        return acc;
      }, {});

      const updatedOrderWithItems = { ...updatedOrder, items: updatedItems };

      const { data, error } = await supabase
        .from('Orders')
        .update(updatedOrderWithItems)
        .eq('id', order.id);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Order updated successfully');
      // Navigate back to the OrderScreen after a successful update
      navigation.goBack();
    } catch (error) {
      console.error('Error updating order:', error.message);
      Alert.alert('Error', 'Failed to update order. Please try again.');
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('Orders')
        .delete()
        .eq('id', order.id);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Order deleted successfully');
      // Navigate back to the OrderScreen after a successful deletion
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting order:', error.message);
      Alert.alert('Error', 'Failed to delete order. Please try again.');
    }
  };

  const handleChangeText = (key, value) => {
    // Update the local state when a text input changes
    setUpdatedOrder((prevOrder) => ({ ...prevOrder, [key]: value }));
  };

  const handleItemQuantityChange = (itemName, quantity) => {
    // Update the item quantity in the dynamic form
    setItemsForm((prevItems) =>
      prevItems.map(([prevItemName, prevQuantity]) => {
        return prevItemName === itemName ? [prevItemName, quantity] : [prevItemName, prevQuantity];
      })
    );
  };

  const handleRemoveItem = (itemName) => {
    // Remove the item from the dynamic form
    setItemsForm((prevItems) => prevItems.filter(([prevItemName]) => prevItemName !== itemName));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <Text style={styles.title}>Update Order</Text> */}
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={updatedOrder.currentLocation}
          onChangeText={(text) => handleChangeText('currentLocation', text)}
        />

        <Text style={styles.label}>Area</Text>
        <TextInput
          style={styles.input}
          value={updatedOrder.selectedArea}
          onChangeText={(text) => handleChangeText('selectedArea', text)}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={String(updatedOrder.phoneNumber)}
          onChangeText={(text) => handleChangeText('phoneNumber', text)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>User Name</Text>
        <TextInput
          style={styles.input}
          value={updatedOrder.userName}
          onChangeText={(text) => handleChangeText('userName', text)}
        />

        <Text style={styles.label}>Payment Method</Text>
        <TextInput
          style={styles.input}
          value={updatedOrder.paymentMethod}
          onChangeText={(text) => handleChangeText('paymentMethod', text)}
        />

        <Text style={styles.label}>Total Price</Text>
        {/* <TextInput
          style={styles.input}
          value={String(updatedOrder.totalPrice)}
          onChangeText={(text) => handleChangeText('totalPrice', text)}
          keyboardType="numeric"
        /> */}

        <Text style={styles.label}>Items</Text>
        {itemsForm.map(([itemName, quantity]) => (
          <View key={itemName} style={styles.itemContainer}>
            <Text style={styles.itemName}>{itemName}</Text>
            <TextInput
              style={styles.itemQuantityInput}
              value={String(quantity)}
              onChangeText={(text) => handleItemQuantityChange(itemName, text)}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => handleRemoveItem(itemName)} style={styles.removeItemButton}>
              <Text style={styles.removeItemButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateOrder}>
          <Text style={styles.buttonText}>Update Order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteOrder}>
          <Text style={styles.buttonText}>Delete Order</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#088F8F',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  updateButton: {
    backgroundColor: '#088F8F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  itemQuantityInput: {
    width: 80,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginRight: 10,
  },
  removeItemButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeItemButtonText: {
    color: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20, // Adjust the paddingBottom as needed
  },
});

export default UpdateOrderScreen;
