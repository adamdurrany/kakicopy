document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cartItemsList = document.getElementById('cart-items'); // Fixed ID
    const emptyCartMsg = document.querySelector('.empty-cart'); // Use class selector
    const totalEl = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartCountElements = document.querySelectorAll('.cart-count');

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Initialize cart
    initCart();

    function initCart() {
        renderCartItems();
        updateCartSummary();
        updateHeaderCartCount();
    }

    function renderCartItems() {
        if (cart.length === 0) {
            emptyCartMsg.style.display = 'block';
            cartItemsList.innerHTML = ''; // Clear items to show empty message
            return;
        }

        emptyCartMsg.style.display = 'none';
        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <i class="fas fa-${item.type === 'nametag' ? 'id-card' : 'print'}"></i>
                </div>
                <div class="cart-item-details">
                    <h4>${item.type === 'nametag' ? 'Name Tag' : 'Printing Service'} (${item.size})</h4>
                    <div class="cart-item-options">
                        <span class="cart-item-option">Qty: ${item.quantity}</span>
                        <span class="cart-item-option">${item.orientation}</span>
                    </div>
                    <div class="cart-item-file">
                        <i class="fas fa-paperclip"></i> ${item.file}
                    </div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="qty-minus"><i class="fas fa-minus"></i></button>
                        <input type="number" value="${item.quantity}" min="1">
                        <button class="qty-plus"><i class="fas fa-plus"></i></button>
                    </div>
                    <button class="remove-item">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners
        addCartEventListeners();
    }

    function addCartEventListeners() {
        // Quantity minus
        document.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.closest('.cart-item').dataset.id);
                updateItemQuantity(itemId, -1);
            });
        });

        // Quantity plus
        document.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.closest('.cart-item').dataset.id);
                updateItemQuantity(itemId, 1);
            });
        });

        // Quantity input
        document.querySelectorAll('.quantity-control input').forEach(input => {
            input.addEventListener('change', function() {
                const itemId = parseInt(this.closest('.cart-item').dataset.id);
                const newQty = parseInt(this.value) || 1;
                setItemQuantity(itemId, newQty);
            });
        });

        // Remove item
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.closest('.cart-item').dataset.id);
                removeItem(itemId);
            });
        });
    }

    function updateItemQuantity(itemId, change) {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        const newQty = cart[itemIndex].quantity + change;
        if (newQty < 1) return;

        cart[itemIndex].quantity = newQty;
        cart[itemIndex].price = calculateItemPrice(cart[itemIndex]);
        saveCart();
        initCart();
    }

    function setItemQuantity(itemId, newQty) {
        if (newQty < 1) return;
        
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        cart[itemIndex].quantity = newQty;
        cart[itemIndex].price = calculateItemPrice(cart[itemIndex]);
        saveCart();
        initCart();
    }

    function removeItem(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        saveCart();
        initCart();
    }

    function calculateItemPrice(item) {
        // Calculate price based on quantity (assuming price in cart is total price)
        const pricePerUnit = parseFloat(item.price.replace('RM ', '')) / item.quantity;
        return `RM ${(pricePerUnit * item.quantity).toFixed(2)}`;
    }

    function updateCartSummary() {
        let total = 0;

        cart.forEach(item => {
            total += parseFloat(item.price.replace('RM ', '')) || 0;
        });

        totalEl.textContent = `RM ${total.toFixed(2)}`;
        checkoutBtn.disabled = cart.length === 0;
    }

    function updateHeaderCartCount() {
        const count = cart.length;
        cartCountElements.forEach(el => {
            el.textContent = count;
        });
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        window.location.href = 'confirmation.html';
    });
});