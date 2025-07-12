import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertItemSchema, insertSwapSchema, insertWishlistSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Items routes
  app.get('/api/items', async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string,
        condition: req.query.condition as string,
        size: req.query.size as string,
        minPoints: req.query.minPoints ? parseInt(req.query.minPoints as string) : undefined,
        maxPoints: req.query.maxPoints ? parseInt(req.query.maxPoints as string) : undefined,
        search: req.query.search as string,
        status: req.query.status as string,
      };
      
      const items = await storage.getItems(filters);
      res.json(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });

  app.get('/api/items/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getItem(id);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      res.json(item);
    } catch (error) {
      console.error("Error fetching item:", error);
      res.status(500).json({ message: "Failed to fetch item" });
    }
  });

  app.post('/api/items', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const itemData = insertItemSchema.parse(req.body);
      
      const item = await storage.createItem({ ...itemData, userId });
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid item data", errors: error.errors });
      }
      console.error("Error creating item:", error);
      res.status(500).json({ message: "Failed to create item" });
    }
  });

  app.put('/api/items/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if user owns the item
      const existingItem = await storage.getItem(id);
      if (!existingItem || existingItem.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this item" });
      }
      
      const updates = insertItemSchema.partial().parse(req.body);
      const item = await storage.updateItem(id, updates);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      console.error("Error updating item:", error);
      res.status(500).json({ message: "Failed to update item" });
    }
  });

  app.delete('/api/items/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if user owns the item
      const existingItem = await storage.getItem(id);
      if (!existingItem || existingItem.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this item" });
      }
      
      const deleted = await storage.deleteItem(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  // User items route
  app.get('/api/users/:userId/items', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.params.userId;
      const currentUserId = req.user.claims.sub;
      
      // Users can only see their own pending items, others can see approved items
      const status = userId === currentUserId ? undefined : 'active';
      
      const items = await storage.getItems({ userId, status });
      res.json(items);
    } catch (error) {
      console.error("Error fetching user items:", error);
      res.status(500).json({ message: "Failed to fetch user items" });
    }
  });

  // Swaps routes
  app.get('/api/swaps', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const swaps = await storage.getSwaps(userId);
      res.json(swaps);
    } catch (error) {
      console.error("Error fetching swaps:", error);
      res.status(500).json({ message: "Failed to fetch swaps" });
    }
  });

  app.post('/api/swaps', isAuthenticated, async (req: any, res) => {
    try {
      const requesterId = req.user.claims.sub;
      const swapData = insertSwapSchema.parse(req.body);
      
      // Validate that the requester has enough points for points redemption
      if (swapData.type === 'points_redemption' && swapData.pointsOffered) {
        const user = await storage.getUser(requesterId);
        if (!user || user.points < swapData.pointsOffered) {
          return res.status(400).json({ message: "Insufficient points" });
        }
      }
      
      const swap = await storage.createSwap({ ...swapData, requesterId });
      res.status(201).json(swap);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid swap data", errors: error.errors });
      }
      console.error("Error creating swap:", error);
      res.status(500).json({ message: "Failed to create swap" });
    }
  });

  app.put('/api/swaps/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const swapId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const { status } = req.body;
      
      if (!['accepted', 'rejected', 'completed'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      // Check if user is the owner of the item being requested
      const existingSwap = await storage.getSwap(swapId);
      if (!existingSwap || existingSwap.ownerId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this swap" });
      }
      
      const swap = await storage.updateSwapStatus(swapId, status);
      
      // Handle points transfer and item status updates
      if (status === 'accepted' && swap) {
        if (swap.type === 'points_redemption' && swap.pointsOffered) {
          // Transfer points
          await storage.updateUserPoints(swap.requesterId, -swap.pointsOffered);
          await storage.updateUserPoints(swap.ownerId, swap.pointsOffered);
        }
        
        // Update item status
        await storage.updateItem(swap.ownerItemId, { status: 'swapped' });
        if (swap.requesterItemId) {
          await storage.updateItem(swap.requesterItemId, { status: 'swapped' });
        }
      }
      
      res.json(swap);
    } catch (error) {
      console.error("Error updating swap status:", error);
      res.status(500).json({ message: "Failed to update swap status" });
    }
  });

  // Wishlist routes
  app.get('/api/wishlist', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const wishlist = await storage.getWishlist(userId);
      res.json(wishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post('/api/wishlist', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { itemId } = insertWishlistSchema.parse(req.body);
      
      const wishlistItem = await storage.addToWishlist(userId, itemId);
      res.status(201).json(wishlistItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid wishlist data", errors: error.errors });
      }
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  app.delete('/api/wishlist/:itemId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const itemId = parseInt(req.params.itemId);
      
      const removed = await storage.removeFromWishlist(userId, itemId);
      
      if (!removed) {
        return res.status(404).json({ message: "Wishlist item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });

  // Admin routes
  app.get('/api/admin/items', isAuthenticated, async (req: any, res) => {
    try {
      // Simple admin check - in production, you'd want proper role-based auth
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.email?.includes('admin')) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const items = await storage.getItems({ status: 'pending' });
      res.json(items);
    } catch (error) {
      console.error("Error fetching pending items:", error);
      res.status(500).json({ message: "Failed to fetch pending items" });
    }
  });

  app.put('/api/admin/items/:id/approve', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.email?.includes('admin')) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const id = parseInt(req.params.id);
      const approved = await storage.approveItem(id);
      
      if (!approved) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      res.json({ message: "Item approved successfully" });
    } catch (error) {
      console.error("Error approving item:", error);
      res.status(500).json({ message: "Failed to approve item" });
    }
  });

  // Reviews routes
  app.get('/api/users/:userId/reviews', async (req, res) => {
    try {
      const userId = req.params.userId;
      const reviews = await storage.getReviews(userId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const reviewerId = req.user.claims.sub;
      const reviewData = insertReviewSchema.parse(req.body);
      
      const review = await storage.createReview({ ...reviewData, reviewerId });
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
