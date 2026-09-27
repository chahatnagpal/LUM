/**
 * MAISON SUCRE — ORDER CONFIRMATION CONTROLLER
 */

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('id');

  let order = null;

  if (orderId) {
    try {
      order = await window.db.getOrderById(orderId);
    } catch (e) {
      console.warn('Error fetching order by ID:', e);
    }
  }

  if (!order) {
    try {
      const saved = sessionStorage.getItem('last_order');
      if (saved) order = JSON.parse(saved);
    } catch (e) {
      console.warn('Error parsing last order:', e);
    }
  }

  if (!order) {
    // Show fallback sample order if accessed directly
    order = window.INITIAL_DATA.orders[0];
  }

  // Render Order Data
  const orderNumEl = document.getElementById('conf-order-number');
  if (orderNumEl) orderNumEl.textContent = order.order_number || order.id;

  const customerNameEl = document.getElementById('conf-customer-name');
  if (customerNameEl) customerNameEl.textContent = order.customer_name;

  const customerPhoneEl = document.getElementById('conf-customer-phone');
  if (customerPhoneEl) customerPhoneEl.textContent = order.customer_phone;

  const fulfillmentTypeEl = document.getElementById('conf-fulfillment-type');
  if (fulfillmentTypeEl) fulfillmentTypeEl.textContent = order.fulfillment_type;

  const addressEl = document.getElementById('conf-delivery-address');
  if (addressEl) addressEl.textContent = order.delivery_address || 'Studio Pickup';

  const dateEl = document.getElementById('conf-date');
  if (dateEl) dateEl.textContent = `${window.UI.formatDate(order.preferred_date)} (${order.preferred_time || 'Standard'})`;

  const notesEl = document.getElementById('conf-notes');
  if (notesEl) {
    if (order.special_notes) {
      notesEl.textContent = `"${order.special_notes}"`;
      document.getElementById('conf-notes-row')?.style.setProperty('display', 'flex');
    } else {
      document.getElementById('conf-notes-row')?.style.setProperty('display', 'none');
    }
  }

  // Line items
  const itemsContainer = document.getElementById('conf-items-list');
  if (itemsContainer && order.items) {
    itemsContainer.innerHTML = order.items.map(it => `
      <div class="receipt-row">
        <span>${it.product_name} (${it.size_selected || it.size}) &times; ${it.quantity}</span>
        <span style="font-weight: 600;">${window.UI.formatCurrency(it.total_price || (it.unit_price * it.quantity))}</span>
      </div>
    `).join('');
  }

  // Totals
  const subtotalEl = document.getElementById('conf-subtotal');
  if (subtotalEl) subtotalEl.textContent = window.UI.formatCurrency(order.subtotal);

  const deliveryEl = document.getElementById('conf-delivery-fee');
  if (deliveryEl) deliveryEl.textContent = order.delivery_fee > 0 ? window.UI.formatCurrency(order.delivery_fee) : 'Complimentary';

  const taxEl = document.getElementById('conf-tax');
  if (taxEl) taxEl.textContent = window.UI.formatCurrency(order.tax);

  const totalEl = document.getElementById('conf-total');
  if (totalEl) totalEl.textContent = window.UI.formatCurrency(order.total_amount);

  // Print button
  const printBtn = document.getElementById('btn-print-receipt');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
});
