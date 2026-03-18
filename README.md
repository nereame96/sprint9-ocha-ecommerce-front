# Ocha

A premium Japanese tea e-commerce platform featuring a custom tea builder, shopping cart, and interactive boutique locator.

## Table of Contents

1. [Overview](#1-overview)
2. [Key Features](#2-key-features)
3. [Tech Stack](#3-tech-stack)
4. [Getting Started](#4-getting-started)
5. [Project Structure](#5-project-structure)
6. [Authentication Flow](#6-authentication-flow)
7. [API Endpoints](#7-api-endpoints)
8. [Tea Bases & Ingredients](#8-tea-bases--ingredients)
9. [Testing](#9-testing)
10. [Map Integration](#10-map-integration)
11. [Custom Tea Builder](#11-custom-tea-builder)
12. [Cart & Checkout](#12-cart--checkout)
13. [Security Features](#13-security-features)
14. [Decisions and Justifications](#15-decisions-and-justifications)
15. [Project Screenshots](#16-project-screenshots)
16. [Demo](#17-demo)
17. [Team](#18-team)
18. [License](#19-license)

## 1. Overview

Ocha is a full-stack e-commerce application that enables users to discover premium Japanese teas, create their own custom blends, and manage their purchases. Users can locate physical boutiques on an interactive map, build custom teas with real-time price calculation, and process payments through a simulated Stripe checkout.

## 2. Key Features

* **User Authentication:** Secure JWT-based registration and login with bcrypt password hashing.
* **Product Catalog:** Browse premium tea products.
* **Custom Tea Builder:** Interactive tool to select base, ingredients, and size with real-time intensity and price calculations.
* **Shopping Cart:** State management using Angular Signals for seamless additions and updates.
* **Checkout & Payments:** Order payload generation and Stripe payment gateway simulation.
* **Interactive Map:** Leaflet-powered map with store markers, custom popups, and synchronized list highlighting.
* **Global Notifications:** Custom Toast service replacing native browser alerts for a premium UI experience.
* **Responsive Design:** Minimalist, mobile-first design using Tailwind CSS v4.

## 3. Tech Stack

**Frontend**
* Angular 21 with Signals for reactive state management
* Tailwind CSS v4 for styling
* Leaflet for interactive maps
* Vitest for testing

**Backend**
* NestJS framework with TypeScript
* MongoDB with Mongoose ODM
* JWT authentication with Passport
* class-validator for DTO validation
* bcrypt for password security
* Stripe API for payment simulation
* Swagger for API documentation

## 4. Getting Started

### Prerequisites

* Node.js (v18+)
* MongoDB (local or Atlas cluster)
* npm
* Stripe Account (for payment simulation)

### Backend Setup

```bash
cd backend
npm install
```

### Create .env file:
```
MONGODB_URI=mongodb+srv://[YOUR-CONNECTION-STRING]
PORT=3000
JWT_SECRET=[YOUR-SECRET-KEY]
JWT_EXPIRATION_TIME=3600s
STRIPE_SECRET_KEY=[YOUR-STRIPE-KEY]
```
### Start the server:
```bash
npm run start:dev
```
* API available at http://localhost:3000

* Swagger docs at http://localhost:3000/api-docs


### Frontend Setup

```bash
cd frontend
npm install
ng serve
```
Application available at http://localhost:4200


## 5. Project Structure
```
backend/
├── src/
│   ├── auth/           # JWT authentication & guards
│   ├── users/          # User management
│   ├── products/       # Standard products CRUD
│   ├── custom-teas/    # Custom tea creation logic
│   ├── orders/         # Order processing & Stripe integration
│   └── store-locations/# Physical boutiques data
│
frontend/
└── src/app/
    ├── core/
    │   ├── services/   # API services (cart, custom-tea, orders, map, toast)
    │   ├── models/     # TypeScript interfaces (Product, CartItem, Order...)
    │   └── enums/      # Base, Ingredients, Size enums
    ├── auth/       # Login & Registration
    ├── user/       # Order-history, profile-info & user-profile
    ├── products/   # Catalog & Product detail
    ├── custom-tea/ # Interactive builder component
    ├── cart/       # Cart sidebar/view
    ├── checkout/   # Delivery form & payment redirection
    ├── checkout-succes/   # Create order & confirm
    │── store-locations/     # Map and locations list
    └── layout/         # Home, Navbar & Footer

```

## 6. Authentication Flow

* User registers with email and password.
* Password is hashed using bcrypt.
* User logs in and receives a JWT token.
* Token stored in localStorage and sent via Authorization header.
* Auth Guards protect routes requiring authentication (e.g., checkout).

## 7. API Endpoints

### Authentication

* POST /auth/register - Register new user
* POST /auth/login - Login and receive JWT token

### Products & Teas

* GET /products - Get all standard products
* POST /custom-teas - Create and save a custom tea blend

### Orders & Checkout

* POST /orders/create-checkout-session - Initialize Stripe session
* POST /orders - Save completed order to database

### Store Locations

* GET /store-locations - Get all physical boutiques coordinates

## 8. Tea Bases & Ingredients

**Bases:** Matcha, Sencha, Gyokuro, Hojicha

**Ingredients (Max 4):** Lemon, Cardamomo, Ginger, Jasmine

**Sizes:** 50g, 100g, 250g

## 9. Testing

### Backend Tests

```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
Frontend Tests
```
```bash
cd frontend
npm run test          # Vitest tests
```

## 10. Map Integration

* Leaflet with OpenStreetMap tiles.
* Custom markers for physical boutiques.
* Bidirectional communication: Clicking a list item flies to the marker; clicking a marker highlights the store in the list.

## 11. Custom Tea Builder

* Interactive form using Angular Signals.
* Real-time calculation of total price based on base, ingredients, and size.
* Algorithm to calculate the tea's final intensity depending on selected elements.
* Validation for maximum ingredients limit (4).

## 12. Cart & Checkout

* Centralized CartService using Signals for reactivity.
* Handles both standard products and dynamically generated custom teas.
* Form validation for delivery address.
* Redirection to Stripe for secure payment simulation.

## 13. Security Features

* Password hashing with bcrypt.
* JWT token-based authentication.
* Stripe Checkout integration to avoid handling sensitive card data.
* CORS configuration for frontend-backend communication.
* Input validation with class-validator in NestJS.

## 14. Decisions and Justifications

### Architecture Decisions

* **Angular Signals over RxJS:** We chose Angular 21's Signals for state management (especially in the Cart and Custom Tea builder) to simplify reactivity and reduce boilerplate compared to traditional RxJS observables.
* **NestJS for Backend:** Selected for its TypeScript-first approach and modular architecture, creating consistency with Angular's patterns.
* **MongoDB over SQL:** Chosen for its flexible schema, ideal for an e-commerce where cart items can be either static products or highly dynamic custom teas.

### Technical Decisions

* **Tailwind CSS v4:** Upgraded to the latest Tailwind version to use native CSS variables (@theme) and reduce configuration files, accelerating the styling of the minimalist UI.
* **Custom Toast Service:** Replaced native browser alerts with a global Toast component managed by Signals to maintain the premium, uninterrupted feel of the brand.
* **Stripe Checkout:** Delegated payment processing entirely to Stripe's hosted checkout to guarantee security without managing complex PCI compliance.

## 15. Project Screenshots
### Homepage & Catalog:
 ![Home Catalog](https://res.cloudinary.com/daz3fkmg9/image/upload/v1773824260/catalog_wyu3ei.gif)
### Custom Tea Builder: 
![Custom Tea](https://res.cloudinary.com/daz3fkmg9/image/upload/v1773769115/custom-tea_arvbxk.gif )
### Map & Store Locator: 
![Map](https://res.cloudinary.com/daz3fkmg9/image/upload/v1773824614/map_jimyrh.gif)
### Checkout & Stripe: 
![Checkout](https://res.cloudinary.com/daz3fkmg9/image/upload/v1773766933/checkout_gwwcqk.gif)

## 16. Demo

Access the live demo: [Ocha Ecommerce Link](https://sprint9-ocha-ecommerce-front.vercel.app/)

### Test Credentials:

* Username: demo
* Password: demo123 

## 17. Author

Developed as an individual learning project demonstrating full-stack development skills with modern frameworks and best practices.

[Nerea Medina Carrasco Github](https://github.com/nereame96)


## 18. License
Educational project - created for learning purposes.
