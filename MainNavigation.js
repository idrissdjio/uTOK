import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import SignUp from './components/Auth/SignUp';
import SignIn from './components/Auth/SignIn';
import HomeScreen from './components/screens/HomeScreen';
import CartScreen from './components/screens/CartScreen';
import AccountScreen from './components/screens/AccountScreen';
import OrderScreen from './components/screens/OrderScreen';
import CheckoutScreen from './components/screens/CheckoutScreen';
import UpdateOrderScreen from './components/screens/UpdateOrderScreen';
import ItemScreen from './components/screens/ItemScreen';
// Import other screens here

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: true }} />
      <Stack.Screen name="ItemScreen" component={ItemScreen} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#088F8F",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" color={color} size={size} />
          ),
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="Main" component={MainStack} options={{ gestureEnabled: false }} />
      <Stack.Screen name="UpdateOrder" component={UpdateOrderScreen} options={{ headerShown: true }} />
      <Stack.Screen name="SignIn" component={SignIn} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="SignUp" component={SignUp} options={{ gestureEnabled: false }}/>
    </Stack.Navigator>
  );
};

export default MainNavigation;