import { and, asc, desc, eq, ilike, not, sql, type AnyColumn } from 'drizzle-orm';
import db from '$lib/server/database/client';
import { sessionTable, userTable } from '$lib/server/database/schemas';
import type { User, UpdateUser } from '$lib/server/database/schemas';
// import { alias } from 'drizzle-orm/pg-core';

// const parent = alias(userTable, "parent")
export type UserFilters = {
	name?: string;
	role?: 'ADMIN' | 'USER';
	email?: string;
	search?: string;
	limit?: string;
	page?: string;
	sort?: string;
	order?: string;
};

const filtersToConditions = async (userFilters: UserFilters, userId: string | undefined = undefined) => {
	const conditions = [];
	if (userId) conditions.push(eq(userTable.parentId, userId));
	if (userFilters.name) conditions.push(ilike(userTable.name, `%${userFilters.name}%`));
	if (userFilters.email) conditions.push(ilike(userTable.email, `%${userFilters.email}%`));
	if (userFilters.role) conditions.push(eq(userTable.role, userFilters.role.toUpperCase()));
	return conditions;
}
const getUsersQuery = async (userFilters: UserFilters, userId: string | undefined = undefined) => {
	const sortableColumns: { [key: string]: AnyColumn } = {
	  name: userTable.name,
	  email: userTable.email,
	  role: userTable.role
	};
	const page = Number(userFilters.page) || 1;
	const limit = Math.min(Number(userFilters.limit) || 10, 50);
	const offset = (page - 1) * limit;
	const query = db
		.select({
			id: userTable.id,
			name: userTable.name,
			email: userTable.email,
			referralCode: userTable.referralCode,
			role: userTable.role,
			emailVerified: userTable.emailVerified
		})
		.from(userTable)
	const countQuery = db.select({ count: sql`count(*)`.mapWith(Number) }).from(userTable);
	const conditions = await filtersToConditions(userFilters, userId);
	if (userFilters.order && userFilters.sort && userFilters.sort in sortableColumns) {
		const colName = sortableColumns[userFilters.sort];
		query.orderBy(userFilters.order === 'asc' ? asc(colName) : desc(colName))
	} else {
		query.orderBy(asc(userTable.serial))
	};
	const [total, filtered, users] = await Promise.all([
		db.select({ count: sql`count(*)`.mapWith(Number) }).from(userTable),
		countQuery.where(and(...conditions)),
		query.where(and(...conditions)).limit(limit).offset(offset)
	])
	return { users, count: filtered?.[0]?.count, total: total?.[0]?.count };
};

export const getUsers = async (userFilters: UserFilters) => await getUsersQuery(userFilters);
export const getMyUsers = async (userFilters: UserFilters, userId: string) => await getUsersQuery(userFilters, userId);

export const countUsers = async () => {
	return await db.select({ count: sql`count(*)`.mapWith(Number) }).from(userTable);
};

export const getUserByReferralCode = async (referralCode: string) => {
	const user = await db.select().from(userTable).where(eq(userTable.referralCode, referralCode));
	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
};

export const getInsiders = async () => {
	return await db.select({
		label: userTable.name,
		value: userTable.id
	})
	.from(userTable)
	.where(not(eq(userTable.role, "USER")))
	.orderBy(asc(userTable.serial));
};

export const getUsersByRole = async (role: "ADMIN" | "USER") => {
	const user = await db.select()
		.from(userTable)
		.where(eq(userTable.role, role))
		.orderBy(asc(userTable.serial));
	if (user.length === 0) {
		return null;
	} else {
		return user;
	}
};
export const getUserById = async (id: string) => {
	const user = await db.select().from(userTable).where(eq(userTable.id, id));
	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
};
export const getUserByEmail = async (email: string) => {
	const user = await db.select().from(userTable).where(eq(userTable.email, email));
	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
};

export const getUserByToken = async (token: string) => {
	const user = await db.select().from(userTable).where(eq(userTable.token, token));
	if (user.length === 0) {
		return null;
	} else {
		return user[0];
	}
};

export const updateUser = async (id: string, user: UpdateUser) => {
	const result = await db.update(userTable).set(user).where(eq(userTable.id, id)).returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
};

export const createUser = async (user: User) => {
	const result = await db.insert(userTable).values(user).onConflictDoNothing().returning();
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
};

export const deleteUser = async (id: string) => {
	await db.delete(sessionTable).where(eq(sessionTable.userId, id))
	return await db.delete(userTable).where(eq(userTable.id, id))
};