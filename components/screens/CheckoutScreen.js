import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import * as Location from 'expo-location';
import { supabase } from '../../config/supabase';
import { useNavigation } from '@react-navigation/native';
import FlashMessage, { showMessage } from 'react-native-flash-message';



const CheckoutScreen = ({ route }) => {
  const cartItems = route?.params?.cartItems || [];
  const totalPrice = route?.params?.totalPrice || 0;
  const [selectedArea, setSelectedArea] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [comments, setComments] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      // Explicitly ask for permission, even if it was granted before
      const { status } = await Location.requestForegroundPermissionsAsync({
        shouldAsk: true,
      });
  
      if (status === 'granted') {
        // Show loading indicator when the user grants location permission
        setLoadingLocation(true);
  
        const location = await Location.getCurrentPositionAsync({});
        const { coords } = location;
  
        // Use reverse geocoding to get the address based on coordinates
        const address = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        // console.log(address)
  
        const newLocation = `${address[0].name}, ${address[0].district}, ${address[0].city}, ${address[0].country}`;
  
        // Set the location directly without confirmation
        setCurrentLocation(newLocation);

  
        // Stop loading after setting the location
        setLoadingLocation(false);
      } else {
        Alert.alert('Permission Denied', 'Location permission is required.');
        setLoadingLocation(false);
      }
    } catch (err) {
      console.warn(err);
      setLoadingLocation(false);
    }
  };
  
  
  
  const getLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { coords } = location;
  
      // Use reverse geocoding to get the address based on coordinates
      const address = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
  
      setCurrentLocation(`${address[0].name}, ${address[0].city}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to get location. Please try again.');
      console.warn(error);
    }
  };
  

  const handlePlaceOrder = async () => {
    // Validate that the required information is provided
    if (!selectedArea || !currentLocation || !selectedPaymentMethod || !phoneNumber || !userName) {
      Alert.alert('Error', 'Please provide valid information for the order.');
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Fetch user information from Supabase
      const session = supabase.auth.getSession();
      console.log('Session:', session);
      if (session) {
        const { data: { user } } = await supabase.auth.getUser()
        email = user.email
  
          // Format the items as per your requirements (name: quantity)
          const formattedItems = cartItems.reduce((acc, item) => {
            const itemName = Object.keys(item)[0]; // Extract the item name (e.g., "Shoes")
            const quantity = item[itemName]; // Extract the quantity associated with the item
            acc[itemName] = quantity;
            return acc;
          }, {});
  
          // Use the selectedArea, currentLocation, and formattedItems to place the order
          const orderDetails = {
            email: email, // Add user email to orderDetails
            selectedArea,
            currentLocation,
            paymentMethod: selectedPaymentMethod,
            phoneNumber,
            userName,
            comments,
            items: formattedItems,
            totalPrice,
          };
  
          // console.log(orderDetails);
  
          // Store the order in the Supabase database
          const { data, error } = await supabase.from('Orders').upsert([orderDetails]);
  
          if (error) {
            throw error;
          }
  
          setIsSuccessModalVisible(true);
  
          showMessage({
            message: 'Order Placed Successfully',
            type: 'success',
            duration: 2000,
          });
  
          // Clear the cart
          // Navigate to the OrderScreen with the necessary information
          // navigation.navigate('Order', { orderDetails });
          setTimeout(() => {
            // Navigate to the OrderScreen with the necessary information
            navigation.navigate('Order', { orderDetails });
          }, 2000);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place the order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Select Area</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
          {['Area A', 'Area B', 'Area C', 'Area D', 'Other'].map((area, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                selectedArea === area && styles.selectedButton,
                { width: Dimensions.get('window').width / 5 },
              ]}
              onPress={() => setSelectedArea(area)}
            >
              <Text style={[styles.buttonText, selectedArea === area && styles.selectedButtonText]}>{area}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Current Location:</Text>
        <View style={styles.locationContainer}>
          <TextInput
            style={styles.locationInput}
            placeholder="Enter or Click to Get Location"
            value={currentLocation}
            onChangeText={(text) => setCurrentLocation(text)}
          />
          <TouchableOpacity style={styles.locationButton} onPress={requestLocationPermission}>
            <Text style={styles.locationButtonText}>Get Location</Text>
          </TouchableOpacity>
          {loadingLocation && <ActivityIndicator style={styles.loadingIndicator} />}
        </View>

        <Text style={styles.label}>Phone Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />

        <Text style={styles.label}>User Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter User Name"
          value={userName}
          onChangeText={(text) => setUserName(text)}
        />

        <Text style={styles.label}>Payment Method:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
          {['MoMo', 'OM', 'Cash'].map((method, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                selectedPaymentMethod === method && styles.selectedButton,
                { width: Dimensions.get('window').width / 3 },
              ]}
              onPress={() => setSelectedPaymentMethod(method)}
            >
              <Text style={[styles.buttonText, selectedPaymentMethod === method && styles.selectedButtonText]}>
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Enter Comments (Optional):</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your comments here..."
          multiline
          numberOfLines={4}
          value={comments}
          onChangeText={(text) => setComments(text)}
        />

        <Text style={styles.label}>Total Price:</Text>
        <Text style={styles.totalPrice}>CFA {totalPrice.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
        <Text style={styles.placeOrderButtonText}>Place Order</Text>
      </TouchableOpacity>
      <FlashMessage position="top" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  scrollContainer: {
    marginBottom: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 1,
    borderColor: '#088F8F',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#088F8F',
  },
  buttonText: {
    color: '#088F8F',
  },
  selectedButtonText: {
    color: '#fff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  locationButton: {
    backgroundColor: '#088F8F',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 10,
  },
  locationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  placeOrderButton: {
    backgroundColor: '#088F8F',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CheckoutScreen;
