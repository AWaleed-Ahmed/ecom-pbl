function Navbar({ cartCount, onCartClick }) {
  return (
    <nav className="bg-white border-b border-dark/10 sticky top-0 z-50">
      <div className="container mx-auto px-8 py-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dark tracking-tight">MOSS</h1>
        <button
          onClick={onCartClick}
          className="font-mono text-dark text-lg hover:text-primary transition-colors relative"
        >
          CART
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-6 bg-primary text-dark w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
