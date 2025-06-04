import { fetchData, postData } from './api.js';
import { showAlert } from './utils.js';

export const loadUsers = async () => {
    try {
        const users = await fetchData('/users');
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><img src="${user.avatar}" alt="Avatar" class="avatar-img rounded-circle"></td>
                <td>${user.role}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        showAlert('Error al cargar usuarios', 'danger');
    }
};

export const addUser = async (userData) => {
    try {
        const newUser = await postData('/users', userData);
        showAlert('Usuario añadido exitosamente', 'success');
        await loadUsers();
        return newUser;
    } catch (error) {
        console.error('Error añadiendo usuario:', error);
        showAlert('Error al añadir usuario', 'danger');
        throw error;
    }
};