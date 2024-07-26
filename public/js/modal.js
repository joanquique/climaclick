// Obtener referencias a elementos del DOM
var modal = document.getElementById("modal");
var loginButton = document.getElementById("loginButton");
var closeButton = document.getElementsByClassName("close")[0];

// Mostrar el modal cuando se haga clic en el botón de iniciar sesión
loginButton.onclick = () => {
    modal.style.display = "block";
}

// Ocultar el modal cuando se haga clic en el botón de cerrar
closeButton.onclick = () => {
    modal.style.display = "none"; 
}

// Ocultar el modal cuando se haga clic fuera de él
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
//Comentario