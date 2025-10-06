# Environment Variables Setup

Create a `.env.local` file in the root of your project with the following variables:

```env
# Clerk Authentication
# Get your keys from https://dashboard.clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## How to Get Clerk Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or select an existing one
3. Navigate to "API Keys" in the sidebar
4. Copy your Publishable Key and Secret Key
5. Paste them into your `.env.local` file

## Clerk Configuration

### Disable Phone Authentication

To completely remove phone authentication from your app:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Navigate to **User & Authentication** → **Email, Phone, Username**
4. Under **Phone number**, toggle it **OFF**
5. Click **Save** at the bottom

This ensures users can only sign up/sign in with email (and social providers if enabled).

### Recommended Settings

- **Email**: Enabled (required)
- **Phone**: Disabled ❌
- **Username**: Optional (based on your needs)
- **Social Providers**: Configure as needed (Google, GitHub, etc.)

## Important Notes

- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore`
- Restart your development server after adding environment variables

