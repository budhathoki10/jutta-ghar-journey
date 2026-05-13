# Animation & Scrolling Features Guide

## Overview

Your Jutta Ghar Journey website now features modern, smooth animations and scrolling behaviors inspired by leading SaaS platforms (Unkey, Framer, and LocalReach). These animations enhance user experience while maintaining performance.

## New Components

### 1. **AnimatedBackground**
Creates dynamic animated backgrounds in multiple styles.

**Location:** `src/components/AnimatedBackground.tsx`

**Usage:**
```tsx
import { AnimatedBackground } from '@/components/AnimatedBackground';

<AnimatedBackground variant="mesh" className="fixed inset-0 -z-10" />
```

**Variants:**
- `mesh` - Animated blob shapes (default, used on Home)
- `gradient` - Subtle pulsing gradient (used on Contact)
- `dots` - Interactive particle system (used on AllShoes)
- `blur` - Shimmer effect across the screen

**Props:**
- `variant` - Animation type ('dots' | 'gradient' | 'mesh' | 'blur')
- `className` - Additional CSS classes

---

### 2. **TrendingShoes**
Horizontal scrolling showcase of trending shoes with smooth animations.

**Location:** `src/components/TrendingShoes.tsx`

**Usage:**
```tsx
import { TrendingShoes } from '@/components/TrendingShoes';

<TrendingShoes />
```

**Features:**
- Fetches first 8 shoes from your API
- Smooth horizontal scroll with fade-in animations
- Navigation arrows (appear on hover)
- Trending badge on each card
- Responsive design
- Hover effects with image zoom and scale

**Auto Behavior:**
- Shows/hides scroll buttons based on scroll position
- Smooth scroll animation on button click
- Staggered card animations on load

---

### 3. **ScrollReveal**
Triggers smooth animations as elements enter the viewport (Intersection Observer).

**Location:** `src/components/ScrollReveal.tsx`

**Usage:**
```tsx
import { ScrollReveal } from '@/components/ScrollReveal';

<ScrollReveal delay={100} threshold={0.1}>
  <YourContent />
</ScrollReveal>
```

**Props:**
- `children` - Content to animate
- `delay` - Animation delay in milliseconds (default: 0)
- `threshold` - Intersection observer threshold 0-1 (default: 0.1)
- `className` - Additional CSS classes

**Animation:**
- Fade in + slide up effect
- Smooth cubic-bezier timing
- Triggers when element enters viewport

---

## Updated Pages

### **Home.tsx** (Complete Redesign)
New modern homepage with:
- Animated mesh background
- Hero section with staggered animations
- Premium collection badge
- Explore & Visit CTAs
- Animated hero image placeholder
- 3-column feature cards with hover effects
- Trending Shoes section
- Final CTA section with animations

**Key Animations:**
- Staggered scroll reveals (100ms delays)
- Floating icon animation
- Gradient shift background
- Scale animations on hover

---

### **Contact.tsx** (Enhanced)
Updated with:
- Animated gradient background
- Scroll reveal animations for each section
- Same core contact functionality
- Better visual hierarchy
- Smooth transitions

**Variants Used:**
- AnimatedBackground: `gradient`
- ScrollReveal on main sections and map

---

### **AllShoes.tsx** (Complete Redesign)
New interactive shoe catalog with:
- Animated dots background
- Search functionality (real-time filtering)
- Loading skeletons while fetching
- Scroll reveal animations for each shoe
- Hover effects on cards
- Empty state with clear button
- Better responsive grid

**Features:**
- Search by shoe name or category
- 8-card responsive grid
- Pricing display in Nepali Rupees
- Gender and category badges
- Smooth image hover zoom

---

## Animation Utilities Added to Tailwind

### New Keyframes
```css
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

### New Animations
- `animate-blob` - 7s blob animation loop
- `animate-shimmer` - 2s shimmer effect

### Animation Delays
Available in milliseconds: 0, 75, 100, 150, 200, 300, 500, 700, 1000, 2000, 4000

Usage: `animation-delay-2000`, `animation-delay-4000`

---

## Global CSS Enhancements (App.css)

- Smooth scroll behavior for entire page
- Enhanced focus states for accessibility
- Backdrop blur support
- Smooth timing functions throughout

---

## Design Principles Used

1. **Staggered Animations** - Elements animate in sequence for visual flow
2. **Micro-interactions** - Hover states provide feedback
3. **Performance** - CSS animations and Intersection Observer for efficiency
4. **Accessibility** - Focus states, reduced-motion support
5. **Responsive** - Animations scale from mobile to desktop

---

## Performance Considerations

✅ **Optimized:**
- Uses CSS animations (GPU accelerated)
- Intersection Observer for efficient viewport detection
- Canvas-based particle effects only for dots variant
- No JavaScript animation libraries

⚠️ **Best Practices:**
- `ScrollReveal` components mount lazily only when needed
- `AnimatedBackground` variants are performance-conscious
- Mobile-first approach with reduced animation complexity

---

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support (backdrop-filter may degrade)
- Mobile browsers: Full support with optimized animations

---

## Customization

### Change Home Background Variant
**File:** `src/pages/Home.tsx` (line ~24)
```tsx
// Current:
<AnimatedBackground variant="mesh" />

// Try:
<AnimatedBackground variant="gradient" />
<AnimatedBackground variant="blur" />
<AnimatedBackground variant="dots" />
```

### Adjust Animation Speeds
**File:** `tailwind.config.ts`
Modify keyframe durations:
```ts
"blob": "blob 7s infinite",  // Change 7s to your value
"shimmer": "shimmer 2s infinite",  // Change 2s to your value
```

### Change ScrollReveal Timing
**File:** `src/components/ScrollReveal.tsx` (line ~31)
```tsx
// Modify these values:
const element = entry.target as HTMLElement;
setTimeout(() => {
  element.classList.add('reveal-visible');
}, delay);  // 'delay' prop controls timing
```

---

## Testing the Features

1. **Home Page** - View all animations on landing
2. **Contact Page** - Scroll to see reveal animations
3. **All Shoes Page** - Search and scroll for full effect
4. **Mobile** - Test responsive animations on devices

---

## Troubleshooting

**Animations not showing?**
- Check browser DevTools for console errors
- Verify Tailwind classes are being generated
- Clear browser cache

**Performance issues?**
- Reduce number of `ScrollReveal` components
- Use simpler background variant
- Profile with browser DevTools Performance tab

**Missing imports?**
- Ensure path aliases are configured (check tsconfig.json)
- Use `@/components/` for component imports
- Use `@/pages/` for page imports

---

## References Used

- **Unkey.com** - Clean background animations and transitions
- **Framer.com** - Scroll-based reveal patterns and interactive elements  
- **LocalReach.com** - Smooth scrolling behavior and interaction patterns

---

## Next Steps

Consider adding:
- Page transition animations
- Scroll progress indicators
- Parallax effects for hero sections
- Image reveal animations
- Loading state animations
- Success/error state animations

---

**Version:** 1.0  
**Last Updated:** 2026-05-11
