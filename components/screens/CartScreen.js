import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CartScreen = ({ route }) => {
  const initialCartItems = route?.params?.cartItems || [];
  const navigation = useNavigation();

  const handleCheckout = () => {
    // Navigate to CheckoutScreen
    const formattedItems = cartItems.map((item) => ({
      [item.name]: item.quantity,
    }));
    // navigation.navigate('Checkout', { cartItems, totalPrice });
    navigation.navigate('Checkout', { cartItems: formattedItems, totalPrice });
  };


  const initialCartItemsWithQuantity = initialCartItems.map((item) => ({
    ...item,
    quantity: 1,
  }));
  

  const [cartItems, setCartItems] = useState(initialCartItemsWithQuantity);

  useEffect(() => {
    // Update cartItems when route params change
    setCartItems(route?.params?.cartItems || []);
  }, [route?.params?.cartItems]);

  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === itemId) {
          // Ensure that the new quantity is a valid number and greater than 0
          const validQuantity = typeof newQuantity === 'number' && newQuantity > 0 ? newQuantity : 1;
          return { ...item, quantity: validQuantity };
        }
        return item;
      });
    });
  };
  
  const totalPrice = cartItems.reduce((total, item) => {
    // Ensure that item.quantity is a valid number and greater than 0
    const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
  
    return total + item.price * quantity;
  }, 0);
  

  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    // Check if the last item is being removed
    if (cartItems.length === 1) {
      setCartItems([]);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.cartItem}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>CFA {item.price}</Text>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleQuantityChange(item.id, item.quantity - 1)}>
            <Text style={styles.quantityButton}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleQuantityChange(item.id, item.quantity + 1)}>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
          <Text style={styles.removeButton}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // const totalPrice = cartItems.reduce((total, item) => {
  //   // Ensure that item.quantity is a valid number before calculating
  //   const quantity = typeof item.quantity === 'number' ? item.quantity : 0;

  //   return total + item.price * quantity;
  // }, 0);

  return (
    <View style={styles.container}>
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>No items in the cart</Text>
        </View>
      )}
      <View style={styles.totalContainer}>
        {cartItems.length > 0 && (
          <>
            <Text style={styles.totalText}>Total: CFA {totalPrice.toFixed(2)}</Text>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    color: 'gray',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensure space between "-" and "+" buttons
    marginRight: 20,
    paddingVertical: 10,
  },  
  quantityButton: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 10, // Add margin to create space between the buttons and the quantity text
    padding: 5, // Adjust padding as needed for the desired button size
  },
  removeButton: {
    color: 'red',
    marginLeft: 20,
    fontWeight: 'bold' // Increased margin for better spacing
  },
  checkoutButton: {
    marginTop: 10, // Add margin to separate the checkout button
    backgroundColor: '#088F8F',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 10, // Add margin to create space between the buttons and the quantity text
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 15
  }
});

export default CartScreen;
