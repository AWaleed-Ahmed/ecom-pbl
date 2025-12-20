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
#include <fstream>
#include <string.h>
#include <sstream>
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
    public:
    node * root;
    
    //insertion function
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

    //searching function
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

    //removing function
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

    //display
    string inorder(node* root) 
    {
    if (!root) return "";

    string result = "";
    result += inorder(root->left);
    result += "ID: " + to_string(root->id) +
              ", Name: " + root->name +
              ", Price: " + to_string(root->price) +
              ", Stock: " + to_string(root->stock) + "\n";
    result += inorder(root->right);

    return result;
    }
    string preorder(node* root) 
    {
    if (!root) return "";

    string result = "";
    result += "ID: " + to_string(root->id) +
              ", Name: " + root->name +
              ", Price: " + to_string(root->price) +
              ", Stock: " + to_string(root->stock) + "\n";
    result += preorder(root->left);
    result += preorder(root->right);

    return result;
    }
    string postorder(node* root) 
    {
        if (!root) return "";

        string result = "";
        result += postorder(root->left);
        result += postorder(root->right);
        result += "ID: " + to_string(root->id) +
                ", Name: " + root->name +
                ", Price: " + to_string(root->price) +
                ", Stock: " + to_string(root->stock) + "\n";

        return result;
    }
    
    //price finding
    int getprice (int key)
    {
        int priceofproduct = getpricehelper (key,root);
        return priceofproduct;
    }
    int getpricehelper(int key, node * parent)
    {
        node * temp = parent;

        if (!parent)//null check
        return -1;

        if (parent->id == key)
        return parent->price;
        else if (parent->id > key)
        getpricehelper(key,parent->left);
        else 
        getpricehelper(key,parent->right);
    }

    //saving and loading functions
    void saveToCSV(const string& filename) 
    {
        ofstream file(filename);
        if (!file.is_open()) {
            cout << "Error opening file for writing.\n";
            return;
        }

        file << "ID,Name,Price,Stock\n";

        saveInorderCSV(root, file);
        file.close();
    }

    void saveInorderCSV(node* parent, ofstream& file) 
    {
        if (!parent) return;

        saveInorderCSV(parent->left, file);

        file << parent->id << ","
            << parent->name << ","
            << parent->price << ","
            << parent->stock << "\n";

        saveInorderCSV(parent->right, file);
    }

    void loadFromCSV(const string& filename) 
    {
    ifstream file(filename);
    if (!file.is_open()) 
    {
        cout << "Error opening file for reading.\n";
        return;
    }

    string line;
    bool firstLine = true;

    while (getline(file, line)) {
        if (firstLine)
        { 
            firstLine = false;
            continue;
        }

        stringstream ss(line);
        string idStr, name, priceStr, stockStr;

        getline(ss, idStr, ',');
        getline(ss, name, ',');
        getline(ss, priceStr, ',');
        getline(ss, stockStr, ',');

        int id = stoi(idStr);
        double price = stod(priceStr);
        int stock = stoi(stockStr);

        insertproduct(id, name, stock, price);
    }

    file.close();
    }
};
