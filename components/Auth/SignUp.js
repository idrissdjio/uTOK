import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { supabase } from '../../config/supabase';
import { Feather } from '@expo/vector-icons';


const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const signUpNewUser = async () => {
    try {
      if (!name || !email || !password || !confirmPassword) {
        Alert.alert('Missing Information', 'Please fill out all fields.');
        return;
      }
  
      if (password !== confirmPassword) {
        Alert.alert("Passwords don't match", 'Please make sure your passwords match.');
        return;
      }
  
      if (password.length < 8) {
        Alert.alert('Password too short', 'Please use a password with at least 8 characters.');
        return;
      }
  
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
        name,
      });

      console.log(error)
  
      if (error) {
        console.log(error.message)
        if (error.message.includes('Password')) {
          Alert.alert('Password should be at least 8 characters');
          // Alert.alert('Email already exists', 'Please use a different email address.');
        } else if (error.message.includes('email address')) {
          Alert.alert('Unable to validate email address: invalid format');
        } 
        else if (error.message.includes('registered')) {
          // Email confirmation required
          Alert.alert('User already registered.');
        } 
        else {
          Alert.alert('Error', 'An error occurred while signing up. Please try again later.');
        }
      } else {
        // Navigate to the login screen
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .upsert([{ email: email, name: name }]);
        console.log(newUser);
        Alert.alert('Sign Up Successful', 'Your account has been created successfully.');
        navigation.navigate('SignIn');
      }
    } catch (error) {
      console.error(error.message);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>uTOK</Text>
        <Text style={styles.headerText}>Create Account</Text>
      </View>

      <View style={styles.fieldsContainer}>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        onChangeText={(text) => setName(text)}
      />
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={signUpNewUser}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.signInText}>Already have an account? Sign In</Text>
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

export default SignUp;
