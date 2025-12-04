let currentProduct = null;

async function loadProductDetail() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (!productId) {
            window.location.href = 'products.html';
            return;
        }
        
        const product = await apiCall(`/products/${productId}`);
        currentProduct = product;
        renderProductDetail(product);
    } catch (error) {
        console.error('Error loading product:', error);
        document.getElementById('productDetail').innerHTML = 
            '<p class="empty-state">Product not found. <a href="products.html">Back to Products</a></p>';
    }
}

function renderProductDetail(product) {
    const container = document.getElementById('productDetail');
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; background: white; padding: 2rem; border-radius: 10px; box-shadow: var(--shadow-lg);">
            <div>
                <img src="${product.image}" alt="${product.name}" 
                     style="width: 100%; border-radius: 10px;"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'500\' height=\'500\'%3E%3Crect width=\'500\' height=\'500\' fill=\'%23e0e0e0\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-family=\'Arial\' font-size=\'24\'%3EProduct%3C/text%3E%3C/svg%3E'">
            </div>
            <div>
                <h1 style="font-size: 2rem; margin-bottom: 1rem;">${product.name}</h1>
                <div style="color: #7f8c8d; margin-bottom: 1rem;">${product.category}</div>
                <div style="font-size: 2rem; font-weight: bold; color: var(--primary-color); margin-bottom: 1rem;">
                    ₹${product.price}/${product.unit}
                </div>
                <div style="margin-bottom: 2rem;">
                    <p style="line-height: 1.8;">${product.description}</p>
                </div>
                <div style="margin-bottom: 2rem;">
                    <strong>Stock:</strong> 
                    <span class="${product.stock < 10 ? 'stock-low' : ''}" style="font-weight: bold;">
                        ${product.stock} ${product.unit}${product.stock !== 1 ? 's' : ''}
                    </span>
                </div>
                ${product.stock > 0 ? `
                    <div style="margin-bottom: 1rem;">
                        <label>Quantity:</label>
                        <input type="number" id="quantity" value="1" min="1" max="${product.stock}" 
                               style="width: 100px; padding: 0.5rem; margin-left: 1rem;">
                    </div>
                    <button onclick="addToCart()" class="btn btn-primary" style="width: 100%;">
                        Add to Cart
                    </button>
                ` : `
                    <button class="btn" disabled style="width: 100%; background: #ccc;">
                        Out of Stock
                    </button>
                `}
            </div>
        </div>
    `;
}

async function addToCart() {
    if (!isAuthenticated()) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }
    
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    if (quantity > currentProduct.stock) {
        alert(`Only ${currentProduct.stock} items available`);
        return;
    }
    
    try {
        await apiCall('/cart/add', {
            method: 'POST',
            body: JSON.stringify({
                productId: currentProduct._id,
                quantity: quantity
            })
        });
        
        alert('Item added to cart!');
        updateCartCount();
    } catch (error) {
        alert('Error adding to cart: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', loadProductDetail);

