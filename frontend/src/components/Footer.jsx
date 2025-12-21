function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="container mx-auto pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-96 mb-8">
          {/* Left Section */}
          <div>
            <h3 className="text-5xl font-semibold text-primary mb-4">
              Say Hello!!!
            </h3>
            <p className="mb-6 text-md" style={{ color: "#F2F0E6" }}>
              Get the latest trends delivered to your inbox!!
            </p>
            <button
              className="text-dark font-mono px-8 py-2 hover:opacity-90 transition-opacity cursor-pointer"
              style={{ backgroundColor: "#F2F0E6" }}
            >
              SUBSCRIBE
            </button>
          </div>

          {/* Right Section - Links */}
          <div className="grid grid-cols-3">
            <div>
              <h4 className="font-bold mb-3 uppercase text-lg font-mono text-primary">
                Home
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: "#F2F0E6B3" }}>
                <li>Products</li>
                <li>About</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 uppercase text-lg font-mono text-primary">
                Company
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: "#F2F0E6B3" }}>
                <li>About Us</li>
                <li>Careers</li>
                <li>Press</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 uppercase text-lg text-primary font-mono">
                Social
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: "#F2F0E6B3" }}>
                <li>Instagram</li>
                <li>Twitter</li>
                <li>Facebook</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Border Line */}
        <div className="h-1 rounded-xl bg-primary/10 max-w-full mb-4"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm mb-8 text-primary/40 font-mono">
          <div>Privacy Policy</div>
          <div className="my-4 md:my-0">All rights reserved 2025@moss</div>
          <div>Terms & Conditions</div>
        </div>
      </div>

      {/* Giant MOSS Text */}
      <div className="relative overflow-hidden h-64">
        <div
          className="absolute -left-20 right-0 font-bold text-primary/20 select-none pointer-events-none"
          style={{
            fontSize: "33rem",
            lineHeight: "1",
            top: "-2rem",
          }}
        >
          MOSS
        </div>
      </div>
    </footer>
  );
}

export default Footer;
