#include "../include/cart.h"
#include "../include/product.h"
#include <iostream>

CartNode::CartNode(int id, int qty) : productId(id), quantity(qty), next(nullptr) {}

ShoppingCart::ShoppingCart() : head(nullptr) {}

ShoppingCart::~ShoppingCart()
{
    clear();
}

void ShoppingCart::addItem(int id, int qty)
{
    // Check if item already exists
    CartNode *current = head;
    while (current)
    {
        if (current->productId == id)
        {
            current->quantity += qty;
            return;
        }
        current = current->next;
    }

    // Add new item at the beginning
    CartNode *newNode = new CartNode(id, qty);
    newNode->next = head;
    head = newNode;
}

void ShoppingCart::removeItem(int id)
{
    if (!head)
        return;

    // If head needs to be removed
    if (head->productId == id)
    {
        CartNode *temp = head;
        head = head->next;
        delete temp;
        return;
    }

    // Find and remove item
    CartNode *current = head;
    while (current->next)
    {
        if (current->next->productId == id)
        {
            CartNode *temp = current->next;
            current->next = current->next->next;
            delete temp;
            return;
        }
        current = current->next;
    }
}

void ShoppingCart::updateQuantity(int id, int qty)
{
    CartNode *current = head;
    while (current)
    {
        if (current->productId == id)
        {
            current->quantity = qty;
            if (qty <= 0)
            {
                removeItem(id);
            }
            return;
        }
        current = current->next;
    }
}

void ShoppingCart::viewCart()
{
    if (!head)
    {
        std::cout << "Cart is empty\n";
        return;
    }

    std::cout << "Shopping Cart:\n";
    std::cout << "Product ID | Quantity\n";
    std::cout << "------------------------\n";

    CartNode *current = head;
    while (current)
    {
        std::cout << current->productId << " | " << current->quantity << "\n";
        current = current->next;
    }
}

double ShoppingCart::calculateTotal(bst &catalog)
{
    double total = 0.0;
    CartNode *temp = head;

    while (temp != nullptr)
    {
        total += catalog.getprice(temp->productId) * temp->quantity;
        temp = temp->next;
    }
    return total;
}

bool ShoppingCart::isEmpty()
{
    return head == nullptr;
}

void ShoppingCart::clear()
{
    while (head)
    {
        CartNode *temp = head;
        head = head->next;
        delete temp;
    }
}
