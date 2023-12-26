import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../config/supabase';

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const signInWithEmail = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Missing Information', 'Please fill out all fields.');
        return;
      }

      setLoading(true);

      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);

      if (error) {
        console.error(error.message);
        Alert.alert('Invalid credentials', 'Please check your email and password.');
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
        navigation.navigate('Main', { screen: 'Home', params: { email } });
      }
    } catch (error) {
      setLoading(false);
      console.error(error.message);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>uTOK</Text>
        <Text style={styles.headerText}>Sign In</Text>
      </View>

      <View style={styles.fieldsContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={signInWithEmail}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signInText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../../assets/google.png')} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../../assets/facebook.png')} style={styles.socialIcon} />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#088F8F" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#088F8F',
  },
  headerText: {
    fontSize: 24,
    marginTop: 10,
    color: '#088F8F',
  },
  fieldsContainer: {
    width: '80%',
    marginTop: 20,
  },
  input: {
    height: 45,
    width: '100%',
    borderColor: '#088F8F',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#088F8F',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
  },
  socialButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 50,
  },
  socialIcon: {
    width: 50,
    height: 50,
  },
  passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginBottom: 15,
    },
    passwordInput: {
      height: 40,
      width: '100%',
      borderColor: '#088F8F',
      borderWidth: 1,
      marginBottom: 0,
      paddingLeft: 10,
      borderRadius: 10,
    },
    eyeIcon: {
      width: '15%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    eyeImage: {
      width: 20,
      height: 20,
    },
    signInText: {
      color: '#088F8F',
      marginTop: 15,
      textAlign: 'right',
    },
});

export default SignIn;
