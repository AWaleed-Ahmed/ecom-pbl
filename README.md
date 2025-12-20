# DSA E-Commerce Platform

A full-stack e-commerce platform built as a Data Structures & Algorithms project, featuring C++ backend with DSA implementations and a modern web interface.

## Project Structure

```
ecom-pbl/
├── cpp/
│   ├── include/            # Header files
│   │   ├── product.h
│   │   ├── cart.h
│   │   └── user.h
│   └── src/                # Source files
│       ├── product.cpp     # Product Catalog (Binary Search Tree)
│       ├── cart.cpp        # Shopping Cart (Linked List)
│       ├── user.cpp        # User Management
│       ├── order.cpp       # Order Queue (Queue)
│       ├── graph.cpp       # Product Recommendations (Graph)
│       └── main.cpp        # Main C++ executable
│
├── backend/
│   ├── controllers/        # Business logic
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── routes/             # API routes
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── utils/              # Helper functions
│   │   └── cppHelper.js    # C++ process spawning
│   ├── server.js           # Main server file (ESM)
│   └── package.json
│
├── frontend/               # Web Interface
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── [components]    # To be added
│   ├── index.html
│   └── package.json
│
└── data/                   # Data Storage
    ├── products.csv
    └── orders.txt          # Created on first order
```

## Data Structures Used

1. **Binary Search Tree (BST)** - Product Catalog

   - Fast product search by ID
   - Sorted product listings (inorder traversal)
   - O(log n) insertion, deletion, search

2. **Queue** - Order Management

   - FIFO order processing
   - Order queue management
   - Enqueue/dequeue operations

3. **Graph** - Product Recommendations

   - Related products using adjacency list
   - Product recommendation system

4. **Linked List** - Shopping Cart
   - Dynamic cart item management
   - Add/remove/update cart items

## Getting Started

### Prerequisites

- C++ Compiler: MinGW (g++)
- Node.js: v18 or higher
- npm: Node package manager

### Installation

1. Install Backend Dependencies

   ```bash
   cd backend
   npm install
   ```

2. Install Frontend Dependencies

   ```bash
   cd frontend
   npm install
   ```

3. Compile C++ Code (when ready)

   ````bash
   cd cpp/src
   g++ -I../include -o main.exe *.cpp
   ```bash
   cd backend
   npm start
   ````

   Server will run on `http://localhost:3000`

4. Start the Frontend (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173
   python -m http.server 8080
   # Or using Node.js http-server
   npx http-server -p 8080
   ```
   Then visit `http://localhost:8080`
   ```

## API Endpoints

### Products

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Add new product
- `GET /api/products/:id/recommendations` - Get product recommendations

### Cart

- `GET /api/cart/:userId` - Get user cart
- `POST /api/cart/:userId/add` - Add item to cart
- `DELETE /api/cart/:userId/remove/:productId` - Remove item from cart

### Orders

- `GET /api/orders` - List all orders
- `POST /api/orders` - Place new order

## Usage

### Adding Products

[To be documented once UI is complete]

### C++ Components

Product Catalog (BST)

- File: `cpp/src/product.cpp`
- Operations: Insert, Search, Remove, Display
- Data: ID, Name, Price, Stock

Order Queue

- File: `cpp/src/order.cpp`
- Operations: Enqueue, Dequeue, Peek, Display
- Data: Order ID, Product IDs, Total Price, Status

Recommendation Graph

- File: `cpp/src/graph.cpp`
- Operations: Add Edge, Get Recommendations
- Data: Product relationships

### Backend Server

Built with Node.js and Express:

- MVC architecture with controllers and routes
- RESTful API design
- Interfaces with C++ executables
- CSV file-based data persistence
- CORS enabled for frontend access

### Frontend

Modern, responsive UI:

- Vanilla JavaScript (no frameworks)
- CSS Grid for product layout
- Fetch API for backend communication
- Modal dialogs for forms

## Features

- Product catalog with BST implementation (C++)
- Shopping cart functionality
- Order queue management (C++)
- Product search by ID
- Product recommendations using Graph (C++)
- REST API backend (Node.js ESM)
- Data persistence (CSV/Text files)
- [UI features to be added]

## Team

- Waleed - Product Catalog (BST) & Recommendations (Graph)
- Ehtisham - Cart & User Management
- Rehan - Order Queue

## Academic Purpose

This project demonstrates practical implementation of:

- Binary Search Trees
- Queues
- Graphs
- Linked Lists
- File I/O
- Full-stack web development
- REST API design

## Troubleshooting

Backend won't start:

- Make sure Node.js is installed
- Run `npm install` in backend directory

C++ compilation errors:

- Ensure MinGW is installed and in PATH
- Check all .cpp files are in cpp/src directory
- Check all .h files are in cpp/include directory

Frontend can't connect:

- Verify backend is running on port 3000
- Check CORS settings in server.js

## License

This is an academic project for educational purposes.
