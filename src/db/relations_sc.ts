import { relations } from "drizzle-orm";
import { CustomerTable } from "./schema/sc_customers";
import { OrderTable } from "./schema/sc_orders";
import { OrderItemsTable } from "./schema/sc_orderItems";
import { productTable, categoryTable } from "./schema/sc_product";
import { ActivityTable } from "./schema/sc_activityTable";
import { SalesTable } from "./schema/sc_sales";
import { ContactTable } from "./schema/sc_contacts";
import { usersTable } from "./schema/sc_users";
import { reviewsTable } from "./schema/sc_reviews";
import { paymentsTable } from "./schema/sc_payment";
import { vendorsTable } from "./schema/sc_vendor";
import { adminProfileTable, adminTable } from "./schema/sc_admin";

// Customer
export const customerRelations = relations(CustomerTable, ({ many }) => ({
  orders: many(OrderTable), 
  sales: many(SalesTable), 
  contacts: many(ContactTable), 
  activities: many(ActivityTable), 
  reviews: many(reviewsTable),
  payments: many(paymentsTable), 
}));

export const orderRelations = relations(OrderTable, ({ one, many }) => ({
  customer: one(CustomerTable, {
    fields: [OrderTable.customerId],
    references: [CustomerTable.id],
  }),
  orderItems: many(OrderItemsTable),
  payments: many(paymentsTable),
  sales: one(SalesTable, {
    fields: [OrderTable.orderId],
    references: [SalesTable.orderId],
  }),
}));


export const orderItemRelations = relations(OrderItemsTable, ({ one }) => ({
  order: one(OrderTable, {
    fields: [OrderItemsTable.orderId], 
    references: [OrderTable.orderId],
  }),
  product: one(productTable, {
    fields: [OrderItemsTable.productId],  
    references: [productTable.id],
  }),
}));


// Product
export const productRelations = relations(productTable, ({ one, many }) => ({
  category: one(categoryTable, {
    fields: [productTable.fkCategory],
    references: [categoryTable.id],
  }),
  vendor: one(vendorsTable, {
    fields: [productTable.fkVendor], 
    references: [vendorsTable.vendorId],
  }),
  orderItems: many(OrderItemsTable),
  reviews: many(reviewsTable),
}));

export const categoryRelations = relations(categoryTable, ({ many }) => ({
  products: many(productTable),
}));

// Sales
export const salesRelations = relations(SalesTable, ({ one }) => ({
  customer: one(CustomerTable, {
    fields: [SalesTable.customerId],
    references: [CustomerTable.id],
  }),
  order: one(OrderTable, {
    fields: [SalesTable.orderId],
    references: [OrderTable.orderId],
  }),
  user: one(usersTable, {
    fields: [SalesTable.customerId],
    references: [usersTable.userId],
  }),
}));

// Contact
export const contactRelations = relations(ContactTable, ({ one }) => ({
  customer: one(CustomerTable, {
    fields: [ContactTable.customer_id], 
    references: [CustomerTable.id],
  }),
}));


export const activityRelations = relations(ActivityTable, ({ one }) => ({
  customer: one(CustomerTable, {
    fields: [ActivityTable.customer_id],
    references: [CustomerTable.id],
  }),
  user: one(usersTable, {
    fields: [ActivityTable.user_id], 
    references: [usersTable.userId],
  }),
}));


// Vendor
export const vendorRelations = relations(vendorsTable, ({ many }) => ({
  products: many(productTable),
}));

// Reviews
export const reviewsRelations = relations(reviewsTable, ({ one }) => ({
  product: one(productTable, {
    fields: [reviewsTable.productId], // Menyambungkan dengan productId
    references: [productTable.id],
  }),
  customer: one(CustomerTable, {
    fields: [reviewsTable.customerId], // Menyambungkan dengan customerId
    references: [CustomerTable.id],
  }),
}));

export const paymentRelations = relations(paymentsTable, ({ one }) => ({
  order: one(OrderTable, {
    fields: [paymentsTable.orderId],
    references: [OrderTable.orderId],
  }),
  customer: one(CustomerTable, {
    fields: [paymentsTable.customerId], // Jika ada kolom customerId pada paymentsTable
    references: [CustomerTable.id],
  }),
}));



// Users
export const userRelations = relations(usersTable, ({ many }) => ({
  activities: many(ActivityTable),
  sales: many(SalesTable),
}));

export const adminRelations = relations(adminTable, ({ one }) => ({
  profile: one(adminProfileTable, {
    fields: [adminTable.adminProfileId],
    references: [adminProfileTable.adminProfileId],
  }),
}));


export const adminProfileRelations = relations(adminProfileTable, ({ many }) => ({
  admins: many(adminTable),
}));