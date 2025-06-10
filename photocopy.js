document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function () {
            nav.classList.toggle('active');
        });
    }

    // Dropdowns (mobile)
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        if (window.innerWidth <= 768) {
            const dropbtn = dropdown.querySelector('.dropbtn');
            dropbtn.addEventListener('click', function (e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (event) {
        if (!event.target.matches('.dropbtn') && !event.target.matches('.dropbtn *')) {
            dropdowns.forEach(dropdown => {
                if (window.innerWidth > 768) {
                    dropdown.classList.remove('active');
                }
            });
        }
    });

    // Calculate total price
    function calculateTotal() {
        const sizeInput = document.querySelector('input[name="size"]:checked');
        const quantityInput = document.getElementById('quantity');
        const colorInput = document.querySelector('input[name="colorOption"]:checked');
        const color = colorInput ? colorInput.value : 'bw'; // default to black & white


        if (!sizeInput || !quantityInput) return;

        const size = sizeInput.value;
        const quantity = parseInt(quantityInput.value);

        let basePrice = 0;
        const table = document.querySelector('#PHOTOCOPY table');
        const rows = table.querySelectorAll('tbody tr');

        // Find the correct price row based on quantity
        let selectedRow = null;
        for (let row of rows) {
            const rangeText = row.querySelector('td').textContent;
            const [min, max] = parseRange(rangeText);

            if ((max && quantity >= min && quantity <= max) || (!max && quantity >= min)) {
                selectedRow = row;
                break;
            }
        }

        if (selectedRow) {
            let priceCellIndex;

            if (size === 'A6' && color === 'bw') priceCellIndex = 2;
            else if (size === 'A6' && color === 'color') priceCellIndex = 3;
            else if (size === 'A7' && color === 'bw') priceCellIndex = 4;
            else if (size === 'A7' && color === 'color') priceCellIndex = 5;

            const priceText = selectedRow.querySelector(`td:nth-child(${priceCellIndex})`).textContent;
            basePrice = parseFloat(priceText.replace('RM ', ''));
        }


        // Calculate total price
        let total = basePrice * quantity;

        const totalElement = document.querySelector('.total-amount');
        if (totalElement) {
            totalElement.textContent = `RM ${total.toFixed(2)}`;
        }
    }

    // Helper to parse quantity range
    function parseRange(rangeText) {
        rangeText = rangeText.replace('PCS', '').trim();

        if (rangeText.includes('-')) {
            const [min, max] = rangeText.split('-').map(v => parseInt(v.trim()));
            return [min, max];
        } else if (rangeText.toLowerCase().includes('above')) {
            const min = parseInt(rangeText);
            return [min, null];
        } else {
            const value = parseInt(rangeText);
            return [value, value];
        }
    }

    // Quantity buttons
    document.querySelector('.quantity-btn.minus').addEventListener('click', function () {
        const input = document.getElementById('quantity');
        let value = parseInt(input.value);
        if (value > 1) {
            input.value = value - 1;
            calculateTotal();
        }
    });

    document.querySelector('.quantity-btn.plus').addEventListener('click', function () {
        const input = document.getElementById('quantity');
        let value = parseInt(input.value);
        input.value = value + 1;
        calculateTotal();
    });

    // Listen for change
    const formControls = document.querySelectorAll(
        'input[name="size"], input[name="colorOption"], #quantity'
    );

    formControls.forEach(control => {
        control.addEventListener('change', calculateTotal);
    });

    // Upload file
    const uploadBtn = document.querySelector('.upload-btn');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    uploadBtn.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function () {
        if (this.files.length > 0) {
            uploadBtn.innerHTML = `<i class="fas fa-check"></i> ${this.files[0].name}`;
        }
    });

    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartCount() {
        const countElement = document.querySelector('.cart-count');
        if (countElement) {
            countElement.textContent = cart.length;
        }
    }

    // Add to cart functionality
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function () {
            const size = document.querySelector('input[name="size"]:checked')?.value;
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            const totalPrice = document.querySelector('.total-amount')?.textContent || 'RM 0.00';
            const uploadedFile = fileInput.files.length > 0 ? fileInput.files[0].name : 'No file uploaded';

            if (!size) {
                alert('Please select a size');
                return;
            }

            const color = document.querySelector('input[name="colorOption"]:checked')?.value || 'bw';

            const item = {
                id: Date.now(),
                type: 'photocopy',
                size,
                quantity,
                color,
                orientation: 'portrait', // or get actual value if needed
                price: totalPrice,
                file: uploadedFile,
                date: new Date().toLocaleString()
            };


            cart.push(item);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert('Item added to cart!');
        });
    }

    // Initial calculation and cart count
    calculateTotal();
    updateCartCount();
});