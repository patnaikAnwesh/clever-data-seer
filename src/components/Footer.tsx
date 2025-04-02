
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-stock-blue text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/lovable-uploads/c0a5d0d3-3af9-4c5a-b0fa-f81460aeab8d.png" 
                alt="JHS Logo" 
                className="h-10 w-10" 
              />
              <span className="text-xl font-bold text-stock-orange">JHS</span>
            </div>
            <p className="text-gray-400 text-sm">
              JHS was started with a common goal of serving the finance community while maintaining integrity. Our members bring to table their unique expertise and experience of stock market which they would like to pass on to future investors.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Contact Us</h3>
            <address className="not-italic text-gray-400 text-sm">
              <p>JHS Office 206, Platform Solaris,</p>
              <p>NE Huddle Road, Churchgate DT</p>
              <p>Mumbai, Maharashtra, India</p>
              <p className="mt-2">info@jhs.com</p>
              <p>+91 98 19348652</p>
            </address>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-stock-orange transition-colors">Home</Link></li>
              <li><Link to="/dashboard" className="hover:text-stock-orange transition-colors">Dashboard</Link></li>
              <li><Link to="/about" className="hover:text-stock-orange transition-colors">About</Link></li>
              <li><Link to="/predict" className="hover:text-stock-orange transition-colors">Predict</Link></li>
              <li><Link to="/contact" className="hover:text-stock-orange transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} JHS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
