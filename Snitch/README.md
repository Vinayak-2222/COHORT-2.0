# SNITCH --- Full-Stack E-Commerce Platform

```{=html}
<p align="center">
```
A production-inspired full-stack fashion commerce platform with buyer
and seller workflows, product variants, inventory-aware cart management,
secure authentication, and Razorpay test-mode payment integration.
```{=html}
</p>
```
```{=html}
<p align="center">
```
`<strong>`{=html}React · Redux Toolkit · Node.js · Express.js · MongoDB
· Mongoose · Razorpay`</strong>`{=html}
```{=html}
</p>
```

------------------------------------------------------------------------

## Overview

**SNITCH** is a full-stack e-commerce application built to model a
realistic online fashion shopping workflow. The project covers the
complete journey from account creation and product discovery to variant
selection, cart management, checkout, payment processing, and order
confirmation.

The application also includes a seller workflow for creating products,
managing product variants, assigning variant-specific attributes,
prices, images, and stock quantities.

The project follows a feature-oriented frontend architecture and a
layered backend architecture with separate controllers, data-access
objects, services, validators, middleware, routes, and database models.

## Highlights

-   End-to-end buyer journey from authentication to successful payment
-   Separate seller workflow for product creation and inventory
    management
-   Product variants with dynamic attributes such as color and size
-   Variant-level image, stock, and price handling
-   Persistent server-side cart with quantity increment, decrement, and
    removal
-   Inventory-aware cart behavior and price comparison feedback
-   Razorpay Checkout integration in test mode
-   Payment records with `pending` and `paid` lifecycle states
-   Protected routes and authentication middleware
-   Google sign-in UI integration
-   Redux Toolkit state management with feature-specific slices
-   Reusable custom hooks and API service modules
-   Backend validation layer for auth, products, and cart operations
-   Layered backend separation using routes, controllers, DAOs,
    services, and models
-   Responsive editorial fashion-store interface

------------------------------------------------------------------------

## Application Flow

``` text
User Registration / Login
          │
          ▼
     Product Catalog
          │
          ▼
   Product Detail Page
          │
          ▼
   Select Product Variant
     (Color / Size / Price)
          │
          ▼
       Add to Cart
          │
          ▼
 Increment / Decrement / Remove
          │
          ▼
   Create Payment Order
          │
          ▼
    Razorpay Checkout
          │
     ┌────┴────┐
     │         │
  Failure    Success
     │         │
     │         ▼
     │   Payment Verification
     │         │
     │         ▼
     │    Status → Paid
     │         │
     └────► Order Success Page
```

------------------------------------------------------------------------

## Core Features

### Authentication

SNITCH provides account registration and login flows backed by
server-side validation and protected application routes.

Key capabilities include:

-   User registration
-   User login
-   Authenticated route protection
-   Authentication middleware on protected backend endpoints
-   Client-side auth state managed through Redux Toolkit
-   Reusable `useAuth` hook
-   Google authentication UI component

### Product Catalog and Product Details

Buyers can browse products and open detailed product pages containing
product information, imagery, and available variants.

The product module supports:

-   Product catalog browsing
-   Detailed product pages
-   Product image galleries
-   Product-specific variants
-   Dynamic variant attributes
-   Variant-specific prices
-   Variant-specific stock
-   Variant-specific images

### Seller Product Management

The seller-facing workflow allows products and inventory variations to
be created and managed separately from the buyer experience.

Seller capabilities include:

-   Create new products
-   Access seller dashboard
-   View seller-specific product details
-   Add new product variants
-   Define flexible key/value attributes
-   Set initial stock
-   Set optional variant-level pricing
-   Upload multiple variant images
-   Review current stock for each variant

A variant can represent combinations such as:

``` text
Color: Brown
Size: M
Stock: 100
Price: ₹838
```

This design allows the product model to support flexible catalog
structures instead of hard-coding a single attribute combination.

### Cart Management

The cart is persisted through the backend and synchronized with frontend
state.

Supported operations include:

-   Add a selected product variant to the cart
-   Increment quantity
-   Decrement quantity
-   Remove an item
-   Display cart item count in navigation
-   Calculate subtotal and total
-   Display available stock
-   Show price difference messaging
-   Preserve variant attributes in cart items

### Payment Workflow

SNITCH integrates **Razorpay Checkout** in test mode to demonstrate a
complete payment lifecycle.

The payment workflow is:

1.  Buyer proceeds to checkout.
2.  Backend creates a payment record and Razorpay order.
3.  Payment starts with a `pending` state.
4.  Razorpay Checkout is opened on the frontend.
5.  The buyer completes a test payment.
6.  Successful payment data is processed by the application.
7.  The payment record is updated to `paid`.
8.  The buyer is redirected to the order success experience.

Payment records store the user, order items, pricing information,
Razorpay-related data, and payment status.

> This repository should never contain real Razorpay secrets or other
> private credentials. Use environment variables and test credentials
> for local development.

------------------------------------------------------------------------

## Architecture

### Frontend Architecture

The frontend uses a **feature-based architecture**. Authentication,
cart, and product domains each own their pages, hooks, API services, and
Redux state.

``` text
Frontend/
├── public/
└── src/
    ├── app/
    │   ├── App.css
    │   ├── App.jsx
    │   ├── app.routes.jsx
    │   ├── app.store.js
    │   └── AppLayout.jsx
    │
    ├── features/
    │   ├── auth/
    │   │   ├── components/
    │   │   │   ├── ContinueWithGoogle.jsx
    │   │   │   └── Protected.jsx
    │   │   ├── hook/
    │   │   │   └── useAuth.js
    │   │   ├── pages/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── service/
    │   │   │   └── auth.api.js
    │   │   └── state/
    │   │       └── auth.slice.js
    │   │
    │   ├── cart/
    │   │   ├── hook/
    │   │   │   └── useCart.js
    │   │   ├── pages/
    │   │   │   ├── Cart.jsx
    │   │   │   └── OrderSuccess.jsx
    │   │   ├── service/
    │   │   │   └── cart.api.js
    │   │   └── state/
    │   │       └── cart.slice.js
    │   │
    │   ├── products/
    │   │   ├── hooks/
    │   │   │   └── useProduct.js
    │   │   ├── pages/
    │   │   │   ├── CreateProduct.jsx
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── Home.jsx
    │   │   │   ├── ProductDetail.jsx
    │   │   │   └── SellerProductDetails.jsx
    │   │   ├── service/
    │   │   │   └── product.api.js
    │   │   └── state/
    │   │       └── product.slice.js
    │   │
    │   └── Shared/
    │       └── Components/
    │           └── Nav.jsx
    │
    └── main.jsx
```

### Backend Architecture

The backend follows a layered structure to keep HTTP handling, business
logic, persistence, validation, and external integrations separated.

``` text
Backend/
├── src/
│   ├── config/
│   │   ├── config.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── cart.controller.js
│   │   └── product.controller.js
│   │
│   ├── dao/
│   │   ├── cart.dao.js
│   │   └── product.dao.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── cart.model.js
│   │   ├── payment.model.js
│   │   ├── price.schema.js
│   │   ├── product.model.js
│   │   └── user.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── cart.routes.js
│   │   └── product.routes.js
│   │
│   ├── services/
│   │   ├── payment.service.js
│   │   └── storage.service.js
│   │
│   ├── validator/
│   │   ├── auth.validator.js
│   │   ├── cart.validator.js
│   │   └── product.validator.js
│   │
│   └── app.js
│
├── server.js
├── package.json
└── .env
```

### Request Lifecycle

``` text
Client Request
      │
      ▼
     Route
      │
      ▼
   Validator
      │
      ▼
 Auth Middleware
  (when required)
      │
      ▼
   Controller
      │
      ▼
 DAO / Service Layer
      │
      ▼
 Mongoose Model / External Service
      │
      ▼
    MongoDB / Razorpay
```

------------------------------------------------------------------------

## Tech Stack

  Layer              Technologies
  ------------------ ----------------------------------------------
  Frontend           React, Vite, JavaScript
  State Management   Redux Toolkit
  Routing            React Router
  Backend            Node.js, Express.js
  Database           MongoDB
  ODM                Mongoose
  Authentication     Protected routes and backend auth middleware
  Payments           Razorpay Checkout
  Architecture       Feature-based frontend, layered backend
  Validation         Dedicated request validator modules
  Version Control    Git and GitHub

------------------------------------------------------------------------

## Data Model Overview

The application is organized around four primary business entities:

``` text
User
 │
 ├── owns / manages ──► Product
 │                       │
 │                       └── Variants
 │                           ├── Attributes
 │                           ├── Images
 │                           ├── Price
 │                           └── Stock
 │
 ├── owns ────────────► Cart
 │                       └── Cart Items
 │                           ├── Product Reference
 │                           ├── Variant Selection
 │                           └── Quantity
 │
 └── owns ────────────► Payment
                         ├── Order Items
                         ├── Price
                         ├── Razorpay Data
                         └── Status
```

------------------------------------------------------------------------

## Getting Started

### Prerequisites

Make sure the following are installed:

-   Node.js
-   npm
-   MongoDB, either locally or through a hosted MongoDB connection
-   Git
-   Razorpay test-mode account credentials for payment testing

### 1. Clone the repository

``` bash
git clone <your-repository-url>
cd SNITCH
```

### 2. Install backend dependencies

``` bash
cd Backend
npm install
```

### 3. Configure backend environment variables

Create a `.env` file inside the `Backend` directory.

``` env
PORT=3000
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret

# Razorpay test credentials
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret

# Add storage provider variables required by storage.service.js
```

> Environment variable names can be adjusted to match the names used in
> your local `config.js`. Never commit `.env` files or real credentials.

### 4. Start the backend

``` bash
npm run dev
```

If your backend package uses a different script, use the corresponding
command defined in `Backend/package.json`.

### 5. Install frontend dependencies

Open another terminal:

``` bash
cd Frontend
npm install
```

### 6. Configure frontend environment variables

Create a `.env` file inside the `Frontend` directory if required by your
API configuration.

``` env
VITE_API_BASE_URL=http://localhost:3000
VITE_RAZORPAY_KEY_ID=your_test_key_id
```

### 7. Start the frontend

``` bash
npm run dev
```

Open the local URL printed by Vite in the terminal.

------------------------------------------------------------------------

## Key Engineering Decisions

### Feature-Based Frontend Organization

Instead of placing every component, hook, service, and state file in
global folders, SNITCH groups code by business domain. This keeps
authentication, cart, and product logic easier to navigate and extend.

### DAO Layer for Persistence Logic

Cart and product database operations are separated into DAO modules.
Controllers can focus on HTTP request/response behavior while
persistence concerns remain isolated.

### Dedicated Service Layer

Payment processing and storage operations are placed in service modules.
This avoids coupling external integrations directly to route handlers.

### Variant-Level Inventory

Inventory is handled at the variant level rather than only at the
product level. This is important in fashion commerce, where combinations
such as color and size can have independent pricing, imagery, and stock.

### Centralized Client State

Redux Toolkit slices manage authentication, cart, and product state.
Custom hooks provide a cleaner interface between UI components and
application state/API operations.

------------------------------------------------------------------------

## Security Notes

-   Keep `.env` files outside version control.
-   Never expose Razorpay secret keys in frontend code.
-   Use test-mode payment credentials during development.
-   Protect seller and authenticated endpoints on the server, not only
    in the UI.
-   Validate request payloads before controller execution.
-   Verify payment authenticity on the backend before treating an order
    as paid.
-   Use strong secrets and production-safe cookie/token settings before
    deployment.
-   Restrict CORS to trusted production origins when deploying.

------------------------------------------------------------------------

## What This Project Demonstrates

SNITCH demonstrates practical understanding of:

-   Full-stack JavaScript application development
-   REST API design and integration
-   Authentication and protected application flows
-   MongoDB document modeling and Mongoose relationships
-   Flexible product variant and inventory modeling
-   Persistent cart state and quantity operations
-   Payment gateway integration
-   External service separation
-   Redux Toolkit state management
-   Custom React hooks
-   Feature-oriented frontend architecture
-   Layered backend architecture
-   Request validation and middleware design
-   End-to-end debugging across frontend, backend, database, and payment
    systems

------------------------------------------------------------------------

## Future Improvements

Potential production-oriented extensions include:

-   Payment signature verification hardening and webhook-based
    reconciliation
-   Order history and detailed order tracking
-   Seller analytics and revenue dashboard
-   Search, filtering, sorting, and pagination
-   Product reviews and ratings
-   Wishlist functionality
-   Coupon and promotion engine
-   Address book and shipping provider integration
-   Email and SMS order notifications
-   Automated unit, integration, and end-to-end tests
-   Dockerized local development and CI/CD deployment pipeline
-   Role-based authorization with explicit buyer, seller, and admin
    permissions

------------------------------------------------------------------------

## Project Status

**Completed --- core full-stack e-commerce workflow is functional.**

The implemented flow covers authentication, product creation, product
variants, inventory, product discovery, cart operations, Razorpay test
payments, payment status persistence, and order success handling.

------------------------------------------------------------------------

## Author

**Vinayak S. Tatti**

B.Tech Computer Science and Engineering --- Data Science\
CMR University

This project was built as a placement-focused full-stack engineering
project to demonstrate end-to-end ownership of application architecture,
frontend development, backend API design, database modeling, state
management, and payment integration.

------------------------------------------------------------------------

```{=html}
<p align="center">
```
`<strong>`{=html}SNITCH`</strong>`{=html}`<br/>`{=html} Full-Stack
E-Commerce Platform
```{=html}
</p>
```
