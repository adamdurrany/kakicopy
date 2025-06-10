<script>
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function () {
      // Get current count
      let count = parseInt(localStorage.getItem('cartCount')) || 0;

      // Increase by 1
      count += 1;

      // Save to localStorage
      localStorage.setItem('cartCount', count);

      // Update display
      const cartDisplay = document.getElementById('cart-count');
      if (cartDisplay) {
        cartDisplay.textContent = count;
      }
    });
  });
</script>
