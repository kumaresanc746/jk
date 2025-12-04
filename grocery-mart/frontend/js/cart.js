let cart = null;

async function loadCart() {
    if (!isAuthenticated()) {
        document.getElementById('cartItems').innerHTML = 
            '<p class="empty-state">Please <a href="login.html">login</a> to view your cart</p>';
        return;
    }

    try {
        cart = await apiCall('/cart');
        renderCart();
    } catch (error) {
        console.error('Error loading cart:', error);
        document.getElementById('cartItems').innerHTML = 
            '<p class="empty-state">Error loading cart. Please try again.</p>';
    }
}

function renderCart() {
    const container = document.getElementById('cartItems');
    
    if (!cart.items || cart.items.length === 0) {
        container.innerHTML = '<p class="empty-state">Your cart is empty. <a href="products.html">Start Shopping</a></p>';
        document.getElementById('cartSummary').innerHTML = '';
        return;
    }

    container.innerHTML = cart.items.map(item => {
        const product = item.product;
        const itemTotal = product.price * item.quantity;
        
        return `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}" class="cart-item-image"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%23e0e0e0\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-family=\'Arial\' font-size=\'12\'%3EProduct%3C/text%3E%3C/svg%3E'">
                <div class="cart-item-details" style="flex: 1;">
                    <h3>${product.name}</h3>
                    <p>${product.category}</p>
                    <p>₹${product.price}/${product.unit}</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${product._id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${product._id}', ${item.quantity + 1})">+</button>
                </div>
                <div style="font-size: 1.2rem; font-weight: bold; color: var(--primary-color);">
                    ₹${itemTotal}
                </div>
                <button class="btn btn-danger" onclick="removeItem('${product._id}')">Remove</button>
            </div>
        `;
    }).join('');

    const total = cart.items.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
    }, 0);

    document.getElementById('cartSummary').innerHTML = `
        <div class="cart-summary">
            <div class="summary-row">
                <span>Subtotal</span>
                <span>₹${total}</span>
            </div>
            <div class="summary-row">
                <span>Delivery Charges</span>
                <span>Free</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total</span>
                <span>₹${total}</span>
            </div>
            <a href="checkout.html" class="btn btn-primary btn-block mt-2">Proceed to Checkout</a>
        </div>
    `;
}

async function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeItem(productId);
        return;
    }

    try {
        await apiCall('/cart/update', {
            method: 'PUT',
            body: JSON.stringify({ productId, quantity: newQuantity })
        });
        await loadCart();
        updateCartCount();
    } catch (error) {
        alert('Error updating quantity: ' + error.message);
    }
}

async function removeItem(productId) {
    if (!confirm('Remove this item from cart?')) return;

    try {
        await apiCall('/cart/remove', {
            method: 'POST',
            body: JSON.stringify({ productId })
        });
        await loadCart();
        updateCartCount();
    } catch (error) {
        alert('Error removing item: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    loadCart();
});

