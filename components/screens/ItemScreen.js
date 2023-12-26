import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, Button, Alert, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { supabase } from '../../config/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';



const ItemScreen = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();


  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text>{item.name}</Text>
    </View>
  );

  const navigateToCartScreen = () => {
    // Navigate to CartScreen with cartItems as props
    // Replace 'YourCartScreenComponent' with the actual component for CartScreen
    const quantity = 1
    navigation.navigate('Cart', { cartItems, quantity });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('id, name, image, price');

    if (error) console.log('Error: ', error);
    else setItems(data);
  };

  const handleAddToCart = (item) => {
    if (cartItems.some(cartItem => cartItem.id === item.id)) {
      // Item already in cart, provide option to remove it
      setCartItems(cartItems.filter(cartItem => cartItem.id !== item.id));
      setCartItems(prevItems => prevItems.map(cartItem => {
        if (cartItem.id === item.id) {
          // Decrease quantity by 1 if greater than 1, else remove the item
          return { ...cartItem, quantity: cartItem.quantity > 1 ? cartItem.quantity - 1 : 1 };
        }
        return cartItem;
      }));
    } else {
      // Item not in cart, add it and provide option to undo
      // setCartItems([...cartItems, item]);
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
      // Show a message or perform any other action to indicate the item has been added
    }
  };

  const renderItem = ({ item, index }) => {
    const isItemInCart = cartItems.some(cartItem => cartItem.id === item.id);
  
    return (
      <View style={[styles.itemContainer, { marginLeft: index % 2 === 1 ? 10 : 0 }]}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={{ marginLeft: 30 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
          <TouchableOpacity
              style={[
                styles.addToCartButton,
                { 
                  backgroundColor: isItemInCart ? 'gray' : '#088F8F',
                  width: 120, // Set a fixed width for the button
                  alignItems: 'center', // Center the text horizontally
                  justifyContent: 'center', // Center the text vertically
                },
              ]}
  onPress={() => handleAddToCart(item)}
>
  <Text style={styles.addToCartText}>
    {isItemInCart ? 'Added' : 'Add to Cart'}
  </Text>
</TouchableOpacity>

          </View>
        </View>
      </View>
    );
  };
  

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
<SafeAreaView>
      <TextInput
        style={styles.searchBar}
        placeholder="Search items..."
        onChangeText={text => setSearch(text)}
      />
      <FlatList
        data={filteredItems}
        renderItem={({ item, index }) => renderItem({ item, index, isItemInCart: cartItems.some(cartItem => cartItem.id === item.id) })}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
      <TouchableOpacity
        style={styles.cartContainer}
        onPress={() => toggleModal()}
      >
        <Text style={styles.cartItemCount}>{cartItems.length}</Text>
        <MaterialIcons name="shopping-cart" size={styles.cartIcon.fontSize} color={styles.cartIcon.color} />
      </TouchableOpacity>
      {/* Modal for displaying cart items */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Selected Items</Text>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id.toString()}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleModal}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
    {cartItems.length > 0 && (
        <TouchableOpacity
          style={styles.viewCartButton}
          onPress={navigateToCartScreen}
        >
          <Text style={styles.viewCartButtonText}>View Cart</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 10,
    justifyContent: 'space-between',
    marginBottom: 80,
  },
  searchBar: {
    height: 40,
    borderColor: '#088F8F',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 10,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 10,
    elevation: 2, // for android
    shadowColor: '#000', // for ios
    shadowOffset: { width: 0, height: 3 }, // for ios
    shadowOpacity: 0.25, // for ios
    shadowRadius: 3.84, // for ios
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemName: {
    fontSize: 18,
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: 'gray',
    fontWeight: 'bold'
  },
  addToCartButton: {
    backgroundColor: '#088F8F',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cartContainer: {
    position: 'absolute',
    bottom: 25, // Adjust the top position to move it down
    right: 20, // Adjust the right position to move it to the right
    // flexDirection: 'row',
    alignItems: 'flex-end', // Align items to the end to place the text on top
  },

  // Updated styles for the cart item count text
  cartItemCount: {
    marginRight: 10, // Add some left margin for spacing
    color: '#123456', // Match the color with the icon
    fontSize: 18, // Adjust the font size as needed
  },
  cartIcon: {
    color: '#123456', // Change the color to red or any other color you prefer
    fontSize: 50, // Increase the font size to make the icon bigger
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20, // Add padding to give space for cart items
  },
  
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItem: {
    padding: 10,
    marginBottom: 15, // Add margin bottom for spacing between items
    backgroundColor: '#fff', // Set a background color for better visibility
    borderRadius: 5,
    elevation: 2, // Add elevation for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#123456',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  viewCartButton: {
    // position: 'absolute',
    bottom: 30, // Position the button 10 units from the bottom
    left: '10%', //8Adjust the left position to move it horizontally
    width: '80%', // Set the width to 80% of the screen width
    backgroundColor: '#123456',
    padding: 15, // Increase padding for a larger button
    borderRadius: 7,
    alignItems: 'center',
    // marginBottom: 10
  },
   
  viewCartButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ItemScreen;