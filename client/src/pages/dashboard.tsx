import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { queryClient } from "@/lib/queryClient";
import { 
  Coins, 
  Package, 
  ArrowLeftRight, 
  Star, 
  Calendar,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import type { Item, Swap } from "@shared/schema";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: userItems = [], isLoading: itemsLoading } = useQuery<Item[]>({
    queryKey: ["/api/users", user?.id, "items"],
    enabled: !!user?.id,
  });

  const { data: swaps = [], isLoading: swapsLoading } = useQuery<Swap[]>({
    queryKey: ["/api/swaps"],
    enabled: !!user?.id,
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
    },
    onSuccess: () => {
      toast({
        title: "Item Deleted",
        description: "Your item has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "items"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-96" />
            <div className="lg:col-span-2">
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeItems = userItems.filter(item => item.status === 'active' || item.status === 'pending');
  const swappedItems = userItems.filter(item => item.status === 'swapped');
  const pendingSwaps = swaps.filter(swap => swap.status === 'pending');
  const completedSwaps = swaps.filter(swap => swap.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'swapped':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteItem = (itemId: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItemMutation.mutate(itemId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your items, track swaps, and grow your sustainable wardrobe</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-medium text-gray-600">
                        {user?.firstName?.[0] || 'U'}
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {user?.firstName || user?.email || 'User'}
                    {user?.lastName && ` ${user.lastName}`}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                    <Coins className="h-5 w-5" />
                    <span className="font-semibold text-lg">{user?.points || 0} Points</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Items Listed:</span>
                      <span className="font-medium">{userItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Successful Swaps:</span>
                      <span className="font-medium">{completedSwaps.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Member Since:</span>
                      <span className="font-medium">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Active Items</span>
                  </div>
                  <span className="font-semibold">{activeItems.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Pending Swaps</span>
                  </div>
                  <span className="font-semibold">{pendingSwaps.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Total Value</span>
                  </div>
                  <span className="font-semibold">
                    {userItems.reduce((sum, item) => sum + item.pointsValue, 0)} pts
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button asChild className="w-full bg-rewear-green hover:bg-rewear-green-dark">
              <Link href="/add-item">
                <Plus className="h-4 w-4 mr-2" />
                List New Item
              </Link>
            </Button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Listings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Items</CardTitle>
              </CardHeader>
              <CardContent>
                {itemsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Skeleton className="w-16 h-16 rounded" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-8 w-16" />
                      </div>
                    ))}
                  </div>
                ) : userItems.length > 0 ? (
                  <div className="space-y-3">
                    {userItems.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                        <div className="w-16 h-16 rounded overflow-hidden bg-gray-200">
                          {item.imageUrls && item.imageUrls.length > 0 ? (
                            <img
                              src={item.imageUrls[0]}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Package className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600">
                            {item.brand && `${item.brand} • `}Size {item.size}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(item.status || 'pending')}>
                              {item.status || 'pending'}
                            </Badge>
                            <span className="text-sm text-green-600 font-medium">
                              {item.pointsValue} pts
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/items/${item.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={deleteItemMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {userItems.length > 5 && (
                      <div className="text-center pt-4">
                        <Link href="/browse?userId=me">
                          <Button variant="outline">View All Items</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
                    <p className="text-gray-600 mb-4 font-medium">Start by listing your first item!</p>
                    <Button asChild className="bg-green-600 text-white hover:bg-green-700 font-semibold shadow-md">
                      <Link href="/add-item" className="text-white hover:text-white">
                        List an Item
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ongoing Swaps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Swaps</CardTitle>
              </CardHeader>
              <CardContent>
                {swapsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : swaps.length > 0 ? (
                  <div className="space-y-3">
                    {swaps.slice(0, 5).map((swap) => (
                      <div key={swap.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            {swap.type === 'direct_swap' ? 'Direct Swap' : 'Points Redemption'}
                          </span>
                          <Badge className={getStatusColor(swap.status || 'pending')}>
                            {swap.status || 'pending'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {swap.type === 'points_redemption' 
                            ? `${swap.pointsOffered} points offered`
                            : 'Item exchange'
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(swap.createdAt!).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ArrowLeftRight className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No swaps yet</h3>
                    <p className="text-gray-600 mb-4">Start browsing to find items you love!</p>
                    <Button asChild>
                      <Link href="/browse">Browse Items</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
