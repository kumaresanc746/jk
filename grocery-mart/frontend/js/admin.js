let allProducts = [];
let allOrders = [];

async function checkAdminAccess() {
    if (!isAuthenticated()) {
        window.location.href = 'admin-login.html';
        return false;
    }

    const user = getUser();
    if (user.role !== 'admin') {
        alert('Access denied. Admin only.');
        window.location.href = 'index.html';
        return false;
    }

    return true;
}

async function loadDashboard() {
    if (!await checkAdminAccess()) return;

    try {
        const stats = await apiCall('/admin/dashboard');
        renderDashboardStats(stats.stats);
        loadProducts();
        loadOrders();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function renderDashboardStats(stats) {
    const container = document.getElementById('dashboardStats');
    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${stats.totalProducts}</div>
            <div class="stat-label">Total Products</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.lowStockCount}</div>
            <div class="stat-label">Low Stock</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.totalCustomers}</div>
            <div class="stat-label">Total Customers</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.pendingOrders}</div>
            <div class="stat-label">Pending Orders</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.deliveriesToday}</div>
            <div class="stat-label">Deliveries Today</div>
        </div>
    `;
}

async function loadProducts() {
    try {
        const data = await apiCall('/admin/products');
        allProducts = data.products || [];
        renderProductsTable();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function renderProductsTable() {
    const tbody = document.getElementById('productsTable');
    
    if (allProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No products found</td></tr>';
        return;
    }

    tbody.innerHTML = allProducts.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" class="table-image" 
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\'%3E%3Crect width=\'60\' height=\'60\' fill=\'%23e0e0e0\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-family=\'Arial\' font-size=\'10\'%3EProduct%3C/text%3E%3C/svg%3E'"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price}</td>
            <td class="${product.stock < 10 ? 'stock-low' : ''}">${product.stock}</td>
            <td>
                <button onclick="editProduct('${product._id}')" class="btn btn-primary" style="padding: 0.3rem 0.8rem; margin-right: 0.5rem;">Edit</button>
                <button onclick="deleteProduct('${product._id}')" class="btn btn-danger" style="padding: 0.3rem 0.8rem;">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function loadOrders() {
    try {
        const data = await apiCall('/admin/orders');
        allOrders = data.orders || [];
        renderOrders();
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function renderOrders() {
    const container = document.getElementById('ordersList');
    
    if (allOrders.length === 0) {
        container.innerHTML = '<p class="empty-state">No orders found</p>';
        return;
    }

    container.innerHTML = allOrders.map(order => {
        const orderDate = new Date(order.orderDate || order.createdAt).toLocaleDateString();
        const statusOptions = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
        
        return `
            <div style="background: white; padding: 1.5rem; border-radius: 10px; margin-bottom: 1rem; box-shadow: var(--shadow);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <strong>Order #${order._id.slice(-8)}</strong>
                        <div style="color: #7f8c8d;">Customer: ${order.user?.name || 'N/A'}</div>
                        <div style="color: #7f8c8d;">Date: ${orderDate}</div>
                    </div>
                    <div>
                        <select id="status-${order._id}" onchange="updateOrderStatus('${order._id}', this.value)" 
                                style="padding: 0.5rem; border-radius: 5px;">
                            ${statusOptions.map(status => 
                                `<option value="${status}" ${order.status === status ? 'selected' : ''}>${status}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                <div>Total: <strong>₹${order.totalAmount}</strong></div>
            </div>
        `;
    }).join('');
}

function showAddProductModal() {
    document.getElementById('modalTitle').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModal').classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
}

async function editProduct(productId) {
    const product = allProducts.find(p => p._id === productId);
    if (!product) return;

    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = product._id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productUnit').value = product.unit;
    
    document.getElementById('productModal').classList.remove('hidden');
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        await apiCall(`/admin/products/delete/${productId}`, {
            method: 'DELETE'
        });
        alert('Product deleted successfully');
        loadProducts();
        loadDashboard();
    } catch (error) {
        alert('Error deleting product: ' + error.message);
    }
}

async function updateOrderStatus(orderId, status) {
    try {
        await apiCall(`/admin/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        loadOrders();
        loadDashboard();
    } catch (error) {
        alert('Error updating order status: ' + error.message);
        loadOrders();
    }
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        image: document.getElementById('productImage').value,
        unit: document.getElementById('productUnit').value
    };

    try {
        if (productId) {
            await apiCall(`/admin/products/update/${productId}`, {
                method: 'PUT',
                body: JSON.stringify(productData)
            });
            alert('Product updated successfully');
        } else {
            await apiCall('/admin/products/add', {
                method: 'POST',
                body: JSON.stringify(productData)
            });
            alert('Product added successfully');
        }
        closeProductModal();
        loadProducts();
        loadDashboard();
    } catch (error) {
        alert('Error saving product: ' + error.message);
    }
});

document.addEventListener('DOMContentLoaded', loadDashboard);

