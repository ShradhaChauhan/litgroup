# Hero Section Image Optimization Guide

## Current Issues Identified from Screenshots

Based on the screenshots showing your hero section on different screens:

1. **Desktop View**: Shows HVAC Remote (Lloyd Remote) - large image
2. **Mobile/Tablet View**: Shows Smart Remote - same large image loaded

## Problems:
- ❌ Same large image file loaded on all devices (wasteful bandwidth)
- ❌ No responsive image sizes (srcset)
- ❌ Missing width/height attributes (causes layout shift)
- ❌ No fetchpriority for critical above-fold images
- ❌ All slides load eagerly (should lazy load non-visible slides)

## Optimization Strategy

### 1. Add Responsive Images with srcset

**For Hero Carousel Images:**
- Desktop (1920px+): 800px wide images
- Tablet (768px-1920px): 600px wide images  
- Mobile (320px-768px): 400px wide images

### 2. Add Width/Height Attributes

Prevents Cumulative Layout Shift (CLS) - critical for SEO and UX.

### 3. Optimize Loading Strategy

- **First slide (visible)**: `fetchpriority="high"` + `loading="eager"`
- **Other slides**: `loading="lazy"` (load when carousel advances)

### 4. Preload Critical Hero Image

Add to `<head>`:
```html
<link rel="preload" as="image" href="images/lloyed-remote-800w.webp" fetchpriority="high">
```

## Implementation Steps

### Step 1: Generate Multiple Image Sizes

You'll need to create multiple sizes of each hero carousel image:
- `lloyed-remote-400w.webp` (mobile)
- `lloyed-remote-600w.webp` (tablet)
- `lloyed-remote-800w.webp` (desktop)

### Step 2: Update HTML with Responsive Images

Replace current `<img>` tags with responsive versions.

### Step 3: Add Dimensions

Add width and height attributes based on aspect ratio.

## Expected Results

- **50-70% reduction** in image file size on mobile devices
- **Faster LCP** (Largest Contentful Paint) - critical metric
- **Zero layout shift** (better CLS score)
- **Better mobile performance** (faster page loads)

