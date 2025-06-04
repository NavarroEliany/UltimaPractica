import { fetchData, postData } from './api.js';
import { showAlert } from './utils.js';

export const loadProducts = async (searchTerm = '') => {
    try {
        let url = '/products';
        if (searchTerm) {
            url += `/?title=${encodeURIComponent(searchTerm)}`;
        }

        const products = await fetchData(url);
        const container = document.getElementById('productsContainer');
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = '<div class="col-12"><p class="text-center">No se encontraron productos.</p></div>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card h-100">
                    <img src="${product.images[0] || 'https://via.placeholder.com/300'}" 
                         class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description.substring(0, 50)}...</p>
                        <p class="card-text"><strong>Precio: $${product.price}</strong></p>
                        <button class="btn btn-primary" onclick="showProductDetail(${product.id})">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error cargando productos:', error);
        showAlert('Error al cargar productos', 'danger');
    }
};

export const showProductDetail = async (productId) => {
    try {
        const product = await fetchData(`/products/${productId}`);
        const modalTitle = document.getElementById('productModalTitle');
        const modalBody = document.getElementById('productModalBody');
        
        modalTitle.textContent = product.title;
        modalBody.innerHTML = `
            <div class="text-center mb-3">
                <img src="${product.images[0] || 'https://via.placeholder.com/300'}" 
                     class="img-fluid rounded" alt="${product.title}">
            </div>
            <p><strong>Descripción:</strong> ${product.description}</p>
            <p><strong>Precio:</strong> $${product.price}</p>
            <p><strong>Categoría:</strong> ${product.category?.name || 'N/A'}</p>
            <p><strong>Fecha de creación:</strong> ${new Date(product.creationAt).toLocaleDateString()}</p>
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('productDetailModal'));
        modal.show();
    } catch (error) {
        console.error('Error cargando detalles del producto:', error);
        showAlert('Error al cargar detalles del producto', 'danger');
    }
};

export const addProduct = async (productData) => {
    try {
        if (typeof productData.images === 'string') {
            productData.images = productData.images.split(',').map(img => img.trim());
        }

        const newProduct = await postData('/products', productData);
        showAlert('Producto añadido exitosamente', 'success');
        await loadProducts();
        return newProduct;
    } catch (error) {
        console.error('Error añadiendo producto:', error);
        showAlert('Error al añadir producto', 'danger');
        throw error;
    }
};

export const setupProductSearch = () => {
    const searchInput = document.getElementById('productSearchInput');
    const searchBtn = document.getElementById('productSearchBtn');

    const handleSearch = () => {
        const searchTerm = searchInput.value.trim();
        loadProducts(searchTerm);
    };

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
};

window.showProductDetail = showProductDetail;