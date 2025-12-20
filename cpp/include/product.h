#ifndef PRODUCT_H
#define PRODUCT_H

#include <string>
using namespace std;

class node
{
public:
    int id;
    string name;
    double price;
    int stock;
    node* left;
    node* right;

    node(int id1, string name1, double price1, int stock1);
};

class bst
{
private:
    node* root;

    void insertproduct(int id1, string name1, int stock1, double price1);

    bool searchhelper(int key, node* parent);

    void removehelper(node* parent);

    string inorder(node* root);
    string preorder(node* root);
    string postorder(node* root);

    int getpricehelper(int key, node* parent);

    void saveInorderCSV(node* parent, ofstream& file);

public:
    bst();

    void insert(int id, string name, double price, int stock);

    bool search(int productId);

    void remove(int productId);

    string inorder();
    string preorder();
    string postorder();

    double getprice(int id);

    node* getProduct(int id);

    void display();

    void saveProducts(const string& filename);
    void loadProducts(const string& filename);
};

#endif
