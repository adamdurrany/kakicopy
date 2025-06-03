document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Calculate total when tab changes
            calculateTotal();
        });
    });

    // Calculate total price
    function calculateTotal() {
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        const size = document.querySelector('input[name="size"]:checked').value;
        const side = document.querySelector('input[name="side"]:checked').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        const color = document.querySelector('input[name="color"]:checked').value;
        
        // Get base price from the appropriate table
        let basePrice = 0;
        const table = document.querySelector(`#${activeTab} table`);
        const rows = table.querySelectorAll('tbody tr');
        
        // Find the correct price row based on quantity
        let selectedRow = null;
        for (let row of rows) {
            const rangeText = row.querySelector('td').textContent;
            const [min, max] = parseRange(rangeText);
            
            if ((max && quantity >= min && quantity <= max) || 
                (!max && quantity >= min)) {
                selectedRow = row;
                break;
            }
        }
        
        // Get price based on size and side
        if (selectedRow) {
            if (size === 'A4') {
                basePrice = side === '1' ? 
                    parseFloat(selectedRow.querySelector('td:nth-child(2)').textContent.replace('RM ', '')) : 
                    parseFloat(selectedRow.querySelector('td:nth-child(3)').textContent.replace('RM ', ''));
            } else { // A3
                basePrice = side === '1' ? 
                    parseFloat(selectedRow.querySelector('td:nth-child(4)').textContent.replace('RM ', '')) : 
                    parseFloat(selectedRow.querySelector('td:nth-child(5)').textContent.replace('RM ', ''));
            }
        }
        
        // Apply color multiplier (assuming color is more expensive)
        if (color === 'bw' && activeTab === 'COLOR') {
            basePrice *= 0.8; // 20% discount for black & white
        }
        
        // Calculate total price (price per piece * quantity)
        let total = basePrice * quantity;
        
        // Update total display
        document.querySelector('.total-amount').textContent = `RM ${total.toFixed(2)}`;
    }

    // Helper function to parse quantity range text
    function parseRange(rangeText) {
        if (rangeText.includes('-')) {
            const [min, max] = rangeText.split('-').map(part => parseInt(part.trim().replace(' PCS', '').replace('+', '')));
            return [min, max];
        } else if (rangeText.includes('+')) {
            const min = parseInt(rangeText.replace('+', '').trim().replace(' PCS', ''));
            return [min, null];
        } else {
            const min = parseInt(rangeText.trim().replace(' PCS', ''));
            return [min, min];
        }
    }

    // Quantity buttons functionality
    document.querySelector('.quantity-btn.minus').addEventListener('click', function() {
        const input = document.getElementById('quantity');
        let value = parseInt(input.value);
        if (value > 1) {
            input.value = value - 1;
            calculateTotal();
        }
    });

    document.querySelector('.quantity-btn.plus').addEventListener('click', function() {
        const input = document.getElementById('quantity');
        let value = parseInt(input.value);
        input.value = value + 1;
        calculateTotal();
    });

    // Event listeners for form controls
    const formControls = document.querySelectorAll(
        'input[name="size"], input[name="side"], input[name="color"], #quantity'
    );
    
    formControls.forEach(control => {
        control.addEventListener('change', calculateTotal);
    });

    // File upload button functionality
    const uploadBtn = document.querySelector('.upload-btn');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            uploadBtn.innerHTML = `<i class="fas fa-check"></i> ${this.files[0].name}`;
        }
    });

    // Initialize calculation
    calculateTotal();
});