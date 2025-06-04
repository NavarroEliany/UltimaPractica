function  users(){
    document.getElementById('info') = '<h1>Lista de usuarios</h1>'
}
function  products(){
    document.getElementById('info') = '<h1>Lista de productos</h1>'
}
function  logout(){
    localStorage.removeItem('token')
    location.href = '../index.html'
}