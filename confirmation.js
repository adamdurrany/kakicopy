document.addEventListener('DOMContentLoaded', function() {
    // Generate random order number and date
    const orderNumber = 'KCP-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
    const orderDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Set order information
    document.querySelector('.order-number').textContent = orderNumber;
    document.querySelector('.order-date').textContent = orderDate;

    // Try to load order items from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItemsContainer = document.getElementById('order-items');
    let total = 0;

    if (cart.length > 0) {
        // Display each item
        cart.forEach(item => {
            const itemPrice = parseFloat(item.price.replace('RM ', '')) || 0;
            total += itemPrice;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <div>
                    <strong>${item.type === 'nametag' ? 'Name Tag' : 'Printing Service'} (${item.size})</strong>
                    <div>${item.quantity} ${item.orientation} - ${item.file || 'No file uploaded'}</div>
                </div>
                <div>${item.price}</div>
            `;
            orderItemsContainer.appendChild(itemElement);
        });

        // Display total
        document.querySelector('.total-amount').textContent = `RM ${total.toFixed(2)}`;
    } else {
        // If no items in cart (direct access to page)
        orderItemsContainer.innerHTML = '<p>No order items found</p>';
        document.querySelector('.total-amount').textContent = 'RM 0.00';
    }

    // Clear cart after order confirmation
    localStorage.removeItem('cart');
});