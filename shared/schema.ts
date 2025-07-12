import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  points: integer("points").default(100).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Items table for clothing exchange
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  size: varchar("size", { length: 50 }).notNull(),
  condition: varchar("condition", { length: 50 }).notNull(),
  brand: varchar("brand", { length: 100 }),
  color: varchar("color", { length: 50 }),
  tags: text("tags").array(),
  pointsValue: integer("points_value").notNull(),
  imageUrls: text("image_urls").array().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, active, swapped, removed
  isApproved: boolean("is_approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Swap requests table
export const swaps = pgTable("swaps", {
  id: serial("id").primaryKey(),
  requesterId: varchar("requester_id").notNull().references(() => users.id),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  requesterItemId: integer("requester_item_id").references(() => items.id),
  ownerItemId: integer("owner_item_id").notNull().references(() => items.id),
  type: varchar("type", { length: 50 }).notNull(), // direct_swap, points_redemption
  pointsOffered: integer("points_offered"),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, accepted, rejected, completed
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wishlist table
export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  itemId: integer("item_id").notNull().references(() => items.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  reviewerId: varchar("reviewer_id").notNull().references(() => users.id),
  revieweeId: varchar("reviewee_id").notNull().references(() => users.id),
  swapId: integer("swap_id").notNull().references(() => swaps.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  items: many(items),
  sentSwaps: many(swaps, { relationName: "requesterSwaps" }),
  receivedSwaps: many(swaps, { relationName: "ownerSwaps" }),
  wishlists: many(wishlists),
  givenReviews: many(reviews, { relationName: "givenReviews" }),
  receivedReviews: many(reviews, { relationName: "receivedReviews" }),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
  user: one(users, {
    fields: [items.userId],
    references: [users.id],
  }),
  requesterSwaps: many(swaps, { relationName: "requesterItemSwaps" }),
  ownerSwaps: many(swaps, { relationName: "ownerItemSwaps" }),
  wishlists: many(wishlists),
}));

export const swapsRelations = relations(swaps, ({ one }) => ({
  requester: one(users, {
    fields: [swaps.requesterId],
    references: [users.id],
    relationName: "requesterSwaps",
  }),
  owner: one(users, {
    fields: [swaps.ownerId],
    references: [users.id],
    relationName: "ownerSwaps",
  }),
  requesterItem: one(items, {
    fields: [swaps.requesterItemId],
    references: [items.id],
    relationName: "requesterItemSwaps",
  }),
  ownerItem: one(items, {
    fields: [swaps.ownerItemId],
    references: [items.id],
    relationName: "ownerItemSwaps",
  }),
  review: one(reviews, {
    fields: [swaps.id],
    references: [reviews.swapId],
  }),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  item: one(items, {
    fields: [wishlists.itemId],
    references: [items.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
    relationName: "givenReviews",
  }),
  reviewee: one(users, {
    fields: [reviews.revieweeId],
    references: [users.id],
    relationName: "receivedReviews",
  }),
  swap: one(swaps, {
    fields: [reviews.swapId],
    references: [swaps.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  userId: true,
  status: true,
  isApproved: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSwapSchema = createInsertSchema(swaps).omit({
  id: true,
  requesterId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWishlistSchema = createInsertSchema(wishlists).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  reviewerId: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type Item = typeof items.$inferSelect;
export type InsertSwap = z.infer<typeof insertSwapSchema>;
export type Swap = typeof swaps.$inferSelect;
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type Wishlist = typeof wishlists.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
