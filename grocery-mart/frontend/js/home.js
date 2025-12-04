const categories = [
    { name: 'Fruits', icon: '🍎', category: 'Fruits' },
    { name: 'Vegetables', icon: '🥬', category: 'Vegetables' },
    { name: 'Dairy', icon: '🥛', category: 'Dairy' },
    { name: 'Snacks', icon: '🍪', category: 'Snacks' },
    { name: 'Beverages', icon: '🥤', category: 'Beverages' },
    { name: 'Household', icon: '🏠', category: 'Household' },
    { name: 'Staples', icon: '🌾', category: 'Staples' },
    { name: 'Personal Care', icon: '🧴', category: 'Personal Care' },
    { name: 'Health', icon: '💊', category: 'Health' }
];

function renderCategories() {
    const container = document.getElementById('categories');
    container.innerHTML = categories.map(cat => `
        <a href="products.html?category=${encodeURIComponent(cat.category)}" class="category-card">
            <div class="category-icon">${cat.icon}</div>
            <div>${cat.name}</div>
        </a>
    `).join('');
}

async function loadFeaturedProducts() {
    try {
        const data = await apiCall('/products?limit=8');
        const container = document.getElementById('featuredProducts');
        
        if (data.products && data.products.length > 0) {
            container.innerHTML = data.products.map(product => `
                <div class="product-card" onclick="window.location.href='product-detail.html?id=${product._id}'">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-category">${product.category}</div>
                        <div class="product-price">₹${product.price}/${product.unit}</div>
                        <div class="product-stock ${product.stock < 10 ? 'stock-low' : ''}">
                            ${product.stock < 10 ? 'Low Stock' : 'In Stock'}
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="empty-state">No products available</p>';
        }
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('featuredProducts').innerHTML = 
            '<p class="empty-state">Error loading products. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    loadFeaturedProducts();
});

