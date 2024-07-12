# SvelteKit Template

-   [Lucia](https://lucia-auth.com/) for authentication
-   [Paraglide JS](https://inlang.com) dead simple i18n
-   [Drizzle ORM](https://orm.drizzle.team/) for database connectivity and type safety
-   [shadcn-svelte](shadcn-svelte.com) for beautifully designed components
-   [Lucide](https://lucide.dev) for icons
-   [Zod](https://zod.dev) Type safety with Zod integration
-   [Superforms](https://superforms.vercel.app) to handle form validation and management.
-   [Formsnap](https://formsnap.dev) Accessible form components that take SvelteKit Superforms to the next level.

# TODO

- [ ] Payments with Stripe
- [ ] Mobile Tab Bar
- [ ] Multi organization setup (with / without url param)


# Inspirations

This template draws inspiration from the following projects:

-   [Sveltekit Auth](https://github.com/delay/sveltekit-auth)
-   [Slide](https://github.com/ak4zh/slide)

Feel free to explore, customize, and innovate with this SvelteKit template!

# Live Demo

Check out the live demo at: https://sveltekit-template-rosy.vercel.app

## Admin Account

-   Email: admin@example.com
-   Password: admin123

## Normal User Account

-   Email: demo@example.com
-   Password: demo123

# Screenshots

![user-profile](https://github.com/ak4zh/sveltekit-template/assets/26350053/1adb410f-82ed-4bf0-86b5-105535185e37)
![users](https://github.com/ak4zh/sveltekit-template/assets/26350053/c9b384a2-7446-4795-a0eb-bc3e6295b7b4)
![user-edit-by-admin](https://github.com/ak4zh/sveltekit-template/assets/26350053/473b7f97-ab0a-416f-bd8f-e0f51a331d9e)
![user-edit-by-admin-mobile](https://github.com/ak4zh/sveltekit-template/assets/26350053/6d272051-863c-41c8-965c-a9783ef46f24)

# Important highlights

## /(public)

Accessible by everyone

## /(private)

All routes inside this will required an authenticated user

## /(private)/(admin)/users

Shows example of admin only route with a filterable and sortable Data Table along with edit and delete function implemented.
