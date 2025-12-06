// int id;
// string name;
// double price;
// int stock;
//make bst node here and then use it in other classes
//product catalog bst here too 

//BSTNode* root;
// void insert(Product p);
// BSTNode* insertNode(BSTNode* root, Product p);

// bool search(int productId);
// BSTNode* searchNode(BSTNode* root, int id);

// void remove(int productId);
// BSTNode* deleteNode(BSTNode* root, int id);

// void inorder();        Sorted product list
// void preorder();
// void postorder();
// double getPrice(int id); 
// Product getProduct(int id);
// void display();
// void saveProducts(ProductCatalogBST& bst);
// void loadProducts(ProductCatalogBST& bst)
//object is gonna be stored in bst
//waleed
#include <iostream>
using namespace std;

class node 
{
    public:
    int id;
    string name;
    double price;
    int stock;
    node * left;
    node * right;
    node (int id1, string name1, double price1, int stock1)
    {
        id = id1;
        name = name1;
        price = price1;
        stock = stock1;
        left = right = nullptr;
    }
};
class bst
{
    node * root;
    
    void insertproduct(int id1,string name1, int stock1, double price1)
    {
        node * temp = root;
        if (root == nullptr)
        {
            root = new node (id1,name1,price1,stock1);
        }
        while (temp)
        {
            if (temp->id > id1)
            {
                if (temp->left)
                {
                    temp = temp->left;
                }
                else 
                {
                temp->left = new node(id1,name1,price1,stock1);
                break;
                }
            }
            else 
            {
                if (temp->right)
                {
                    temp = temp->right;
                }
                else
                {
                temp->right = new node(id1,name1,price1,stock1);
                break;
                }
            }
        }
    }
    bool search(int key)
    {
        if (searchhelper(key,root))
        return true;
        else 
        return false;
    }
    bool searchhelper (int key, node * parent)
    {
        if (parent->id == NULL)
        return false;
        else if (parent->id == key)
        return true;
        else if (parent->id > key)
        return searchhelper(key,parent->left);
        else 
        return searchhelper(key,parent->right);
    }
};
