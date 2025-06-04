
import { isAuthenticated } from './auth.js';

export const showAlert = (message, type = 'info') => {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show fixed-top mt-5 mx-3`;
    alertContainer.role = 'alert';
    alertContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(alertContainer);
    
    setTimeout(() => {
        alertContainer.remove();
    }, 5000);
};

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const protectRoutes = () => {
    const protectedSections = ['products', 'categories', 'users'];
    const currentSection = document.querySelector('.section.active')?.id || 'dashboard';
    
    if (protectedSections.includes(currentSection)) {
        if (!isAuthenticated()) {
            document.getElementById('dashboard').classList.add('active');
            document.getElementById('products').classList.remove('active');
            document.getElementById('categories').classList.remove('active');
            document.getElementById('users').classList.remove('active');
            
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === 'dashboard') {
                    link.classList.add('active');
                }
            });
            
            showAlert('Debes iniciar sesión para acceder a esta sección', 'warning');
        }
    }
};

export const fillCategorySelect = async () => {
    try {
        const categories = await window.fetchData('/categories');
        const select = document.getElementById('productCategory');
        if (select) {
            select.innerHTML = '<option value="">Seleccione una categoría</option>';
            
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error cargando categorías:', error);
        showAlert('Error al cargar categorías para el selector', 'danger');
    }
};