import { LogOut, User, Search, Shield } from "lucide-react";

function Navbar({
  cartCount,
  currentUser,
  onCartClick,
  onLogout,
  searchQuery,
  onSearchChange,
  onAdminClick,
  isAdmin,
}) {
  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="container mx-auto py-4 flex items-center justify-between border-b-2 border-b-dark/10">
        <h1 className="text-3xl font-bold text-dark tracking-tight">MOSS</h1>

        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-dark/20 focus:outline-none focus:border-primary transition-colors w-64"
            />
          </div>
          {currentUser && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-dark">
                <User className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {currentUser.name}
                </span>
              </div>

              {isAdmin && (
                <button
                  onClick={onAdminClick}
                  className="text-dark/60 hover:text-primary transition-colors cursor-pointer"
                  title="Admin Panel"
                >
                  <Shield className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={onLogout}
                className="text-dark/60 hover:text-primary transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}

          <button
            onClick={onCartClick}
            className="font-mono text-dark text-lg hover:text-primary transition-colors relative cursor-pointer"
          >
            CART
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-6 bg-primary text-dark w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
