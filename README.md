This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Clerk Webhook Setup (Sync Data)

This app implements Clerk webhook sync functionality to automatically sync user data between Clerk and your database. Follow these steps to set up webhooks:

### 1. Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Get this from your Clerk Dashboard -> Webhooks -> [Your Endpoint] -> Signing Secret
CLERK_WEBHOOK_SIGNING_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Your existing Clerk variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxx

# Database
DATABASE_URL="your-database-url"
DIRECT_URL="your-direct-database-url"
```

### 2. Configure Webhook in Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **Webhooks** in the sidebar
4. Click **Add Endpoint**
5. Set the **Endpoint URL** to:
   - **Development**: Use ngrok to expose your local server
     ```bash
     # Install ngrok if you haven't already
     npm install -g ngrok
     
     # Expose your local server (make sure your app is running on port 3000)
     ngrok http 3000
     
     # Use the ngrok URL + /api/webhooks
     # Example: https://abc123.ngrok.io/api/webhooks
     ```
   - **Production**: `https://yourdomain.com/api/webhooks`

6. Select the events to listen for:
   - `user.created`
   - `user.updated` 
   - `user.deleted`

7. Click **Create**
8. Copy the **Signing Secret** and add it to your `.env.local`

### 3. Test the Webhook

#### Option 1: Using Clerk Dashboard
1. In your webhook endpoint settings, go to the **Testing** tab
2. Select **user.created** from the dropdown
3. Click **Send Example**
4. Check your server logs for the webhook payload
5. Verify the user was created in your database

#### Option 2: Create a Real User
1. Go to your app's sign-up page
2. Create a new user account
3. Check your server logs for the webhook
4. Verify the user data was synced to your database

### 4. Manual User Sync (Optional)

If you already have users in Clerk before implementing webhooks, you can manually sync them:

```typescript
// This is a server action - can be called from a page or API route
import { syncExistingUsers, syncSingleUser } from '@/src/lib/actions/user-sync'

// Sync all existing users
await syncExistingUsers()

// Or sync a specific user by Clerk ID
await syncSingleUser('user_xxxxxxxxxx')
```

### 5. Webhook Events Handled

| Event | Description | Action |
|-------|-------------|--------|
| `user.created` | New user signs up | Creates user record in database |
| `user.updated` | User profile updated | Updates user record in database |
| `user.deleted` | User account deleted | Removes user record from database |

### 6. Development with ngrok

For local development with webhooks:

1. Start your Next.js app: `bun dev`
2. In another terminal, start ngrok: `ngrok http 3000`
3. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
4. Use this URL + `/api/webhooks` as your webhook endpoint in Clerk Dashboard
5. The webhook will now forward to your local development server

### 7. Production Deployment

When deploying to production:

1. Update your webhook endpoint URL in Clerk Dashboard to your production domain
2. Add the `CLERK_WEBHOOK_SIGNING_SECRET` to your production environment variables
3. Redeploy your application

### Troubleshooting

- **Webhook verification failed**: Check that your `CLERK_WEBHOOK_SIGNING_SECRET` is correct
- **User not created**: Check your database logs and ensure your DATABASE_URL is correct
- **Webhook not received**: Verify the endpoint URL is accessible and using HTTPS in production

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Clerk Webhook Documentation](https://clerk.com/docs/webhooks/sync-data) - official Clerk webhook guide

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
