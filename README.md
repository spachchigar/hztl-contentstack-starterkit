# HZTL Contentstack Starterkit

A production-ready Next.js starter kit for building headless CMS-powered websites with Contentstack. This kit provides a solid foundation with pre-configured content models, integration setup, and best practices for rapid development.

---

## 📖 Overview

This starterkit accelerates your Contentstack + Next.js development by providing:

- Pre-built Content Models — Ready-to-use schemas for common content patterns  
- Starter Components — Minimal demo components to illustrate usage patterns  
- Multi-language Support — Built-in internationalization with middleware  
- Live Preview — Real-time content updates with Contentstack Visual Builder  
- Type Safety — Auto-generated TypeScript types from your CMS  
- SEO Ready — Dynamic Metadata, Sitemap and Robots support 
- Dynamic Routing — Automatic page generation from Contentstack entries  

**Note:** This starterkit focuses on content modeling and integration setup. Only minimal demo components are included. Developers are expected to build their own UI components based on project needs.

---

## 🚀 How to Get Started

### Prerequisites

Before you begin, ensure you have:

- Node.js 18 or higher  
- npm or yarn  
- Contentstack account  
- Git  
- Basic knowledge of React and Next.js  

---

## 📋 Step-by-Step Setup Guide

### Step 1 — Clone the Repository

```bash
git clone YOUR_REPO_URL
cd hztl-contentstack-starterkit
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

---

### Step 3 — Install Contentstack CLI

```bash
npm install -g @contentstack/cli
```

Verify installation:

```bash
csdx --version
```

---

### Step 4 — Configure Contentstack Region

Set your Contentstack's region if not already set.

Example:

```bash
csdx config:set:region AWS-NA
```

**Note:** Refer the Contentstack CLI documentation for list of available regions.

---

### Step 5 — Login to Contentstack CLI

```bash
csdx auth:login
```

Verify login:

```bash
csdx auth:whoami
```

---

### Step 6 — Create an Empty Stack

1. Login to Contentstack  
2. Click New Stack  
3. Copy API Key from Settings → Stack Settings  

---

### Step 7 — Import Content Schema and Data

```bash
npm run import-content YOUR_API_KEY
```

Example:

```bash
npm run import-content blt1234567890abcdef
```

---

### Step 8 — Verify Import

Content Models:
- Page  
- Header  
- Footer  
- Dictionary Items
- Site Settings
- 301 Redirect Mappings

Global Fields:
- SEO  
- Enhanced CTA
- Enhanced Image
- Sitemap Setting
- Hero Banner - Modular Block

Entries:
- Home  
- About Us
- Default Header
- Default Footer
- Default Site Setting  

Environments:
- development  

Assets:
- Favicons
- Header
- Hero Banner

---

### Step 9 — Create Tokens

Delivery Token:

1. Go to Settings → Tokens → Delivery Token
2. Create Delivery Token  
3. Select environment  
4. Enable preview token  

Management Token:

1. Go to Settings → Tokens → Management Token
2. Create Management Token
3. Set Branch
4. Assign Permissions.

Store these tokens securely as they will be used later.

---

### Step 10 — Add Delivery Token as CLI Alias

```bash
csdx tokens:add -a CSDT -k YOUR_API_KEY --delivery --token YOUR_DELIVERY_TOKEN -e YOUR_STACK_ENVIRONMENT
```

---

### Step 11 — Setup Environment Variables

Copy example:

```bash
cp .env.example .env
```

Example `.env`:

```env
CONTENTSTACK_API_KEY=
CONTENTSTACK_PREVIEW_TOKEN=
CONTENTSTACK_MANAGEMENT_TOKEN=
CONTENTSTACK_DELIVERY_TOKEN=
NEXT_PUBLIC_CONTENTSTACK_REGION=NA
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=development
NEXT_PUBLIC_CONTENTSTACK_BRANCH=main
NEXT_PUBLIC_CONTENTSTACK_PREVIEW=true
NEXT_PUBLIC_ENABLE_LANGUAGE_SWITCHER=true
CACHE_MAX_AGE=100
STALE_WHILE_REVALIDATE=600
ENABLE_SOURCE_MAPS=true
DISABLE_CORS=false
CSP_REPORT_ONLY=true

NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Never commit `.env` to version control.

---

### Step 12 — Run Development Server

```bash
npm run dev
```

Visit:

http://localhost:3000

---

## ✅ Verification Checklist

- Application loads locally  
- Content renders from CMS  
- Images load correctly   
- Navigation works
- Language selector works  
- Live Preview works  
- Metadata tags generated
- sitemap.xml generated
- robots.txt generated
- No console errors  
- TypeScript types generated  

---

## 🎯 Next Steps

- Customize content  
- Build your own components  
- Add more languages  
- Test Live Preview  
- Deploy to hosting  

---

## 📚 Resources

Contentstack Docs: https://www.contentstack.com/docs/  
Next.js Docs: https://nextjs.org/docs  
Starterkit Confluence: https://horizontal.atlassian.net/wiki/spaces/Contentsta/pages/7276040388709/Overview

---

## 🆘 Troubleshooting

Import fails  
Check API key and region  

Live Preview issues  
Verify preview token  

Types not generating

```bash
npm run tsgen
```

Build errors  
Delete `.next` and rebuild.

Content not visible  
Ensure all the entries are published in the stack.  

---