import { pgTable, text, timestamp, boolean, uuid, serial, varchar, AnyPgColumn } from 'drizzle-orm/pg-core';
// import { sql } from 'drizzle-orm'; // pg_uuidv7

export const userTable = pgTable('users', {
	// internal fields
	// id: uuid('id').primaryKey().default(sql`uuid_generate_v7()`), // pg_uuidv7
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	serial: serial('serial'), // used for faster orderBy if you are not using uuid7 or similar
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull(),
	// other attributes
	// role: text('role', { enum: ["USER", "ADMIN"] }).default("USER"), // if you prefer text type
	parentId: uuid('parent_id').references((): AnyPgColumn => userTable.id),
	referralCode: varchar('referral_code', { length: 16 }).notNull().unique().default(),
	role: varchar('role', { enum: ["USER", "ADMIN"], length: 8 }).default("USER"),
	name: text('first_name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull().default(false),
	emailVerifyToken: text('email_verify_token').unique(),
	passwordHash: text('password_hash').notNull(),
});

export const sessionTable = pgTable('sessions', {
	id: text('id').notNull().primaryKey(),
	userId: uuid('user_id').notNull().references(() => userTable.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type User = typeof userTable.$inferInsert;
export type UpdateUser = Partial<typeof userTable.$inferInsert>;
export type Session = typeof sessionTable.$inferInsert;
