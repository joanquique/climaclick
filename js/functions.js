//Efecto de header
window.addEventListener('scroll', function() {
    var header = document.querySelector('header');
    var scrollPosition = window.scrollY;
    scrollPosition > 50 ? header.classList.add('scrolled') : header.classList.remove('scrolled');
});

// Función para filtrar los productos
function filtrarProductos() {
    // Obtener el texto ingresado en el cuadro de búsqueda
    var textoBusqueda = document.querySelector('input[name="q"]').value.toLowerCase();
    // Obtener todos los elementos de artículo (productos)
    var productos = document.querySelectorAll('.item');
    // Recorrer todos los productos y mostrar u ocultar según coincidan con el texto de búsqueda
    productos.forEach(function(producto) {
        // Obtener el texto del título del producto
        var titulo = producto.querySelector('h2').textContent.toLowerCase();
        // Mostrar u ocultar el producto según coincida con el texto de búsqueda
        if (titulo.includes(textoBusqueda)) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });
}

// Escuchar el evento de cambio en el cuadro de búsqueda
document.querySelector('input[name="q"]').addEventListener('input', function() {
    // Filtrar los productos al cambiar el texto en el cuadro de búsqueda
    filtrarProductos();
});

// Funciones de carrito de compras
document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.getElementById('menu-icon');
    const cartIcon = document.getElementById('cart-icon');

    if (menuIcon && cartIcon) {
        // Menú
        document.getElementById('menu-toggle').addEventListener('click', () => {
            const menu = document.querySelector('.menu');
            menu.classList.toggle('menu--open');

            const newSrc = menu.classList.contains('menu--open') ? 'img/x.svg' : 'img/menu.svg';
            animateIcon(menuIcon, newSrc);
        });

        document.getElementById('menu-close').addEventListener('click', () => {
            const menu = document.querySelector('.menu');
            menu.classList.remove('menu--open');
            animateIcon(menuIcon, 'img/menu.svg');
        });

        // Carrito
        document.getElementById('cart-toggle').addEventListener('click', function() {
            const cart = document.querySelector('.cart');
            cart.classList.toggle('cart--open');
            animateIcon(cartIcon);
        });

        document.getElementById('cart-close').addEventListener('click', function() {
            const cart = document.querySelector('.cart');
            cart.classList.remove('cart--open');
            animateIcon(cartIcon);
        });

        // Añadir al carrito
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const product = button.parentNode;
                const productName = product.querySelector('span.text-archivo-black').textContent;
                const productPrice = product.querySelector('span.precio').textContent;
                const imgSrc = product.querySelector('img').getAttribute('src');
                addToCart(productName, productPrice, imgSrc);
                animateIcon(cartIcon);
            });
        });
    }
    // Cargar el carrito desde localStorage al cargar la página
    loadCartFromLocalStorage();
    updateCartTotal(); // Actualiza el total a pagar al cargar la página
    verificarCarrito();

    //Verificar que no exista el botón de Proceder al pago en el DOM
    const payButton = document.getElementById('pay-button');
  
    // Verifica si el botón de pago está presente en el DOM
    if (payButton) {
      payButton.addEventListener('click', function() {
        const requiredFields = [
          'nombre', 'correo', 'telefono', 'calle', 'num_ext', 'cp',
          'colonia', 'city', 'state', 'pais', 'referencia', 'termsCheckbox'
        ];
  
        let allFieldsFilled = true;
  
        requiredFields.forEach(fieldId => {
          const field = document.getElementById(fieldId);
  
          // Solo procede si el campo existe
          if (field) {
            if (!field.value || (field.type === 'checkbox' && !field.checked)) {
              allFieldsFilled = false;
              field.classList.add('invalid');
            } else {
              field.classList.remove('invalid');
            }
          }
        });
  
        if (allFieldsFilled) {
          payButton.classList.add('hidden');
          const walletContainer = document.getElementById('wallet_container');
          if (walletContainer) {
            walletContainer.style.display = 'block';
          }
        } else {
          alert('Por favor completa todos los campos antes de proceder.');
        }
      });
    }
});

function animateIcon(iconElement, newSrc = null) {
    iconElement.style.transform = 'scale(0.8)'; // Reducir tamaño
    setTimeout(() => {
        if (newSrc) {
            iconElement.src = newSrc; // Cambiar ícono si se proporciona una nueva fuente
        }
        iconElement.style.transform = 'scale(1)'; // Restaurar tamaño
    }, 300); // Tiempo de espera igual a la duración de la transición en milisegundos
}

// Función para guardar el carrito en localStorage
function saveCartToLocalStorage(cartItems) {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Función para cargar el carrito desde localStorage
function loadCartFromLocalStorage() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.forEach(item => {
        addToCart(item.name, item.price, item.imgSrc, item.quantity, false);
    });
}

// Modifica la función addToCart para actualizar el localStorage
function addToCart(name, price, imgSrc, quantity = 1, updateLocalStorage = true) {
    const existingCartItem = document.querySelector(`.cart__item[data-name="${name}"]`);
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (existingCartItem) {
        const itemCountElement = existingCartItem.querySelector('.cart__item-count');
        let currentCount = parseInt(itemCountElement.textContent);
        currentCount += quantity;
        itemCountElement.textContent = currentCount;

        // Actualiza el objeto del carrito en localStorage
        const itemIndex = cartItems.findIndex(item => item.name === name);
        cartItems[itemIndex].quantity = currentCount;
    } else {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart__item');
        cartItem.setAttribute('data-name', name);

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = name;
        cartItem.appendChild(img);

        const itemName = document.createElement('p');
        itemName.textContent = name;
        cartItem.appendChild(itemName);
        const itemPrice = document.createElement('p');
        itemPrice.textContent = price;
        cartItem.appendChild(itemPrice);

        const quantityControls = document.createElement('div');
        quantityControls.classList.add('cart__quantity-controls');

        const decrementButton = document.createElement('button');
        decrementButton.textContent = '-';
        decrementButton.classList.add('cart__quantity-decrement');
        decrementButton.addEventListener('click', () => {
            updateCartItemQuantity(cartItem, -1);
        });
        quantityControls.appendChild(decrementButton);

        const itemCount = document.createElement('span');
        itemCount.textContent = quantity;
        itemCount.classList.add('cart__item-count');
        quantityControls.appendChild(itemCount);

        const incrementButton = document.createElement('button');
        incrementButton.textContent = '+';
        incrementButton.classList.add('cart__quantity-increment');
        incrementButton.addEventListener('click', () => {
            updateCartItemQuantity(cartItem, 1);
        });
        quantityControls.appendChild(incrementButton);
        cartItem.appendChild(quantityControls);
        
        const cart = document.querySelector('.cart');
        cart.appendChild(cartItem);

        // Agrega el nuevo artículo al array de localStorage
        cartItems.push({ name, price, imgSrc, quantity });
    }

    if (updateLocalStorage) {
        saveCartToLocalStorage(cartItems);
    }

    updateCartItemCount(quantity);
    showNotification(); // Mostrar notificación solo al agregar al carrito
}

function showNotification() {
    const notification = document.getElementById('notification');
    
    if (!notification) {
        return;
    }
    
    notification.classList.remove('hidden');

    // Forzar el reflujo para reiniciar la animación
    void notification.offsetWidth;

    notification.classList.add('visible');

    // Ocultar notificación después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('visible');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 500); // Espera a que la transición termine antes de agregar la clase 'hidden'
    }, 2000);
}


function updateCartItemQuantity(cartItem, change) {
    const itemCountElement = cartItem.querySelector('.cart__item-count');
    let currentCount = parseInt(itemCountElement.textContent);
    currentCount += change;

    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (currentCount < 1) {
        const itemName = cartItem.getAttribute('data-name');
        cartItems = cartItems.filter(item => item.name !== itemName);
        cartItem.remove();
        updateCartItemCount(-1);
    } else {
        itemCountElement.textContent = currentCount;
        const itemIndex = cartItems.findIndex(item => item.name === cartItem.getAttribute('data-name'));
        cartItems[itemIndex].quantity = currentCount;
        updateCartItemCount(change);
    }

    saveCartToLocalStorage(cartItems);
    updateCartTotal(); // Actualiza el total a pagar
}

function updateCartItemCount(change) {
    const totalItemCountElement = document.getElementById('cart-item-count');
    let currentTotal = parseInt(totalItemCountElement.textContent) || 0; // Inicializa en 0 si no hay valor
    currentTotal += change;
    totalItemCountElement.textContent = currentTotal;
    totalItemCountElement.style.display = currentTotal > 0 ? 'inline-block' : 'none'; // Mostrar el contador solo si hay artículos en el carrito
    verificarCarrito(); // Verificar la cantidad de artículos en el carrito
    updateCartTotal();
}   

// Función para calcular y actualizar el total a pagar
function updateCartTotal() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    cartItems.forEach(item => {
        const itemPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, '').replace(',', '.')); // Elimina caracteres no numéricos excepto el punto decimal y reemplaza coma con punto
        total += itemPrice * item.quantity;
    });

    const cartTotalElement = document.getElementById('cart-total');
    cartTotalElement.textContent = total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Función para verificar la cantidad de artículos en el carrito
function verificarCarrito() {
    const totalItemCountElement = document.getElementById('cart-item-count');
    const itemCount = parseInt(totalItemCountElement.textContent) || 0;
    const buyButton = document.getElementById('buy-button');
    
    if (itemCount > 0) {
        buyButton.style.display = 'block';
    } else {
        buyButton.style.display = 'none';
    }
}

// Función para verificar si es dispositivo móvil
function esDispositivoMovil() {
    return window.innerWidth <= 795; // Cambia este valor según tus necesidades
}

// Cambiar contenido visible en función del dispositivo
function ajustarContenidoSegunDispositivo() {
    var contenidoDesktop = document.querySelector('.left-content.desktop');
    var contenidoMovil = document.querySelector('.left-content.mobile');
    
    if (esDispositivoMovil()) {
        if (contenidoDesktop) contenidoDesktop.style.display = 'none';
        if (contenidoMovil) contenidoMovil.style.display = 'block';
    } else {
        if (contenidoDesktop) contenidoDesktop.style.display = 'block';
        if (contenidoMovil) contenidoMovil.style.display = 'none';
    }
}

// Llamar a la función al cargar la página
window.onload = function() {
    ajustarContenidoSegunDispositivo(); // Ajustar contenido al cargar la página
}

// Llamar a la función al redimensionar la ventana
window.onresize = function() {
    ajustarContenidoSegunDispositivo(); // Ajustar contenido al cambiar el tamaño de la ventana
}

//Script de carrusel de imágenes
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    if (slides.length === 0) return; // Verificar si hay elementos de carrusel
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    let slides = document.getElementsByClassName("mySlides");
    if (slides.length === 0) return; // Verificar si hay elementos de carrusel
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (slides.length === 0 || dots.length === 0) return; // Verificar si hay elementos de carrusel

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

function generateOrderNumber() {
    return 'ORD-' + Date.now(); // Usa el timestamp para crear un número único
}

const orderNumber = generateOrderNumber();
console.log("Número de compra: ", orderNumber);


function loadCartForSummary() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const itemsSummaryContainer = document.getElementById('items-summary-container');
    const summaryTotalElement = document.getElementById('summary-total');
    itemsSummaryContainer.innerHTML = `<p>Orden de compra: ${orderNumber}</p>`;

    let total = 0;

    cartItems.forEach(item => {
        // Crear el contenedor del artículo
        const itemElement = document.createElement('div');

        // Crear el HTML para cada artículo
        itemElement.innerHTML = `
            <div class="item-summary">
                <img class="img-summary" src="${item.imgSrc}" alt="${item.name}">
                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-quantity">Cantidad: ${item.quantity}</p>
                    <p class="item-price">Precio: ${item.price}*</p>
                </div>
            </div>
            <hr>
        `;

        // Añadir el artículo al contenedor
        itemsSummaryContainer.appendChild(itemElement);

        // Limpiar el precio y convertirlo a número
            const priceNumber = parseFloat(item.price.replace(/[^0-9.-]+/g,""));
            
            // Sumar al total
            total += priceNumber * item.quantity;
    });

    // Formatear el total
    const formattedTotal = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(total);

    // Mostrar el total en el resumen
    summaryTotalElement.textContent = formattedTotal;
    
}

document.querySelector('.boton-confirmar').addEventListener('click', () => {
    // Limpia el localStorage
    localStorage.removeItem('cart');
    
    // Redirige al usuario al índice
    window.location.href = 'index.html';
});


// Llama a la función para cargar el resumen de la compra cuando se cargue la página
document.addEventListener('DOMContentLoaded', loadCartForSummary);
