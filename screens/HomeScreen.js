import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
  Share,
  Alert,
} from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    setIsOpen(hours >= 10 && hours < 22);
  }, []);

  const handleCall = () => Linking.openURL('tel:7070895098');
  const handleWhatsApp = () => Linking.openURL('https://wa.me/917070895098');
  const handleShare = async () => {
    try {
      await Share.share({
        message:
          'Check out Matangi Kitchen! 🍽️ Located opposite Gaya College, Jail Road, Gaya. Delicious food & fast service. 📞 7070895098',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSendBooking = () => {
    if (!name || !phone || !guests || !time) {
      Alert.alert('Please fill all fields');
      return;
    }

    const message = `🪑 Dine-In Booking Request:
Name: ${name}
Phone: ${phone}
Guests: ${guests}
Time: ${time}

Special Request: Hanging Seat 🎡

Matangi Kitchen 🍽️`;

    const url = `https://wa.me/917070895098?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>🍽️ Matangi Kitchen</Text>
          <Text style={styles.heroSubtitle}>Authentic flavors of Bihar</Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isOpen ? '#00D084' : '#FF6B6B' },
              ]}
            />
            <Text style={styles.statusText}>
              {isOpen ? 'Open Now' : 'Closed'} • 4.3 ⭐
            </Text>
          </View>
        </View>

        {/* Dine-In Toggle */}
        <View style={styles.bookingSection}>
          <TouchableOpacity
            style={styles.bookingButton}
            onPress={() => setShowForm(!showForm)}
          >
            <Text style={styles.bookingButtonText}>
              {showForm ? '🔽 Hide Dine-In Form' : '🍽️ Dine-In Booking'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dine-In Form */}
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.specialNote}>
              ✨ We have a special hanging seat for your perfect dine-in experience!
            </Text>
            <Text style={styles.formTitle}>Reserve a Rooftop Table 🌇</Text>
            <TextInput
              placeholder="Your Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
            />
            <TextInput
              placeholder="Number of Guests"
              value={guests}
              onChangeText={setGuests}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Preferred Time (e.g., 7:30 PM)"
              value={time}
              onChangeText={setTime}
              style={styles.input}
            />
            <TouchableOpacity onPress={handleSendBooking} style={styles.submitButton}>
              <Text style={styles.submitText}>📲 Book Now via WhatsApp</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Quick Information</Text>
          <Text style={styles.infoLine}>
            <Text style={styles.infoLabel}>Cuisines:</Text> Chinese, Multicuisine, North Indian
          </Text>
          <Text style={styles.infoLine}>
            <Text style={styles.infoLabel}>Type:</Text> Coffee Shops
          </Text>
          <Text style={styles.infoLine}>
            <Text style={styles.infoLabel}>Year of Establishment:</Text> 2017
          </Text>
          <Text style={styles.infoLine}>
            <Text style={styles.infoLabel}>Highlights:</Text> Rooftop Seating
          </Text>
          <Text style={styles.infoLine}>
            <Text style={styles.infoLabel}>Serves:</Text> Coffee, Tandoori Dishes
          </Text>
          <Text style={styles.infoLine}>
            <Text style={styles.infoLabel}>Seating Options:</Text> Rooftop Seating
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Text style={styles.actionIcon}>📞</Text>
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleWhatsApp}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  hero: {
    backgroundColor: '#d32f2f',
    paddingTop: 64,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroTitle: { fontSize: 32, fontWeight: '700', color: '#fff' },
  heroSubtitle: { color: '#fff', fontSize: 16, marginVertical: 8 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { color: '#fff', fontSize: 14 },

  bookingSection: { paddingHorizontal: 24, marginTop: 24 },
  bookingButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  bookingButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  formCard: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    margin: 24,
    borderRadius: 12,
    elevation: 2,
  },
  specialNote: {
    backgroundColor: '#fff3cd',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ffeeba',
    borderWidth: 1,
    color: '#856404',
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#d32f2f',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#25D366',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  infoCard: {
    backgroundColor: '#fff',
    margin: 24,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#d32f2f',
    marginBottom: 10,
  },
  infoLine: { marginBottom: 6 },
  infoLabel: { fontWeight: '600', color: '#333' },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#d32f2f',
    paddingVertical: 24,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  actionButton: { alignItems: 'center' },
  actionIcon: { fontSize: 28, marginBottom: 8, color: '#fff' },
  actionText: { fontSize: 12, color: '#fff', fontWeight: '500' },
});

export default HomeScreen;
