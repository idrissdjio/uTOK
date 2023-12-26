import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../../config/supabase';
import { MaterialIcons } from '@expo/vector-icons';


const HomeScreen = ({ navigation }) => {
  const services = [
    { name: 'Laundry', icon: 'local-laundry-service', available: true },
    { name: 'Drying', icon: 'dry-cleaning', available: false },
    { name: 'Ironing', icon: 'whatshot', available: false },
    { name: 'Folding', icon: 'layers', available: false },
  ];
  
  const [username, setUsername] = useState(''); // Use setUsername instead of username

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const email = user.email;
        const { data, error } = await supabase
          .from('users')
          .select('name')
          .eq('email', email);
    
        if (error) {
          throw error;
        }
    
        setUsername(data[0]?.name || 'Unknown');
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    

    fetchUserName(); // Call the fetchUserName function
  }, []);

  const handleServiceClick = (service) => {
    if (service.available) {
      // Navigate to the ItemScreen for the selected service
      navigation.navigate('ItemScreen', { service });
    } else {
      // Display a message that the service is not yet available
      alert('Services are not yet available for ' + service.name);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Block */}
      {/* Top Block */}
<View style={styles.topBlock}>
  {username ? (
    <Text style={styles.username}>{username}</Text>
  ) : (
    <Text style={styles.username}>Loading...</Text>
  )}
  <Text style={styles.greeting}>Good morning,</Text>
  <Text style={{}}>We are open from Mon-Fri 8am - 5pm,</Text>
</View>


      {/* Carousel */}
      <ScrollView horizontal style={styles.carousel} showsHorizontalScrollIndicator={false}>
        <Image source={require('../../assets/carousel3.jpeg')} style={styles.carouselImage} />
        <Image source={require('../../assets/carousel1.jpeg')} style={styles.carouselImage} />
        <Image source={require('../../assets/carousel2.jpeg')} style={styles.carouselImage} />
        <Image source={require('../../assets/carousel4.jpeg')} style={styles.carouselImage} />

        {/* Add more images as needed */}
      </ScrollView>

      {/* Services */}
          <View style={styles.servicesContainer}>
      {services.map((service, index) => (
        <TouchableOpacity
          key={index}
          style={styles.serviceBlock}
          onPress={() => handleServiceClick(service)}
        >
          {/* Replace the Image component with MaterialIcons */}
          <MaterialIcons name={service.icon} size={50} color="#088F8F" style={styles.serviceIcon} />
          <Text style={styles.serviceName}>{service.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBlock: {
    backgroundColor: '#088F8F',
    padding: 30,
    marginBottom: 10,
    borderRadius: 20,
    paddingLeft: 10,
    paddingTop: 80,
    // paddingBottom: 10,
  },
  username: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  greeting: {
    color: '#fff',
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 5,
    fontStyle: 'italic',
  },
  carousel: {
    height: '20%', // Reduced height for the carousel
  },
  carouselImage: {
    width: 300,
    height: '100%',
    marginRight: 10,
    resizeMode: 'cover',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  serviceBlock: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
    // marginTop: 10
  },
  serviceIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
