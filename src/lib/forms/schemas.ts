import { z } from 'zod';

export const userSchema = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.min(1, { message: 'Name is required' })
		.trim(),
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Please enter a valid email address' }),
	password: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
		.trim(),
	confirmPassword: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
		.trim(),
	//terms: z.boolean({ required_error: 'You must accept the terms and privacy policy' }),
	role: z.enum(['USER', 'ADMIN'], { required_error: 'You must have a role' }).default('USER'),
	emailVerified: z.boolean().optional(),
	terms: z.literal<boolean>(true, {
		errorMap: () => ({ message: 'You must accept the terms & privacy policy' })
	}),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional()
});
export type UserSchema = typeof userSchema;

export const userUpdateSchema = userSchema.pick({
	name: true,
	email: true
});
export type UserUpdateSchema = typeof userUpdateSchema;

export const userUpdatePasswordSchema = userSchema
	.pick({ password: true, confirmPassword: true })
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['confirmPassword']
			});
		}
	});
export type UserUpdatePasswordSchema = typeof userUpdatePasswordSchema;

export const signUpSchema = userSchema.pick({
	name: true,
	email: true,
	password: true,
	terms: true
});
export type SignUpSchema = typeof signUpSchema;

export const loginSchema = userSchema.pick({
	email: true,
	password: true
});
export type LoginSchema = typeof loginSchema;

export const resetPasswordSchema = userSchema.pick({ email: true });
export type ResetPasswordSchema = typeof resetPasswordSchema;

export const resendEmailSchema = z.object({
	id: z.string({ required_error: 'Something went wrong' })
});
export type ResendEmailSchema = typeof resendEmailSchema;

export const userDeleteSchema = z.object({
	id: z.string({ required_error: 'Select the user you want to delete' })
});
export type UserDeleteSchema = typeof userDeleteSchema;

export const userCreateByAdminSchema = userSchema.pick({
	name: true,
	email: true,
	role: true,
	password: true,
	emailVerified: true
});
export type UserCreateByAdminSchema = typeof userCreateByAdminSchema;

export const userUpdateByAdminSchema = userSchema
	.extend({ id: z.string({ required_error: 'Please select the user you want to update' }) })
	.pick({
		id: true,
		name: true,
		email: true,
		role: true
	});
export type UserUpdateByAdminSchema = typeof userUpdateByAdminSchema;
