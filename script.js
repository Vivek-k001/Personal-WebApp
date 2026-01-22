// Initialize Lucide icons when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Initialize the website
    initWebsite();
});

// Global variables
let currentCategory = 'All';
let currentSort = 'newest';
let products = [];

// Categories
const categories = ['All', 'Door', 'Windows', 'Table', 'Sofa', 'Wardrobe', 'Bed'];

// Initialize website
function initWebsite() {
    // Load products from localStorage
    loadProducts();

    // Setup event listeners
    setupEventListeners();

    // Render categories
    renderCategories();

    // Render products
    renderProducts();
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
}

function setupEventListeners() {
    // Menu button
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawer = document.getElementById('drawer');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            drawer.classList.add('active');
            drawerOverlay.classList.add('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeDrawer);
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeDrawer);
    }

    // Admin link
    const adminLink = document.getElementById('adminLink');
    if (adminLink) {
        adminLink.addEventListener('click', openLoginPopup);
    }

    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = currentSort;
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderProducts();
        });
    }

    // Login popup
    const loginOverlay = document.getElementById('loginOverlay');
    const loginPopup = document.getElementById('loginPopup');
    const cancelLogin = document.getElementById('cancelLogin');
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (loginOverlay) {
        loginOverlay.addEventListener('click', closeLoginPopup);
    }

    if (cancelLogin) {
        cancelLogin.addEventListener('click', closeLoginPopup);
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }

    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }

    // Scroll effect for header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
}

// Close drawer
function closeDrawer() {
    const drawer = document.getElementById('drawer');
    const drawerOverlay = document.getElementById('drawerOverlay');

    if (drawer) drawer.classList.remove('active');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
}

// Open login popup
function openLoginPopup() {
    closeDrawer();

    const loginOverlay = document.getElementById('loginOverlay');
    const loginPopup = document.getElementById('loginPopup');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');

    if (loginOverlay) loginOverlay.classList.add('active');
    if (loginPopup) loginPopup.classList.add('active');
    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
    if (loginError) {
        loginError.textContent = '';
        loginError.classList.remove('active');
    }

    // Focus on username input
    setTimeout(() => {
        if (usernameInput) usernameInput.focus();
    }, 100);
}

// Close login popup
function closeLoginPopup() {
    const loginOverlay = document.getElementById('loginOverlay');
    const loginPopup = document.getElementById('loginPopup');
    const loginError = document.getElementById('loginError');

    if (loginOverlay) loginOverlay.classList.remove('active');
    if (loginPopup) loginPopup.classList.remove('active');
    if (loginError) {
        loginError.textContent = '';
        loginError.classList.remove('active');
    }
}

// Handle login
function handleLogin() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');

    if (!usernameInput || !passwordInput || !loginError) return;

    const username = usernameInput.value;
    const password = passwordInput.value;

    // Check credentials (Admin@123 / 237007)
    if (username === 'Admin@123' && password === '237007') {
        // Redirect to admin panel
        window.location.href = 'admin.html';
    } else {
        loginError.textContent = 'Invalid username or password!';
        loginError.classList.add('active');

        // Shake animation
        loginError.style.animation = 'none';
        setTimeout(() => {
            loginError.style.animation = 'shake 0.3s ease-out';
        }, 10);
    }
}

// Render categories
function renderCategories() {
    const categoriesScroll = document.getElementById('categoriesScroll');
    if (!categoriesScroll) return;

    categoriesScroll.innerHTML = '';

    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = `category-btn ${category === currentCategory ? 'active' : ''}`;
        button.textContent = category;
        button.addEventListener('click', () => {
            currentCategory = category;
            // Update active button
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');

            renderProducts();
        });

        categoriesScroll.appendChild(button);
    });
}

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const emptyState = document.getElementById('emptyState');
    if (!productsGrid) return;

    // Filter products by category
    let filteredProducts = products.filter(product => {
        if (currentCategory === 'All') return true;
        return product.category === currentCategory;
    });

    // Sort products
    filteredProducts.sort((a, b) => {
        if (currentSort === 'newest') {
            return b.date - a.date;
        } else if (currentSort === 'price-low') {
            return parseFloat(a.price) - parseFloat(b.price);
        } else if (currentSort === 'price-high') {
            return parseFloat(b.price) - parseFloat(a.price);
        }
        return 0;
    });

    // Clear grid
    productsGrid.innerHTML = '';

    // Show empty state if no products
    if (filteredProducts.length === 0) {
        if (emptyState) {
            emptyState.style.display = 'block';
            productsGrid.appendChild(emptyState);
        }
        return;
    }

    // Hide empty state
    if (emptyState) {
        emptyState.style.display = 'none';
    }

    // Create product cards
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">₹${product.price}</p>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });
}

// Function to update products (called from admin panel)
function updateProducts(newProducts) {
    products = newProducts;
    saveProducts();
    renderProducts();
}

// Listen for storage changes (for admin panel updates)
window.addEventListener('storage', (e) => {
    if (e.key === 'furniture-products') {
        loadProducts();
        renderProducts();
    }
});

// Listen for custom event from admin panel
window.addEventListener('productsUpdated', () => {
    loadProducts();
    renderProducts();
});