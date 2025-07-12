import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ArrowRight, TrendingUp, Star, Users } from "lucide-react";
import type { Item } from "@shared/schema";

export default function Home() {
  const { data: featuredItems = [], isLoading } = useQuery<Item[]>({
    queryKey: ["/api/items"],
    queryParams: { limit: 12 },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Welcome to Your Sustainable Wardrobe
            </h1>
            <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
              Discover amazing fashion finds from our community. Swap, earn points, and make a positive impact on the planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold shadow-md border-2 border-white">
                <Link href="/browse" className="text-green-600 hover:text-green-700">
                  Browse Items <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-green-700 text-white hover:bg-green-800 font-semibold shadow-md border-2 border-green-700">
                <Link href="/add-item" className="text-white hover:text-white">
                  List an Item
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">2,450+ Active Items</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">50K+ Members</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Star className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">4.9★ Avg Rating</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-green-600 font-bold">🌱</span>
              <span className="text-lg font-semibold text-gray-900">2M+ CO₂ Saved</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/browse?category=women-dresses">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">👗</div>
                  <h3 className="font-semibold text-gray-900 mb-1">Dresses</h3>
                  <p className="text-sm text-gray-600">Elegant & Casual</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/browse?category=men-shirts">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">👔</div>
                  <h3 className="font-semibold text-gray-900 mb-1">Shirts</h3>
                  <p className="text-sm text-gray-600">Formal & Casual</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/browse?category=women-shoes">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">👠</div>
                  <h3 className="font-semibold text-gray-900 mb-1">Shoes</h3>
                  <p className="text-sm text-gray-600">All Styles</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/browse?category=accessories">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">👜</div>
                  <h3 className="font-semibold text-gray-900 mb-1">Accessories</h3>
                  <p className="text-sm text-gray-600">Bags & More</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Items</h2>
              <p className="text-gray-600">Discover amazing pieces from our community</p>
            </div>
            <Button asChild variant="outline" className="text-gray-900 border-gray-300 hover:bg-gray-50 font-medium">
              <Link href="/browse">View All</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {featuredItems.slice(0, 12).map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {!isLoading && featuredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4 font-medium">No items available yet.</p>
              <Button asChild className="bg-green-600 text-white hover:bg-green-700 font-semibold shadow-md">
                <Link href="/add-item" className="text-white hover:text-white">
                  Be the first to list an item!
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Simple steps to sustainable fashion</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Badge className="bg-green-100 text-green-600 mb-4">Step 1</Badge>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">List Your Items</h3>
                <p className="text-gray-600">Upload photos and details of clothes you no longer wear.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Badge className="bg-green-100 text-green-600 mb-4">Step 2</Badge>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Swap or Redeem</h3>
                <p className="text-gray-600">Find items you love and propose swaps or use points.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Badge className="bg-green-100 text-green-600 mb-4">Step 3</Badge>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Enjoy & Repeat</h3>
                <p className="text-gray-600">Receive your items and continue the sustainable cycle.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
