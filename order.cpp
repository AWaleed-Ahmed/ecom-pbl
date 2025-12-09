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

class Order
{
public:
    int orderId;
    std::vector<int> productIds;
    double totalPrice;
    std::string status;
    
    void display()
    {
        std::cout << "Order ID: " << orderId << "\n";
        std::cout << "Product IDs: ";
        for (int id : productIds)
            std::cout << id << " ";
        std::cout << "\nTotal Price: " << totalPrice << "\n";
        std::cout << "Status: " << status << "\n";
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
            // Print
            current = current->next;
        }
    };

    void saveOrders()
    {
        std::ofstream file;
        file.open("orders.txt");

        if (!file)
            return;

        OrderNode *current = front;
        while (current)
        {
            file << current->data.orderId << " "
            << current->data.totalPrice << " "
            << current->data.status << "\n";
            current = current->next;
        }
        file.close();
    };
    void loadOrders()
    {
        std::ifstream file("orders.txt");
    };
};
