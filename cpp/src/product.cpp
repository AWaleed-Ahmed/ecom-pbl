#include "../include/product.h"
#include <iostream>
#include <fstream>
#include <sstream>
using namespace std;

// node constructor implementation
node::node(int id1, string name1, double price1, int stock1)
{
    id = id1;
    name = name1;
    price = price1;
    stock = stock1;
    left = right = nullptr;
}

// bst constructor
bst::bst() : root(nullptr) {}

// private insertion helper
void bst::insertproduct(int id1, string name1, int stock1, double price1)
{
    node *temp = root;
    if (root == nullptr)
    {
        root = new node(id1, name1, price1, stock1);
        return;
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
                temp->left = new node(id1, name1, price1, stock1);
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
                temp->right = new node(id1, name1, price1, stock1);
                break;
            }
        }
    }
}

// public insert method
void bst::insert(int id, string name, double price, int stock)
{
    insertproduct(id, name, stock, price);
}

// searching function
bool bst::search(int key)
{
    return searchhelper(key, root);
}

bool bst::searchhelper(int key, node *parent)
{
    if (!parent)
        return false;
    else if (parent->id == key)
        return true;
    else if (parent->id > key)
        return searchhelper(key, parent->left);
    else
        return searchhelper(key, parent->right);
}

// public remove method
void bst::remove(int key)
{
    node *target = root;
    node *targetparent = nullptr;
    while (target != nullptr && target->id != key)
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
    node *leftsubtree = target->left;
    node *rightsubtree = target->right;
    target->left = nullptr;
    target->right = nullptr;
    removehelper(leftsubtree);
    removehelper(rightsubtree);
    delete target;
}

void bst::removehelper(node *parent)
{
    node *temp = parent;
    if (!temp)
        return;
    node *rightone = temp->right;
    node *leftone = temp->left;
    temp->left = nullptr;
    temp->right = nullptr;
    insertproduct(temp->id, temp->name, temp->stock, temp->price);
    removehelper(rightone);
    removehelper(leftone);
}

// private display helpers
string bst::inorder(node *root)
{
    if (!root)
        return "";

    string result = "";
    result += inorder(root->left);
    result += "ID: " + to_string(root->id) +
              ", Name: " + root->name +
              ", Price: " + to_string(root->price) +
              ", Stock: " + to_string(root->stock) + "\n";
    result += inorder(root->right);

    return result;
}

string bst::preorder(node *root)
{
    if (!root)
        return "";

    string result = "";
    result += "ID: " + to_string(root->id) +
              ", Name: " + root->name +
              ", Price: " + to_string(root->price) +
              ", Stock: " + to_string(root->stock) + "\n";
    result += preorder(root->left);
    result += preorder(root->right);

    return result;
}

string bst::postorder(node *root)
{
    if (!root)
        return "";

    string result = "";
    result += postorder(root->left);
    result += postorder(root->right);
    result += "ID: " + to_string(root->id) +
              ", Name: " + root->name +
              ", Price: " + to_string(root->price) +
              ", Stock: " + to_string(root->stock) + "\n";

    return result;
}

// public display methods
string bst::inorder()
{
    return inorder(root);
}

string bst::preorder()
{
    return preorder(root);
}

string bst::postorder()
{
    return postorder(root);
}

void bst::display()
{
    cout << inorder();
}

// price finding
double bst::getprice(int key)
{
    return getpricehelper(key, root);
}

int bst::getpricehelper(int key, node *parent)
{
    if (!parent)
        return -1;

    if (parent->id == key)
        return parent->price;
    else if (parent->id > key)
        return getpricehelper(key, parent->left);
    else
        return getpricehelper(key, parent->right);
}

// get product node
node *bst::getProduct(int id)
{
    node *temp = root;
    while (temp)
    {
        if (temp->id == id)
            return temp;
        else if (temp->id > id)
            temp = temp->left;
        else
            temp = temp->right;
    }
    return nullptr;
}

// saving and loading functions
void bst::saveProducts(const string &filename)
{
    ofstream file(filename);
    if (!file.is_open())
    {
        cout << "Error opening file for writing.\n";
        return;
    }

    file << "ID,Name,Price,Stock\n";

    saveInorderCSV(root, file);
    file.close();
}

void bst::saveInorderCSV(node *parent, ofstream &file)
{
    if (!parent)
        return;

    saveInorderCSV(parent->left, file);

    file << parent->id << ","
         << parent->name << ","
         << parent->price << ","
         << parent->stock << "\n";

    saveInorderCSV(parent->right, file);
}

void bst::loadProducts(const string &filename)
{
    ifstream file(filename);
    if (!file.is_open())
    {
        cout << "Error opening file for reading.\n";
        return;
    }

    string line;
    bool firstLine = true;

    while (getline(file, line))
    {
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

// Search products by name (case-insensitive partial match)
void bst::searchByNameHelper(node *parent, const string &query, string &results)
{
    if (!parent)
        return;

    searchByNameHelper(parent->left, query, results);

    // Convert both strings to lowercase for case-insensitive comparison
    string lowerName = parent->name;
    string lowerQuery = query;
    for (char &c : lowerName)
        c = tolower(c);
    for (char &c : lowerQuery)
        c = tolower(c);

    if (lowerName.find(lowerQuery) != string::npos)
    {
        results += to_string(parent->id) + "|" +
                   parent->name + "|" +
                   to_string(parent->price) + "|" +
                   to_string(parent->stock) + "\n";
    }

    searchByNameHelper(parent->right, query, results);
}

string bst::searchByName(const string &query)
{
    string results = "";
    searchByNameHelper(root, query, results);
    return results;
}
