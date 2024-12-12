import { boolean, integer, pgTable, text, timestamp, uuid, varchar, type AnyPgColumn } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

export const users = pgTable('users', {
	id: text('id').primaryKey().$defaultFn(() => nanoid(12)),
	serial: integer('serial').generatedAlwaysAsIdentity(), // used for faster orderBy if you are not using uuid7 or similar
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	token: uuid().notNull().unique().defaultRandom(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	parentId: text('parent_id').references((): AnyPgColumn => users.id),
	referralCode: varchar('referral_code', { length: 16 }).notNull().unique().$defaultFn(() => nanoid(12)),
	role: varchar('role', { enum: ['USER', 'ADMIN'], length: 8 })
		.default('USER')
		.notNull(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull().default(false)
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof sessions.$inferSelect;
export type User = typeof users.$inferSelect;
export type UserNew = typeof users.$inferInsert;
export type UserUpdate = Partial<UserNew>
