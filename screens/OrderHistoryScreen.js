// screens/OrderHistoryScreen.js
import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  Alert,
  RefreshControl
} from 'react-native';
import { useCart } from '../App';

export default function OrderHistoryScreen() {
  const { orders, reorderItems, clearOrderHistory } = useCart();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'amount'

  // Sort orders based on selected criteria
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'amount':
          return b.total - a.total;
        case 'newest':
        default:
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });
  }, [orders, sortBy]);

  // Calculate order statistics
  const orderStats = useMemo(() => {
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;
    const totalItems = orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    
    return {
      totalOrders: orders.length,
      totalSpent,
      avgOrderValue,
      totalItems
    };
  }, [orders]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleReorder = (order) => {
    Alert.alert(
      'Reorder Items',
      `Add all items from Order #${order.id} to your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add to Cart', 
          onPress: () => {
            reorderItems(order.items);
            Alert.alert('Success', 'Items added to cart!');
          }
        }
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Order History',
      'Are you sure you want to clear all order history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            clearOrderHistory();
            Alert.alert('Success', 'Order history cleared!');
          }
        }
      ]
    );
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getOrderStatus = (timestamp) => {
    const orderDate = new Date(timestamp);
    const now = new Date();
    const diffHours = (now - orderDate) / (1000 * 60 * 60);
    
    if (diffHours < 1) return { status: 'Preparing', color: '#ff9800' };
    if (diffHours < 2) return { status: 'Ready', color: '#4caf50' };
    return { status: 'Delivered', color: '#2196f3' };
  };

  const renderOrderItem = ({ item }) => {
    const orderStatus = getOrderStatus(item.timestamp);
    
    return (
      <TouchableOpacity 
        style={styles.orderCard}
        onPress={() => openOrderDetails(item)}
        activeOpacity={0.8}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Order #{item.id}</Text>
            <Text style={styles.orderTime}>{formatDate(item.timestamp)}</Text>
          </View>
          <View style={styles.orderStatus}>
            <View style={[styles.statusDot, { backgroundColor: orderStatus.color }]} />
            <Text style={[styles.statusText, { color: orderStatus.color }]}>
              {orderStatus.status}
            </Text>
          </View>
        </View>
        
        <View style={styles.orderSummary}>
          <Text style={styles.itemCount}>
            {item.items.length} item{item.items.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.total}>₹{item.total}</Text>
        </View>
        
        <View style={styles.orderActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleReorder(item)}
          >
            <Text style={styles.actionText}>Reorder</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.detailsButton]}
            onPress={() => openOrderDetails(item)}
          >
            <Text style={[styles.actionText, styles.detailsText]}>Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSortButtons = () => (
    <View style={styles.sortContainer}>
      <Text style={styles.sortLabel}>Sort by:</Text>
      <View style={styles.sortButtons}>
        {[
          { key: 'newest', label: 'Latest' },
          { key: 'oldest', label: 'Oldest' },
          { key: 'amount', label: 'Amount' }
        ].map(sort => (
          <TouchableOpacity
            key={sort.key}
            style={[
              styles.sortButton,
              sortBy === sort.key && styles.activeSortButton
            ]}
            onPress={() => setSortBy(sort.key)}
          >
            <Text style={[
              styles.sortButtonText,
              sortBy === sort.key && styles.activeSortButtonText
            ]}>
              {sort.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{orderStats.totalOrders}</Text>
        <Text style={styles.statLabel}>Orders</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>₹{orderStats.totalSpent}</Text>
        <Text style={styles.statLabel}>Total Spent</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>₹{Math.round(orderStats.avgOrderValue)}</Text>
        <Text style={styles.statLabel}>Avg Order</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{orderStats.totalItems}</Text>
        <Text style={styles.statLabel}>Items</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>🧾 Order History</Text>
        {orders.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearHistory}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptySubtitle}>
            Your order history will appear here once you place your first order.
          </Text>
        </View>
      ) : (
        <>
          {renderStats()}
          {renderSortButtons()}
          <FlatList
            data={sortedOrders}
            keyExtractor={(order) => order.id.toString()}
            renderItem={renderOrderItem}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#d32f2f']}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      {/* Order Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedOrder && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Order Details</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalOrderInfo}>
                  <Text style={styles.modalOrderId}>Order #{selectedOrder.id}</Text>
                  <Text style={styles.modalOrderTime}>
                    {new Date(selectedOrder.timestamp).toLocaleString()}
                  </Text>
                  
                  <View style={styles.modalStatusContainer}>
                    <View style={[
                      styles.statusDot, 
                      { backgroundColor: getOrderStatus(selectedOrder.timestamp).color }
                    ]} />
                    <Text style={[
                      styles.statusText, 
                      { color: getOrderStatus(selectedOrder.timestamp).color }
                    ]}>
                      {getOrderStatus(selectedOrder.timestamp).status}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalItemsContainer}>
                  <Text style={styles.modalItemsTitle}>Items Ordered:</Text>
                  {selectedOrder.items.map((food, index) => (
                    <View key={index} style={styles.modalFoodItem}>
                      <View style={styles.modalFoodInfo}>
                        <Text style={styles.modalFoodName}>{food.name}</Text>
                        <Text style={styles.modalFoodQuantity}>Qty: {food.quantity}</Text>
                      </View>
                      <Text style={styles.modalFoodPrice}>
                        ₹{food.price * food.quantity}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.modalTotal}>
                  <Text style={styles.modalTotalText}>Total: ₹{selectedOrder.total}</Text>
                </View>

                <TouchableOpacity 
                  style={styles.reorderButton}
                  onPress={() => {
                    setModalVisible(false);
                    handleReorder(selectedOrder);
                  }}
                >
                  <Text style={styles.reorderButtonText}>Reorder These Items</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
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
    fontSize: 24,
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
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  sortButtons: {
    flexDirection: 'row',
    flex: 1,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  activeSortButton: {
    backgroundColor: '#d32f2f',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
  },
  activeSortButtonText: {
    color: '#fff',
  },
  list: {
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderTime: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderSummary: {
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 0.45,
  },
  detailsButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  detailsText: {
    color: '#d32f2f',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
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
  modalOrderInfo: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalOrderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modalOrderTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  modalStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalItemsContainer: {
    marginBottom: 20,
  },
  modalItemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalFoodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalFoodInfo: {
    flex: 1,
  },
  modalFoodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  modalFoodQuantity: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  modalFoodPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  modalTotal: {
    borderTopWidth: 2,
    borderTopColor: '#d32f2f',
    paddingTop: 15,
    marginBottom: 20,
  },
  modalTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'right',
  },
  reorderButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  reorderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});