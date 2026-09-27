# Maison Sucre — Haute Cake Studio & Artisanal Confections

A complete, responsive, premium boutique cake and bakery e-commerce platform crafted with **HTML5**, **CSS3**, **Vanilla JavaScript (ES6)**, and real **Supabase** backend database integration.

---

## ✦ Brand & Visual Direction

- **Brand Aesthetic:** Refined, feminine, editorial, and visually sophisticated boutique cake atelier.
- **Palette:** Warm ivory & alabaster (`#FDFBF7`), soft blush pink (`#F4E4DC`), warm taupe (`#8C7667`), deep espresso charcoal (`#211B17`), and muted 24k gold accents (`#C5A059`).
- **Typography:** Refined editorial serif headings (*Cormorant Garamond* / *Playfair Display*) paired with clean modern sans-serif body text (*Plus Jakarta Sans*).
- **Design Rhythm:** Generous whitespace, subtle delicate borders, restrained transitions, and high-fashion cake photography.

---

## 📁 Project Architecture

```
cake/
├── index.html                 # Editorial homepage (hero, collections, philosophy, gallery, bespoke banner, reviews, FAQ)
├── shop.html                  # Confectionery catalogue (search, filter pills, sorting, in-stock toggle, dynamic cards)
├── product.html               # Product details (image gallery, tier size price configurator, inscriptions, accordions)
├── bespoke.html               # Special Feature: Custom Cake Request Studio (interactive occasion, styling & flavor journey)
├── checkout.html              # Frictionless guest checkout (fulfillment choice, delivery address, 48h lead-time picker)
├── order-confirmation.html    # Order confirmation receipt with reference number and print functionality
├── admin.html                 # Protected Admin Portal (stats metrics, orders ledger, products CRUD, categories, Supabase setup)
├── admin/
│   └── index.html             # /admin route entry point
├── sql/
│   └── schema.sql             # Complete PostgreSQL Supabase database schema, RLS policies, and seed data
├── css/
│   ├── variables.css          # Design system tokens, typography scales, luxury color palette, elevations
│   ├── global.css             # CSS reset, responsive typography, container layouts, animations
│   ├── components.css         # Navigation, buttons, product cards, cart slide-over drawer, modals, toasts, footer
│   ├── home.css               # Hero banner, story collage, category showcase, gallery, testimonials, FAQ
│   ├── shop.css               # Catalog search bar, category pills, filter controls, product grid
│   ├── product.css            # Detail gallery, sizing options, custom inscription input, accordion tabs
│   ├── checkout.css           # Checkout form cards, fulfillment selector, order summary sidebar, receipt
│   ├── bespoke.css            # Interactive visual selection cards for custom cake commissions
│   └── admin.css              # Admin layout, sidebar, metrics cards, data tables, live status selectors
└── js/
    ├── config.js              # Supabase project URL, Anon Key, admin passkey, and business settings
    ├── data.js                # Initial seed data for categories, boutique cakes, sample orders & custom requests
    ├── supabase-client.js     # Supabase client wrapper with live API integration & resilient local store fallback
    ├── ui.js                  # Global UI helpers: Toast notifications, modals, drawer, formatting
    ├── cart.js                # Shopping cart manager with LocalStorage persistence & slide-over drawer
    ├── home.js                # Homepage dynamic loaders (featured products, categories, FAQ accordions)
    ├── shop.js                # Shop filtering, search debouncing, sorting, and dynamic grid rendering
    ├── product.js             # Product details parser, gallery thumbnail switcher, size price calculator
    ├── bespoke.js             # Custom cake request submission to Supabase `custom_requests` table
    ├── checkout.js            # Guest order placement to Supabase `orders` and `order_items` tables
    ├── order-confirmation.js  # Order confirmation receipt renderer & print controller
    └── admin.js               # Admin authentication, dashboard metrics, CRUD for products/categories, status updates
```

---

## ⚡ Quick Start / Local Development

To run the website locally on any web browser:

1. Open your terminal in the project directory:
   ```bash
   cd cake
   ```

2. Start a local HTTP server using Python:
   ```bash
   python -m http.server 8000
   ```

3. Open your browser and navigate to:
   - **Customer Boutique:** [http://localhost:8000](http://localhost:8000)
   - **The Collection / Shop:** [http://localhost:8000/shop.html](http://localhost:8000/shop.html)
   - **Bespoke Custom Cake Studio:** [http://localhost:8000/bespoke.html](http://localhost:8000/bespoke.html)
   - **Admin Management Portal:** [http://localhost:8000/admin.html](http://localhost:8000/admin.html) (or `http://localhost:8000/admin`)

---

## 🔑 Admin Portal & Protected Access

- **Admin URL:** `admin.html` (or click **Studio Admin** in the header / footer)
- **Demo Presentation Passkey:** `maison2026`

### Admin Capabilities:
- **Overview Dashboard:** Live metrics for Total Revenue, Total Orders, Pending Orders, Custom Inquiries, and Active Catalogue Products.
- **Orders Management:** Real-time orders ledger, line items view, customer delivery details, and live status dropdown (`New` &rarr; `Confirmed` &rarr; `Preparing` &rarr; `Ready` &rarr; `Delivered` &rarr; `Cancelled`).
- **Product Management:** Add new boutique cakes (name, price, category, image URL with live preview, tasting notes, portion guide, availability, featured status), edit existing products, delete products, and 1-click toggle availability (`In Stock`, `Pre-Order Only`, `Sold Out`).
- **Categories Management:** Create and organize boutique collections.
- **Custom Cake Inquiries:** Review personalized bespoke inquiries submitted by clients with event date, guest count, flavor palette, and design notes.
- **Supabase Backend Settings:** Input live Supabase project credentials with 1-click database seeding!

---

## 🗄️ Supabase Database Integration

The platform is designed to connect to your real Supabase project:

### Step 1: Execute SQL Schema
1. In your [Supabase Dashboard](https://supabase.com/dashboard), open your project.
2. Go to the **SQL Editor** tab.
3. Open `sql/schema.sql` from this repository, paste the entire SQL code, and click **Run**.
4. This creates:
   - `categories` table with RLS
   - `products` table with category relationships
   - `orders` table with status tracking
   - `order_items` table with product associations
   - `custom_requests` table for bespoke inquiries
   - Row Level Security (RLS) policies allowing public ordering & secure admin management
   - Rich initial seed data with high-res boutique photography!

### Step 2: Configure Keys in Admin Panel
1. Open the Admin Panel (`admin.html`) &rarr; Navigate to **Supabase Settings**.
2. Enter your **Supabase Project URL** and **Anon Public API Key**.
3. Click **Save & Connect Supabase**.
4. The status badge will switch to **Live Supabase Connected**!

*(Note: If you run the project without Supabase keys, it automatically functions with the built-in resilient local storage store so everything can be tested immediately.)*

---

## 🍰 Key User Journeys

1. **Browse & Discover:** Customers explore curated collections on the homepage or search/filter by category, price, and in-stock status on `shop.html`.
2. **Product Customization:** On `product.html`, customers choose tier sizing (6", 8", 2-Tier), customize edible cake plaque inscriptions, and view tasting notes.
3. **Frictionless Guest Ordering:** On `checkout.html`, customers choose between Soho studio pickup or courier delivery, select a delivery date (with 48h lead-time enforcement), and submit their order directly to Supabase.
4. **Bespoke Commissions:** On `bespoke.html`, clients submit custom tiered inquiries with visual occasion, guest count, and flavor preference cards.
5. **Studio Management:** The bakery owner manages orders, updates statuses, edits cake descriptions, and adjusts inventory from `admin.html`.
