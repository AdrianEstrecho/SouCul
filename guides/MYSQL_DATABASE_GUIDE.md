# SoulCul MySQL Database Guide

This guide defines the complete database schema for the SoulCul e-commerce platform.
Database: `soulcul`
MySQL Version: 8.0+

## 0. Initial Setup Commands

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS soulcul CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE soulcul;

-- Create database user (optional but recommended)
CREATE USER 'soulcul_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON soulcul.* TO 'soulcul_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 1. Users Table (Customers)

Stores customer account information.

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  profile_image_url VARCHAR(500),
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP NULL,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_created_at (created_at),
  INDEX idx_is_active (is_active)
);
```

---

## 2. Admins Table (Shop Owners/Sellers)

Stores admin/seller account information.

```sql
CREATE TABLE admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(155) NOT NULL,
  phone VARCHAR(20),
  role ENUM('super_admin', 'shop_owner', 'inventory_manager') DEFAULT 'shop_owner',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP NULL,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_is_active (is_active)
);
```

---

## 3. Locations Table

Stores Philippine destination/location information.

```sql
CREATE TABLE locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  featured_image_url VARCHAR(500),
  region VARCHAR(100),
  province VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_slug (slug),
  INDEX idx_is_active (is_active),
  INDEX idx_display_order (display_order)
);
```

**Sample Data:**
```sql
INSERT INTO locations (name, slug, region, province, is_active, display_order) VALUES
('Vigan', 'vigan', 'Ilocos Region', 'Ilocos Sur', true, 1),
('Baguio', 'baguio', 'Cordillera Administrative Region', 'Benguet', true, 2),
('Boracay', 'boracay', 'Western Visayas', 'Aklan', true, 3),
('Tagaytay', 'tagaytay', 'Calabarzon', 'Cavite', true, 4),
('Bohol', 'bohol', 'Central Visayas', 'Bohol', true, 5);
```

---

## 4. Categories Table

Stores product category information.

```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  featured_image_url VARCHAR(500),
  parent_category_id INT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (parent_category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_parent_category_id (parent_category_id),
  INDEX idx_is_active (is_active),
  INDEX idx_display_order (display_order)
);
```

**Sample Data:**
```sql
INSERT INTO categories (name, slug, display_order, is_active) VALUES
('Clothes', 'clothes', 1, true),
('Decorations', 'decorations', 2, true),
('Delicacies', 'delicacies', 3, true),
('Handicrafts', 'handicrafts', 4, true),
('Homeware', 'homeware', 5, true);
```

---

## 5. Products Table

Stores product information tied to locations and categories.

```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  long_description LONGTEXT,
  sku VARCHAR(100),
  location_id INT NOT NULL,
  category_id INT NOT NULL,
  admin_id INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  quantity_in_stock INT NOT NULL DEFAULT 0,
  featured_image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  rating_count INT DEFAULT 0,
  rating_average DECIMAL(3, 2) DEFAULT 0.00,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (location_id) REFERENCES locations(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (admin_id) REFERENCES admins(id),
  INDEX idx_slug (slug),
  INDEX idx_location_id (location_id),
  INDEX idx_category_id (category_id),
  INDEX idx_admin_id (admin_id),
  INDEX idx_is_active (is_active),
  INDEX idx_is_featured (is_featured),
  INDEX idx_price (price)
);
```

---

## 6. Product Images Table

Stores multiple images per product.

```sql
CREATE TABLE product_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id),
  INDEX idx_display_order (display_order)
);
```

---

## 7. Cart Items Table

Stores items in user shopping carts.

```sql
CREATE TABLE cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id),
  INDEX idx_user_id (user_id),
  INDEX idx_product_id (product_id)
);
```

---

## 8. Orders Table

Stores customer orders.

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  subtotal DECIMAL(12, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  
  -- Shipping address
  shipping_address VARCHAR(500) NOT NULL,
  shipping_city VARCHAR(100) NOT NULL,
  shipping_province VARCHAR(100) NOT NULL,
  shipping_postal_code VARCHAR(20),
  shipping_phone VARCHAR(20),
  
  -- Billing address (optional, same as shipping if not provided)
  billing_address VARCHAR(500),
  billing_city VARCHAR(100),
  billing_province VARCHAR(100),
  billing_postal_code VARCHAR(20),
  
  customer_notes TEXT,
  admin_notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP NULL,
  shipped_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  cancelled_at TIMESTAMP NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_order_number (order_number),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
```

---

## 9. Order Line Items Table

Stores individual products within an order.

```sql
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
);
```

---

## 10. Payments Table

Stores payment/transaction information for orders.

```sql
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL UNIQUE,
  payment_method ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'gcash', 'cod') NOT NULL,
  payment_status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  transaction_id VARCHAR(255),
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'PHP',
  
  -- Payment gateway reference
  gateway_reference VARCHAR(255),
  gateway_response TEXT,
  
  processed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_payment_status (payment_status),
  INDEX idx_transaction_id (transaction_id)
);
```

---

## 11. Product Reviews Table

Stores customer reviews and ratings for products.

```sql
CREATE TABLE product_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  order_item_id INT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE SET NULL,
  UNIQUE KEY unique_user_product_review (product_id, user_id),
  INDEX idx_product_id (product_id),
  INDEX idx_user_id (user_id),
  INDEX idx_rating (rating),
  INDEX idx_is_active (is_active),
  INDEX idx_created_at (created_at)
);
```

---

## 12. Wishlist Table

Stores user favorite/wishlist products.

```sql
CREATE TABLE wishlists (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product_wishlist (user_id, product_id),
  INDEX idx_user_id (user_id),
  INDEX idx_product_id (product_id)
);
```

---

## 13. Audit/Activity Log Table

Tracks important system actions for auditing.

```sql
CREATE TABLE activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  admin_id INT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  description TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_admin_id (admin_id),
  INDEX idx_action (action),
  INDEX idx_entity_type (entity_type),
  INDEX idx_created_at (created_at)
);
```

---

## 14. Settings Table

Stores global application configuration.

```sql
CREATE TABLE settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value LONGTEXT,
  description TEXT,
  data_type ENUM('string', 'integer', 'boolean', 'json') DEFAULT 'string',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_setting_key (setting_key)
);
```

**Sample Data:**
```sql
INSERT INTO settings (setting_key, setting_value, data_type) VALUES
('tax_rate', '12', 'string'),
('shipping_cost_base', '50', 'string'),
('free_shipping_threshold', '1000', 'string'),
('currency', 'PHP', 'string'),
('company_email', 'info@soulcul.com', 'string');
```

---

## 15. Relationships Diagram (Text Summary)

```
users
  ├── cart_items (user_id)
  ├── orders (user_id)
  ├── product_reviews (user_id)
  └── wishlists (user_id)

admins
  └── products (admin_id)

products
  ├── product_images (product_id)
  ├── product_reviews (product_id)
  ├── cart_items (product_id)
  ├── order_items (product_id)
  ├── wishlists (product_id)
  ├── location_id → locations
  └── category_id → categories

orders
  ├── order_items (order_id)
  ├── payments (order_id)
  └── user_id → users

locations
  └── products (location_id)

categories
  └── products (category_id)
```

---

## 16. Data Types Reference

| Data Type | Usage |
|-----------|-------|
| INT | IDs, counts, integer values |
| VARCHAR(n) | Short strings (emails, names, URLs) |
| TEXT | Medium-length content (descriptions) |
| LONGTEXT | Long content (product descriptions) |
| DECIMAL(10,2) | Money (price = 10 digits, 2 decimals) |
| DECIMAL(3,2) | Ratings (3 digits, 2 decimals: 0.00 to 9.99) |
| BOOLEAN | true/false flags |
| ENUM | Fixed set of values |
| TIMESTAMP | Auto date/time tracking |

---

## 17. Indexing Strategy

**Already indexed:**
- Primary keys (id)
- Foreign keys
- Frequently searched fields (email, slug, status)
- Sorting fields (created_at, display_order)
- Filter fields (is_active, is_featured)

**Consider adding if slow queries occur:**
```sql
-- Search optimization
CREATE INDEX idx_products_full_text ON products(name, description);
CREATE INDEX idx_order_user_status ON orders(user_id, status);
CREATE INDEX idx_product_location_category ON products(location_id, category_id);
```

---

## 18. Common Queries

### Get all products by location and category
```sql
SELECT p.* FROM products p
WHERE p.location_id = ? AND p.category_id = ? AND p.is_active = true;
```

### Get user cart total
```sql
SELECT SUM(ci.quantity * p.price) as cart_total
FROM cart_items ci
JOIN products p ON ci.product_id = p.id
WHERE ci.user_id = ?;
```

### Get order with items
```sql
SELECT o.*, oi.product_id, oi.product_name, oi.quantity, oi.unit_price
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.order_number = ?;
```

### Calculate product rating
```sql
UPDATE products
SET rating_average = (
  SELECT AVG(rating) FROM product_reviews 
  WHERE product_id = ? AND is_active = true
),
rating_count = (
  SELECT COUNT(*) FROM product_reviews 
  WHERE product_id = ? AND is_active = true
)
WHERE id = ?;
```

---

## 19. Backup & Maintenance

### Regular Backups
```bash
# Backup database
mysqldump -u root -p soulcul > soulcul_backup_$(date +%Y%m%d).sql

# Restore from backup
mysql -u root -p soulcul < soulcul_backup_20260331.sql
```

### Table Maintenance
```sql
-- Optimize tables (monthly)
OPTIMIZE TABLE products, users, orders, payments;

-- Check table integrity
CHECK TABLE users, products, orders;
```

---

## 20. Environment Variables for Backend

Add these to your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=soulcul
DB_USERNAME=soulcul_user
DB_PASSWORD=your_secure_password

# Connection pool settings (if using)
DB_POOL_MIN=2
DB_POOL_MAX=10
```

---

## 21. Design Notes & Considerations

1. **Timestamps**: All tables use UTC TIMESTAMP with `DEFAULT CURRENT_TIMESTAMP` for consistency with API contract (ISO 8601).

2. **Soft Deletes**: Not implemented by default. Use `is_active` flags instead. If needed, add `deleted_at TIMESTAMP NULL` to any table.

3. **Inventory**: `quantity_in_stock` in products table allows simple inventory management. For advanced stock tracking, consider a separate `inventory_transactions` table.

4. **Order Numbers**: Generated as unique strings (e.g., "ORD-20260331-001"). Application responsible for generation logic.

5. **Discounts**: Currently stored as `discount_price` on products and `discount_amount` on orders. For advanced promotions (coupon codes), add a `promotions` table.

6. **User Roles**: Currently customers (users table) and admins (admins table) are separate. Users table can be extended with admin role if needed for unified user management.

7. **Payment Gateway**: `gateway_response` can store JSON from payment providers. Keep sensitive data (API keys) in `.env`, never in database.

8. **Reviews**: `is_verified_purchase` helps display badge. Consider adding `verified_purchase_order_id` foreign key for strict verification.

---

## 22. Next Steps for Backend Dev

1. Run all CREATE TABLE statements to initialize database
2. Add sample data to locations and categories
3. Create PHP models/entities for each table
4. Build repository/DAO layer for database queries
5. Create migrations system (optional but recommended for version control)
6. Set up connection pooling and query optimization
7. Implement audit logging for product and order changes

