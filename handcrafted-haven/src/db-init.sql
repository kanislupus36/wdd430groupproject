-- Create database
CREATE DATABASE handcrafted_haven;
-- Use the database
\ c handcrafted_haven;
-- Create users table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) CHECK (role IN ('seller', 'buyer')) NOT NULL
);
-- Create profiles table
CREATE TABLE profiles (
  profile_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  bio TEXT,
  profile_picture VARCHAR(255),
  social_links TEXT []
);
-- Create products table
CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  images TEXT []
);
-- Create reviews table
CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  rating INT CHECK (
    rating BETWEEN 1 AND 5
  ) NOT NULL,
  comment TEXT
);
-- Create orders table
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  buyer_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  seller_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'cancelled')) NOT NULL
);
-- Create order details table
CREATE TABLE order_details (
  order_detail_id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);
-- Insert sample users
INSERT INTO users (username, email, password, role)
VALUES (
    'artisan_anna',
    'anna@example.com',
    'hashed_password_1',
    'seller'
  ),
  (
    'crafty_carl',
    'carl@example.com',
    'hashed_password_2',
    'seller'
  ),
  (
    'buyer_ben',
    'ben@example.com',
    'hashed_password_3',
    'buyer'
  );
-- Insert sample profiles
INSERT INTO profiles (user_id, bio, profile_picture, social_links)
VALUES (
    1,
    'I am Anna, a passionate ceramic artisan.',
    'https://example.com/anna.jpg',
    ARRAY ['https://instagram.com/anna_ceramics']
  ),
  (
    2,
    'Carl creates handcrafted wooden furniture.',
    'https://example.com/carl.jpg',
    ARRAY ['https://facebook.com/carl_woodworks']
  );
-- Insert sample products
INSERT INTO products (
    user_id,
    title,
    description,
    price,
    category,
    images
  )
VALUES (
    1,
    'Ceramic Vase',
    'A beautiful handmade ceramic vase.',
    45.99,
    'Ceramics',
    ARRAY ['https://example.com/vase1.jpg']
  ),
  (
    2,
    'Oak Table',
    'Handcrafted solid oak table.',
    299.99,
    'Furniture',
    ARRAY ['https://example.com/table1.jpg']
  );
-- Insert sample reviews
INSERT INTO reviews (product_id, user_id, rating, comment)
VALUES (
    1,
    3,
    5,
    'Beautiful vase! Perfect for my living room.'
  ),
  (2, 3, 4, 'The table is sturdy and well-made.');
-- Insert sample orders
INSERT INTO orders (buyer_id, seller_id, total_amount, status)
VALUES (3, 1, 45.99, 'completed'),
  (3, 2, 299.99, 'pending');
-- Insert sample order details
INSERT INTO order_details (order_id, product_id, quantity, subtotal)
VALUES (1, 1, 1, 45.99),
  (2, 2, 1, 299.99);