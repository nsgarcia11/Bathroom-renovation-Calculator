# Email/Password Authentication Setup Guide

This guide explains how to configure Supabase for email/password authentication with email verification.

## 1. Supabase Dashboard Configuration

### Step 1: Enable Email/Password Authentication

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Email** provider
4. Disable **Magic Link** if you want to use only email/password

### Step 2: Configure Email Settings

1. Go to **Authentication** → **Settings**
2. Set **Enable email confirmations** to `true`
3. Configure your email templates if needed

### Step 3: Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Set the **Site URL** to your production domain:

   ```
   https://your-vercel-domain.vercel.app
   ```

3. Add these **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/auth/verify-email
   https://your-vercel-domain.vercel.app/auth/callback
   https://your-vercel-domain.vercel.app/auth/verify-email
   ```

## 2. Environment Variables

### Local Development (.env.local)

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Production (Vercel Environment Variables)

```env
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 3. Authentication Flow

### Registration Flow

1. User enters email and password
2. Account is created but email is not confirmed
3. Verification email is sent automatically
4. User clicks verification link
5. User is redirected to `/auth/verify-email` page
6. After verification, user can sign in

### Login Flow

1. User enters email and password
2. If email is not verified, user is prompted to verify
3. If email is verified, user is signed in

### Email Verification

- Users receive verification emails automatically after signup
- Verification links redirect to `/auth/verify-email`
- Users can resend verification emails if needed

## 4. Key Features

### Form Validation

- Email format validation
- Password minimum length (6 characters)
- Password confirmation matching
- Real-time error display

### User Experience

- Toggle between sign in and sign up
- Clear error messages
- Loading states
- Email verification status

### Security

- Email verification required before login
- Secure password handling
- Session management

## 5. Testing the Setup

### Local Development

1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Try creating a new account
4. Check your email for verification link
5. Click the verification link
6. Try signing in with the verified account

### Production

1. Deploy to Vercel
2. Set all environment variables
3. Test the complete flow in production
4. Verify email templates work correctly

## 6. Common Issues and Solutions

### Issue: "Email not confirmed" error

**Solution**:

- Check that email verification is enabled in Supabase
- Verify the user clicked the verification link
- Check spam folder for verification email

### Issue: Verification email not received

**Solution**:

- Check Supabase email settings
- Verify SMTP configuration
- Check spam folder
- Use resend verification feature

### Issue: Redirect URLs not working

**Solution**:

- Ensure URLs are exactly added to Supabase configuration
- Check for trailing slashes
- Verify protocol (http/https)

### Issue: Password requirements not met

**Solution**:

- Check password length (minimum 6 characters)
- Ensure password confirmation matches
- Check for special characters if required

## 7. Supabase Settings Checklist

- [ ] Email provider enabled
- [ ] Email confirmations enabled
- [ ] Site URL configured
- [ ] Redirect URLs added
- [ ] Email templates configured (optional)
- [ ] SMTP settings configured (if using custom SMTP)

## 8. Security Best Practices

- Use strong password requirements
- Enable email verification
- Implement rate limiting
- Use HTTPS in production
- Regularly review user access
- Monitor authentication logs

## 9. Customization Options

### Email Templates

You can customize email templates in Supabase:

1. Go to **Authentication** → **Email Templates**
2. Customize verification email template
3. Add your branding and styling

### Password Requirements

You can adjust password requirements in your validation schema:

```typescript
password: z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[0-9]/, 'Password must contain a number');
```

### Additional Fields

You can add more fields to the registration form:

- Full name
- Phone number
- Company name
- etc.
