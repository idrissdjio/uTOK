import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../config/supabase';
import { useNavigation } from '@react-navigation/native';


const AccountScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleShowConfirmNewPassword = () => setShowConfirmNewPassword(!showConfirmNewPassword);

  // const navigation = useNavigation();

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      Alert.alert('Well signed out!', 'You have successfully signed out.');
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const deleteAccount = async () => {
    try {
      const { user } = await supabase.auth.getUser();
      const result = await supabase.auth.deleteUser(user.id);
      if (result.error) {
        Alert.alert('Error Deleting Account', result.error.message);
      } else {
        navigation.navigate('SignIn');
      }
    } catch (error) {
      console.error('Error deleting account:', error.message);
    }
  };

  const updatePassword = async () => {
    try {
      if (!newPassword && !confirmNewPassword) {
        Alert.alert('Missing Information', 'Please fill out all password fields.');
        return;
      }

      if (newPassword !== confirmNewPassword) {
        Alert.alert("Passwords don't match", 'Please make sure your new passwords match.');
        return;
      }

      if (newPassword.length < 8) {
        Alert.alert('Password too short', 'Please use a password with at least 8 characters.');
        return;
      }

      // Update password
      if (newPassword) {
        const { user, error } = await supabase.auth.update({
          password: newPassword,
        });

        if (error) {
          Alert.alert('Error updating password', error.message);
          return;
        }
      }

      Alert.alert('Update Successful', 'Password updated successfully.');
    } catch (error) {
      console.error('Error updating password:', error.message);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Account Settings</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        secureTextEntry={!showNewPassword}
        onChangeText={(text) => setNewPassword(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm new password"
        secureTextEntry={!showConfirmNewPassword}
        onChangeText={(text) => setConfirmNewPassword(text)}
      />

      <TouchableOpacity style={styles.button} onPress={updatePassword}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dangerButton} onPress={deleteAccount}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    color: '#088F8F',
  },
  input: {
    height: 45,
    width: '80%',
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
  dangerButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  signOutButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default AccountScreen;
