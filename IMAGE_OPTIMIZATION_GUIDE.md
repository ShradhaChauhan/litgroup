# Image Optimization Guide for Production

## Current Status ✅
- ✅ All images converted to WebP format (433 images)
- ✅ Some lazy loading implemented (events page)
- ✅ Deferred loading for hidden images

## Optimization Recommendations

### 1. **Implement Lazy Loading Everywhere** (High Priority)

**Current Issue:** Only some images use `loading="lazy"`. Critical above-the-fold images should load immediately, while others should lazy load.

**Action Items:**
- Add `loading="lazy"` to all images below the fold
- Keep `loading="eager"` or remove attribute for above-the-fold images (logo, hero images)
- Use `fetchpriority="high"` for critical above-the-fold images

**Example:**
```html
<!-- Above the fold (critical) -->
<img src="images/logo.webp" alt="Logo" fetchpriority="high" />

<!-- Below the fold -->
<img src="images/product.webp" alt="Product" loading="lazy" />
```

### 2. **Add Responsive Images with srcset** (High Priority)

**Why:** Serve appropriately sized images based on device screen size, reducing bandwidth.

**Implementation:**
```html
<img 
  src="images/product-800.webp" 
  srcset="images/product-400.webp 400w,
          images/product-800.webp 800w,
          images/product-1200.webp 1200w,
          images/product-1600.webp 1600w"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
  alt="Product"
  loading="lazy"
/>
```

**Tools to generate multiple sizes:**
- Use ImageMagick or Sharp (Node.js) to create multiple sizes
- Or use online tools like Squoosh.app

### 3. **Optimize WebP Compression Quality** (Medium Priority)

**Current:** Using lossless WebP for transparent images (good for quality, but larger files)

**Recommendation:**
- For photos: Use quality 80-85 (good balance)
- For graphics/logos: Use quality 90-95 or lossless
- For thumbnails: Use quality 70-75

**Re-compress existing images:**
```python
# Example script to re-compress with optimal quality
from PIL import Image

# Photos: quality 85
# Graphics: quality 90
# Thumbnails: quality 75
```

### 4. **Add AVIF Format Support** (Future Enhancement)

**Why:** AVIF provides 50% better compression than WebP while maintaining quality.

**Implementation:**
```html
<picture>
  <source srcset="images/product.avif" type="image/avif">
  <source srcset="images/product.webp" type="image/webp">
  <img src="images/product.jpg" alt="Product" loading="lazy">
</picture>
```

**Browser Support:** Modern browsers (Chrome, Firefox, Safari 16+)

### 5. **Preload Critical Images** (High Priority)

**Add to `<head>`:**
```html
<!-- Preload above-the-fold hero images -->
<link rel="preload" as="image" href="images/hero-image.webp" fetchpriority="high">
<link rel="preload" as="image" href="images/logo.webp" fetchpriority="high">
```

### 6. **Set Proper Image Dimensions** (High Priority)

**Why:** Prevents layout shift (CLS - Cumulative Layout Shift)

**Always specify width and height:**
```html
<img 
  src="images/product.webp" 
  alt="Product"
  width="800"
  height="600"
  loading="lazy"
/>
```

Or use CSS aspect-ratio:
```css
img {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
}
```

### 7. **Use Blur-Up/Placeholder Technique** (Medium Priority)

**Why:** Improves perceived performance

**Implementation:**
```html
<img 
  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect fill='%23f0f0f0' width='800' height='600'/%3E%3C/svg%3E"
  data-src="images/product.webp"
  alt="Product"
  loading="lazy"
  class="blur-up"
/>
```

### 8. **Implement CDN for Images** (High Priority)

**Benefits:**
- Faster delivery via edge servers
- Automatic optimization
- Better caching

**Options:**
- Cloudflare (free tier available)
- Cloudinary
- AWS CloudFront
- ImageKit

**Example:**
```html
<img src="https://cdn.yoursite.com/images/product.webp" alt="Product" />
```

### 9. **Configure Proper Caching Headers** (High Priority)

**For static hosting (Netlify/Vercel):**
```json
// netlify.toml or vercel.json
{
  "headers": [
    {
      "source": "/(.*)\\.(webp|avif|jpg|jpeg|png)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 10. **Optimize Background Images** (Medium Priority)

**Current:** Using CSS background-image

**Recommendation:**
- Use `<img>` with `object-fit: cover` instead when possible (better for lazy loading)
- Or use `image-set()` for responsive backgrounds:

```css
.hero {
  background-image: 
    image-set(
      url('images/hero-small.webp') 1x,
      url('images/hero-large.webp') 2x
    );
}
```

### 11. **Image Sprites for Icons** (Low Priority)

**For small icons/logos:**
- Combine into sprite sheets
- Reduces HTTP requests
- Use SVG sprites for scalability

### 12. **Monitor Image Performance** (Ongoing)

**Tools:**
- Google PageSpeed Insights
- Lighthouse (Chrome DevTools)
- WebPageTest
- Chrome DevTools Network tab

**Key Metrics:**
- Largest Contentful Paint (LCP) - should be < 2.5s
- Cumulative Layout Shift (CLS) - should be < 0.1
- Total image bytes - monitor and optimize

## Implementation Priority

### Phase 1 (Immediate - High Impact):
1. ✅ Add `loading="lazy"` to all below-fold images
2. ✅ Add `fetchpriority="high"` to critical images
3. ✅ Add `width` and `height` attributes to prevent CLS
4. ✅ Preload critical hero images

### Phase 2 (Short-term - Medium Impact):
5. ✅ Implement responsive images with `srcset`
6. ✅ Re-compress images with optimal quality settings
7. ✅ Configure CDN and caching headers

### Phase 3 (Long-term - Future Enhancement):
8. ✅ Add AVIF format support
9. ✅ Implement blur-up placeholders
10. ✅ Optimize background images

## Quick Wins Checklist

- [ ] Add `loading="lazy"` to all non-critical images
- [ ] Add `width` and `height` to all images
- [ ] Preload logo and hero images
- [ ] Set up CDN for image delivery
- [ ] Configure long-term caching headers
- [ ] Re-compress images with optimal quality (85 for photos)
- [ ] Add `srcset` for responsive images
- [ ] Monitor performance with Lighthouse

## Tools & Resources

**Image Optimization:**
- Squoosh.app (online)
- Sharp (Node.js library)
- ImageMagick (command line)
- TinyPNG (online)

**CDN Providers:**
- Cloudflare (free tier)
- Cloudinary (free tier)
- ImageKit (free tier)

**Performance Testing:**
- PageSpeed Insights: https://pagespeed.web.dev/
- WebPageTest: https://www.webpagetest.org/
- Lighthouse (built into Chrome)

## Expected Results

After implementing these optimizations:
- **50-70% reduction** in image file sizes
- **30-50% faster** page load times
- **Better Core Web Vitals** scores
- **Improved SEO** rankings
- **Better user experience** on mobile devices

