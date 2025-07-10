import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Search, Star } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../App';

const UnifiedMenuApp = () => {
  const [section, setSection] = useState(null); // null means no section selected
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const navigation = useNavigation();
  const { addToCart } = useCart();

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    setIsOpen(hour >= 10 && hour < 22);
  }, []);

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'chinese', name: 'Veg Chinese', icon: '🥢' },
    { id: 'beverages', name: 'Beverages', icon: '☕' },
    { id: 'coolers', name: 'Coolers', icon: '❄️' },
    { id: 'shakes', name: 'Shakes', icon: '🥤' },
    { id: 'sandwich', name: 'Grilled Sandwich', icon: '🥪' },
    { id: 'rolls', name: 'Rolls', icon: '🌯' },
    { id: 'momos', name: 'Momos', icon: '🥟' },
    { id: 'pasta', name: 'Pasta', icon: '🍝' },
    { id: 'soup', name: 'Soup', icon: '🍲' },
    { id: 'thukpa', name: 'Thukpa', icon: '🍜' },
    { id: 'noodles', name: 'Noodles', icon: '🍜' },
    { id: 'rice', name: 'Fried Rice & Biryani', icon: '🍚' },
    { id: 'indo', name: 'Indo-Chinese', icon: '🇮🇳' },
  ];

  const menuItems = [
    { id: 1, name: 'Veg Manchurian', price: 139, category: 'chinese', description: 'Crispy vegetable balls in tangy sauce', popular: true, veg: true },
    { id: 28, name: 'Oreo Shake', price: 179, priceL: 279, category: 'shakes', description: 'Creamy Oreo milkshake', popular: true, veg: true },
    { id: 39, name: 'Chicken Cheese Sandwich', price: 189, category: 'sandwich', description: 'Grilled chicken with cheese', popular: true, veg: false },
    { id: 87, name: 'Chicken Biryani', price: 245, category: 'rice', description: 'Aromatic basmati rice with chicken', popular: true, veg: false },
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSection =
        section === null || (section === 'veg' && item.veg) || (section === 'nonveg' && !item.veg);
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSection && matchesCategory && matchesSearch;
    });
  }, [section, selectedCategory, searchTerm]);

  const handleAddToCart = (item) => {
    addToCart(item);
    navigation.navigate('Cart');
  };

  const renderPriceText = (item) => {
    if (item.priceL) return `₹${item.price} / ₹${item.priceL}`;
    return `₹${item.price}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Red Header */}
        <View style={{ backgroundColor: '#d32f2f', paddingHorizontal: 32, paddingVertical: 60, alignItems: 'center' }}>
          <Text style={{
            fontSize: 36,
            fontWeight: '700',
            color: '#fff',
            marginBottom: 12,
            textAlign: 'center',
            textShadowColor: '#000',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 6,
            fontFamily: 'serif'
          }}>
            Matangi Kitchen
          </Text>
          <Text style={{ fontSize: 16, color: '#fff', opacity: 0.9, marginBottom: 8 }}>
            Authentic Chinese & Indo-Chinese Cuisine
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, marginRight: 8, backgroundColor: isOpen ? '#00D084' : '#FF6B6B' }} />
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>
              {isOpen ? 'Open Now' : 'Closed'} • 4.3 ⭐
            </Text>
          </View>
        </View>

        {/* Veg / Non-Veg Section Selector */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 12 }}>
          <TouchableOpacity
            onPress={() => setSection('veg')}
            style={{
              backgroundColor: section === 'veg' ? '#d32f2f' : '#f0f0f0',
              paddingVertical: 8,
              paddingHorizontal: 20,
              borderRadius: 20,
              marginHorizontal: 8,
            }}
          >
            <Text style={{ color: section === 'veg' ? '#fff' : '#333', fontWeight: 'bold' }}>🟢 Veg</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSection('nonveg')}
            style={{
              backgroundColor: section === 'nonveg' ? '#d32f2f' : '#f0f0f0',
              paddingVertical: 8,
              paddingHorizontal: 20,
              borderRadius: 20,
              marginHorizontal: 8,
            }}
          >
            <Text style={{ color: section === 'nonveg' ? '#fff' : '#333', fontWeight: 'bold' }}>🔴 Non-Veg</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 }}>
          <Search size={20} color="#888" style={{ marginRight: 8 }} />
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
            placeholder="Search menu items..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {/* Category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16, marginBottom: 16 }}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 20,
                marginRight: 8,
                backgroundColor: selectedCategory === category.id ? '#d32f2f' : '#f0f0f0',
              }}
            >
              <Text style={{ color: selectedCategory === category.id ? '#fff' : '#333' }}>
                {category.icon} {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Menu Items */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
          {filteredItems.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
              No items found.
            </Text>
          ) : (
            filteredItems.map(item => (
              <View
                key={item.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  shadowColor: '#000',
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: '#eee',
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                    <Text style={{ fontSize: 12, color: item.veg ? 'green' : 'red' }}>
                      {item.veg ? '🟢 Veg' : '🔴 Non-Veg'}
                    </Text>
                    {item.popular && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Star size={14} color="orange" fill="orange" />
                        <Text style={{ color: 'orange', marginLeft: 4 }}>Popular</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ color: '#d32f2f', fontSize: 16, fontWeight: 'bold' }}>
                    {renderPriceText(item)}
                  </Text>
                </View>
                <Text style={{ color: '#555', fontSize: 12, marginBottom: 8 }}>
                  {item.description}
                </Text>
                <TouchableOpacity
                  onPress={() => handleAddToCart(item)}
                  style={{
                    backgroundColor: '#d32f2f',
                    paddingVertical: 10,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Add to Cart</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UnifiedMenuApp;
