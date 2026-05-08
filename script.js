const tabs = document.querySelectorAll('.tab-button');
const products = document.querySelectorAll('.product-card');
const addButtons = document.querySelectorAll('.add-button');
const checkoutSection = document.getElementById('checkout');
const checkoutItems = document.getElementById('checkoutItems');
const checkoutTotal = document.getElementById('checkoutTotal');
const checkoutCount = document.getElementById('checkoutCount');
const placeOrderButton = document.getElementById('placeOrderButton');

let cart = JSON.parse(localStorage.getItem('chelyCart') || '[]');

function formatPrice(value) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

function parsePrice(priceText) {
  return Number(priceText.replace(/[R$\s\.]/g, '').replace(',', '.'));
}

function setActiveTab(category) {
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.category === category);
  });

  products.forEach(product => {
    const isVisible = category === 'todas' || product.dataset.category === category;
    product.style.display = isVisible ? 'grid' : 'none';
  });
}

function saveCart() {
  localStorage.setItem('chelyCart', JSON.stringify(cart));
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (checkoutCount) {
    checkoutCount.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'}`;
  }
}

function updateCartDisplay() {
  const totalValue = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  checkoutTotal.textContent = formatPrice(totalValue);
  updateCartCount();
  renderCheckoutItems();
}

function addToCart(item) {
  const existingIndex = cart.findIndex(cartItem =>
    cartItem.name === item.name && cartItem.size === item.size && cartItem.color === item.color
  );

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  saveCart();
  updateCartCount();
  updateCartDisplay();
}

function renderCheckoutItems() {
  checkoutItems.innerHTML = '';

  if (cart.length === 0) {
    checkoutItems.innerHTML = '<p class="checkout-empty">Seu carrinho está vazio.</p>';
    return;
  }

  cart.forEach(item => {
    const checkoutItem = document.createElement('div');
    checkoutItem.className = 'checkout-item';
    checkoutItem.innerHTML = `
      <div>
        <strong>${item.name}</strong>
      </div>
      <div>${item.size} • ${item.color}</div>
      <div>${item.quantity} unidade(s) • ${formatPrice(item.price * item.quantity)}</div>
    `;
    checkoutItems.appendChild(checkoutItem);
  });
}

function showOrderSuccess() {
  alert('Pedido confirmado! Agradecemos por comprar na Chely Modas.');
  cart = [];
  saveCart();
  updateCartCount();
  updateCartDisplay();
  renderCheckoutItems();
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    setActiveTab(tab.dataset.category);
  });
});

addButtons.forEach(button => {
  button.addEventListener('click', event => {
    const card = event.currentTarget.closest('.product-card');
    const name = card.querySelector('h3').textContent;
    const price = parsePrice(card.querySelector('.price').textContent);
    const size = card.querySelector('.size-select').value;
    const color = card.querySelector('.color-select').value;

    addToCart({ name, price, size, color });
  });
});

placeOrderButton.addEventListener('click', () => {
  const name = document.getElementById('customerName').value.trim();
  const address = document.getElementById('customerAddress').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();

  if (!name || !address || !phone || cart.length === 0) {
    alert('Preencha todos os dados e adicione pelo menos um produto ao carrinho.');
    return;
  }

  showOrderSuccess();
});

updateCartCount();
updateCartDisplay();
renderCheckoutItems();
setActiveTab('todas');
