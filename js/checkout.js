/**
 * MAISON SUCRE — CHECKOUT CONTROLLER
 * Seamless Guest Ordering Process to Supabase Database
 */

class CheckoutController {
  constructor() {
    this.fulfillmentType = 'Pickup';
    this.init();
  }

  init() {
    const items = window.cart.getItems();
    if (items.length === 0) {
      window.location.href = 'shop.html';
      return;
    }

    this.renderSummary();
    this.setupForm();
  }

  setupForm() {
    // 1. Min allowable date for delivery/pickup (48 hours lead time)
    const dateInput = document.getElementById('checkout-date');
    if (dateInput) {
      dateInput.min = window.UI.getMinDeliveryDateString();
      dateInput.value = window.UI.getMinDeliveryDateString();
    }

    // 2. Fulfillment Radio Cards (Pickup vs Delivery)
    const fulfillmentCards = document.querySelectorAll('.fulfillment-radio-card');
    const addressSection = document.getElementById('delivery-address-group');

    fulfillmentCards.forEach(card => {
      card.addEventListener('click', () => {
        fulfillmentCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.fulfillmentType = card.getAttribute('data-type');

        if (addressSection) {
          addressSection.style.display = this.fulfillmentType === 'Delivery' ? 'block' : 'none';
          const addressInput = addressSection.querySelector('input, textarea');
          if (addressInput) addressInput.required = (this.fulfillmentType === 'Delivery');
        }

        this.renderSummary();
      });
    });

    // 3. Checkout Form Submit Handler
    const form = document.getElementById('checkout-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  renderSummary() {
    const items = window.cart.getItems();
    const totals = window.cart.getTotals(this.fulfillmentType);

    const itemsContainer = document.getElementById('checkout-items-list');
    if (itemsContainer) {
      itemsContainer.innerHTML = items.map(item => `
        <div class="summary-item-row">
          <img src="${item.image}" alt="${item.name}" class="summary-item-img">
          <div class="summary-item-info">
            <div class="summary-item-title">${item.name} &times; ${item.quantity}</div>
            <div class="summary-item-sub">${item.size}</div>
            ${item.inscription ? `<div class="summary-item-sub" style="font-style: italic; color: var(--color-accent-terracotta);">"${item.inscription}"</div>` : ''}
          </div>
          <div class="summary-item-price">${window.UI.formatCurrency(item.price * item.quantity)}</div>
        </div>
      `).join('');
    }

    const subtotalEl = document.getElementById('checkout-subtotal');
    if (subtotalEl) subtotalEl.textContent = window.UI.formatCurrency(totals.subtotal);

    const deliveryFeeEl = document.getElementById('checkout-delivery-fee');
    if (deliveryFeeEl) {
      deliveryFeeEl.textContent = totals.deliveryFee > 0 ? window.UI.formatCurrency(totals.deliveryFee) : 'Complimentary';
    }

    const taxEl = document.getElementById('checkout-tax');
    if (taxEl) taxEl.textContent = window.UI.formatCurrency(totals.tax);

    const totalEl = document.getElementById('checkout-total');
    if (totalEl) totalEl.textContent = window.UI.formatCurrency(totals.total);
  }

  async handleSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('checkout-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting Your Order...';
    }

    const form = document.getElementById('checkout-form');
    const formData = new FormData(form);

    const customerName = formData.get('customer_name')?.toString().trim();
    const customerPhone = formData.get('customer_phone')?.toString().trim();
    const customerEmail = formData.get('customer_email')?.toString().trim();
    const preferredDate = formData.get('preferred_date')?.toString();
    const preferredTime = formData.get('preferred_time')?.toString();
    const deliveryAddress = this.fulfillmentType === 'Delivery' ? formData.get('delivery_address')?.toString().trim() : 'Studio Pickup (148 Mercer St, Soho, NY)';
    const specialNotes = formData.get('special_notes')?.toString().trim();
    const paymentMethod = formData.get('payment_method')?.toString() || 'Cash on Pickup / Delivery';

    if (!customerName || !customerPhone || !preferredDate) {
      window.UI.showToast('Please fill in all required contact details.', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Place Order';
      }
      return;
    }

    const items = window.cart.getItems();
    const totals = window.cart.getTotals(this.fulfillmentType);

    const orderPayload = {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      fulfillment_type: this.fulfillmentType,
      delivery_address: deliveryAddress,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      special_notes: specialNotes,
      subtotal: totals.subtotal,
      delivery_fee: totals.deliveryFee,
      tax: totals.tax,
      total_amount: totals.total,
      payment_method: paymentMethod
    };

    try {
      const createdOrder = await window.db.createOrder(orderPayload, items);

      // Save last created order for confirmation screen
      sessionStorage.setItem('last_order', JSON.stringify(createdOrder));

      // Clear the shopping cart
      window.cart.clearCart();

      // Redirect to Order Confirmation
      window.location.href = `order-confirmation.html?id=${createdOrder.order_number || createdOrder.id}`;
    } catch (err) {
      console.error('Order creation failed:', err);
      window.UI.showToast('Could not process order. Please try again.', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Place Order';
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('checkout-form')) {
    new CheckoutController();
  }
});
