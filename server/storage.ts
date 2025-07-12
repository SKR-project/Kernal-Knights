import {
  users,
  items,
  swaps,
  wishlists,
  reviews,
  type User,
  type UpsertUser,
  type Item,
  type InsertItem,
  type Swap,
  type InsertSwap,
  type Wishlist,
  type InsertWishlist,
  type Review,
  type InsertReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserPoints(userId: string, points: number): Promise<void>;
  
  // Item operations
  getItems(filters?: {
    category?: string;
    condition?: string;
    size?: string;
    minPoints?: number;
    maxPoints?: number;
    search?: string;
    userId?: string;
    status?: string;
  }): Promise<Item[]>;
  getItem(id: number): Promise<Item | undefined>;
  createItem(item: InsertItem & { userId: string }): Promise<Item>;
  updateItem(id: number, updates: Partial<InsertItem>): Promise<Item | undefined>;
  deleteItem(id: number): Promise<boolean>;
  approveItem(id: number): Promise<boolean>;
  
  // Swap operations
  getSwaps(userId?: string): Promise<Swap[]>;
  getSwap(id: number): Promise<Swap | undefined>;
  createSwap(swap: InsertSwap & { requesterId: string }): Promise<Swap>;
  updateSwapStatus(id: number, status: string): Promise<Swap | undefined>;
  
  // Wishlist operations
  getWishlist(userId: string): Promise<Wishlist[]>;
  addToWishlist(userId: string, itemId: number): Promise<Wishlist>;
  removeFromWishlist(userId: string, itemId: number): Promise<boolean>;
  
  // Review operations
  getReviews(userId: string): Promise<Review[]>;
  createReview(review: InsertReview & { reviewerId: string }): Promise<Review>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        id: userData.email || 'anonymous',
        points: 100,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserPoints(userId: string, points: number): Promise<void> {
    await db
      .update(users)
      .set({ points: sql`${users.points} + ${points}` })
      .where(eq(users.id, userId));
  }

  async getItems(filters?: {
    category?: string;
    condition?: string;
    size?: string;
    minPoints?: number;
    maxPoints?: number;
    search?: string;
    userId?: string;
    status?: string;
  }): Promise<Item[]> {
    let query = db.select().from(items);
    
    const conditions = [];
    
    if (filters?.category) {
      conditions.push(eq(items.category, filters.category));
    }
    if (filters?.condition) {
      conditions.push(eq(items.condition, filters.condition));
    }
    if (filters?.size) {
      conditions.push(eq(items.size, filters.size));
    }
    if (filters?.minPoints) {
      conditions.push(sql`${items.pointsValue} >= ${filters.minPoints}`);
    }
    if (filters?.maxPoints) {
      conditions.push(sql`${items.pointsValue} <= ${filters.maxPoints}`);
    }
    if (filters?.search) {
      conditions.push(
        or(
          ilike(items.title, `%${filters.search}%`),
          ilike(items.description, `%${filters.search}%`),
          ilike(items.brand, `%${filters.search}%`)
        )
      );
    }
    if (filters?.userId) {
      conditions.push(eq(items.userId, filters.userId));
    }
    if (filters?.status) {
      conditions.push(eq(items.status, filters.status));
    } else {
      conditions.push(eq(items.status, 'active'));
      conditions.push(eq(items.isApproved, true));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(items.createdAt));
  }

  async getItem(id: number): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item;
  }

  async createItem(itemData: InsertItem & { userId: string }): Promise<Item> {
    const [item] = await db
      .insert(items)
      .values({
        ...itemData,
        status: 'pending',
        isApproved: false,
      })
      .returning();
    return item;
  }

  async updateItem(id: number, updates: Partial<InsertItem>): Promise<Item | undefined> {
    const [item] = await db
      .update(items)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(items.id, id))
      .returning();
    return item;
  }

  async deleteItem(id: number): Promise<boolean> {
    const result = await db.delete(items).where(eq(items.id, id));
    return result.rowCount > 0;
  }

  async approveItem(id: number): Promise<boolean> {
    const [item] = await db
      .update(items)
      .set({ isApproved: true, status: 'active', updatedAt: new Date() })
      .where(eq(items.id, id))
      .returning();
    return !!item;
  }

  async getSwaps(userId?: string): Promise<Swap[]> {
    let query = db.select().from(swaps);
    
    if (userId) {
      query = query.where(
        or(eq(swaps.requesterId, userId), eq(swaps.ownerId, userId))
      );
    }

    return await query.orderBy(desc(swaps.createdAt));
  }

  async getSwap(id: number): Promise<Swap | undefined> {
    const [swap] = await db.select().from(swaps).where(eq(swaps.id, id));
    return swap;
  }

  async createSwap(swapData: InsertSwap & { requesterId: string }): Promise<Swap> {
    const [swap] = await db
      .insert(swaps)
      .values({
        ...swapData,
        status: 'pending',
      })
      .returning();
    return swap;
  }

  async updateSwapStatus(id: number, status: string): Promise<Swap | undefined> {
    const [swap] = await db
      .update(swaps)
      .set({ status, updatedAt: new Date() })
      .where(eq(swaps.id, id))
      .returning();
    return swap;
  }

  async getWishlist(userId: string): Promise<Wishlist[]> {
    return await db
      .select()
      .from(wishlists)
      .where(eq(wishlists.userId, userId))
      .orderBy(desc(wishlists.createdAt));
  }

  async addToWishlist(userId: string, itemId: number): Promise<Wishlist> {
    const [wishlist] = await db
      .insert(wishlists)
      .values({ userId, itemId })
      .returning();
    return wishlist;
  }

  async removeFromWishlist(userId: string, itemId: number): Promise<boolean> {
    const result = await db
      .delete(wishlists)
      .where(and(eq(wishlists.userId, userId), eq(wishlists.itemId, itemId)));
    return result.rowCount > 0;
  }

  async getReviews(userId: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.revieweeId, userId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(reviewData: InsertReview & { reviewerId: string }): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(reviewData)
      .returning();
    return review;
  }
}

export const storage = new DatabaseStorage();
