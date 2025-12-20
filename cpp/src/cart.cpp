// cart class 
//int productId;
// int quantity;
// CartNode* next;



// CartNode* head;
// void addItem(int id, int qty);
// void removeItem(int id);
// void updateQuantity(int id, int qty);
// void viewCart();
// double calculateTotal(ProductCatalogBST& catalog);
// bool isEmpty();
//ehtisham
#include <iostream>
#include "product.h"
using namespace std;

class CartEntry {
public:
    int productId;
    int quantity;
    CartEntry* next;

    CartEntry(int id, int qty) {
        productId = id;
        quantity = qty;
        next = NULL;
    }
};

class Cart {
private:
    CartEntry* head;

public:
    Cart() {
        head = NULL;
    }

    void addItem(int id, int qty) {
        CartEntry* temp = head;

        while (temp != NULL) {
            if (temp->productId == id) {
                temp->quantity += qty;
                return;
            }
            temp = temp->next;
        }

        CartEntry* newNode = new CartEntry(id, qty);
        newNode->next = head;
        head = newNode;
    }

    void removeItem(int id) {
        if (head == NULL)
            return;

        if (head->productId == id) {
            CartEntry* del = head;
            head = head->next;
            delete del;
            return;
        }

        CartEntry* curr = head;
        while (curr->next != NULL && curr->next->productId != id)
            curr = curr->next;

        if (curr->next != NULL) {
            CartEntry* del = curr->next;
            curr->next = del->next;
            delete del;
        }
    }

    double calculateTotal(bst &catalog) {
        double total = 0;
        CartEntry* temp = head;

        while (temp != NULL) {
            total += catalog.getprice(temp->productId) * temp->quantity;
            temp = temp->next;
        }
        return total;
    }

    bool isEmpty() {
        return head == NULL;
    }
};
