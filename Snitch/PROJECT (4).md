# SNITCH --- Full-Stack E-Commerce Platform

![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black)
![Redux
Toolkit](https://img.shields.io/badge/Redux_Toolkit-State_Management-764ABC?logo=redux&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-REST_API-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000?logo=mongoose&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C2451)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?logo=vite&logoColor=white)

------------------------------------------------------------------------

## Table of Contents

1.  [Executive Summary](#1-executive-summary)
2.  [Project Objectives](#2-project-objectives)
3.  [High-Level Architecture](#3-high-level-architecture)
4.  [Frontend Architecture](#4-frontend-architecture)
5.  [Backend Architecture](#5-backend-architecture)
6.  [Authentication Module](#6-authentication-module)
7.  [Product and Inventory Module](#7-product-and-inventory-module)
8.  [Cart Module](#8-cart-module)
9.  [Payment Workflow](#9-payment-workflow)
10. [Data Model Design](#10-data-model-design)
11. [Application Workflows](#11-application-workflows)
12. [Project Structure](#12-project-structure)
13. [Technology Stack](#13-technology-stack)
14. [Developer Setup](#14-developer-setup)
15. [Environment Configuration](#15-environment-configuration)
16. [API Design Overview](#16-api-design-overview)
17. [Validation and Error Handling](#17-validation-and-error-handling)
18. [Security Considerations](#18-security-considerations)
19. [Engineering Decisions](#19-engineering-decisions)
20. [Development Journey](#20-development-journey)
21. [Testing Strategy](#21-testing-strategy)
22. [Known Limitations](#22-known-limitations)
23. [Future Roadmap](#23-future-roadmap)
24. [Placement-Relevant Engineering
    Skills](#24-placement-relevant-engineering-skills)
25. [Project Status](#25-project-status)
26. [Author](#26-author)

------------------------------------------------------------------------

## 1. Executive Summary

**SNITCH** is a full-stack fashion e-commerce platform built to
implement a realistic buyer and seller workflow using the MERN
ecosystem.

The application covers the complete commerce journey:

``` text
Authentication
      ↓
Product Discovery
      ↓
Product Detail & Variant Selection
      ↓
Add to Cart
      ↓
Quantity Management
      ↓
Checkout
      ↓
Razorpay Payment
      ↓
Payment Status Update
      ↓
Order Success
```

The system supports product creation, flexible product variants,
variant-specific stock and pricing, persistent cart management, quantity
increment/decrement operations, item removal, checkout, and Razorpay
test-mode payment processing.

The project was designed as a placement-focused full-stack engineering
project. Its purpose is not only to demonstrate UI development, but also
backend architecture, database modeling, state management, API
integration, payment workflows, validation, authentication, and
separation of concerns.

### Core Value Proposition

SNITCH demonstrates how the different layers of a modern e-commerce
application work together:

-   React renders the user experience.
-   Redux Toolkit manages shared client state.
-   API service modules communicate with the backend.
-   Express routes receive HTTP requests.
-   Validators protect API boundaries.
-   Authentication middleware protects restricted operations.
-   Controllers coordinate request handling.
-   DAOs isolate database access.
-   Services manage external integrations.
-   Mongoose models define application data.
-   MongoDB persists users, products, carts, and payments.
-   Razorpay handles the payment checkout experience.

------------------------------------------------------------------------

## 2. Project Objectives

The main objectives of SNITCH were:

-   Build an end-to-end e-commerce application rather than an isolated
    frontend.
-   Design separate buyer and seller workflows.
-   Model products with flexible variants instead of a flat product
    structure.
-   Track inventory at the variant level.
-   Build a persistent cart backed by the database.
-   Implement increment, decrement, and remove-item cart operations.
-   Maintain frontend state using Redux Toolkit.
-   Separate API calls from UI components.
-   Introduce reusable custom hooks for domain logic.
-   Organize the backend using routes, controllers, DAOs, services,
    validators, middleware, and models.
-   Integrate a real payment gateway in test mode.
-   Persist payment lifecycle states.
-   Build a project suitable for technical discussion during placement
    interviews.

------------------------------------------------------------------------

## 3. High-Level Architecture

``` mermaid
graph TB
    subgraph Client["Frontend — React + Vite"]
        UI["Pages & Components"]
        HOOKS["Custom Hooks"]
        REDUX["Redux Toolkit Store"]
        API["API Service Modules"]

        UI --> HOOKS
        HOOKS --> REDUX
        HOOKS --> API
        UI --> REDUX
    end

    subgraph Server["Backend — Node.js + Express"]
        ROUTES["Routes"]
        VALIDATORS["Validators"]
        AUTHMW["Auth Middleware"]
        CONTROLLERS["Controllers"]
        DAO["DAO Layer"]
        SERVICES["Service Layer"]
        MODELS["Mongoose Models"]

        ROUTES --> VALIDATORS
        VALIDATORS --> AUTHMW
        AUTHMW --> CONTROLLERS
        CONTROLLERS --> DAO
        CONTROLLERS --> SERVICES
        DAO --> MODELS
        SERVICES --> MODELS
    end

    subgraph External["Persistence & External Services"]
        DB[("MongoDB")]
        PAYMENT["Razorpay Checkout"]
        STORAGE["Storage Service"]
    end

    API -->|"HTTP / JSON"| ROUTES
    MODELS --> DB
    SERVICES --> PAYMENT
    SERVICES --> STORAGE
```

### Architectural Style

SNITCH uses two complementary organization strategies:

**Frontend:** Feature-based architecture

``` text
auth/
cart/
products/
Shared/
```

Each business feature owns its pages, hooks, service modules, and Redux
state.

**Backend:** Layered architecture

``` text
Route
  ↓
Validator
  ↓
Middleware
  ↓
Controller
  ↓
DAO / Service
  ↓
Model
  ↓
MongoDB / External Provider
```

This organization reduces coupling and makes responsibilities easier to
understand during development and debugging.

------------------------------------------------------------------------

## 4. Frontend Architecture

The frontend is built with React and Vite and follows a feature-oriented
structure.

### 4.1 Application Layer

The `app/` directory contains application-wide configuration.

  File               Responsibility
  ------------------ -----------------------------
  `App.jsx`          Main application component
  `app.routes.jsx`   Central route configuration
  `app.store.js`     Redux store configuration
  `AppLayout.jsx`    Shared page layout
  `App.css`          Application-level styles

### 4.2 Authentication Feature

``` text
features/auth/
├── components/
│   ├── ContinueWithGoogle.jsx
│   └── Protected.jsx
├── hook/
│   └── useAuth.js
├── pages/
│   ├── Login.jsx
│   └── Register.jsx
├── service/
│   └── auth.api.js
└── state/
    └── auth.slice.js
```

Responsibilities:

-   Registration UI
-   Login UI
-   Google sign-in UI
-   Protected frontend routes
-   Authentication API communication
-   Authentication state management
-   Reusable authentication logic through `useAuth`

### 4.3 Cart Feature

``` text
features/cart/
├── hook/
│   └── useCart.js
├── pages/
│   ├── Cart.jsx
│   └── OrderSuccess.jsx
├── service/
│   └── cart.api.js
└── state/
    └── cart.slice.js
```

Responsibilities:

-   Fetching cart data
-   Adding items
-   Increasing quantity
-   Decreasing quantity
-   Removing items
-   Synchronizing server cart state with Redux
-   Calculating and displaying totals
-   Initiating checkout
-   Displaying successful order completion

### 4.4 Product Feature

``` text
features/products/
├── hooks/
│   └── useProduct.js
├── pages/
│   ├── CreateProduct.jsx
│   ├── Dashboard.jsx
│   ├── Home.jsx
│   ├── ProductDetail.jsx
│   └── SellerProductDetails.jsx
├── service/
│   └── product.api.js
└── state/
    └── product.slice.js
```

Responsibilities:

-   Product discovery
-   Product details
-   Product creation
-   Seller dashboard
-   Seller product details
-   Product API integration
-   Product state management
-   Variant and inventory interactions

### 4.5 Shared Components

``` text
features/Shared/Components/
└── Nav.jsx
```

The navigation component is shared across relevant application pages and
displays authentication-aware navigation and cart state.

------------------------------------------------------------------------

## 5. Backend Architecture

The backend uses Node.js, Express.js, MongoDB, and Mongoose.

``` text
Backend/src/
├── config/
├── controllers/
├── dao/
├── middlewares/
├── models/
├── routes/
├── services/
├── validator/
└── app.js
```

### 5.1 Configuration Layer

``` text
config/
├── config.js
└── db.js
```

Responsibilities:

-   Centralized configuration access
-   Environment variable loading
-   MongoDB connection initialization

### 5.2 Route Layer

``` text
routes/
├── auth.routes.js
├── cart.routes.js
└── product.routes.js
```

Routes define the public HTTP interface and connect requests to
validation, authentication middleware, and controllers.

### 5.3 Controller Layer

``` text
controllers/
├── auth.controller.js
├── cart.controller.js
└── product.controller.js
```

Controllers are responsible for:

-   Reading request data
-   Calling application operations
-   Coordinating DAO and service calls
-   Returning HTTP responses
-   Forwarding errors appropriately

### 5.4 DAO Layer

``` text
dao/
├── cart.dao.js
└── product.dao.js
```

The Data Access Object layer isolates MongoDB operations from
controllers.

Benefits:

-   Database queries remain centralized.
-   Controllers stay focused on HTTP behavior.
-   Query logic becomes easier to reuse.
-   Persistence code can evolve independently from routing code.

### 5.5 Middleware Layer

``` text
middlewares/
└── auth.middleware.js
```

The authentication middleware protects restricted backend operations and
ensures authenticated access where required.

### 5.6 Model Layer

``` text
models/
├── cart.model.js
├── payment.model.js
├── price.schema.js
├── product.model.js
└── user.model.js
```

Models define the core business entities and their persistence
structure.

### 5.7 Service Layer

``` text
services/
├── payment.service.js
└── storage.service.js
```

Services isolate external or specialized operations.

**Payment service** - Creates payment-related operations. - Integrates
with Razorpay. - Separates payment gateway logic from controllers.

**Storage service** - Handles media/storage responsibilities. - Keeps
storage-provider details outside product controllers.

### 5.8 Validation Layer

``` text
validator/
├── auth.validator.js
├── cart.validator.js
└── product.validator.js
```

Validation is separated by domain, allowing invalid input to be rejected
before business logic executes.

------------------------------------------------------------------------

## 6. Authentication Module

The authentication module provides the entry point to protected
application functionality.

### Authentication Flow

``` mermaid
sequenceDiagram
    actor User
    participant UI as React UI
    participant API as Auth API Service
    participant Route as Auth Route
    participant Validator as Auth Validator
    participant Controller as Auth Controller
    participant UserModel as User Model
    participant DB as MongoDB

    User->>UI: Submit registration or login
    UI->>API: Send credentials
    API->>Route: HTTP request
    Route->>Validator: Validate payload
    Validator->>Controller: Valid request
    Controller->>UserModel: Query / create user
    UserModel->>DB: Database operation
    DB-->>UserModel: Result
    UserModel-->>Controller: User data
    Controller-->>API: Auth response
    API-->>UI: Update auth state
```

### Frontend Authentication Components

  Component                  Purpose
  -------------------------- ----------------------------------
  `Login.jsx`                Login interface
  `Register.jsx`             Registration interface
  `Protected.jsx`            Restricts frontend routes
  `ContinueWithGoogle.jsx`   Google sign-in UI
  `useAuth.js`               Reusable authentication behavior
  `auth.api.js`              Authentication API calls
  `auth.slice.js`            Global auth state

### Backend Authentication Components

  Component              Purpose
  ---------------------- ---------------------------------
  `auth.routes.js`       Authentication endpoints
  `auth.validator.js`    Request validation
  `auth.controller.js`   Authentication request handling
  `auth.middleware.js`   Protected endpoint access
  `user.model.js`        User persistence

------------------------------------------------------------------------

## 7. Product and Inventory Module

Products are one of the central domains in SNITCH.

A fashion product often has multiple purchasable combinations. A single
product may have:

-   multiple colors,
-   multiple sizes,
-   different stock per variant,
-   different images per variant,
-   optional price differences.

SNITCH models these combinations as product variants.

### Conceptual Product Structure

``` text
Product
├── Basic Information
├── Description
├── Base Product Data
└── Variants
    ├── Variant A
    │   ├── Color: Brown
    │   ├── Size: M
    │   ├── Stock: 100
    │   ├── Price: ₹838
    │   └── Images: [...]
    │
    └── Variant B
        ├── Color: Black
        ├── Size: L
        ├── Stock: 50
        ├── Price: ₹899
        └── Images: [...]
```

### Seller Workflow

``` mermaid
flowchart LR
    LOGIN["Seller Login"] --> DASH["Seller Dashboard"]
    DASH --> CREATE["Create Product"]
    CREATE --> DETAILS["Product Information"]
    DETAILS --> VARIANT["Add Variant"]
    VARIANT --> ATTR["Set Attributes"]
    ATTR --> STOCK["Set Stock"]
    STOCK --> PRICE["Set Price"]
    PRICE --> IMAGES["Add Images"]
    IMAGES --> SAVE["Persist Product / Variant"]
```

### Product Pages

  -----------------------------------------------------------------------
  Page                                Purpose
  ----------------------------------- -----------------------------------
  `Home.jsx`                          Buyer product discovery

  `ProductDetail.jsx`                 Buyer product and variant selection

  `CreateProduct.jsx`                 Seller product creation

  `Dashboard.jsx`                     Seller product management entry
                                      point

  `SellerProductDetails.jsx`          Seller product details and variant
                                      management
  -----------------------------------------------------------------------

### Why Variant-Level Inventory Matters

Tracking stock only at the product level would be inaccurate for fashion
commerce.

For example:

``` text
Brown / M → 0 units
Brown / L → 8 units
Black / M → 15 units
```

A total product stock number cannot represent which combination is
actually available. Variant-level stock solves this problem.

------------------------------------------------------------------------

## 8. Cart Module

The cart module connects product selection to checkout.

### Supported Cart Operations

-   Add product variant to cart
-   Retrieve cart
-   Increment item quantity
-   Decrement item quantity
-   Remove item
-   Display available stock
-   Maintain variant information
-   Display subtotal and total
-   Synchronize cart state with Redux
-   Display cart item count in shared navigation

### Cart Request Flow

``` mermaid
sequenceDiagram
    actor Buyer
    participant UI as Cart UI
    participant Hook as useCart
    participant API as cart.api
    participant Route as Cart Route
    participant Validator as Cart Validator
    participant Controller as Cart Controller
    participant DAO as Cart DAO
    participant DB as MongoDB

    Buyer->>UI: Increment / Decrement / Remove
    UI->>Hook: Trigger operation
    Hook->>API: API request
    API->>Route: HTTP request
    Route->>Validator: Validate input
    Validator->>Controller: Validated request
    Controller->>DAO: Cart operation
    DAO->>DB: Update cart
    DB-->>DAO: Updated data
    DAO-->>Controller: Cart result
    Controller-->>API: Response
    API-->>Hook: Updated cart
    Hook-->>UI: Redux/UI synchronization
```

### Cart Aggregation and Product Resolution

The cart data layer can combine cart item references with product
information so the frontend receives the product and variant context
required to render a useful cart experience.

Conceptually:

``` text
Cart
  ↓
Unwind Items
  ↓
Resolve Product Reference
  ↓
Combine Product + Variant + Quantity
  ↓
Return Cart View Data
```

This keeps the cart useful even though the database stores relationships
using references.

### Quantity Rules

The cart workflow should preserve the following invariants:

``` text
quantity >= 1
quantity <= available stock
```

When a buyer no longer wants an item, the explicit remove operation
deletes it from the cart.

------------------------------------------------------------------------

## 9. Payment Workflow

SNITCH integrates Razorpay Checkout in test mode.

The payment feature completes the full buyer journey and connects
frontend checkout behavior to backend payment persistence.

### Payment Lifecycle

``` mermaid
sequenceDiagram
    actor Buyer
    participant Cart as Cart Page
    participant Backend as Backend
    participant PaymentService as Payment Service
    participant DB as MongoDB
    participant Razorpay as Razorpay Checkout
    participant Success as Order Success Page

    Buyer->>Cart: Proceed to checkout
    Cart->>Backend: Create payment request
    Backend->>PaymentService: Create gateway order
    PaymentService->>Razorpay: Create Razorpay order
    Razorpay-->>PaymentService: Gateway order data
    PaymentService->>DB: Save payment as pending
    Backend-->>Cart: Checkout data
    Cart->>Razorpay: Open checkout
    Buyer->>Razorpay: Complete test payment
    Razorpay-->>Cart: Payment success response
    Cart->>Backend: Submit payment result
    Backend->>DB: Update payment status
    DB-->>Backend: Payment marked paid
    Backend-->>Cart: Success
    Cart->>Success: Navigate to success page
```

### Payment States

The implemented lifecycle includes:

``` text
pending
   ↓
 paid
```

A payment starts as `pending` and becomes `paid` after the successful
payment workflow is processed.

### Payment Model Responsibilities

The payment record is designed to preserve information such as:

-   User association
-   Purchased items
-   Pricing information
-   Razorpay-related order/payment data
-   Payment status

### Payment Engineering Boundary

The Razorpay integration belongs in the service layer rather than being
embedded throughout controllers.

``` text
Controller
    ↓
Payment Service
    ↓
Razorpay
```

This makes the integration easier to maintain and keeps external
provider logic separated from HTTP handling.

------------------------------------------------------------------------

## 10. Data Model Design

The core business model can be represented as:

``` mermaid
erDiagram
    USER ||--o{ PRODUCT : manages
    USER ||--|| CART : owns
    USER ||--o{ PAYMENT : makes
    PRODUCT ||--o{ VARIANT : contains
    CART ||--o{ CART_ITEM : contains
    PRODUCT ||--o{ CART_ITEM : referenced_by
    PAYMENT ||--o{ PAYMENT_ITEM : contains

    USER {
        ObjectId id
        string identity
        string contact
    }

    PRODUCT {
        ObjectId id
        string productData
        array variants
    }

    VARIANT {
        object attributes
        number stock
        object price
        array images
    }

    CART {
        ObjectId id
        ObjectId user
        array items
    }

    CART_ITEM {
        ObjectId product
        object variantSelection
        number quantity
    }

    PAYMENT {
        ObjectId id
        ObjectId user
        array items
        object price
        string status
        object gatewayData
    }
```

### 10.1 User Model

The user model represents registered application users and provides
identity for protected operations.

### 10.2 Product Model

The product model represents catalog information and product variants.

Important modeling concerns:

-   Product identity
-   Product description
-   Variant attributes
-   Variant images
-   Variant stock
-   Variant pricing

### 10.3 Price Schema

`price.schema.js` separates reusable price structure from the main
product model.

This is useful when price information has multiple related fields or is
shared across nested structures.

### 10.4 Cart Model

The cart model associates a user with selected product items.

Each cart item needs enough information to identify:

-   the product,
-   the selected variant,
-   the requested quantity.

### 10.5 Payment Model

The payment model persists checkout and payment lifecycle information.

The separation of cart and payment data is important:

``` text
Cart = current shopping intent
Payment = checkout transaction record
```

------------------------------------------------------------------------

## 11. Application Workflows

### 11.1 Buyer Journey

``` text
1. Register or log in
2. Browse products
3. Open product details
4. Inspect product images and information
5. Select the required variant
6. Add the selected variant to cart
7. Open cart
8. Increase or decrease quantities
9. Remove unwanted items
10. Review subtotal and total
11. Proceed to checkout
12. Complete Razorpay test payment
13. Payment status is updated
14. View order success page
```

### 11.2 Seller Journey

``` text
1. Authenticate
2. Open seller dashboard
3. Create a product
4. Open seller product details
5. Add product variants
6. Define attributes such as color and size
7. Set stock quantity
8. Configure variant pricing
9. Add product/variant images
10. Save and manage product inventory
```

### 11.3 Cart-to-Payment Journey

``` text
Cart Items
    ↓
Validate Checkout State
    ↓
Calculate Payment Data
    ↓
Create Razorpay Order
    ↓
Persist Pending Payment
    ↓
Open Checkout
    ↓
Successful Test Payment
    ↓
Process Result
    ↓
Mark Payment as Paid
    ↓
Order Success
```

------------------------------------------------------------------------

## 12. Project Structure

### 12.1 Root Structure

``` text
SNITCH/
├── Backend/
└── Frontend/
```

### 12.2 Backend Structure

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
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

### 12.3 Frontend Structure

``` text
Frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── app.routes.jsx
│   │   ├── app.store.js
│   │   └── AppLayout.jsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hook/
│   │   │   ├── pages/
│   │   │   ├── service/
│   │   │   └── state/
│   │   │
│   │   ├── cart/
│   │   │   ├── hook/
│   │   │   ├── pages/
│   │   │   ├── service/
│   │   │   └── state/
│   │   │
│   │   ├── products/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── service/
│   │   │   └── state/
│   │   │
│   │   └── Shared/
│   │       └── Components/
│   │           └── Nav.jsx
│   │
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

------------------------------------------------------------------------

## 13. Technology Stack

  Layer               Technology                           Responsibility
  ------------------- ------------------------------------ ------------------------------------------
  Frontend            React                                Component-based UI
  Build Tool          Vite                                 Frontend development and bundling
  State               Redux Toolkit                        Global application state
  Routing             React Router                         Client-side navigation
  HTTP Integration    API service modules                  Backend communication
  Backend Runtime     Node.js                              Server-side JavaScript
  Backend Framework   Express.js                           REST API and middleware pipeline
  Database            MongoDB                              Persistent application data
  ODM                 Mongoose                             Schemas, models, and database operations
  Validation          Domain validator modules             Request payload validation
  Authentication      Auth middleware + protected routes   Access control
  Payments            Razorpay Checkout                    Test-mode payment processing
  Architecture        Feature-based + layered              Separation of concerns
  Version Control     Git                                  Source control

------------------------------------------------------------------------

## 14. Developer Setup

### Prerequisites

Install:

-   Node.js
-   npm
-   Git
-   MongoDB locally or a hosted MongoDB connection
-   Razorpay test-mode credentials

### Clone the Repository

``` bash
git clone <repository-url>
cd SNITCH
```

### Backend Setup

``` bash
cd Backend
npm install
```

Create the backend `.env` file using the variables expected by
`src/config/config.js`.

Then run the backend using the script defined in `Backend/package.json`.

For example:

``` bash
npm run dev
```

### Frontend Setup

In another terminal:

``` bash
cd Frontend
npm install
npm run dev
```

Vite will print the frontend development URL in the terminal.

------------------------------------------------------------------------

## 15. Environment Configuration

A production repository must never contain real credentials.

Example backend configuration:

``` env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret

RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret

# Add storage-provider variables required by storage.service.js
```

Example frontend configuration, if the project reads these values
through Vite:

``` env
VITE_API_BASE_URL=http://localhost:3000
VITE_RAZORPAY_KEY_ID=your_test_key_id
```

> The exact variable names must match the implementation in the
> project's configuration files.

### Secret Handling Rules

-   Never commit `.env`.
-   Never expose Razorpay secret keys in frontend code.
-   Use test keys during development.
-   Rotate credentials immediately if they were committed.
-   Keep production and development credentials separate.

------------------------------------------------------------------------

## 16. API Design Overview

SNITCH organizes API responsibilities by business domain.

### Authentication Domain

Responsibilities:

-   Registration
-   Login
-   Authentication state
-   Protected access

Conceptual routes:

``` text
/api/auth/*
```

### Product Domain

Responsibilities:

-   Product creation
-   Product retrieval
-   Product detail retrieval
-   Seller product operations
-   Variant management
-   Inventory updates

Conceptual routes:

``` text
/api/products/*
```

### Cart Domain

Responsibilities:

-   Retrieve cart
-   Add item
-   Increment quantity
-   Decrement quantity
-   Remove item
-   Checkout-related cart operations

Conceptual routes:

``` text
/api/cart/*
```

### Payment Operations

Payment behavior is separated through `payment.service.js` and persisted
through `payment.model.js`.

The exact public route placement should be documented from the final
route implementation if payment endpoints are mounted under cart or
another domain.

### API Design Principle

``` text
HTTP Concern        → Route + Controller
Input Correctness   → Validator
Access Control      → Middleware
Database Access     → DAO
External Provider   → Service
Persistence Shape   → Model
```

------------------------------------------------------------------------

## 17. Validation and Error Handling

SNITCH uses dedicated validators for:

-   Authentication requests
-   Cart requests
-   Product requests

### Validation Pipeline

``` text
Incoming Request
      ↓
Domain Validator
      ↓
Validation Error? ── Yes ──► Return Client Error
      │
      No
      ↓
Authentication Middleware
      ↓
Controller
      ↓
DAO / Service
      ↓
Response
```

### Why Dedicated Validation Matters

Without validation, malformed requests can reach business logic and
database operations.

Examples of validation concerns include:

-   Contact format
-   Password requirements
-   Required product data
-   Valid cart item identifiers
-   Quantity constraints
-   Required variant data

A dedicated validation layer improves reliability and keeps validation
logic outside controllers.

------------------------------------------------------------------------

## 18. Security Considerations

### 18.1 Authentication

Protected operations should be enforced on the backend.

Frontend route protection improves UX but is not a security boundary.

``` text
Frontend Protected Route = navigation control
Backend Auth Middleware   = actual access control
```

### 18.2 Payment Security

For production-grade payment handling:

-   Create Razorpay orders from the backend.
-   Never expose the Razorpay secret key.
-   Verify successful payment data on the backend.
-   Validate payment signatures before marking transactions as paid.
-   Consider webhook-based reconciliation for production reliability.
-   Make payment processing idempotent to avoid duplicate updates.

### 18.3 Database Security

-   Use environment variables for database credentials.
-   Restrict database network access.
-   Use least-privilege database users.
-   Validate object identifiers.
-   Avoid trusting price values sent directly from the browser.
-   Calculate authoritative checkout totals on the server.

### 18.4 Inventory Security

Before checkout or order creation, the server should verify:

``` text
requested quantity <= current available stock
```

For production concurrency, stock reservation or transactional inventory
updates should be considered to prevent overselling.

### 18.5 Input Validation

All client input must be treated as untrusted.

Validation should cover:

-   Authentication payloads
-   Product creation payloads
-   Variant attributes
-   Prices
-   Stock values
-   Cart quantities
-   Payment identifiers

------------------------------------------------------------------------

## 19. Engineering Decisions

### 19.1 Feature-Based Frontend

The frontend is grouped by domain rather than by generic file type.

Instead of:

``` text
components/
pages/
hooks/
services/
```

SNITCH uses:

``` text
features/
├── auth/
├── cart/
└── products/
```

This improves ownership and scalability.

### 19.2 Custom Hooks as Domain Interfaces

`useAuth`, `useCart`, and `useProduct` create a reusable boundary
between UI components and application logic.

Conceptually:

``` text
Page
 ↓
Custom Hook
 ↓
Redux + API Service
```

This prevents pages from becoming overloaded with request and
state-management details.

### 19.3 API Service Modules

Files such as:

``` text
auth.api.js
cart.api.js
product.api.js
```

centralize backend communication.

Benefits:

-   reusable API functions,
-   easier endpoint changes,
-   cleaner page components,
-   clearer separation of UI and networking.

### 19.4 DAO Layer

Database access is separated into DAOs for cart and product operations.

This demonstrates an understanding that controllers should not become
large collections of database queries.

### 19.5 Service Layer for External Integrations

Razorpay and storage behavior are separated into services.

This is especially useful because third-party provider code often
changes independently of core application logic.

### 19.6 Variant-Oriented Product Modeling

The project treats a product and a purchasable variant as different
concepts.

This is a more realistic e-commerce model than storing one global stock
and one global price for every product combination.

### 19.7 Persistent Server-Side Cart

The cart is stored through the backend rather than existing only in
browser memory.

Benefits:

-   cart survives page refresh,
-   cart belongs to the authenticated user,
-   server remains authoritative,
-   payment flow can use persisted cart data.

------------------------------------------------------------------------

## 20. Development Journey

SNITCH was built incrementally.

### Stage 1 --- Project Foundation

Initial work established:

-   Backend and frontend applications
-   Project folder structure
-   Express application
-   MongoDB configuration
-   React application setup
-   Feature-based frontend organization

### Stage 2 --- Authentication

Implemented:

-   Registration
-   Login
-   Auth pages
-   Authentication API layer
-   Auth Redux slice
-   `useAuth` hook
-   Protected route component
-   Authentication middleware
-   Authentication validation

### Stage 3 --- Product Backend and Seller Workflow

Implemented:

-   Product model
-   Reusable price schema
-   Product controller
-   Product DAO
-   Product routes
-   Product validation
-   Product API service
-   Product Redux state
-   Product creation page
-   Seller dashboard

### Stage 4 --- Product Experience and Variants

Implemented:

-   Home product browsing
-   Product details
-   Seller product details
-   Variant creation
-   Flexible variant attributes
-   Variant stock
-   Variant pricing
-   Variant images
-   Buyer variant selection

### Stage 5 --- Cart System

Implemented:

-   Cart model
-   Cart DAO
-   Cart controller
-   Cart routes
-   Cart validator
-   Cart API module
-   Cart Redux slice
-   `useCart` hook
-   Cart page
-   Add to cart
-   Increment quantity
-   Decrement quantity
-   Remove item
-   Cart navigation count
-   Cart product data resolution

### Stage 6 --- Payment Completion

Implemented:

-   Payment model
-   Payment service
-   Razorpay Checkout integration
-   Payment creation flow
-   `pending` payment state
-   Successful payment processing
-   `paid` payment state
-   Order success page

### Final Outcome

The final project completes the core e-commerce loop:

``` text
Seller creates inventory
        ↓
Buyer discovers product
        ↓
Buyer selects variant
        ↓
Buyer manages cart
        ↓
Buyer pays
        ↓
Payment state is persisted
        ↓
Order success is displayed
```

------------------------------------------------------------------------

## 21. Testing Strategy

The project currently benefits from manual end-to-end testing across the
main application workflows.

### Critical Manual Test Cases

#### Authentication

-   Register with valid data
-   Reject invalid contact data
-   Reject passwords that do not satisfy requirements
-   Login with valid credentials
-   Prevent unauthorized protected access

#### Products

-   Create product
-   Retrieve products
-   Open product detail
-   Add variant
-   Set variant attributes
-   Set variant stock
-   Set variant price
-   Verify product display

#### Cart

-   Add a variant to cart
-   Increment quantity
-   Decrement quantity
-   Remove item
-   Verify cart count
-   Verify subtotal and total
-   Prevent invalid quantity behavior

#### Payment

-   Start checkout
-   Verify pending payment creation
-   Complete Razorpay test payment
-   Verify paid status
-   Verify success navigation

### Recommended Automated Test Layers

``` text
Unit Tests
    ↓
Service / DAO Tests
    ↓
API Integration Tests
    ↓
Frontend Component Tests
    ↓
End-to-End Checkout Tests
```

Recommended future tools:

-   Vitest for frontend unit testing
-   React Testing Library for component behavior
-   Jest or Node test tooling for backend units
-   Supertest for Express API integration testing
-   Playwright or Cypress for end-to-end buyer workflows

------------------------------------------------------------------------

## 22. Known Limitations

The core commerce workflow is complete, but the project can still be
extended toward production readiness.

Current limitations include:

-   No automated test suite documented yet.
-   No dedicated order-history module.
-   No shipment tracking workflow.
-   No product review and rating system.
-   No wishlist feature.
-   No advanced search and filtering system documented.
-   No coupon or promotion engine.
-   No admin moderation workflow.
-   Payment production hardening should include signature verification
    and webhook reconciliation if not already present in the final
    implementation.
-   High-concurrency inventory reservation is not documented.
-   Deployment and CI/CD automation are not yet part of the current
    project scope.

These limitations do not prevent the project from demonstrating a
complete core full-stack e-commerce workflow.

------------------------------------------------------------------------

## 23. Future Roadmap

  -----------------------------------------------------------------------
  Feature                 Priority                Description
  ----------------------- ----------------------- -----------------------
  Order History           High                    Buyers can view
                                                  previous purchases and
                                                  payment states

  Payment Webhooks        High                    Reconcile gateway
                                                  events asynchronously

  Signature Verification  High                    Harden server-side
                                                  payment authenticity
                                                  checks

  Search & Filtering      High                    Filter by category,
                                                  price, color, size, and
                                                  availability

  Inventory Transactions  High                    Prevent overselling
                                                  under concurrent
                                                  checkout

  Automated Testing       High                    Unit, API integration,
                                                  and end-to-end coverage

  Seller Analytics        Medium                  Revenue, sales, and
                                                  product performance
                                                  metrics

  Reviews & Ratings       Medium                  Verified buyer feedback

  Wishlist                Medium                  Save products for later

  Coupon Engine           Medium                  Promotions and discount
                                                  rules

  Address Book            Medium                  Multiple delivery
                                                  addresses

  Shipping Integration    Medium                  Shipment creation and
                                                  tracking

  Notifications           Medium                  Email/SMS order and
                                                  payment updates

  Admin Portal            Low                     User, seller, product,
                                                  and order moderation

  Containerization        Low                     Dockerized development
                                                  and deployment

  CI/CD                   Low                     Automated validation
                                                  and deployment pipeline
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 24. Placement-Relevant Engineering Skills

SNITCH demonstrates practical experience in the following areas.

### Frontend Engineering

-   React component architecture
-   Client-side routing
-   Protected routes
-   Redux Toolkit
-   Feature-based folder architecture
-   Custom React hooks
-   API service abstraction
-   Shared navigation state
-   Dynamic product and cart interfaces
-   Checkout integration

### Backend Engineering

-   Node.js
-   Express.js
-   REST API design
-   Middleware
-   Request validation
-   Controllers
-   DAO pattern
-   Service layer
-   External payment gateway integration
-   Error-handling boundaries

### Database Engineering

-   MongoDB
-   Mongoose schemas and models
-   Document relationships
-   Product variant modeling
-   Cart persistence
-   Payment lifecycle persistence
-   Aggregation-based data resolution

### System Design Concepts

-   Separation of concerns
-   Layered architecture
-   Domain-oriented frontend organization
-   Server-authoritative cart
-   Variant-level inventory
-   Payment state machine
-   External provider abstraction
-   Secure secret handling
-   Buyer/seller workflow separation

### Debugging Experience

The project required debugging across:

``` text
React UI
   ↕
Redux State
   ↕
API Service
   ↕
Express Route
   ↕
Validation / Middleware
   ↕
Controller
   ↕
DAO / Service
   ↕
MongoDB / Razorpay
```

This end-to-end debugging experience is one of the strongest technical
outcomes of the project.

------------------------------------------------------------------------

## 25. Project Status

**Status: Core Project Completed**

Completed modules:

-   Authentication
-   Registration and login
-   Protected routes
-   Product creation
-   Seller dashboard
-   Product browsing
-   Product details
-   Product variants
-   Variant attributes
-   Variant inventory
-   Variant pricing
-   Cart persistence
-   Add to cart
-   Increment quantity
-   Decrement quantity
-   Remove item
-   Cart totals
-   Razorpay test checkout
-   Payment persistence
-   Payment status lifecycle
-   Order success flow

The application now demonstrates a complete core e-commerce journey from
seller inventory creation to buyer payment completion.

------------------------------------------------------------------------

## 26. Author

**Vinayak S. Tatti**

B.Tech Computer Science and Engineering --- Data Science\
CMR University\
Expected Graduation: 2027

SNITCH was developed as a placement-focused full-stack project to
demonstrate end-to-end application ownership across frontend
architecture, backend API development, database modeling,
authentication, state management, cart logic, product inventory, and
payment integration.

------------------------------------------------------------------------

```{=html}
<p align="center">
```
`<strong>`{=html}SNITCH`</strong>`{=html}`<br/>`{=html} Full-Stack
Fashion E-Commerce Platform
```{=html}
</p>
```
```{=html}
<p align="center">
```
Built with React, Redux Toolkit, Node.js, Express.js, MongoDB, Mongoose,
and Razorpay.
```{=html}
</p>
```
