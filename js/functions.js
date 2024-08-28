//Efecto de header
window.addEventListener('scroll', function() {
    var header = document.querySelector('header');
    var mainContent = document.querySelector('main'); // Asegúrate de que este selector apunte al contenido principal
    var scrollPosition = window.scrollY;

    if (scrollPosition > 1) {
        header.classList.add('scrolled');
        mainContent.style.marginTop = header.offsetHeight + 'px'; // Añadir margen superior al contenido
    } else {
        header.classList.remove('scrolled');
        mainContent.style.marginTop = '0px'; // Restablecer margen superior al contenido
    }
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
    // Selecciona todos los botones con la clase 'add-to-cart'
    const botones = document.querySelectorAll('.add-to-cart');
    
    // Itera sobre cada botón y agrega el event listener
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            showNotification(); // Mostrar notificación solo al agregar al carrito
        });
    });
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
            showNotification();
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
    const totalItemCountBadge = document.getElementById('cart-count');
    let currentTotal = parseInt(totalItemCountElement.textContent) || 0; // Inicializa en 0 si no hay valor
    currentTotal += change;
    totalItemCountElement.textContent = currentTotal;
    totalItemCountBadge.textContent = currentTotal;
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
    const countBadge = document.getElementById('cart-count');
    
    if (itemCount > 0) {
        buyButton.style.display = 'block';
        countBadge.style.display = 'block';
    } else {
        buyButton.style.display = 'none';
        countBadge.style.display = 'none';
    }
}

// Función para verificar si es dispositivo móvil
function esDispositivoMovil() {
    return window.innerWidth <= 1060; // Cambia este valor según tus necesidades
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

// Efecto de slide en carrusel de imágenes
let slideIndex = 1;
let previousIndex = 1;

function plusSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    if (slides.length === 0) return; // Verificar si hay elementos de carrusel

    previousIndex = slideIndex;
    slideIndex += n;

    if (slideIndex > slides.length) { slideIndex = 1; }
    if (slideIndex < 1) { slideIndex = slides.length; }

    showSlides(slideIndex, n);
}

function currentSlide(n) {
    let slides = document.getElementsByClassName("mySlides");
    if (slides.length === 0) return; // Verificar si hay elementos de carrusel

    previousIndex = slideIndex;
    slideIndex = n;

    showSlides(slideIndex, slideIndex - previousIndex);
}

function showSlides(n, direction) {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (slides.length === 0 || dots.length === 0) return; // Verificar si hay elementos de carrusel

    // Eliminar todas las clases de animación antes de mostrar la siguiente
    for (let i = 0; i < slides.length; i++) {
        slides[i].className = slides[i].className.replace(/slide-(in|out)-(left|right)/g, "");
        slides[i].style.display = "none";
    }

    // Determinar la dirección de la animación
    if (direction > 0) { // Deslizar hacia la izquierda
        slides[previousIndex - 1].classList.add("slide-out-left");
        slides[slideIndex - 1].classList.add("slide-in-right");
    } else if (direction < 0) { // Deslizar hacia la derecha
        slides[previousIndex - 1].classList.add("slide-out-right");
        slides[slideIndex - 1].classList.add("slide-in-left");
    }

    slides[slideIndex - 1].style.display = "block";

    // Actualizar las clases de los puntos (dots)
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    dots[slideIndex - 1].className += " active";
}

// Inicializar la primera diapositiva
showSlides(slideIndex);

// Integración del deslizamiento táctil
document.addEventListener('DOMContentLoaded', function() {
    let xStart = null; // Coordenada inicial X del toque
    let yStart = null; // Coordenada inicial Y del toque

    const slideshowContainer = document.querySelector('.slideshow-container');

    // Verifica si el slideshowContainer existe antes de agregar eventos
    if (slideshowContainer) {
        // Función para manejar el toque inicial
        function handleTouchStart(evt) {
            xStart = evt.touches[0].clientX;
            yStart = evt.touches[0].clientY;
        }

        // Función para manejar el movimiento del toque
        function handleTouchMove(evt) {
            if (!xStart || !yStart) {
                return;
            }

            let xEnd = evt.touches[0].clientX;
            let yEnd = evt.touches[0].clientY;

            let xDiff = xStart - xEnd;
            let yDiff = yStart - yEnd;

            // Detectar movimiento horizontal
            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                if (xDiff > 0) {
                    // Deslizó hacia la izquierda
                    plusSlides(1);
                } else {
                    // Deslizó hacia la derecha
                    plusSlides(-1);
                }
            }

            // Resetear los valores de inicio
            xStart = null;
            yStart = null;
        }

        // Asignar eventos de toque al contenedor del slideshow
        slideshowContainer.addEventListener('touchstart', handleTouchStart, false);
        slideshowContainer.addEventListener('touchmove', handleTouchMove, false);
    }
    const inputs = document.querySelectorAll('#paymentForm input');

    // Añade un evento 'input' a cada campo
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Si el campo tiene valor, añade la clase 'input-filled'
            if (this.value.trim() !== '') {
                this.classList.add('input-filled');
            } else {
                this.classList.remove('input-filled');
            }
        });
    });
});

// Función para obtener parámetros de la URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Función para generar o recuperar el número de orden desde sessionStorage
function getOrderNumber() {
    let orderNumber = sessionStorage.getItem('orderNumber');
    if (!orderNumber) {
        orderNumber = 'ORD-' + Date.now(); // Usa el timestamp para crear un número único
        sessionStorage.setItem('orderNumber', orderNumber);
    }
    return orderNumber;
}

// Función para cargar el resumen del carrito o desde sessionStorage
function loadCartForSummary() {
    const itemsSummaryContainer = document.getElementById('items-summary-container');
    const summaryTotalElement = document.getElementById('summary-total');
    
    if (!itemsSummaryContainer || !summaryTotalElement) {
        return;
    }
    
    // Primero, verifica si ya hay un resumen guardado en sessionStorage
    let purchaseSummary = sessionStorage.getItem('purchaseSummary');
    
    if (purchaseSummary) {
        // Cargar el resumen desde sessionStorage
        purchaseSummary = JSON.parse(purchaseSummary);
        displayPurchaseSummary(purchaseSummary);
        return;
    }

    // Si no hay resumen previo, generamos uno nuevo desde el carrito
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    if (cartItems.length === 0) {
        itemsSummaryContainer.innerHTML = '<p>No hay artículos en el carrito.</p>';
        summaryTotalElement.textContent = '';
        return;
    }

    const orderNumber = getOrderNumber();
    itemsSummaryContainer.innerHTML = `<p class="odc">Orden de compra: <b>${orderNumber}</b></p>`;
    
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
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
        itemsSummaryContainer.appendChild(itemElement);
        const priceNumber = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
        total += priceNumber * item.quantity;
    });

    const formattedTotal = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(total);
    summaryTotalElement.textContent = formattedTotal;

    // Guardar el resumen de compra en sessionStorage
    purchaseSummary = {
        orderNumber,
        cartItems,
        total: formattedTotal
    };
    sessionStorage.setItem('purchaseSummary', JSON.stringify(purchaseSummary));
    
    // Vaciar el carrito después de generar el resumen
    localStorage.removeItem('cart');
}

// Función para mostrar el resumen de compra desde sessionStorage
function displayPurchaseSummary(purchaseSummary) {
    const itemsSummaryContainer = document.getElementById('items-summary-container');
    const summaryTotalElement = document.getElementById('summary-total');
    
    itemsSummaryContainer.innerHTML = `<p class="odc">Orden de compra: <b>${purchaseSummary.orderNumber}</b></p>`;
    
    purchaseSummary.cartItems.forEach(item => {
        const itemElement = document.createElement('div');
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
        itemsSummaryContainer.appendChild(itemElement);
    });

    summaryTotalElement.textContent = purchaseSummary.total;
}

// Función principal que verifica el payment_id y carga el resumen
function initializePage() {
    if (window.location.pathname.includes('resumen_compra.html')) {
        const paymentId = getQueryParam('payment_id');

        if (paymentId) {
            loadCartForSummary();
        } else {
            // Redirigir al índice si payment_id no está presente
            window.location.href = 'index.html';
        }
    }
}

// Llamar a la función principal cuando la página se carga
document.addEventListener('DOMContentLoaded', initializePage);

// Función para vaciar el carrito al cargar la página de resumen de compra
function clearCartOnSummaryPageLoad() {
    if (window.location.pathname.includes('resumen_compra.html')) {
        localStorage.removeItem('cart'); // Vacía el carrito
    }
}

// Llamar a esta función cuando la página de resumen de compra se carga
document.addEventListener('DOMContentLoaded', function() {
    clearCartOnSummaryPageLoad();
});

// Script de efecto de lupa en artículo individual
document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.img-container');

    // Verifica si hay elementos con la clase 'img-container' antes de aplicar el efecto
    if (containers.length > 0) {
        containers.forEach(container => {
            const img = container.querySelector('.img-item');

            // Verifica si el elemento img-item existe dentro de la img-container
            if (img) {
                container.addEventListener('mousemove', (e) => {
                    const rect = container.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const xPercent = (x / container.offsetWidth) * 100;
                    const yPercent = (y / container.offsetHeight) * 100;

                    img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
                    img.style.transform = 'scale(2)'; // Aplica la escala
                });

                container.addEventListener('mouseleave', () => {
                    img.style.transformOrigin = 'center center';
                    img.style.transform = 'scale(1)'; // Reestablece la escala
                });
            }
        });
    }
});
