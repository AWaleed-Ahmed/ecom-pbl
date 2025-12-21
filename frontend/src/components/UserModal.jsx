import { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

function UserModal({ isOpen, onClose, onUserSelect }) {
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      await axios.get("http://localhost:3000/api/users");
      // Backend returns mock data, we'll use localStorage for now
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      setUsers(storedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!newUser.name || !newUser.email) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    // Auto-generate userId (max + 1)
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const maxId =
      storedUsers.length > 0
        ? Math.max(...storedUsers.map((u) => u.userId))
        : 0;
    const newUserId = maxId + 1;

    try {
      await axios.post("http://localhost:3000/api/users", {
        userId: newUserId,
        name: newUser.name,
        email: newUser.email,
      });

      // Store in localStorage
      const updatedUsers = [
        ...storedUsers,
        {
          userId: newUserId,
          name: newUser.name,
          email: newUser.email,
        },
      ];
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Select the new user
      onUserSelect({
        userId: newUserId,
        name: newUser.name,
        email: newUser.email,
      });
      onClose();
    } catch (error) {
      setError("Failed to create user");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    onUserSelect(user);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-dark/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark/10">
          <h2 className="text-2xl font-bold text-dark">
            {showCreateForm ? "CREATE ACCOUNT" : "SELECT USER"}
          </h2>
          <button
            onClick={onClose}
            className="text-dark/60 hover:text-dark transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showCreateForm ? (
            // User Selection
            <>
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-dark/60 mb-4">No users found</p>
                  <p className="text-sm text-dark/40 mb-4">
                    Create an account to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                  {users.map((user) => (
                    <button
                      key={user.userId}
                      onClick={() => handleUserSelect(user)}
                      className="w-full text-left p-4 bg-background hover:bg-primary/10 rounded-lg transition-colors border border-dark/5"
                    >
                      <div className="font-semibold text-dark">{user.name}</div>
                      <div className="text-sm text-dark/60">{user.email}</div>
                      <div className="text-xs font-mono text-dark/40 mt-1">
                        ID: {user.userId}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full bg-primary hover:bg-primary/90 text-dark font-bold py-3 rounded transition-all"
              >
                CREATE NEW ACCOUNT
              </button>
            </>
          ) : (
            // Create User Form
            <form onSubmit={handleCreateUser}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    USER ID
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-dark/20 rounded focus:outline-none focus:border-primary"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-dark/20 rounded focus:outline-none focus:border-primary"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setError("");
                    setNewUser({ userId: "", name: "", email: "" });
                  }}
                  className="flex-1 bg-background hover:bg-dark/5 text-dark font-bold py-3 rounded transition-all"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-dark font-bold py-3 rounded transition-all disabled:opacity-50"
                >
                  {loading ? "CREATING..." : "CREATE"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserModal;
