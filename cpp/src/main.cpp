#include <iostream>
#include <string>
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

    // Load existing data
    productCatalog.loadFromCSV("../data/products.csv");

    // Command handling
    if (command == "list-products")
    {
        cout << productCatalog.inorder(nullptr);
    }
    else if (command == "add-product" && argc >= 6)
    {
        int id = stoi(argv[2]);
        string name = argv[3];
        double price = stod(argv[4]);
        int stock = stoi(argv[5]);

        productCatalog.insertproduct(id, name, stock, price);
        productCatalog.saveToCSV("../data/products.csv");

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
    else if (command == "remove-product" && argc >= 3)
    {
        int id = stoi(argv[2]);
        productCatalog.removeproduct(id);
        productCatalog.saveToCSV("../data/products.csv");

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
    else
    {
        cout << "Unknown command: " << command << endl;
        return 1;
    }

    return 0;
}
