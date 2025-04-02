
import { Link } from "react-router-dom";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      toast({
        title: "Search",
        description: `Searching for ${searchValue}...`,
      });
      // In a real app, we would redirect to search results
      setSearchValue("");
    }
  };

  return (
    <nav className="bg-stock-blue text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <img 
            src="/lovable-uploads/c0a5d0d3-3af9-4c5a-b0fa-f81460aeab8d.png" 
            alt="JHS Logo" 
            className="h-10 w-10" 
          />
          <span className="text-2xl font-bold text-stock-orange">JHS</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="nav-link font-medium">Home</Link>
          <Link to="/predict" className="nav-link font-medium">Predict</Link>
          <Link to="/dashboard" className="nav-link font-medium">Dashboard</Link>
          <Link to="/about" className="nav-link font-medium">About</Link>
        </div>
        
        <form onSubmit={handleSearch} className="hidden md:flex items-center">
          <Input
            type="search"
            placeholder="Search for stocks..."
            className="w-64 bg-white/10 border-gray-600 focus:border-stock-orange"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button type="submit" variant="ghost" className="ml-2">
            <SearchIcon className="h-5 w-5" />
          </Button>
        </form>
        
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
