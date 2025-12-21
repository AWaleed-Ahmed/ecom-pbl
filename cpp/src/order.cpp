// int orderId;
// vector<int> productIds;   // can also use array if required
// double totalPrice;
// string status;            // "Pending", "Processing", "Completed"
// void display();
// int front, rear, size;
// Order orders[100];   // or dynamic array
// void enqueue(Order o);
// Order dequeue();
// bool isEmpty();
// bool isFull();
// Order peek();
// void displayQueue();
// void saveOrders(OrderQueue& oq);  // Save to file
// void loadOrders(OrderQueue& oq);  // Load from file
// rehan
#include <iostream>
#include <vector>
#include <fstream>
#include <sstream>
#include <iomanip>

class Order
{
public:
    long long orderId;
    int userId;
    std::vector<int> productIds;
    double totalPrice;
    std::string status;
    std::string orderDate;

    void display()
    {
        std::cout << "Order ID: " << orderId << "\n";
        std::cout << "User ID: " << userId << "\n";
        std::cout << "Product IDs: ";
        for (int id : productIds)
            std::cout << id << " ";
        std::cout << "\nTotal Price: " << totalPrice << "\n";
        std::cout << "Status: " << status << "\n";
        std::cout << "Date: " << orderDate << "\n";
    }
};

struct OrderNode
{
    Order data;
    OrderNode *next;

    OrderNode(Order &o)
    {
        data = o;
        next = nullptr;
    }
};

class OrderQueue
{
private:
    OrderNode *front, *rear;
    int size;

public:
    OrderQueue()
    {
        front = nullptr;
        rear = nullptr;
        size = 0;
    }

    void enqueue(Order o)
    {
        OrderNode *newNode = new OrderNode(o);
        if (rear == nullptr)
        {
            front = newNode;
            rear = newNode;
        }
        else
        {
            rear->next = newNode;
            rear = newNode;
        }
        size++;
    };

    Order dequeue()
    {
        if (front == nullptr)
            return Order();

        OrderNode *temp = front;
        Order orderReturn = temp->data;
        front = front->next;

        if (front == nullptr)
            rear = nullptr;
        delete (temp);
        size--;
        return orderReturn;
    };

    bool isEmpty()
    {
        return front == nullptr;
    };

    Order peek()
    {
        if (front == nullptr)
            return Order();
        return front->data;
    };

    void displayQueue()
    {
        if (front == nullptr)
            return;
        OrderNode *current = front;
        while (current)
        {
            std::cout << "Order ID: " << current->data.orderId;
            std::cout << " | Total Price: " << current->data.totalPrice;
            std::cout << " | Status: " << current->data.status << "\n";
            current = current->next;
        }
    };

    void saveOrders()
    {
        std::ofstream file;
        file.open("../../data/orders.csv");

        if (!file)
            return;

        file << "ID,UserID,ProductIDs,TotalPrice,Status,OrderDate\n";

        OrderNode *current = front;
        while (current)
        {
            file << current->data.orderId << ","
                 << current->data.userId << ",";

            // Write product IDs separated by semicolons
            for (size_t i = 0; i < current->data.productIds.size(); i++)
            {
                file << current->data.productIds[i];
                if (i < current->data.productIds.size() - 1)
                    file << ";";
            }

            file << ","
                 << std::fixed << std::setprecision(2) << current->data.totalPrice << ","
                 << current->data.status << ","
                 << current->data.orderDate << "\n";
            current = current->next;
        }
        file.close();
    };
    void loadOrders()
    {
        std::ifstream file("../../data/orders.csv");
        if (!file.is_open())
            return;

        std::string line;
        bool firstLine = true;

        while (std::getline(file, line))
        {
            if (firstLine)
            {
                firstLine = false;
                continue; // Skip header
            }

            std::stringstream ss(line);
            std::string token;
            Order newOrder;
            int fieldIndex = 0;

            while (std::getline(ss, token, ','))
            {
                if (fieldIndex == 0)
                    newOrder.orderId = std::stoll(token);
                else if (fieldIndex == 1)
                    newOrder.userId = std::stoi(token);
                else if (fieldIndex == 2)
                {
                    // Parse product IDs (semicolon-separated)
                    std::stringstream productSS(token);
                    std::string productId;
                    while (std::getline(productSS, productId, ';'))
                    {
                        if (!productId.empty())
                            newOrder.productIds.push_back(std::stoi(productId));
                    }
                }
                else if (fieldIndex == 3)
                    newOrder.totalPrice = std::stod(token);
                else if (fieldIndex == 4)
                    newOrder.status = token;
                else if (fieldIndex == 5)
                    newOrder.orderDate = token;

                fieldIndex++;
            }

            enqueue(newOrder);
        }

        file.close();
    };
};
