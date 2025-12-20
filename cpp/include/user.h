#ifndef USER_H
#define USER_H

#include <string>
#include "cart.h"

class User
{
public:
    int userId;
    std::string name;
    std::string email;
    ShoppingCart cart;

    User();
    User(int id, std::string userName, std::string userEmail);
    void display();
};

// Hash table node for chaining
struct UserNode
{
    User user;
    UserNode *next;

    UserNode(User u);
};

class UserManager
{
private:
    static const int TABLE_SIZE = 100; // Hash table size
    UserNode *hashTable[TABLE_SIZE];   // Array of linked lists
    int count;                         // Total number of users

    int hashFunction(int userId); // Hash function

public:
    UserManager();
    ~UserManager();
    void addUser(User u);
    User *getUser(int id);
    void removeUser(int id);
    void listUsers();
    int getUserCount();
    void saveUsers(const std::string &filename);
    void loadUsers(const std::string &filename);
};

#endif
