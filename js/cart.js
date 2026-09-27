/**
 * MAISON SUCRE — SHOPPING CART & DRAWER CONTROLLER
 */

class CartManager {
  constructor() {
    this.storageKey = window.APP_CONFIG.STORAGE_CART_KEY;
    this.items = this.loadCart();
    this.init();
  }

  loadCart() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Failed to parse cart storage:', e);
      return [];
    }
  }

  saveCart() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    this.updateCartUI();
  }

  // Add Item to Cart
  addItem(product, options = {}) {
    const size = options.size || product.portion_guide || '6-inch (8-10 Servings)';
    const flavor = options.flavor || 'Signature Studio Recipe';
    const inscription = options.inscription || '';
    const quantity = parseInt(options.quantity, 10) || 1;
    const unitPrice = parseFloat(options.price || product.price);

    // Unique cart key based on product ID + size + inscription
    const cartItemId = `${product.id}-${encodeURIComponent(size)}-${encodeURIComponent(inscription)}`;

    const existingIndex = this.items.findIndex(item => item.cartItemId === cartItemId);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
      this.items[existingIndex].total = this.items[existingIndex].quantity * this.items[existingIndex].price;
    } else {
      this.items.push({
        cartItemId: cartItemId,
        product_id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image_url,
        price: unitPrice,
        size: size,
        flavor: flavor,
        inscription: inscription,
        quantity: quantity,
        total: unitPrice * quantity
      });
    }

    this.saveCart();
    window.UI.showToast(`Added "${product.name}" to your order.`, 'success');
    this.openDrawer();
  }

  // Update item quantity
  updateQuantity(cartItemId, newQty) {
    const index = this.items.findIndex(item => item.cartItemId === cartItemId);
    if (index > -1) {
      if (newQty <= 0) {
        this.removeItem(cartItemId);
      } else {
        this.items[index].quantity = newQty;
        this.items[index].total = this.items[index].price * newQty;
        this.saveCart();
      }
    }
  }

  // Remove single item
  removeItem(cartItemId) {
    const item = this.items.find(i => i.cartItemId === cartItemId);
    this.items = this.items.filter(i => i.cartItemId !== cartItemId);
    this.saveCart();
    if (item) {
      window.UI.showToast(`Removed "${item.name}" from your order.`);
    }
  }

  // Clear all items
  clearCart() {
    this.items = [];
    this.saveCart();
  }

  getItems() {
    return this.items;
  }

  getItemCount() {
    return this.items.reduce((sum, it) => sum + it.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
  }

  getTotals(fulfillmentType = 'Pickup') {
    const subtotal = this.getSubtotal();
    const tax = subtotal * window.APP_CONFIG.TAX_RATE;
    let deliveryFee = 0;
    if (fulfillmentType === 'Delivery') {
      deliveryFee = subtotal >= window.APP_CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : window.APP_CONFIG.DELIVERY_FEE;
    }
    const total = subtotal + tax + deliveryFee;

    return {
      subtotal,
      tax,
      deliveryFee,
      total
    };
  }

  // Open & Close Cart Drawer
  openDrawer() {
    const backdrop = document.querySelector('.cart-drawer-backdrop');
    const drawer = document.querySelector('.cart-drawer');
    if (backdrop && drawer) {
      backdrop.classList.add('open');
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeDrawer() {
    const backdrop = document.querySelector('.cart-drawer-backdrop');
    const drawer = document.querySelector('.cart-drawer');
    if (backdrop && drawer) {
      backdrop.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Render Drawer Content & Badges
  updateCartUI() {
    // 1. Update Badge Counters in Header
    const count = this.getItemCount();
    document.querySelectorAll('.badge-counter').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });

    // 2. Render Drawer List
    const itemsContainer = document.querySelector('.cart-items-container');
    const footerContainer = document.querySelector('.cart-drawer-footer');
    
    if (!itemsContainer) return;

    if (this.items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <h4 style="font-family: var(--font-serif-display); font-size: 1.35rem; margin-bottom: 8px; color: var(--color-text-primary);">Your Cart is Empty</h4>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: 20px;">Explore our artisanal cake collection to add confections to your order.</p>
          <a href="shop.html" class="btn btn-primary btn-sm">Explore Collection</a>
        </div>
      `;
      if (footerContainer) footerContainer.style.display = 'none';
      return;
    }

    if (footerContainer) footerContainer.style.display = 'block';

    const subtotal = this.getSubtotal();

    itemsContainer.innerHTML = this.items.map(item => `
      <div class="cart-item" data-cart-id="${item.cartItemId}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=80'">
        <div class="cart-item-details">
          <button class="cart-item-remove" onclick="window.cart.removeItem('${item.cartItemId}')" title="Remove item">&times;</button>
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-variant">${item.size}</div>
          ${item.inscription ? `<div class="cart-item-custom-note">"${item.inscription}"</div>` : ''}
          <div class="cart-item-footer">
            <div class="qty-control">
              <button class="qty-btn" onclick="window.cart.updateQuantity('${item.cartItemId}', ${item.quantity - 1})">-</button>
              <input type="text" class="qty-input" value="${item.quantity}" readonly>
              <button class="qty-btn" onclick="window.cart.updateQuantity('${item.cartItemId}', ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-price">${window.UI.formatCurrency(item.price * item.quantity)}</div>
          </div>
        </div>
      </div>
    `).join('');

    // Update Drawer Footer Subtotal
    const drawerSubtotalEl = document.querySelector('.drawer-subtotal-price');
    if (drawerSubtotalEl) {
      drawerSubtotalEl.textContent = window.UI.formatCurrency(subtotal);
    }
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      // Setup Drawer Triggers
      document.querySelectorAll('.cart-btn, [data-open-cart]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.openDrawer();
        });
      });

      const drawerCloseBtn = document.querySelector('.cart-drawer-close');
      if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', () => this.closeDrawer());
      }

      const drawerBackdrop = document.querySelector('.cart-drawer-backdrop');
      if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', () => this.closeDrawer());
      }

      this.updateCartUI();
    });
  }
}

window.cart = new CartManager();
