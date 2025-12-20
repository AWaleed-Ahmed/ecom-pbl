#ifndef CART_H
#define CART_H

// Forward declaration
class bst;

struct CartNode
{
    int productId;
    int quantity;
    CartNode *next;

    CartNode(int id, int qty);
};

class ShoppingCart
{
private:
    CartNode *head;

public:
    ShoppingCart();
    ~ShoppingCart();
    void addItem(int id, int qty);
    void removeItem(int id);
    void updateQuantity(int id, int qty);
    void viewCart();
    double calculateTotal(bst &catalog);
    bool isEmpty();
    void clear();
};

#endif
