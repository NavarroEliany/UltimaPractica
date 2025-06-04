import { login, logout, isAuthenticated, getAuthToken } from './auth.js';
import { loadProducts, addProduct, setupProductSearch } from './products.js';
import { loadCategories, addCategory } from './categories.js';
import { loadUsers, addUser } from './users.js';
import { showAlert, validateEmail, protectRoutes, fillCategorySelect } from './utils.js';

// Configurar fetchData globalmente
window.fetchData = async (endpoint, options = {}) => {
    const token = getAuthToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`https://api.escuelajs.co/api/v1${endpoint}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

const initializeApp = () => {
    if (isAuthenticated()) {
        showAuthenticatedUI();
    } else {
        showLoginUI();
    }

    setupEventListeners();
    fillCategorySelect();
    window.addEventListener('hashchange', protectRoutes);
};

const showAuthenticatedUI = () => {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    loadDashboardData();
};

const showLoginUI = () => {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
};

const setupEventListeners = () => {
    setupLoginForm();
    setupLogoutButton();
    setupNavLinks();
    setupAddForms();
    setupProductSearch();
};

const setupLoginForm = () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
};

const handleLogin = async () => {
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    let isValid = true;

    if (!validateEmail(email.value)) {
        email.classList.add('is-invalid');
        isValid = false;
    } else {
        email.classList.remove('is-invalid');
    }

    if (password.value.trim() === '') {
        password.classList.add('is-invalid');
        isValid = false;
    } else {
        password.classList.remove('is-invalid');
    }

    if (isValid) {
        try {
            await login(email.value, password.value);
            showAuthenticatedUI();
            showAlert('Inicio de sesión exitoso', 'success');
        } catch (error) {
            showAlert('Credenciales incorrectas', 'danger');
        }
    }
};

const setupLogoutButton = () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logout();
            showLoginUI();
            showAlert('Sesión cerrada correctamente', 'info');
        });
    }
};

const setupNavLinks = () => {
    const navLinks = document.querySelectorAll('[data-section]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavLinkClick(link);
        });
    });
};

const handleNavLinkClick = (link) => {
    const sectionId = link.getAttribute('data-section');

    if (['products', 'categories', 'users'].includes(sectionId) && !isAuthenticated()) {
        showAlert('Debes iniciar sesión para acceder a esta sección', 'warning');
        return;
    }

    updateActiveNavLink(link);
    showSection(sectionId);
    loadSectionData(sectionId);
};

const updateActiveNavLink = (activeLink) => {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
};

const showSection = (sectionId) => {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
};

const loadSectionData = (sectionId) => {
    switch (sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'products':
            loadProducts();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'users':
            loadUsers();
            break;
    }
};

const setupAddForms = () => {
    setupAddProductForm();
    setupAddCategoryForm();
    setupAddUserForm();
};

const setupAddProductForm = () => {
    const saveProductBtn = document.getElementById('saveProductBtn');
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', async () => {
            const productData = {
                title: document.getElementById('productTitle').value.trim(),
                price: parseFloat(document.getElementById('productPrice').value),
                description: document.getElementById('productDescription').value.trim(),
                categoryId: parseInt(document.getElementById('productCategory').value),
                images: document.getElementById('productImages').value.trim()
            };

            if (!validateProductData(productData)) return;

            try {
                await addProduct({
                    ...productData,
                    images: productData.images.split(',').map(img => img.trim())
                });
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
                modal.hide();
                document.getElementById('addProductForm').reset();
                showAlert('Producto añadido exitosamente', 'success');
            } catch (error) {
                console.error('Error al guardar producto:', error);
                showAlert('Error al guardar producto', 'danger');
            }
        });
    }
};

const validateProductData = (data) => {
    if (!data.title || isNaN(data.price) || !data.description || isNaN(data.categoryId) || !data.images) {
        showAlert('Por favor complete todos los campos correctamente', 'warning');
        return false;
    }
    return true;
};

const setupAddCategoryForm = () => {
    const saveCategoryBtn = document.getElementById('saveCategoryBtn');
    if (saveCategoryBtn) {
        saveCategoryBtn.addEventListener('click', async () => {
            const categoryData = {
                name: document.getElementById('categoryName').value.trim(),
                image: document.getElementById('categoryImage').value.trim()
            };

            if (!categoryData.name || !categoryData.image) {
                showAlert('Por favor complete todos los campos', 'warning');
                return;
            }

            try {
                await addCategory(categoryData);
                const modal = bootstrap.Modal.getInstance(document.getElementById('addCategoryModal'));
                modal.hide();
                document.getElementById('addCategoryForm').reset();
                showAlert('Categoría añadida exitosamente', 'success');
            } catch (error) {
                console.error('Error al guardar categoría:', error);
                showAlert('Error al guardar categoría', 'danger');
            }
        });
    }
};

const setupAddUserForm = () => {
    const saveUserBtn = document.getElementById('saveUserBtn');
    if (saveUserBtn) {
        saveUserBtn.addEventListener('click', async () => {
            const userData = {
                name: document.getElementById('userName').value.trim(),
                email: document.getElementById('userEmail').value.trim(),
                password: document.getElementById('userPassword').value,
                avatar: document.getElementById('userAvatar').value.trim(),
                role: document.getElementById('userRole').value
            };

            if (!validateUserData(userData)) return;

            try {
                await addUser(userData);
                const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
                modal.hide();
                document.getElementById('addUserForm').reset();
                showAlert('Usuario añadido exitosamente', 'success');
            } catch (error) {
                console.error('Error al guardar usuario:', error);
                showAlert('Error al guardar usuario', 'danger');
            }
        });
    }
};

const validateUserData = (data) => {
    if (!data.name || !data.email || !data.password || !data.avatar) {
        showAlert('Por favor complete todos los campos', 'warning');
        return false;
    }

    if (!validateEmail(data.email)) {
        showAlert('Por favor ingrese un email válido', 'warning');
        return false;
    }

    return true;
};

const loadDashboardData = async () => {
    try {
        const [products, categories, users] = await Promise.all([
            fetchData('/products'),
            fetchData('/categories'),
            fetchData('/users')
        ]);
        
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('totalCategories').textContent = categories.length;
        document.getElementById('totalUsers').textContent = users.length;
    } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        showAlert('Error al cargar datos del dashboard', 'danger');
    }
};