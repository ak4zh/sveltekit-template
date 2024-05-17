import { asc, eq, not } from 'drizzle-orm';
import db from '$lib/server/database/client';
import { sessionTable, userTable } from '$lib/server/database/schemas';
import type { User, UpdateUser } from '$lib/server/database/schemas';
import { alias } from 'drizzle-orm/pg-core';

const parent = alias(userTable, "parent")

export const getUsers = async (page = 1, pageSize = 100) => {
	return await db
		.select({
			id: userTable.id,
			name: userTable.name,
			email: userTable.email,
			referralCode: userTable.referralCode,
			role: userTable.role,
			parent,
		})
		.from(userTable)
		.leftJoin(parent, eq(parent.id, userTable.parentId))
		.orderBy(asc(userTable.serial))
		.limit(pageSize)
		.offset((page - 1) * pageSize);
};

export const getMyUsers = async (userId: string, page = 1, pageSize = 100) => {
	return await db
		.select({
			id: userTable.id,
			name: userTable.name,
			company: userTable.company,
			email: userTable.email,
			inviteCode: userTable.inviteCode,
			role: userTable.role,
			advisorId: userTable.advisorId,
			advisor,
		})
		.from(userTable)
		.where(eq(userTable.advisorId, userId))
		.leftJoin(advisor, eq(advisor.id, userTable.advisorId))
		.orderBy(asc(userTable.serial))
		.limit(pageSize)
		.offset((page - 1) * pageSize);
};

export const getUserByInviteCode = async (inviteCode: string) => {
	const user = await db.select().from(userTable).where(eq(userTable.inviteCode, inviteCode));
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

export const getUsersByRole = async (role: string) => {
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