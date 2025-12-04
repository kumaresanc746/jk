let allProducts = [];
let currentCategory = null;

async function loadProducts() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const search = urlParams.get('search');
        
        currentCategory = category;
        
        let url = '/products?';
        if (category) url += `category=${category}&`;
        if (search) url += `search=${search}&`;
        
        const data = await apiCall(url);
        allProducts = data.products || [];
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsGrid').innerHTML = 
            '<p class="empty-state">Error loading products. Please try again later.</p>';
    }
}

function renderProducts() {
    const container = document.getElementById('productsGrid');
    
    if (allProducts.length === 0) {
        container.innerHTML = '<p class="empty-state">No products found</p>';
        return;
    }
    
    container.innerHTML = allProducts.map(product => `
        <div class="product-card" onclick="window.location.href='product-detail.html?id=${product._id}'">
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='https://via.placeholder.com/300x300?text=Product'">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">₹${product.price}/${product.unit}</div>
                <div class="product-stock ${product.stock < 10 ? 'stock-low' : ''}">
                    ${product.stock < 10 ? `Only ${product.stock} left` : 'In Stock'}
                </div>
            </div>
        </div>
    `).join('');
}

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value;
    if (searchTerm.length > 2) {
        const url = new URL(window.location);
        url.searchParams.set('search', searchTerm);
        window.location.href = url.toString();
    } else if (searchTerm.length === 0) {
        const url = new URL(window.location);
        url.searchParams.delete('search');
        window.location.href = url.toString();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    if (search) {
        document.getElementById('searchInput').value = search;
    }
    loadProducts();
});

