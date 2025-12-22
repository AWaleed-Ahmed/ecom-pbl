#include <iostream>
#include <string>
#include <ctime>
#include <iomanip>
#include "../include/product.h"
#include "../include/cart.h"
#include "../include/user.h"
#include <vector>

// Include implementations (temporary until proper compilation)
#include "product.cpp"
#include "order.cpp"
#include "graph.cpp"

using namespace std;

int main(int argc, char *argv[])
{
    if (argc < 2)
    {
        cout << "Usage: main.exe <command> [args...]" << endl;
        return 1;
    }

    string command = argv[1];

    // Initialize data structures
    bst productCatalog;
    OrderQueue orderQueue;
    graph recommendationGraph;
    UserManager userManager;

    // Load existing data
    productCatalog.loadProducts("../../data/products.csv");
    userManager.loadUsers("../../data/users.csv");
    userManager.loadCarts("../../data/carts.csv");
    orderQueue.loadOrders();
    recommendationGraph.loadGraph("../../data/recommendations.csv");

    // Command handling
    if (command == "list-products")
    {
        cout << productCatalog.inorder();
    }
    else if (command == "add-product" && argc >= 6)
    {
        int id = stoi(argv[2]);
        string name = argv[3];
        double price = stod(argv[4]);
        int stock = stoi(argv[5]);

        productCatalog.insert(id, name, price, stock);
        productCatalog.saveProducts("../data/products.csv");

        cout << "Product added successfully" << endl;
    }
    else if (command == "search-product" && argc >= 3)
    {
        int id = stoi(argv[2]);
        if (productCatalog.search(id))
        {
            cout << "Product found" << endl;
        }
        else
        {
            cout << "Product not found" << endl;
        }
    }
    else if (command == "search-by-name" && argc >= 3)
    {
        string query = argv[2];
        string results = productCatalog.searchByName(query);
        if (results.empty())
        {
            cout << "No products found" << endl;
        }
        else
        {
            cout << results;
        }
    }
    else if (command == "remove-product" && argc >= 3)
    {
        int id = stoi(argv[2]);
        productCatalog.remove(id);
        productCatalog.saveProducts("../data/products.csv");

        cout << "Product removed successfully" << endl;
    }
    else if (command == "get-recommendations" && argc >= 3)
    {
        int productId = stoi(argv[2]);
        vector<int> recs = recommendationGraph.recommendation(productId);

        cout << "Recommendations: ";
        for (int id : recs)
        {
            cout << id << " ";
        }
        cout << endl;
    }
    else if (command == "get-cart" && argc >= 3)
    {
        int userId = stoi(argv[2]);
        User *user = userManager.getUser(userId);

        if (!user)
        {
            cout << "User not found" << endl;
            return 1;
        }

        user->cart.viewCart();
    }
    else if (command == "add-to-cart" && argc >= 4)
    {
        int userId = stoi(argv[2]);
        int productId = stoi(argv[3]);
        int quantity = (argc >= 5) ? stoi(argv[4]) : 1;

        User *user = userManager.getUser(userId);

        if (!user)
        {
            cout << "User not found" << endl;
            return 1;
        }

        user->cart.addItem(productId, quantity);
        userManager.saveCarts("../../data/carts.csv");
        cout << "Item added to cart successfully" << endl;
    }
    else if (command == "remove-from-cart" && argc >= 4)
    {
        int userId = stoi(argv[2]);
        int productId = stoi(argv[3]);

        User *user = userManager.getUser(userId);

        if (!user)
        {
            cout << "User not found" << endl;
            return 1;
        }

        user->cart.removeItem(productId);
        userManager.saveCarts("../../data/carts.csv");
        cout << "Item removed from cart successfully" << endl;
    }
    else if (command == "clear-cart" && argc >= 3)
    {
        int userId = stoi(argv[2]);
        User *user = userManager.getUser(userId);

        if (!user)
        {
            cout << "User not found" << endl;
            return 1;
        }

        user->cart.clear();
        userManager.saveCarts("../../data/carts.csv");
        cout << "Cart cleared successfully" << endl;
    }
    else if (command == "cart-total" && argc >= 3)
    {
        int userId = stoi(argv[2]);
        User *user = userManager.getUser(userId);

        if (!user)
        {
            cout << "User not found" << endl;
            return 1;
        }

        double total = user->cart.calculateTotal(productCatalog);
        cout << "Total: " << total << endl;
    }
    else if (command == "place-order" && argc >= 4)
    {
        int userId = stoi(argv[2]);
        long long orderId = stoll(argv[3]);

        // Build cart from remaining arguments: productId1 qty1 productId2 qty2 ...
        vector<pair<int, int>> items; // productId, quantity
        for (int i = 4; i < argc; i += 2)
        {
            if (i + 1 < argc)
            {
                int productId = stoi(argv[i]);
                int quantity = stoi(argv[i + 1]);
                items.push_back({productId, quantity});
            }
        }

        if (items.empty())
        {
            cout << "Cart is empty" << endl;
            return 1;
        }

        // Calculate total from items
        double total = 0;
        Order newOrder;
        newOrder.orderId = orderId;
        newOrder.userId = userId;
        newOrder.status = "pending";

        // Get current date
        time_t now = time(0);
        tm *ltm = localtime(&now);
        char dateStr[11];
        sprintf(dateStr, "%04d-%02d-%02d",
                1900 + ltm->tm_year, 1 + ltm->tm_mon, ltm->tm_mday);
        newOrder.orderDate = dateStr;

        for (auto &item : items)
        {
            double price = productCatalog.getprice(item.first);
            if (price > 0)
            {
                total += price * item.second;
                newOrder.productIds.push_back(item.first);
            }
        }

        newOrder.totalPrice = total;

        orderQueue.enqueue(newOrder);
        orderQueue.saveOrders();

        cout << "Order placed successfully" << endl;
        cout << "Order ID: " << orderId << endl;
        cout << "Total: " << total << endl;
    }
    else if (command == "list-orders")
    {
        if (orderQueue.isEmpty())
        {
            cout << "No orders" << endl;
        }
        else
        {
            orderQueue.displayQueue();
        }
    }
    else
    {
        cout << "Unknown command: " << command << endl;
        return 1;
    }

    return 0;
}
