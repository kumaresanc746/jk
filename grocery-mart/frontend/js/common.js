// Check authentication status and update UI
function updateNavBar() {
    const user = getUser();
    const isAuth = isAuthenticated();

    if (isAuth && user) {
        document.getElementById('authNav').classList.add('hidden');
        document.getElementById('userNav').classList.remove('hidden');
        document.getElementById('cartNav').classList.remove('hidden');
        document.getElementById('logoutNav').classList.remove('hidden');
        
        if (user.role === 'admin') {
            document.getElementById('adminNav').classList.remove('hidden');
        }
    } else {
        document.getElementById('authNav').classList.remove('hidden');
        document.getElementById('userNav').classList.add('hidden');
        document.getElementById('cartNav').classList.add('hidden');
        document.getElementById('logoutNav').classList.add('hidden');
        document.getElementById('adminNav').classList.add('hidden');
    }
    
    updateCartCount();
}

async function updateCartCount() {
    if (!isAuthenticated()) {
        document.getElementById('cartCount').textContent = '0';
        return;
    }

    try {
        const cart = await apiCall('/cart');
        const count = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
        document.getElementById('cartCount').textContent = count;
    } catch (error) {
        document.getElementById('cartCount').textContent = '0';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavBar();
});

