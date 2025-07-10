// App.js
import React, { createContext, useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import AboutScreen from './screens/AboutScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- GLOBAL CART CONTEXT ---
const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter(i => i.id !== id));
  const updateQuantity = (id, qty) => {
    if (qty <= 0) removeFromCart(id);
    else setCart(cart.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };
  const clearCart = () => setCart([]);
  const getCartTotal = () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const getCartCount = () => cart.reduce((sum, i) => sum + i.quantity, 0);

  const placeOrder = (details = {}) => {
    const newOrder = {
      id: Date.now(),
      items: [...cart],
      total: getCartTotal(),
      timestamp: new Date().toISOString(),
      status: 'confirmed',
      ...details
    };
    setOrders([newOrder, ...orders]);
    clearCart();
    return newOrder;
  };

  return (
    <CartContext.Provider value={{
      cart,
      orders,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      placeOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};

// --- TAB BAR ICON COMPONENT ---
const TabIcon = ({ icon, focused }) => (
  <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{icon}</Text>
);

// --- MAIN TABS ---
const MainTabs = () => {
  const { getCartCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#d32f2f',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => {
          const icons = {
            Home: '🏠',
            Menu: '📋',
            Cart: '🛒',
            Profile: '👤',
          };
          return <TabIcon icon={icons[route.name]} focused={focused} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{
          tabBarBadge: getCartCount() > 0 ? getCartCount() : null
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// --- STACK NAVIGATION ---
const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#d32f2f' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
      headerTitleAlign: 'center',
    }}
  >
    <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: '🧾 Order History' }} />
    <Stack.Screen name="About" component={AboutScreen} options={{ title: 'ℹ️ About Us' }} />
  </Stack.Navigator>
);

// --- APP ENTRY ---
export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#d32f2f" />
        <AppStack />
      </NavigationContainer>
    </CartProvider>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    height: 70,
    paddingBottom: 5,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabIconFocused: {
    transform: [{ scale: 1.2 }],
  },
});
