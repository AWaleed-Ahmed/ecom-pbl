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

    bool search(int key)//key is id
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

    //this works like key is input then it checks if the target exists and goes to target and then it disconnets the
    //targetroot from itself and then disconnects it from its children and passes it to removehelper function where they are reinserted to the 
    //whole insertproduct function
    void removeproduct(int key) 
    {
        node * target = root;
        node * targetparent = nullptr;
        while (target != nullptr && target->id != key )
        {
            targetparent = target;
            if (target->id > key)
            target = target->left;
            else 
            target = target->right;
        }
        if (!target)
        return;
        if (targetparent == nullptr) 
        root = nullptr;
        else if (targetparent->left == target)
        targetparent->left = nullptr;
        else if (targetparent->right == target)
        targetparent->right = nullptr;
        node * leftsubtree = target->left;
        node * rightsubtree = target->right;
        target->left = nullptr;
        target->right = nullptr;
        removehelper(leftsubtree);
        removehelper(rightsubtree);
        delete target;
    }
    void removehelper(node * parent)
    {
        node * temp = parent;
        if (!temp)
        return;
        node * rightone = temp->right;
        node * leftone = temp->left;
        temp->left = nullptr;
        temp->right = nullptr;
        insertproduct(temp->id,temp->name,temp->stock,temp->price);
        removehelper(rightone);
        removehelper(leftone);
    }
};
