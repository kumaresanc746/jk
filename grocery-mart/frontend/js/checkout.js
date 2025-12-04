let cart = null;

async function loadCheckout() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    try {
        cart = await apiCall('/cart');
        if (!cart.items || cart.items.length === 0) {
            alert('Your cart is empty');
            window.location.href = 'cart.html';
            return;
        }
        renderOrderSummary();
        loadUserAddress();
    } catch (error) {
        console.error('Error loading checkout:', error);
    }
}

function renderOrderSummary() {
    const container = document.getElementById('orderSummary');
    const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    container.innerHTML = `
        <div class="cart-summary">
            <h3>Order Summary</h3>
            ${cart.items.map(item => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                    <div>
                        <strong>${item.product.name}</strong> x ${item.quantity}
                    </div>
                    <div>₹${item.product.price * item.quantity}</div>
                </div>
            `).join('')}
            <div class="summary-row summary-total">
                <span>Total</span>
                <span>₹${total}</span>
            </div>
        </div>
    `;
}

async function loadUserAddress() {
    try {
        const userData = await apiCall('/auth/me');
        if (userData.user && userData.user.address) {
            const addr = userData.user.address;
            if (addr.street) document.getElementById('street').value = addr.street;
            if (addr.city) document.getElementById('city').value = addr.city;
            if (addr.state) document.getElementById('state').value = addr.state;
            if (addr.zipCode) document.getElementById('zipCode').value = addr.zipCode;
        }
    } catch (error) {
        console.error('Error loading address:', error);
    }
}

document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const deliveryAddress = {
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value
    };
    
    const paymentMethod = document.getElementById('paymentMethod').value;
    const messageDiv = document.getElementById('message');
    
    try {
        const order = await apiCall('/order/create', {
            method: 'POST',
            body: JSON.stringify({ deliveryAddress, paymentMethod })
        });
        
        messageDiv.innerHTML = '<div class="message message-success">Order placed successfully! Redirecting...</div>';
        
        setTimeout(() => {
            window.location.href = `order-success.html?orderId=${order.order._id}`;
        }, 2000);
    } catch (error) {
        messageDiv.innerHTML = `<div class="message message-error">${error.message}</div>`;
    }
});

document.addEventListener('DOMContentLoaded', loadCheckout);

