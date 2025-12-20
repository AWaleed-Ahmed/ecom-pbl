//for product recommendation
// vector<int> adjList[1000];   // adjacency list
// void addEdge(int productA, int productB);
// void showRecommendations(int productId);
// void printGraph();

//waleed
#include <iostream>
#include <vector>
using namespace std;

class graph
{
    private:
    vector<int> adjList[1000];

    public:
    void addedge(int productid1, int productid2)
    {
        adjList[productid1].push_back(productid2);
        adjList[productid2].push_back(productid1);
    }
    vector<int> recommendation(int productid)
    {
        vector<int> products;
        for (int i=0; i<adjList[productid].size();i++)
        {
            products.push_back(adjList[productid][i]);
        }
        return products;
    }
};