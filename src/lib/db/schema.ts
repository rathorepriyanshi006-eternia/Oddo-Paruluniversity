import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const trips = sqliteTable('trips', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  destination: text('destination').notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  budgetTotal: integer('budget_total').notNull(),
  currency: text('currency').default('USD').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  progress: integer('progress').default(0),
  daysLeft: integer('days_left'),
  collaborators: integer('collaborators').default(1),
  image: text('image'),
});

export const activities = sqliteTable('activities', {
  id: text('id').primaryKey(),
  tripId: text('trip_id').references(() => trips.id).notNull(),
  day: text('day').notNull(),
  type: text('type').notNull(), // transport, stay, food, sightseeing
  title: text('title').notNull(),
  time: text('time').notNull(),
  orderIndex: integer('order_index').notNull(),
});
