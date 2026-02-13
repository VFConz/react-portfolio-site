# Deployment Guide -- Conor Douglas Portfolio

Step-by-step instructions for deploying your portfolio to Vercel.

---

## Prerequisites

Before you begin, make sure you have:

- **Node.js 20+** installed ([nodejs.org](https://nodejs.org/))
- **pnpm** installed globally: `npm install -g pnpm`
- A **GitHub** account with this repo pushed to it
- A **Vercel** account (free tier is fine): [vercel.com/signup](https://vercel.com/signup)

---

## Step 1: Push Your Code to GitHub

If you haven't already, push the project to your GitHub repository:

```bash
git add .
git commit -m "feat: complete portfolio remodel with Next.js, GSAP, Three.js"
git push origin main
```

---

## Step 2: Connect GitHub to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub account and find `react-portfolio-site`
4. Click **"Import"**

---

## Step 3: Configure Build Settings

Vercel should auto-detect Next.js. Verify these settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `./` (default) |
| **Build Command** | `pnpm build` |
| **Output Directory** | `.next` (auto-detected) |
| **Install Command** | `pnpm install` |
| **Node.js Version** | 20.x |

Click **"Deploy"**.

---

## Step 4: Environment Variables (Optional)

If you add a contact form backend later, you can set environment variables in:

**Vercel Dashboard > Project > Settings > Environment Variables**

For now, no environment variables are required.

---

## Step 5: Verify Deployment

After Vercel finishes building (usually 30-60 seconds):

1. Click the deployment URL (e.g., `your-project.vercel.app`)
2. Verify all sections load: Hero, About, Experience, Projects, Education, Contact
3. Test smooth scroll navigation
4. Test theme toggle (sun/moon icon in sidebar)
5. Check mobile view by resizing the browser
6. Verify the 3D particle background in the hero section

---

## Step 6: Custom Domain Configuration

1. Go to **Vercel Dashboard > Project > Settings > Domains**
2. Click **"Add"** and enter your domain (e.g., `conordouglas.dev`)
3. Vercel will provide DNS records to configure:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`
4. Add these records at your domain registrar (Namecheap, Cloudflare, etc.)
5. Wait for DNS propagation (usually 5-30 minutes)
6. Vercel will automatically provision an SSL certificate

---

## Step 7: Enable Vercel Analytics & Speed Insights

1. Go to **Vercel Dashboard > Project > Analytics**
2. Click **"Enable"** to activate Web Analytics (free tier: 2,500 events/month)
3. Go to **Speed Insights** tab and click **"Enable"**
4. This gives you Core Web Vitals monitoring in production

---

## Step 8: Ongoing Updates

### Automatic Deployments
Every push to `main` will automatically trigger a new deployment on Vercel.

### Preview Deployments
Every pull request will get its own preview URL for testing before merge.

### Manual Redeployment
From the Vercel Dashboard, click **"Redeploy"** on any deployment.

### Local Development
```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Production build
pnpm start        # Serve production build locally
pnpm lint         # Run ESLint
```

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and PR:

1. **Lint** -- ESLint checks for code quality
2. **Type Check** -- TypeScript strict mode validation
3. **Build** -- Full production build to catch errors

If any step fails, the GitHub check will show a red X on the PR.

---

## Tech Stack Reference

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.x | Framework (App Router, SSG) |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| GSAP | 3.14 | Scroll animations (ScrollTrigger) |
| Framer Motion | 12.x | Layout animations, transitions |
| Three.js / R3F | 9.x | 3D particle hero scene |
| Lenis | 1.x | Smooth scroll |
| Zustand | 5.x | State management (theme) |

---

## Troubleshooting

### Build fails on Vercel
- Check the build logs in Vercel Dashboard
- Ensure `pnpm-lock.yaml` is committed
- Verify Node.js version is 20+

### 3D scene not rendering
- Three.js requires WebGL -- works in all modern browsers
- On mobile, the canvas is lighter (fewer particles) for performance
- The scene loads client-side only (SSR disabled via `dynamic()`)

### Theme not persisting
- Theme preference is saved in `localStorage` under key `theme-preference`
- Clear localStorage if stuck: `localStorage.removeItem('theme-preference')`

### Smooth scroll not working
- Lenis requires JavaScript -- degrades gracefully to native scroll if JS fails
- Check browser console for any errors from `lenis/react`
