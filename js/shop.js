/**
 * MAISON SUCRE — SHOP & CATALOG CONTROLLER
 */

class ShopController {
  constructor() {
    this.products = [];
    this.categories = [];
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.sortOption = 'default';
    this.inStockOnly = false;
    this.init();
  }

  async init() {
    // Parse URL Query Params
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      this.currentCategory = categoryParam;
    }

    await this.loadCategories();
    await this.loadProducts();
    this.setupListeners();
    this.applyFiltersAndRender();
  }

  async loadCategories() {
    try {
      this.categories = await window.db.getCategories();
      this.renderCategoryPills();
    } catch (e) {
      console.error('Failed to load categories:', e);
    }
  }

  async loadProducts() {
    const grid = document.getElementById('catalog-products-grid');
    if (grid) {
      grid.innerHTML = Array(6).fill(0).map(() => `
        <div class="product-card skeleton" style="height: 420px;"></div>
      `).join('');
    }

    try {
      this.products = await window.db.getProducts();
    } catch (e) {
      console.error('Failed to load products:', e);
      this.products = [];
    }
  }

  renderCategoryPills() {
    const container = document.getElementById('category-filter-pills');
    if (!container) return;

    const pills = [
      { id: 'all', name: 'All Confections' },
      ...this.categories
    ];

    container.innerHTML = pills.map(cat => `
      <button class="filter-pill ${this.currentCategory === cat.id ? 'active' : ''}" data-category-id="${cat.id}">
        ${cat.name}
      </button>
    `).join('');

    // Attach listeners
    container.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        container.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentCategory = pill.getAttribute('data-category-id');
        this.applyFiltersAndRender();
      });
    });
  }

  setupListeners() {
    // Search Input with Debounce
    const searchInput = document.getElementById('catalog-search-input');
    if (searchInput) {
      let timeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.searchQuery = e.target.value.trim().toLowerCase();
          this.applyFiltersAndRender();
        }, 250);
      });
    }

    // Sort Dropdown
    const sortSelect = document.getElementById('catalog-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortOption = e.target.value;
        this.applyFiltersAndRender();
      });
    }

    // In Stock Only Checkbox
    const inStockCheck = document.getElementById('in-stock-only-checkbox');
    if (inStockCheck) {
      inStockCheck.addEventListener('change', (e) => {
        this.inStockOnly = e.target.checked;
        this.applyFiltersAndRender();
      });
    }
  }

  applyFiltersAndRender() {
    let filtered = [...this.products];

    // 1. Category Filter
    if (this.currentCategory && this.currentCategory !== 'all') {
      filtered = filtered.filter(p => p.category_id === this.currentCategory || p.category_name === this.currentCategory);
    }

    // 2. Search Query Filter
    if (this.searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(this.searchQuery) ||
        (p.description && p.description.toLowerCase().includes(this.searchQuery)) ||
        (p.tasting_notes && p.tasting_notes.toLowerCase().includes(this.searchQuery))
      );
    }

    // 3. Availability Filter
    if (this.inStockOnly) {
      filtered = filtered.filter(p => p.availability === 'In Stock');
    }

    // 4. Sorting
    if (this.sortOption === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (this.sortOption === 'name-az') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortOption === 'featured') {
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    this.renderCatalog(filtered);
  }

  renderCatalog(items) {
    const grid = document.getElementById('catalog-products-grid');
    const countInfo = document.getElementById('catalog-results-count');
    
    if (countInfo) {
      countInfo.textContent = `Showing ${items.length} ${items.length === 1 ? 'Cake Creation' : 'Cake Creations'}`;
    }

    if (!grid) return;

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="empty-catalog-state">
          <h3>No Confections Found</h3>
          <p>We could not find any cakes matching your specific filters or search keywords. Please adjust your criteria or reset filters.</p>
          <button class="btn btn-outline btn-sm" id="reset-catalog-btn">Reset All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-catalog-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.currentCategory = 'all';
          this.searchQuery = '';
          this.inStockOnly = false;
          this.sortOption = 'default';
          
          const searchInput = document.getElementById('catalog-search-input');
          if (searchInput) searchInput.value = '';
          const inStockCheck = document.getElementById('in-stock-only-checkbox');
          if (inStockCheck) inStockCheck.checked = false;
          const sortSelect = document.getElementById('catalog-sort-select');
          if (sortSelect) sortSelect.value = 'default';

          this.renderCategoryPills();
          this.applyFiltersAndRender();
        });
      }
      return;
    }

    grid.innerHTML = items.map(prod => `
      <div class="product-card">
        <div class="product-image-wrap">
          <img src="${prod.image_url}" alt="${prod.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80'">
          <div class="product-badge-overlay">
            <span class="badge ${prod.availability === 'In Stock' ? 'badge-signature' : prod.availability === 'Sold Out' ? 'badge-soldout' : 'badge-preorder'}">
              ${prod.availability}
            </span>
          </div>
          <a href="product.html?id=${prod.id}" class="product-quick-view-btn" title="View Details">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </a>
        </div>
        <div class="product-card-body">
          <span class="product-category-tag">${prod.category_name || 'Artisanal Cake'}</span>
          <h3 class="product-title">
            <a href="product.html?id=${prod.id}">${prod.name}</a>
          </h3>
          <div class="product-tasting-notes">${prod.tasting_notes || prod.description}</div>
          <div class="product-card-footer">
            <div class="product-price">${window.UI.formatCurrency(prod.price)}</div>
            <button class="btn btn-outline btn-sm" onclick="window.cart.addItem(${JSON.stringify(prod).replace(/"/g, '&quot;')})" ${prod.availability === 'Sold Out' ? 'disabled' : ''}>
              ${prod.availability === 'Sold Out' ? 'Sold Out' : 'Add to Order'}
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('catalog-products-grid')) {
    new ShopController();
  }
});
