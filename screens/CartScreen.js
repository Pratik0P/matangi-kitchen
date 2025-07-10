// screens/CartScreen.js
import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Animated,
  ActivityIndicator
} from 'react-native';
import { useCart } from '../App';

export default function CartScreen({ navigation }) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    placeOrder,
    clearCart
  } = useCart();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Calculate order summary
  const orderSummary = useMemo(() => {
    const subtotal = getCartTotal();
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const taxAmount = Math.round(subtotal * 0.05); // 5% tax
    const discountAmount = Math.round(subtotal * (discount / 100));
    const total = subtotal + deliveryFee + taxAmount - discountAmount;
    
    return {
      subtotal,
      deliveryFee,
      taxAmount,
      discountAmount,
      total
    };
  }, [getCartTotal, discount]);

  const handleApplyPromo = () => {
    const validPromoCodes = {
      'SAVE10': 10,
      'FIRST20': 20,
      'STUDENT15': 15
    };
    
    if (validPromoCodes[promoCode.toUpperCase()]) {
      setDiscount(validPromoCodes[promoCode.toUpperCase()]);
      Alert.alert('Promo Applied!', `${promoCode.toUpperCase()} - ${validPromoCodes[promoCode.toUpperCase()]}% off`);
    } else {
      Alert.alert('Invalid Promo Code', 'Please enter a valid promo code');
    }
  };

  const handlePlaceOrder = async () => {
    if (!customerName || !customerPhone || !deliveryAddress) {
      Alert.alert('Missing Information', 'Please fill in all delivery details');
      return;
    }

    setIsProcessingOrder(true);
    
    // Simulate order processing
    setTimeout(() => {
      const orderData = {
        location: 'Matangi Kitchen',
        customerName,
        customerPhone,
        deliveryAddress,
        notes: orderNotes,
        paymentMethod: selectedPaymentMethod,
        orderSummary,
        promoCode: promoCode || null
      };
      
      const newOrder = placeOrder(orderData);
      setIsProcessingOrder(false);
      setShowCheckoutModal(false);
      
      Alert.alert(
        'Order Placed Successfully! 🎉',
        `Order ID: ${newOrder.id}\nTotal: ₹${orderSummary.total}\nEstimated delivery: 30-45 minutes`,
        [
          {
            text: 'Track Order',
            onPress: () => navigation.navigate('OrderHistory')
          }
        ]
      );
      
      // Reset form
      setCustomerName('');
      setCustomerPhone('');
      setDeliveryAddress('');
      setOrderNotes('');
      setPromoCode('');
      setDiscount(0);
    }, 2000);
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => clearCart()
        }
      ]
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price} each</Text>
        <Text style={styles.itemSubtotal}>Subtotal: ₹{item.price * item.quantity}</Text>
      </View>
      
      <View style={styles.itemActions}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Text style={styles.quantityText}>−</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantity}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => {
            Alert.alert(
              'Remove Item',
              `Remove ${item.name} from cart?`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', onPress: () => removeFromCart(item.id) }
              ]
            );
          }}
        >
          <Text style={styles.removeText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const PaymentMethodSelector = () => (
    <View style={styles.paymentSection}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.paymentMethods}>
        {[
          { id: 'cash', label: '💵 Cash on Delivery', desc: 'Pay when food arrives' },
          { id: 'card', label: '💳 Credit/Debit Card', desc: 'Pay online securely' },
          { id: 'upi', label: '📱 UPI', desc: 'Pay via UPI apps' }
        ].map(method => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethod,
              selectedPaymentMethod === method.id && styles.selectedPaymentMethod
            ]}
            onPress={() => setSelectedPaymentMethod(method.id)}
          >
            <Text style={styles.paymentMethodLabel}>{method.label}</Text>
            <Text style={styles.paymentMethodDesc}>{method.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const OrderSummarySection = () => (
    <View style={styles.orderSummarySection}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>₹{orderSummary.subtotal}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Delivery Fee</Text>
        <Text style={styles.summaryValue}>
          {orderSummary.deliveryFee === 0 ? 'FREE' : `₹${orderSummary.deliveryFee}`}
        </Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tax (5%)</Text>
        <Text style={styles.summaryValue}>₹{orderSummary.taxAmount}</Text>
      </View>
      {orderSummary.discountAmount > 0 && (
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, styles.discountText]}>
            Discount ({discount}%)
          </Text>
          <Text style={[styles.summaryValue, styles.discountText]}>
            -₹{orderSummary.discountAmount}
          </Text>
        </View>
      )}
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>₹{orderSummary.total}</Text>
      </View>
      {orderSummary.subtotal < 500 && (
        <Text style={styles.freeDeliveryNote}>
          Add ₹{500 - orderSummary.subtotal} more for free delivery!
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>🛒 Your Cart</Text>
        {cart.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearCart}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some delicious items to get started!</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => navigation.navigate('Menu')}
          >
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCartItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          {/* Promo Code Section */}
          <View style={styles.promoSection}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={setPromoCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity 
              style={styles.promoButton}
              onPress={handleApplyPromo}
            >
              <Text style={styles.promoButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerInfo}>
              <Text style={styles.itemCount}>
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </Text>
              <Text style={styles.total}>₹{orderSummary.total}</Text>
            </View>
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={() => setShowCheckoutModal(true)}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Checkout Modal */}
      <Modal
        visible={showCheckoutModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCheckoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Checkout</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowCheckoutModal(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Customer Details */}
              <View style={styles.customerSection}>
                <Text style={styles.sectionTitle}>Customer Details</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name *"
                  value={customerName}
                  onChangeText={setCustomerName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number *"
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={[styles.input, styles.addressInput]}
                  placeholder="Delivery Address *"
                  value={deliveryAddress}
                  onChangeText={setDeliveryAddress}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Order Notes */}
              <View style={styles.notesSection}>
                <Text style={styles.sectionTitle}>Order Notes (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  placeholder="Any special instructions..."
                  value={orderNotes}
                  onChangeText={setOrderNotes}
                  multiline
                  numberOfLines={2}
                />
              </View>

              <PaymentMethodSelector />
              <OrderSummarySection />

              <TouchableOpacity 
                style={[styles.placeOrderButton, isProcessingOrder && styles.processingButton]}
                onPress={handlePlaceOrder}
                disabled={isProcessingOrder}
              >
                {isProcessingOrder ? (
                  <View style={styles.processingContainer}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.processingText}>Processing...</Text>
                  </View>
                ) : (
                  <Text style={styles.placeOrderText}>
                    Place Order • ₹{orderSummary.total}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  clearButton: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  clearButtonText: {
    color: '#d32f2f',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 20,
  },
  cartItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 12,
    color: '#666',
  },
  itemSubtotal: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '600',
    marginTop: 4,
  },
  itemActions: {
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 5,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quantityButton: {
    width: 28,
    height: 28,
    backgroundColor: '#d32f2f',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  quantityText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 5,
  },
  removeText: {
    fontSize: 18,
  },
  promoSection: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  promoInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  promoButton: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  promoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  checkoutButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  customerSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 10,
  },
  addressInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  notesSection: {
    marginBottom: 20,
  },
  notesInput: {
    height: 50,
    textAlignVertical: 'top',
  },
  paymentSection: {
    marginBottom: 20,
  },
  paymentMethods: {
    gap: 10,
  },
  paymentMethod: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPaymentMethod: {
    borderColor: '#d32f2f',
    backgroundColor: '#fff5f5',
  },
  paymentMethodLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  paymentMethodDesc: {
    fontSize: 12,
    color: '#666',
  },
  orderSummarySection: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
  },
  discountText: {
    color: '#4caf50',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  freeDeliveryNote: {
    fontSize: 12,
    color: '#4caf50',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  placeOrderButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  processingButton: {
    backgroundColor: '#999',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  processingText: {
    color: '#fff',
    fontSize: 16,
  },
});