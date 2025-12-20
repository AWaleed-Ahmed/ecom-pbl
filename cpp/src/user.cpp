#include "../include/user.h"
#include <iostream>
#include <fstream>
#include <sstream>

// User class implementation
User::User() : userId(0), name(""), email("") {}

User::User(int id, std::string userName, std::string userEmail)
    : userId(id), name(userName), email(userEmail) {}

void User::display()
{
    std::cout << "User ID: " << userId << "\n";
    std::cout << "Name: " << name << "\n";
    std::cout << "Email: " << email << "\n";
    std::cout << "Cart items:\n";
    cart.viewCart();
}

// UserNode implementation
UserNode::UserNode(User u) : user(u), next(nullptr) {}

// UserManager class implementation
UserManager::UserManager() : count(0)
{
    // Initialize hash table with nullptr
    for (int i = 0; i < TABLE_SIZE; i++)
    {
        hashTable[i] = nullptr;
    }
}

UserManager::~UserManager()
{
    // Clean up all linked lists in hash table
    for (int i = 0; i < TABLE_SIZE; i++)
    {
        UserNode *current = hashTable[i];
        while (current)
        {
            UserNode *temp = current;
            current = current->next;
            delete temp;
        }
    }
}

int UserManager::hashFunction(int userId)
{
    // Simple modulo hash function
    return userId % TABLE_SIZE;
}

void UserManager::addUser(User u)
{
    int index = hashFunction(u.userId);

    // Check if user already exists
    UserNode *current = hashTable[index];
    while (current)
    {
        if (current->user.userId == u.userId)
        {
            std::cout << "User with ID " << u.userId << " already exists\n";
            return;
        }
        current = current->next;
    }

    // Add new user at the beginning of the chain
    UserNode *newNode = new UserNode(u);
    newNode->next = hashTable[index];
    hashTable[index] = newNode;
    count++;
    std::cout << "User added successfully (Hash index: " << index << ")\n";
}

User *UserManager::getUser(int id)
{
    int index = hashFunction(id);

    // Search in the chain
    UserNode *current = hashTable[index];
    while (current)
    {
        if (current->user.userId == id)
        {
            return &(current->user);
        }
        current = current->next;
    }

    return nullptr; // User not found
}

void UserManager::removeUser(int id)
{
    int index = hashFunction(id);

    UserNode *current = hashTable[index];
    UserNode *prev = nullptr;

    // Search for user in chain
    while (current)
    {
        if (current->user.userId == id)
        {
            // Remove node
            if (prev)
            {
                prev->next = current->next;
            }
            else
            {
                hashTable[index] = current->next;
            }
            delete current;
            count--;
            std::cout << "User removed successfully\n";
            return;
        }
        prev = current;
        current = current->next;
    }

    std::cout << "User not found\n";
}

void UserManager::listUsers()
{
    if (count == 0)
    {
        std::cout << "No users found\n";
        return;
    }

    std::cout << "User List (Total: " << count << "):\n";
    std::cout << "ID | Name | Email | Hash Index\n";
    std::cout << "--------------------------------------------\n";

    for (int i = 0; i < TABLE_SIZE; i++)
    {
        UserNode *current = hashTable[i];
        while (current)
        {
            std::cout << current->user.userId << " | "
                      << current->user.name << " | "
                      << current->user.email << " | "
                      << i << "\n";
            current = current->next;
        }
    }
}

int UserManager::getUserCount()
{
    return count;
}

void UserManager::saveUsers(const std::string &filename)
{
    std::ofstream file(filename);
    if (!file.is_open())
    {
        std::cout << "Error opening file for writing\n";
        return;
    }

    file << "UserID,Name,Email\n";

    // Traverse entire hash table
    for (int i = 0; i < TABLE_SIZE; i++)
    {
        UserNode *current = hashTable[i];
        while (current)
        {
            file << current->user.userId << ","
                 << current->user.name << ","
                 << current->user.email << "\n";
            current = current->next;
        }
    }

    file.close();
    std::cout << "Users saved to " << filename << "\n";
}

void UserManager::loadUsers(const std::string &filename)
{
    std::ifstream file(filename);
    if (!file.is_open())
    {
        std::cout << "Error opening file for reading\n";
        return;
    }

    std::string line;
    bool firstLine = true;

    while (std::getline(file, line))
    {
        if (firstLine)
        {
            firstLine = false;
            continue;
        }

        std::stringstream ss(line);
        std::string idStr, name, email;

        std::getline(ss, idStr, ',');
        std::getline(ss, name, ',');
        std::getline(ss, email, ',');

        if (!idStr.empty())
        {
            int id = std::stoi(idStr);
            addUser(User(id, name, email)); // Uses hash table's addUser
        }
    }

    file.close();
    std::cout << "Loaded " << count << " users from " << filename << "\n";
}
