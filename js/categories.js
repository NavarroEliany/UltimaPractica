import { fetchData, postData } from './api.js';
import { showAlert } from './utils.js';

export const loadCategories = async () => {
    try {
        const categories = await fetchData('/categories');
        const container = document.getElementById('categoriesContainer');
        container.innerHTML = '';

        categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card h-100">
                    <img src="${category.image || 'https://via.placeholder.com/300'}" 
                         class="card-img-top" alt="${category.name}">
                    <div class="card-body">
                        <h5 class="card-title">${category.name}</h5>
                        <button class="btn btn-primary" onclick="showCategoryDetail(${category.id})">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error cargando categorías:', error);
        showAlert('Error al cargar categorías', 'danger');
    }
};

export const showCategoryDetail = async (categoryId) => {
    try {
        const category = await fetchData(`/categories/${categoryId}`);
        const modalTitle = document.getElementById('categoryModalTitle');
        const modalBody = document.getElementById('categoryModalBody');
        
        modalTitle.textContent = category.name;
        modalBody.innerHTML = `
            <div class="text-center mb-3">
                <img src="${category.image || 'https://via.placeholder.com/300'}" 
                     class="img-fluid rounded" alt="${category.name}">
            </div>
            <p><strong>Fecha de creación:</strong> ${new Date(category.creationAt).toLocaleDateString()}</p>
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('categoryDetailModal'));
        modal.show();
    } catch (error) {
        console.error('Error cargando detalles de la categoría:', error);
        showAlert('Error al cargar detalles de la categoría', 'danger');
    }
};

export const addCategory = async (categoryData) => {
    try {
        const newCategory = await postData('/categories', categoryData);
        showAlert('Categoría añadida exitosamente', 'success');
        await loadCategories();
        return newCategory;
    } catch (error) {
        console.error('Error añadiendo categoría:', error);
        showAlert('Error al añadir categoría', 'danger');
        throw error;
    }
};

window.showCategoryDetail = showCategoryDetail;