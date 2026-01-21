// Initialize Lucide icons when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // Initialize admin panel
    initAdminPanel();
});

// Global variables
let products = [];
let editingProductId = null;

// Categories
const categories = ['Door', 'Windows', 'Table', 'Sofa', 'Wardrobe', 'Bed'];

// Initialize admin panel
function initAdminPanel() {
    // Load products from localStorage
    loadProducts();
    
    // Setup event listeners
    setupAdminEventListeners();
    
    // Render products list
    renderProductsList();
    
    // Update products count
    updateProductsCount();
}

// Load products from localStorage
function loadProducts() {
    const savedProducts = localStorage.getItem('furniture-products');
    if (savedProducts) {
        try {
            products = JSON.parse(savedProducts);
        } catch (error) {
            console.error('Error loading products:', error);
            products = [];
        }
    }
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('furniture-products', JSON.stringify(products));
    
    // Dispatch event to main website
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('productsUpdated'));
}

// Setup event listeners
function setupAdminEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', addProduct);
    }
    
    // Save edit button
    const saveEditBtn = document.getElementById('saveEditBtn');
    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', saveEdit);
    }
    
    // Cancel edit button
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', cancelEdit);
    }
    
    // Image upload
    const productImage = document.getElementById('productImage');
    if (productImage) {
        productImage.addEventListener('change', handleImageUpload);
    }
    
    // Enter key in form fields
    const productTitle = document.getElementById('productTitle');
    const productPrice = document.getElementById('productPrice');
    
    if (productTitle) {
        productTitle.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (editingProductId) {
                    saveEdit();
                } else {
                    addProduct();
                }
            }
        });
    }
    
    if (productPrice) {
        productPrice.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (editingProductId) {
                    saveEdit();
                } else {
                    addProduct();
                }
            }
        });
    }
}

// Handle logout
function handleLogout() {
    // Clear any admin session data
    localStorage.removeItem('admin-logged-in');
    
    // Redirect to main website
    window.location.href = 'index.html';
}

// Handle image upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        }
    };
    reader.readAsDataURL(file);
}

// Add new product
function addProduct() {
    const productTitle = document.getElementById('productTitle');
    const productPrice = document.getElementById('productPrice');
    const productCategory = document.getElementById('productCategory');
    const imagePreview = document.getElementById('imagePreview');
    
    if (!productTitle || !productPrice || !productCategory || !imagePreview) return;
    
    const title = productTitle.value.trim();
    const price = productPrice.value.trim();
    const category = productCategory.value;
    const image = imagePreview.querySelector('img')?.src;
    
    // Validation
    if (!title) {
        alert('Please enter product title');
        productTitle.focus();
        return;
    }
    
    if (!price) {
        alert('Please enter product price');
        productPrice.focus();
        return;
    }
    
    if (!image) {
        alert('Please upload a product image');
        return;
    }
    
    // Create new product
    const newProduct = {
        id: Date.now(),
        title: title,
        price: price,
        category: category,
        image: image,
        date: Date.now()
    };
    
    // Add to products array
    products.unshift(newProduct);
    
    // Save to localStorage
    saveProducts();
    
    // Reset form
    resetForm();
    
    // Update products list
    renderProductsList();
    updateProductsCount();
    
    // Show success message
    alert('Product added successfully!');
}

// Edit product
function startEdit(product) {
    editingProductId = product.id;
    
    // Update form title
    const formTitle = document.getElementById('formTitle');
    if (formTitle) {
        formTitle.textContent = 'Edit Product';
    }
    
    // Show edit buttons, hide add button
    const addProductBtn = document.getElementById('addProductBtn');
    const editActions = document.getElementById('editActions');
    if (addProductBtn) addProductBtn.style.display = 'none';
    if (editActions) editActions.style.display = 'flex';
    
    // Fill form with product data
    const productTitle = document.getElementById('productTitle');
    const productPrice = document.getElementById('productPrice');
    const productCategory = document.getElementById('productCategory');
    const imagePreview = document.getElementById('imagePreview');
    
    if (productTitle) productTitle.value = product.title;
    if (productPrice) productPrice.value = product.price;
    if (productCategory) productCategory.value = product.category;
    if (imagePreview) {
        imagePreview.innerHTML = `<img src="${product.image}" alt="Preview">`;
    }
    
    // Store editing product ID
    const editingProductIdInput = document.getElementById('editingProductId');
    if (editingProductIdInput) {
        editingProductIdInput.value = product.id;
    }
    
    // Scroll to form
    const formSection = document.querySelector('.admin-form-section');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Save edited product
function saveEdit() {
    const productTitle = document.getElementById('productTitle');
    const productPrice = document.getElementById('productPrice');
    const productCategory = document.getElementById('productCategory');
    const imagePreview = document.getElementById('imagePreview');
    
    if (!productTitle || !productPrice || !productCategory || !imagePreview) return;
    
    const title = productTitle.value.trim();
    const price = productPrice.value.trim();
    const category = productCategory.value;
    const image = imagePreview.querySelector('img')?.src;
    
    // Validation
    if (!title) {
        alert('Please enter product title');
        productTitle.focus();
        return;
    }
    
    if (!price) {
        alert('Please enter product price');
        productPrice.focus();
        return;
    }
    
    if (!image) {
        alert('Please upload a product image');
        return;
    }
    
    // Find product index
    const productIndex = products.findIndex(p => p.id === editingProductId);
    if (productIndex === -1) {
        alert('Product not found');
        cancelEdit();
        return;
    }
    
    // Update product
    products[productIndex] = {
        ...products[productIndex],
        title: title,
        price: price,
        category: category,
        image: image
    };
    
    // Save to localStorage
    saveProducts();
    
    // Reset form
    cancelEdit();
    
    // Update products list
    renderProductsList();
    
    // Show success message
    alert('Product updated successfully!');
}

// Cancel edit
function cancelEdit() {
    editingProductId = null;
    
    // Reset form title
    const formTitle = document.getElementById('formTitle');
    if (formTitle) {
        formTitle.textContent = 'Add New Product';
    }
    
    // Show add button, hide edit buttons
    const addProductBtn = document.getElementById('addProductBtn');
    const editActions = document.getElementById('editActions');
    if (addProductBtn) addProductBtn.style.display = 'flex';
    if (editActions) editActions.style.display = 'none';
    
    // Reset form
    resetForm();
}

// Reset form
function resetForm() {
    const productTitle = document.getElementById('productTitle');
    const productPrice = document.getElementById('productPrice');
    const productCategory = document.getElementById('productCategory');
    const productImage = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    
    if (productTitle) productTitle.value = '';
    if (productPrice) productPrice.value = '';
    if (productCategory) productCategory.value = 'Door';
    if (productImage) productImage.value = '';
    if (imagePreview) imagePreview.innerHTML = '';
    
    // Clear editing product ID
    const editingProductIdInput = document.getElementById('editingProductId');
    if (editingProductIdInput) {
        editingProductIdInput.value = '';
    }
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    // Remove product from array
    products = products.filter(p => p.id !== productId);
    
    // Save to localStorage
    saveProducts();
    
    // Update products list
    renderProductsList();
    updateProductsCount();
    
    // If deleting the product being edited, cancel edit
    if (editingProductId === productId) {
        cancelEdit();
    }
    
    // Show success message
    alert('Product deleted successfully!');
}

// Render products list
function renderProductsList() {
    const productsList = document.getElementById('productsList');
    if (!productsList) return;
    
    // Clear list
    productsList.innerHTML = '';
    
    // If no products
    if (products.length === 0) {
        productsList.innerHTML = '<p class="empty-state">No products yet. Add your first product!</p>';
        return;
    }
    
    // Create product list items
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-list-item';
        
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="product-list-details">
                <h3>${product.title}</h3>
                <p>${product.category}</p>
                <p class="product-list-price">₹${product.price}</p>
            </div>
            <div class="product-list-actions">
                <button class="edit-btn" onclick="startEdit(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    <i data-lucide="edit-2"></i>
                </button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;
        
        productsList.appendChild(productItem);
    });
    
    // Reinitialize Lucide icons for new buttons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Update products count
function updateProductsCount() {
    const productsCount = document.getElementById('productsCount');
    if (productsCount) {
        productsCount.textContent = products.length;
    }
}

// Make functions available globally
window.startEdit = startEdit;
window.deleteProduct = deleteProduct;