import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Heart, ArrowLeftRight, Coins, MapPin, Calendar, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import type { Item, Swap } from "@shared/schema";

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [swapType, setSwapType] = useState<"direct" | "points">("points");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [pointsOffer, setPointsOffer] = useState("");
  const [message, setMessage] = useState("");

  const { data: item, isLoading } = useQuery<Item>({
    queryKey: ["/api/items", id],
    enabled: !!id,
  });

  const { data: userItems = [] } = useQuery<Item[]>({
    queryKey: ["/api/users", user?.id, "items"],
    enabled: !!user?.id && swapType === "direct",
  });

  const createSwapMutation = useMutation({
    mutationFn: async (swapData: any) => {
      return await apiRequest("POST", "/api/swaps", swapData);
    },
    onSuccess: () => {
      toast({
        title: "Swap Request Sent",
        description: "Your swap request has been sent to the item owner.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/swaps"] });
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
        description: "Failed to create swap request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleWishlistToggle = () => {
    // TODO: Implement wishlist functionality
    toast({
      title: "Added to Wishlist",
      description: "This item has been added to your wishlist.",
    });
  };

  const handleSwapRequest = () => {
    if (!item || !user) return;

    const swapData: any = {
      ownerItemId: item.id,
      ownerId: item.userId,
      type: swapType === "direct" ? "direct_swap" : "points_redemption",
      message,
    };

    if (swapType === "direct" && selectedItemId) {
      swapData.requesterItemId = parseInt(selectedItemId);
    } else if (swapType === "points" && pointsOffer) {
      const points = parseInt(pointsOffer);
      if (points > (user.points || 0)) {
        toast({
          title: "Insufficient Points",
          description: "You don't have enough points for this offer.",
          variant: "destructive",
        });
        return;
      }
      swapData.pointsOffered = points;
    } else {
      toast({
        title: "Missing Information",
        description: "Please select an item or enter points amount.",
        variant: "destructive",
      });
      return;
    }

    createSwapMutation.mutate(swapData);
  };

  const nextImage = () => {
    if (item?.imageUrls) {
      setCurrentImageIndex((prev) => (prev + 1) % item.imageUrls.length);
    }
  };

  const prevImage = () => {
    if (item?.imageUrls) {
      setCurrentImageIndex((prev) => (prev - 1 + item.imageUrls.length) % item.imageUrls.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Skeleton className="h-96 w-full rounded-lg" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20 rounded-md" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h1>
            <p className="text-gray-600 mb-6">The item you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'like new':
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-yellow-500';
      case 'fair':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const isOwner = user?.id === item.userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <span>Home</span> / <span>Browse</span> / <span>{item.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              {item.imageUrls && item.imageUrls.length > 0 ? (
                <img
                  src={item.imageUrls[currentImageIndex]}
                  alt={item.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No Image Available</span>
                </div>
              )}
              
              {item.imageUrls && item.imageUrls.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            
            {item.imageUrls && item.imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {item.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${item.title} ${index + 1}`}
                    className={`h-20 w-20 object-cover rounded-md cursor-pointer ${
                      index === currentImageIndex ? 'ring-2 ring-green-500' : ''
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <Badge className={`text-white ${getConditionColor(item.condition)}`}>
                  {item.condition}
                </Badge>
                <span className="text-gray-600">Size {item.size}</span>
                {item.brand && (
                  <span className="text-gray-600">{item.brand}</span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-6">
                <Coins className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold rewear-green">{item.pointsValue} points</span>
              </div>
            </div>

            {/* Action Buttons */}
            {!isOwner && (
              <div className="flex gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="flex-1 bg-rewear-green hover:bg-rewear-green-dark">
                      <ArrowLeftRight className="h-4 w-4 mr-2" />
                      Request Swap
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Request Swap</DialogTitle>
                    </DialogHeader>
                    
                    <Tabs value={swapType} onValueChange={(value) => setSwapType(value as "direct" | "points")}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="points">Use Points</TabsTrigger>
                        <TabsTrigger value="direct">Direct Swap</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="points" className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Points to Offer</label>
                          <input
                            type="number"
                            className="w-full mt-1 px-3 py-2 border rounded-md"
                            placeholder={`Minimum ${item.pointsValue}`}
                            value={pointsOffer}
                            onChange={(e) => setPointsOffer(e.target.value)}
                            min={item.pointsValue}
                            max={user?.points || 0}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            You have {user?.points || 0} points
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="direct" className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Select Your Item</label>
                          <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose an item to swap" />
                            </SelectTrigger>
                            <SelectContent>
                              {userItems.map((userItem) => (
                                <SelectItem key={userItem.id} value={userItem.id.toString()}>
                                  {userItem.title} ({userItem.pointsValue} pts)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div>
                      <label className="text-sm font-medium">Message (Optional)</label>
                      <Textarea
                        placeholder="Add a personal message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <Button
                      onClick={handleSwapRequest}
                      disabled={createSwapMutation.isPending}
                      className="w-full"
                    >
                      {createSwapMutation.isPending ? "Sending..." : "Send Request"}
                    </Button>
                  </DialogContent>
                </Dialog>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlistToggle}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Item Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Item Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium capitalize">{item.category?.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Listed:</span>
                    <span className="font-medium">
                      {new Date(item.createdAt!).toLocaleDateString()}
                    </span>
                  </div>
                  {item.color && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Color:</span>
                      <span className="font-medium">{item.color}</span>
                    </div>
                  )}
                </div>
                
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-4">
                    <span className="text-gray-600 text-sm">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
