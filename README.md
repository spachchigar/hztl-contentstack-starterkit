# Contentstack Next.js Starter Kit

A production-ready starter kit for building headless CMS-powered websites using Contentstack and Next.js. This kit demonstrates best practices for SDK integration, live preview, visual building, multi-language support, and dynamic content rendering.

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Contentstack](https://img.shields.io/badge/Contentstack-SDK%204.10-orange)](https://www.contentstack.com/)

## 🚀 Features

- ✅ **Multi-language Support** - Middleware-based i18n with cookie persistence and SEO optimization
- ✅ **Live Preview & Visual Builder** - Real-time content updates with inline editing
- ✅ **Dynamic Component Rendering** - Automatic component mapping from Contentstack
- ✅ **CMS-Managed Redirects** - Edge-based redirect management with dual-layer caching
- ✅ **Dynamic XML Sitemap** - Auto-generated sitemap with multilingual hreflang support
- ✅ **SEO Optimized** - Comprehensive metadata with OpenGraph, Twitter Cards, and hreflang
- ✅ **Type Safety** - Auto-generated TypeScript types from Contentstack
- ✅ **Server-Side Rendering** - Fast initial page loads with Next.js App Router
- ✅ **Image Optimization** - Next.js Image with AVIF/WebP support
- ✅ **Tailwind CSS** - Modern, utility-first styling framework

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Contentstack Account** ([Sign up here](https://www.contentstack.com/))
- **Git** for version control

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd hztl-contentstack-starterkit
```

### 2. Install Contentstack CLI

```bash
npm install -g @contentstack/cli
```

#### First time using the CLI?

Set your region (check your Contentstack account region):

```bash
# Get available regions
csdx config:get:region

# Set your region (EU, US, AZURE_NA, or AZURE_EU)
csdx config:set:region EU
```

> **Note:** Free developer accounts are typically bound to the EU region.

### 3. Log in to Contentstack CLI

```bash
csdx auth:login
```

### 4. Create a New Stack (Optional)

If you don't have an existing stack, create one:

```bash
# Get your Organization ID from Contentstack Dashboard > Org Admin
csdx cm:stacks:seed --repo "contentstack/kickstart-stack-seed" --org "<YOUR_ORG_ID>" -n "Kickstart Stack"
```

> **Skip this step** if you installed via Contentstack Marketplace or onboarding.

### 5. Create Delivery Token

1. Go to **Settings > Tokens** in your Contentstack stack
2. Click **+ New Token**
3. Select **Delivery Token** type
4. Enable **Create preview token**
5. Select the **preview** scope
6. Save and copy both tokens

### 6. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Contentstack Configuration
NEXT_PUBLIC_CONTENTSTACK_API_KEY=<your_api_key>
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=<your_delivery_token>
NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN=<your_preview_token>
NEXT_PUBLIC_CONTENTSTACK_REGION=EU
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=preview
NEXT_PUBLIC_CONTENTSTACK_PREVIEW=true
NEXT_PUBLIC_CONTENTSTACK_BRANCH=main

# Optional: For non-public access
CONTENTSTACK_API_KEY=<your_api_key>
CONTENTSTACK_DELIVERY_TOKEN=<your_delivery_token>
CONTENTSTACK_PREVIEW_TOKEN=<your_preview_token>

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Redirects (Optional)
ENABLE_REDIRECTS=true

# Cache Configuration (Optional)
CACHE_MAX_AGE=3600
STALE_WHILE_REVALIDATE=86400
```

#### Environment Variable Details

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_CONTENTSTACK_API_KEY` | Stack API key | ✅ Yes | - |
| `NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN` | Delivery token | ✅ Yes | - |
| `NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN` | Preview token | ✅ Yes | - |
| `NEXT_PUBLIC_CONTENTSTACK_REGION` | Region code (EU, US, AZURE_NA, AZURE_EU) | ✅ Yes | EU |
| `NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT` | Environment name | ✅ Yes | preview |
| `NEXT_PUBLIC_CONTENTSTACK_PREVIEW` | Enable live preview | ✅ Yes | true |
| `NEXT_PUBLIC_CONTENTSTACK_BRANCH` | Stack branch | ❌ No | main |
| `NEXT_PUBLIC_BASE_URL` | Application base URL | ✅ Yes | http://localhost:3000 |
| `ENABLE_REDIRECTS` | Enable CMS-managed redirects | ❌ No | false |
| `CACHE_MAX_AGE` | Cache duration in seconds | ❌ No | 3600 |
| `STALE_WHILE_REVALIDATE` | Stale revalidation time | ❌ No | 86400 |

### 7. Install Dependencies

```bash
npm install
```

### 8. Generate TypeScript Types

Generate TypeScript types from your Contentstack content types:

```bash
npm run tsgen
```

### 9. Fetch Languages from Contentstack

Sync supported languages from your stack:

```bash
npm run fetch-languages
```

### 10. Enable Live Preview in Contentstack

1. Go to **Settings > Live Preview** in Contentstack
2. Click **Enable**
3. Set **Preview URL**: `http://localhost:3000`
4. Select the **Preview** environment
5. Save settings

---

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

**Development features:**
- Hot module replacement
- Auto-regeneration of component registry
- Live preview enabled
- Debug logging

### Production Build

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with watch mode |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run tsgen` | Generate TypeScript types from Contentstack |
| `npm run gen-config` | Generate component mapper registry |
| `npm run gen-config:watch` | Watch mode for component registry |
| `npm run fetch-languages` | Fetch languages from Contentstack |

---

## 🔧 How It Works

### Dynamic Routing

All pages use a **catch-all route** (`[[...slug]]`) that:
1. Captures any URL path
2. Extracts locale from the first segment
3. Fetches content from Contentstack by URL
4. Dynamically renders components

### Component Mapping

The **ComponentMapper** system:
1. Scans `components/authorable/shared` directory
2. Registers components with PascalCase names
3. Maps Contentstack component names to React components
4. Provides fallback for missing components

### Multi-language Flow

1. **Middleware** detects locale from URL or cookie
2. **Rewrites** or **redirects** to appropriate locale route
3. **Page component** fetches content in the correct language
4. **Metadata** includes hreflang tags for SEO

### Live Preview

1. Contentstack sends query parameters to your app
2. SDK initializes live preview mode
3. Content updates in real-time as authors edit
4. Edit buttons appear on components

### CMS-Managed Redirects

1. **Edge function** intercepts incoming requests before middleware
2. **Fetches redirect rules** from `/api/redirect` endpoint (cached for 1 hour)
3. **API route** pulls redirect mappings from Contentstack `redirect_mappings` content type
4. **Dual-layer caching**: Edge (1 hour) + API (10 minutes) for optimal performance
5. **Matches source path** and returns 301/302 redirect or passes through
6. **Graceful fallback**: Serves stale cache on Contentstack errors

**Benefits:**
- Content editors manage redirects without code deployment
- Edge-based processing for minimal latency
- Supports internal (`/old-page` → `/new-page`) and external redirects
- Automatic active/inactive filtering
- CORS-enabled API for external integrations

### Dynamic XML Sitemap

1. **Auto-generation** from Contentstack pages using Next.js sitemap API
2. **Parallel fetching** of page locales via `Promise.all()` for performance
3. **Validation** of priority (0.0-1.0) and changeFrequency values
4. **Multilingual support** with hreflang alternates for each locale
5. **x-default hreflang** added for default locale (SEO best practice)
6. **Hourly revalidation** - cached for 3600 seconds
7. **Error resilience** - per-page error handling prevents full sitemap failure

**Features:**
- Accessible at `/sitemap.xml`
- Includes `lastModified`, `changeFrequency`, `priority` from CMS
- Skips pages without URLs
- Conditional alternates (only added when locales exist)
- Structured logging for debugging

**Sitemap Fields in Contentstack:**
```typescript
page_sitemap_setting: {
  priority: 0.8,           // 0.0 to 1.0
  change_frequency: 'weekly' // always, hourly, daily, weekly, monthly, yearly, never
}
```
---

## 🧩 Helper Components

The starter kit includes production-ready wrapper components for common content types that integrate seamlessly with Contentstack and Next.js.

### ImageWrapper

**Location:** `helpers/Wrappers/ImageWrapper/ImageWrapper.tsx`

A production-ready image wrapper component that wraps Next.js Image with Contentstack integration. Handles responsive images, domain validation, error fallbacks, and Live Preview attributes. Supports both static dimensions and fill mode, with automatic optimization for Contentstack CDN images.

**Key Features:**
- ✅ Next.js Image optimization with automatic domain validation
- ✅ Responsive image handling with optimal `sizes` attribute generation
- ✅ Error handling with automatic fallback image display
- ✅ Contentstack Live Preview integration with editable attributes

**Usage:**
```tsx
import ImageWrapper from '@/helpers/Wrappers/ImageWrapper/ImageWrapper';

<ImageWrapper
  image={contentstackImage}
  priority={true}
  sizes="(max-width: 768px) 100vw, 50vw"
  quality={90}
/>
```

### ButtonWrapper

**Location:** `helpers/Wrappers/ButtonWrapper/ButtonWrapper.tsx`

Flexible button/link wrapper component that seamlessly handles both navigation links and interactive buttons. Integrates with Contentstack CTAs, provides multiple variants and sizes, and includes comprehensive accessibility features. Automatically detects external links and applies appropriate security attributes.

**Key Features:**
- ✅ Dual-mode component (link/button) with automatic detection
- ✅ Multiple variants (primary, secondary, outline, ghost, danger, link) and sizes
- ✅ Accessibility features (ARIA labels, focus rings, disabled states)
- ✅ Contentstack CTA integration with external link handling

**Usage:**
```tsx
import { ButtonWrapper } from '@/helpers/Wrappers/ButtonWrapper/ButtonWrapper';

// As a link (from Contentstack CTA)
<ButtonWrapper cta={contentstackCta} />

// As a button
<ButtonWrapper 
  href="/contact" 
  customLabel="Contact Us"
  variant="primary"
  size="lg"
/>
```
---

## 🎨 Adding New Components

### 1. Create Component File

Create a new component in `components/authorable/shared`:

```tsx
// components/authorable/shared/Hero.tsx
import { IExtendedProps } from '@/lib/types';

interface HeroProps extends IExtendedProps {
  title?: string;
  description?: string;
}

export const Hero = ({ title, description }: HeroProps) => {
  return (
    <section>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
};
```

### 2. Regenerate Component Registry

The component will be automatically registered when you run:

```bash
npm run gen-config
```

Or in development mode with watch:

```bash
npm run dev  # Includes gen-config:watch
```

### 3. Create Content Type in Contentstack

Create a matching content type in Contentstack with the same name (case-insensitive).

---

## 🌍 Adding Languages

### 1. Add Locale in Contentstack

1. Go to **Settings > Languages** in Contentstack
2. Add your new language
3. Configure fallback languages if needed

### 2. Fetch Updated Languages

```bash
npm run fetch-languages
```

This automatically updates `constants/locales.ts`.

### 3. Configure URL Behavior (Optional)

Edit `constants/locales.ts` to control which languages show in URLs:

```typescript
export const LANGUAGES_WITHOUT_URL_PREFIX = ['en-us', 'en'];
```

---

## 🔀 Managing Redirects

### 1. Enable Redirects

Add to your `.env.local`:

```env
ENABLE_REDIRECTS=true
```

### 2. Create Redirect Mappings in Contentstack

1. Go to **Entries** in Contentstack
2. Find the **Redirect Mappings** content type
3. Create or edit an entry
4. Add redirect rules with:
   - **Source**: The old URL path (e.g., `/old-page`)
   - **Destination**: The new URL (e.g., `/new-page` or `https://external.com`)
   - **Status**: Set to `Active` to enable the redirect

### 3. Redirect Types

**Internal Redirects:**
```
Source: /old-page
Destination: /new-page
```

**External Redirects:**
```
Source: /old-blog
Destination: https://blog.example.com
```

### 4. Cache Behavior

- Edge cache: 1 hour (3600s)
- API cache: 10 minutes (600s)
- Stale-while-revalidate: 24 hours

Redirects update automatically based on cache expiration.

---

## 🗺️ Sitemap Configuration

The sitemap is auto-generated from your Contentstack pages and accessible at `/sitemap.xml`.

### 1. Add Sitemap Settings to Pages

In your Contentstack **Page** content type, add a group field called `page_sitemap_setting` with:

**Priority** (Number field):
- Range: 0.0 to 1.0
- Default: 0.5
- Description: Indicates the importance of this page relative to other pages

**Change Frequency** (Select field):
- Options: `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`
- Default: `daily`
- Description: How frequently the page is likely to change

### 2. Configure Per Page

Edit any page entry and set:

```
Page Sitemap Settings:
  Priority: 0.8
  Change Frequency: weekly
```

### 3. View Your Sitemap

Visit `https://yourdomain.com/sitemap.xml` to see the generated sitemap.

### 4. Sitemap Features

The sitemap automatically includes:
- ✅ All published pages with URLs
- ✅ Multilingual hreflang alternates
- ✅ x-default for default locale
- ✅ Last modified dates from CMS
- ✅ Priority and change frequency from page settings
- ✅ Validation of all values
- ✅ Hourly cache revalidation

### 5. Submit to Search Engines

**Google Search Console:**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property for your domain
3. Submit sitemap: `https://yourdomain.com/sitemap.xml`

**Bing Webmaster Tools:**
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Submit sitemap: `https://yourdomain.com/sitemap.xml`

---

## 🔍 Troubleshooting

### Live Preview Not Working

1. Check `NEXT_PUBLIC_CONTENTSTACK_PREVIEW=true` in `.env.local`
2. Verify preview URL in Contentstack matches your localhost
3. Ensure preview token is correct
4. Check browser console for errors

### Components Not Rendering

1. Run `npm run gen-config` to regenerate component registry
2. Check component name matches in Contentstack (case-insensitive)
3. Verify component is in `components/authorable/` directory
4. Check console for component mapping errors

### TypeScript Errors

1. Run `npm run tsgen` to regenerate types
2. Check `.generated/index.ts` exists
3. Restart TypeScript server in your IDE

### Language Selector Not Showing Languages

1. Run `npm run fetch-languages`
2. Check `constants/locales.ts` is generated
3. Verify languages are enabled in Contentstack

### Redirects Not Working

1. Check `ENABLE_REDIRECTS=true` in `.env.local`
2. Verify redirect mapping status is set to `Active` in Contentstack
3. Check edge function is deployed (for production)
4. Clear cache and wait up to 10 minutes for updates
5. Check browser console for redirect errors
6. Verify source path matches exactly (case-sensitive)

### Sitemap Not Generating or Empty

1. Check `NEXT_PUBLIC_BASE_URL` is set in environment variables
2. Verify pages exist in Contentstack for the current locale
3. Ensure pages have `url` field populated
4. Check server logs for `[Sitemap]` errors
5. Visit `/sitemap.xml` directly to see error messages
6. Clear Next.js cache: `rm -rf .next` and rebuild
7. Verify `page_sitemap_setting` fields exist in content type (optional)
8. Wait up to 1 hour for cache revalidation or force rebuild

### Sitemap Missing Language Alternates

1. Verify pages are localized in multiple languages in Contentstack
2. Check entry locales are published (not draft)
3. Ensure locale codes match `constants/locales.ts`
4. Check console for locale fetch errors
5. Verify Management API token has proper permissions

---

## 🤝 Contributing

### Development Guidelines

1. Follow TypeScript best practices
2. Use existing component patterns
3. Add comments for complex logic
4. Test in multiple languages
5. Ensure live preview compatibility

### Pull Request Checklist

- [ ] Code follows project conventions
- [ ] TypeScript types are properly defined
- [ ] Components work in live preview
- [ ] Multi-language support tested
- [ ] No console errors or warnings
- [ ] Build passes (`npm run build`)
- [ ] README updated if needed
