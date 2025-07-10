// screens/AboutScreen.js
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Linking, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Easing
} from 'react-native';

export default function AboutScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const titleScale = useRef(new Animated.Value(0.8)).current;
  const locationSlide = useRef(new Animated.Value(100)).current;
  const locationFade = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animateIn = () => {
      Animated.parallel([
        Animated.timing(titleScale, {
          toValue: 1,
          duration: 600,
          easing: Easing.elastic(1.2),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }, 200);

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(locationSlide, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          }),
          Animated.timing(locationFade, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
      }, 400);
    };

    animateIn();
  }, []);

  const openMap = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const url = 'https://www.google.com/maps?q=Opp.+Gaya+College,+Jail+Road,+Gaya,+Bihar';
    Linking.openURL(url);
  };

  const dialNumber = () => Linking.openURL('tel:9431002090');
  const sendEmail = () => Linking.openURL('mailto:matangirestro@gmail.com');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View
        style={[styles.titleContainer, { opacity: fadeAnim, transform: [{ scale: titleScale }] }]}
      >
        <Text style={styles.title}>🍽️ MATANGI KITCHEN</Text>
      </Animated.View>

      <Animated.View
        style={[styles.textContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <Text style={styles.text}>
          Matangi Kitchen is a cozy dine-in restaurant located opposite Gaya College, Jail Road, Gaya. Known for Indo‑Chinese fusion and classic comfort food, we serve affordable, delicious meals made with care.
        </Text>
        <Text style={styles.text}>
          Whether you're looking to enjoy a hot soup, flavorful rice, or a grilled sandwich, we've got you covered. Takeaway available too!
        </Text>
      </Animated.View>

      <Animated.View
        style={[styles.locationSection, { opacity: locationFade, transform: [{ translateY: locationSlide }] }]}
      >
        <Text style={styles.sectionTitle}>📍 Location</Text>
        <Text style={styles.locationText}>Opp. Gaya College, Jail Road, Gaya, Bihar</Text>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity style={styles.mapButton} onPress={openMap}>
            <Text style={styles.mapButtonText}>Open in Maps</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.sectionTitle}>📞 Contact</Text>
        <TouchableOpacity onPress={dialNumber}>
          <Text style={styles.contactText}>Call: 9431002090</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={sendEmail}>
          <Text style={styles.contactText}>Email: matangirestro@gmail.com</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[styles.footerContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <Text style={styles.footer}>© 2025 Matangi Kitchen | All Rights Reserved</Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 20,
    paddingTop: 60,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'serif',
    textShadowColor: '#FF69B4',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
    letterSpacing: 2,
  },
  textContainer: {
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    color: '#eee',
    lineHeight: 22,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFC300',
    marginTop: 20,
    marginBottom: 8,
  },
  locationSection: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    shadowColor: '#fff',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  locationText: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 10,
  },
  mapButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contactText: {
    fontSize: 14,
    color: '#00CED1',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  footerContainer: {
    marginTop: 40,
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
  },
});