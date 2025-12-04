async function loadProfile() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const userData = await apiCall('/auth/me');
        const user = userData.user;
        
        document.getElementById('name').value = user.name || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
        
        if (user.address) {
            document.getElementById('street').value = user.address.street || '';
            document.getElementById('city').value = user.address.city || '';
            document.getElementById('state').value = user.address.state || '';
            document.getElementById('zipCode').value = user.address.zipCode || '';
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }

    loadOrderHistory();
}

async function loadOrderHistory() {
    try {
        const data = await apiCall('/order/history');
        const container = document.getElementById('orderHistory');
        
        if (data.orders && data.orders.length > 0) {
            container.innerHTML = data.orders.map(order => {
                const orderDate = new Date(order.orderDate || order.createdAt).toLocaleDateString();
                const statusColors = {
                    'Pending': '#fdcb6e',
                    'Confirmed': '#0984e3',
                    'Preparing': '#6c5ce7',
                    'Out for Delivery': '#a29bfe',
                    'Delivered': '#00b894',
                    'Cancelled': '#d63031'
                };
                
                return `
                    <div style="background: white; padding: 1.5rem; border-radius: 10px; margin-bottom: 1rem; box-shadow: var(--shadow);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                            <div>
                                <strong>Order #${order._id.slice(-8)}</strong>
                                <div style="color: #7f8c8d; font-size: 0.9rem;">${orderDate}</div>
                            </div>
                            <div style="background: ${statusColors[order.status] || '#ddd'}; color: white; padding: 0.5rem 1rem; border-radius: 5px; font-weight: bold;">
                                ${order.status}
                            </div>
                        </div>
                        ${order.items.map(item => `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>${item.name || item.product?.name} x ${item.quantity}</span>
                                <span>₹${item.price * item.quantity}</span>
                            </div>
                        `).join('')}
                        <div style="border-top: 2px solid #eee; margin-top: 1rem; padding-top: 1rem; display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem;">
                            <span>Total</span>
                            <span>₹${order.totalAmount}</span>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            container.innerHTML = '<p class="empty-state">No orders yet. <a href="products.html">Start Shopping</a></p>';
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('orderHistory').innerHTML = 
            '<p class="empty-state">Error loading orders. Please try again.</p>';
    }
}

document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    // Profile update functionality would go here
    // For now, we'll just show a message
    document.getElementById('profileMessage').innerHTML = 
        '<div class="message message-success">Profile update feature coming soon!</div>';
});

document.addEventListener('DOMContentLoaded', loadProfile);

