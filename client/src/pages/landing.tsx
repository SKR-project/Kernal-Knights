import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, ArrowLeftRight, Truck, Users, Recycle, TrendingUp, Globe } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="bg-rewear-green text-white text-center py-2 text-sm">
          <span>🌱 Join the sustainable fashion movement - Swap, don't shop! Free shipping on all exchanges</span>
        </div>
        
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold rewear-green">ReWear</h1>
              <p className="text-xs text-gray-500 -mt-1 ml-1">Sustainable Fashion</p>
            </div>
            
            <Button asChild>
              <a href="/api/login">Login</a>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Fashion Forward,
                <span className="block">Planet Friendly</span>
              </h1>
              <p className="text-xl mb-8 text-green-100">
                Join thousands of fashion lovers exchanging clothes through direct swaps or our innovative points system. Give your wardrobe a refresh while saving the planet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  <a href="/api/login">
                    Start Swapping <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                  <a href="/api/login">Browse Items</a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&w=600&h=400&fit=crop"
                alt="Sustainable fashion items arranged beautifully"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <div className="text-3xl font-bold rewear-green mb-2">50K+</div>
              <div className="text-gray-600">Active Members</div>
            </div>
            <div className="flex flex-col items-center">
              <ArrowLeftRight className="h-12 w-12 text-green-600 mb-4" />
              <div className="text-3xl font-bold rewear-green mb-2">200K+</div>
              <div className="text-gray-600">Items Exchanged</div>
            </div>
            <div className="flex flex-col items-center">
              <Recycle className="h-12 w-12 text-green-600 mb-4" />
              <div className="text-3xl font-bold rewear-green mb-2">85%</div>
              <div className="text-gray-600">Waste Reduction</div>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-12 w-12 text-green-600 mb-4" />
              <div className="text-3xl font-bold rewear-green mb-2">2M+</div>
              <div className="text-gray-600">CO₂ Pounds Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How ReWear Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to refresh your wardrobe sustainably</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. List Your Items</h3>
              <p className="text-gray-600">Upload photos of clothes you no longer wear. Add details about size, condition, and brand to help others find what they love.</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowLeftRight className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Swap or Redeem</h3>
              <p className="text-gray-600">Find items you love and propose direct swaps with other users, or use points earned from your listings to redeem items instantly.</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Enjoy & Repeat</h3>
              <p className="text-gray-600">Receive your new-to-you items and continue the cycle. Every exchange helps reduce textile waste and supports sustainable fashion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Sustainable Fashion Journey?</h2>
          <p className="text-xl mb-8 text-green-100">Join thousands of fashion lovers making a positive impact on the planet.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <a href="/api/login">Sign Up Free</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
              <a href="/api/login">List Your First Item</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold rewear-green mb-4">ReWear</h3>
              <p className="text-gray-400 mb-4">Making fashion sustainable, one swap at a time.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">How It Works</a></li>
                <li><a href="#" className="hover:text-white">Browse Items</a></li>
                <li><a href="#" className="hover:text-white">List an Item</a></li>
                <li><a href="#" className="hover:text-white">Points System</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Safety Guidelines</a></li>
                <li><a href="#" className="hover:text-white">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Sustainability</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ReWear. All rights reserved. Making fashion circular since 2024.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
