# GitHub Pages Deployment Guide

This guide will help you deploy your Next.js Project Dashboard application to GitHub Pages.

## Prerequisites

- A GitHub repository (your current repository: `QNA-task`)
- GitHub Pages enabled on your repository
- Node.js and npm installed locally

## Configuration Changes Made

### 1. Next.js Configuration (`next.config.ts`)

- Added `output: 'export'` for static site generation
- Added `trailingSlash: true` for GitHub Pages compatibility
- Added `images: { unoptimized: true }` since GitHub Pages doesn't support Next.js Image Optimization
- Added `basePath` and `assetPrefix` for proper routing on GitHub Pages

### 2. GitHub Actions Workflow (`.github/workflows/deploy.yml`)

- Automated build and deployment process
- Runs tests before deployment
- Builds the application for production
- Deploys to GitHub Pages automatically

### 3. Package.json Scripts

- Added `export` script for manual static export

## Deployment Steps

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### Step 2: Push Your Changes

```bash
# Add all changes
git add .

# Commit the changes
git commit -m "Configure for GitHub Pages deployment"

# Push to main branch
git push origin main
```

### Step 3: Monitor Deployment

1. Go to the **Actions** tab in your GitHub repository
2. You should see a workflow run called "Deploy to GitHub Pages"
3. Click on it to monitor the deployment progress
4. The deployment will:
   - Install dependencies
   - Run tests
   - Build the application
   - Deploy to GitHub Pages

### Step 4: Access Your Application

Once the deployment is complete, your application will be available at:

```
https://[your-username].github.io/QNA-task/
```

Replace `[your-username]` with your actual GitHub username.

## Local Testing

To test the production build locally:

```bash
# Build the application
npm run build

# The static files will be generated in the 'out' directory
# You can serve them using any static file server, for example:
npx serve out
```

## Troubleshooting

### Common Issues

1. **404 Errors on Refresh**

   - This is normal for single-page applications on GitHub Pages
   - The application uses client-side routing

2. **Images Not Loading**

   - Make sure all images are in the `public` folder
   - Use relative paths for images

3. **Build Failures**

   - Check the Actions tab for detailed error logs
   - Ensure all tests pass before deployment

4. **Styling Issues**
   - Verify that Tailwind CSS is properly configured
   - Check that all CSS files are being included

### Manual Deployment

If you need to deploy manually:

```bash
# Build and export
npm run build

# The 'out' directory contains your static site
# You can upload this to any static hosting service
```

## Environment Variables

If you need environment variables for production:

1. Go to your repository **Settings**
2. Click on **Secrets and variables** → **Actions**
3. Add your environment variables as repository secrets
4. Update the workflow file to use these secrets

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public` folder with your domain
2. Configure your domain's DNS settings to point to GitHub Pages
3. Enable the custom domain in your repository's Pages settings

## Updating Your Application

Every time you push changes to the `main` branch, the application will automatically redeploy. The deployment process typically takes 2-5 minutes.

## Support

If you encounter any issues:

1. Check the GitHub Actions logs for detailed error messages
2. Verify that all configuration files are correct
3. Ensure your application builds successfully locally with `npm run build`

Your Project Dashboard is now ready for deployment to GitHub Pages! 🚀

## Quick Troubleshooting

If you see "Site not found":

1. Check that GitHub Pages is enabled in Settings → Pages
2. Verify the source is set to "GitHub Actions"
3. Check the Actions tab for deployment status
4. Use the correct URL: `https://[username].github.io/QNA-task/`
