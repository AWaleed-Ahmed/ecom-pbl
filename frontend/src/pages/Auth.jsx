import { useState } from "react";
import axios from "axios";

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingUsers, setExistingUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.name || !formData.email) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      // Auto-generate userId
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const maxId =
        storedUsers.length > 0
          ? Math.max(...storedUsers.map((u) => u.userId))
          : 0;
      const newUserId = maxId + 1;

      await axios.post("http://localhost:3000/api/users", {
        userId: newUserId,
        name: formData.name,
        email: formData.email,
      });

      const newUser = {
        userId: newUserId,
        name: formData.name,
        email: formData.email,
      };

      const updatedUsers = [...storedUsers, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      onAuthSuccess(newUser);
    } catch (error) {
      setError("Failed to create account");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (storedUsers.length === 0) {
      setError("No users found. Please create an account.");
      return;
    }
    setExistingUsers(storedUsers);
    setShowUserList(true);
  };

  const handleUserSelect = (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    onAuthSuccess(user);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background Color */}
      <div className="flex-1 bg-background relative flex items-center justify-center p-12">
        <div className="max-w-md w-full">
          <h1 className="text-6xl font-bold text-dark mb-4 tracking-tight">
            MOSS
          </h1>
          <p className="text-2xl text-dark/70 leading-relaxed">
            Your one-stop shop for everything you need.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <p className="text-dark/60">Premium quality products</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <p className="text-dark/60">Fast & secure checkout</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <p className="text-dark/60">24/7 customer support</p>
            </div>
          </div>
        </div>

        {/* Wavy Border */}
        <div className="absolute right-0 top-0 bottom-0 w-24">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 800"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0 Q50,100 0,200 T0,400 T0,600 T0,800 L100,800 L100,0 Z"
              fill="#F2F0E6"
            />
          </svg>
        </div>
      </div>

      {/* Right Side - Dark Color */}
      <div className="flex-1 bg-dark flex items-center justify-center p-12">
        <div className="max-w-md w-full">
          {!showUserList ? (
            <>
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-background mb-2">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-background/60">
                  {isLogin
                    ? "Select from existing users or create new"
                    : "Join us and start shopping"}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {isLogin ? (
                <div className="space-y-4">
                  <button
                    onClick={handleLogin}
                    className="w-full bg-primary hover:bg-primary/90 text-dark font-bold py-4 rounded-lg transition-all"
                  >
                    SELECT EXISTING USER
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className="w-full bg-background/10 hover:bg-background/20 text-background font-bold py-4 rounded-lg transition-all border border-background/20"
                  >
                    CREATE NEW ACCOUNT
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-background/80 mb-2">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background/5 border border-background/20 rounded-lg text-background placeholder-background/40 focus:outline-none focus:border-primary transition-colors"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-background/80 mb-2">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background/5 border border-background/20 rounded-lg text-background placeholder-background/40 focus:outline-none focus:border-primary transition-colors"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-dark font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setError("");
                      setFormData({ name: "", email: "" });
                    }}
                    className="w-full text-background/60 hover:text-background transition-colors text-sm"
                  >
                    Already have an account? Login
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              <div className="mb-6">
                <button
                  onClick={() => setShowUserList(false)}
                  className="text-background/60 hover:text-background text-sm mb-4"
                >
                  ← Back
                </button>
                <h2 className="text-3xl font-bold text-background">
                  Select User
                </h2>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {existingUsers.map((user) => (
                  <button
                    key={user.userId}
                    onClick={() => handleUserSelect(user)}
                    className="w-full text-left p-4 bg-background/5 hover:bg-background/10 rounded-lg transition-colors border border-background/10 hover:border-primary"
                  >
                    <div className="font-semibold text-background">
                      {user.name}
                    </div>
                    <div className="text-sm text-background/60">
                      {user.email}
                    </div>
                    <div className="text-xs font-mono text-background/40 mt-1">
                      ID: {user.userId}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
