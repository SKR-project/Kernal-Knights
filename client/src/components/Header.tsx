import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Heart, ArrowLeftRight, Menu, Coins } from "lucide-react";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-rewear-green text-white text-center py-2 text-sm">
        <span>🌱 Join the sustainable fashion movement - Swap, don't shop! Free shipping on all exchanges</span>
      </div>
      
      {/* Main navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold rewear-green">ReWear</h1>
                <p className="text-xs text-gray-500 -mt-1">Sustainable Fashion</p>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-gray-700 hover:text-rewear-green px-3 py-2 text-sm font-medium flex items-center">
                    Men
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link href="/browse?category=men-shirts">Shirts</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/browse?category=men-pants">Pants</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/browse?category=men-shoes">Shoes</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-gray-700 hover:text-rewear-green px-3 py-2 text-sm font-medium flex items-center">
                    Women
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link href="/browse?category=women-dresses">Dresses</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/browse?category=women-tops">Tops</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/browse?category=women-shoes">Shoes</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-gray-700 hover:text-rewear-green px-3 py-2 text-sm font-medium flex items-center">
                    Kids
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link href="/browse?category=kids-clothing">Clothing</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/browse?category=kids-shoes">Shoes</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-gray-700 hover:text-rewear-green px-3 py-2 text-sm font-medium flex items-center">
                    Home & Living
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link href="/browse?category=home-decor">Decor</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/browse?category=home-textiles">Textiles</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-rewear-green/10 px-3 py-1 rounded-full">
                <Coins className="h-4 w-4 text-rewear-green" />
                <span className="text-sm font-medium rewear-green">
                  {user?.points || 0} pts
                </span>
              </div>
              
              <Button variant="ghost" size="sm" asChild>
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeftRight className="h-5 w-5" />
                  <Badge variant="destructive" className="ml-1">3</Badge>
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger>
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {user?.firstName?.[0] || 'U'}
                      </span>
                    </div>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/add-item">List an Item</Link>
                  </DropdownMenuItem>
                  {user?.email?.includes('admin') && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <a href="/api/logout">Logout</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
