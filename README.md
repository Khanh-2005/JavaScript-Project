# E-Commerce Website

A simple, full-featured e-commerce web application built with Node.js, Express, EJS and MySQL. It includes product management, shopping cart, checkout, user authentication, order management, and an admin dashboard.

---

## 📁 Project Structure

- `app.js` - Application entry point
- `config/` - Configuration and database setup
- `controllers/` - Route controllers
- `models/` - Sequelize models
- `migrations/` - Database migrations
- `seeders/` - Seed data
- `routes/` - Express route definitions
- `views/` - EJS templates
- `public/` - Static assets and uploads

## 🚀 Features

- User registration and login (authentication)
- Product listing, create/edit/delete (admin)
- Shopping cart and checkout flow
- Order history and order detail pages
- File uploads for product images (stored in `public/uploads/products`)
- Admin dashboard for managing products, categories and orders
- Sequelize migrations & seeders for database setup

## 🧰 Tech Stack

- Node.js
- Express.js
- EJS (templating)
- MySQL (database)
- Sequelize (ORM)

## ⚙️ Getting Started

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd E_Commerce
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the database connection in `config/config.json` (or set environment variables as needed).

4. Run migrations and seeders (requires Sequelize CLI):

   ```bash
   npx sequelize db:migrate
   npx sequelize db:seed:all
   ```

5. Start the application:

   ```bash
   npm start
   ```

6. Open your browser at `http://localhost:3000` (or the port defined in your environment).

## 🔒 Environment Variables

Recommended variables (set in your environment or a .env file):

- `PORT` - Server port (default: 3000)
- `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST` - MySQL connection details
