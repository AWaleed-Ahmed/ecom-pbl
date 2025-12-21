// for product recommendation
//  vector<int> adjList[1000];   // adjacency list
//  void addEdge(int productA, int productB);
//  void showRecommendations(int productId);
//  void printGraph();

// waleed
#include <iostream>
#include <vector>
#include <fstream>
#include <sstream>
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
        for (int i = 0; i < adjList[productid].size(); i++)
        {
            products.push_back(adjList[productid][i]);
        }
        return products;
    }

    void saveGraph(const string &filename)
    {
        ofstream file(filename);
        if (!file.is_open())
        {
            cout << "Error opening file for writing.\n";
            return;
        }

        file << "ProductID1,ProductID2\n";

        // Save edges (avoid duplicates by only saving when productid1 < productid2)
        for (int i = 0; i < 1000; i++)
        {
            for (int j : adjList[i])
            {
                if (i < j) // Avoid duplicate edges
                {
                    file << i << "," << j << "\n";
                }
            }
        }
        file.close();
    }

    void loadGraph(const string &filename)
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
                continue; // Skip header
            }

            stringstream ss(line);
            string id1Str, id2Str;

            getline(ss, id1Str, ',');
            getline(ss, id2Str, ',');

            if (!id1Str.empty() && !id2Str.empty())
            {
                int productId1 = stoi(id1Str);
                int productId2 = stoi(id2Str);
                addedge(productId1, productId2);
            }
        }

        file.close();
    }
};