# Wi-Chain Portal Design System

## Overview

Wi-Chain Portal features a minimal, calm, and professional design inspired by modern fintech applications like Groww and Zerodha. The design emphasizes clarity, trust, and accessibility while maintaining a futuristic blockchain aesthetic.

## Design Philosophy

- **Minimal & Calm**: Clean layouts with ample white space
- **Professional**: Trust-building through clear hierarchy and consistent patterns
- **Accessible**: WCAG compliant contrast ratios and readable typography
- **Responsive**: Mobile-first approach with tablet and desktop adaptations
- **Animated**: Subtle, purposeful micro-animations that enhance UX

## Color Palette

### Primary Colors
- **Primary Blue**: `#2563eb` - Main actions, links, active states
- **Primary Light**: `#3b82f6` - Hover states
- **Primary Lighter**: `#60a5fa` - Backgrounds, highlights

### Accent Colors
- **Accent Teal**: `#14b8a6` - Secondary actions, highlights
- **Accent Light**: `#2dd4bf` - Accent backgrounds

### Neutral Palette
- **Background**: `#fafbfc` - App background
- **Foreground**: `#0f1419` - Primary text
- **Card**: `#ffffff` - Card backgrounds
- **Border**: `#e2e8f0` - Borders, dividers
- **Muted**: `#f8fafc` - Subtle backgrounds
- **Muted Foreground**: `#64748b` - Secondary text

### State Colors
- **Success**: `#10b981` - Success states, positive metrics
- **Destructive**: `#ef4444` - Errors, critical actions
- **Warning**: `#f59e0b` - Warnings, pending states

## Typography

### Font Family
- Primary: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### Font Weights
- Normal: `400`
- Medium: `500`
- Semibold: `600`

### Type Scale
Follows default Tailwind CSS type scale with semantic HTML elements styled appropriately.

## Components

### Bottom Navigation
- 4 primary tabs: Home, Portfolio, Activity, Settings
- Active tab features:
  - Icon fill transition
  - Color change to primary
  - Subtle upward movement (-2px)
  - Animated indicator dot
  - Medium font weight

### Top Bar
- Sticky positioning with blur backdrop
- Page title (left)
- Contextual actions (center-right)
- Wallet connection status (right)
- Height: 56px (14 tailwind units)

### Cards
- Background: White (`#ffffff`)
- Border: 1px solid `#e2e8f0`
- Border radius: `12px` (rounded-xl)
- Shadow on hover: `0 8px 30px rgba(0, 0, 0, 0.08)`
- Lift on hover: `-4px` transform

### Buttons

#### Primary
- Background: `#2563eb`
- Text: White
- Padding: `12px 16px`
- Border radius: `12px`
- Font weight: Medium

#### Secondary
- Background: `#f1f5f9`
- Text: `#475569`
- Same padding and radius as primary

#### Tap Animation
- Scale: `0.96` on tap
- Duration: `200ms`
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

### Toggle Switch
- Width: `48px`
- Height: `24px`
- Handle size: `20px`
- Active color: Primary blue
- Inactive color: `#cbd5e1`
- Animation: Spring with stiffness 500, damping 30

## Animations

### Motion System

#### Timing
- **Fast**: 200ms - Button taps, toggles
- **Medium**: 300ms - Card animations, transitions
- **Slow**: 400-500ms - Page transitions, complex animations

#### Easing Curves
- **Smooth**: `cubic-bezier(0.4, 0, 0.2, 1)` - General animations
- **Spring**: Used for toggles, FAB, natural movements

### Micro-Animations

#### Button Tap
```typescript
whileTap={{ scale: 0.96 }}
transition={{ duration: 0.2 }}
```

#### Card Tap
```typescript
whileTap={{ scale: 0.98 }}
whileHover={{ 
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
  y: -4 
}}
```

#### Page Transition
```typescript
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: -20 }}
transition={{ duration: 0.25 }}
```

#### Toggle Switch
```typescript
animate={{ x: enabled ? 26 : 2 }}
transition={{ 
  type: 'spring',
  stiffness: 500,
  damping: 30 
}}
```

## Layout

### Mobile (Default)
- Bottom navigation (fixed)
- Top bar (sticky)
- Single column content
- Padding: `16px` (px-4)
- Max width: Full viewport

### Tablet & Desktop
- Same navigation pattern
- Max content width: `1280px` (max-w-screen-xl)
- Centered content
- Increased spacing where appropriate

## Loading States

### Skeleton Loaders
- Background: `#f8fafc` (secondary)
- Animation: Opacity pulse (0.5 → 1 → 0.5)
- Duration: 1.5s
- Infinite repeat

### Spinner
- Border width: 4px
- Color: Primary blue (top) / Secondary (sides)
- Size: 48px
- Rotation: 360deg in 1s

## Accessibility

### Contrast Ratios
- Normal text: Minimum 4.5:1
- Large text: Minimum 3:1
- Interactive elements: Minimum 3:1

### Focus States
- Ring: Primary blue
- Opacity: 50%
- Width: 2px

### Motion
- Respects `prefers-reduced-motion`
- Motion intensity toggle in settings
- All animations optional

## Background Effects

### Subtle Grid
- Line color: Primary blue
- Opacity: 1.5%
- Grid size: 40px × 40px

### Gradient Orbs
- Top right: Primary blue at 5% opacity
- Bottom left: Accent teal at 5% opacity
- Blur: 3xl

## Best Practices

1. **Consistency**: Use defined tokens, avoid hard-coded values
2. **Spacing**: Follow 4px/8px grid system
3. **Typography**: Let default styles work, override sparingly
4. **Animation**: Keep it subtle and purposeful
5. **Accessibility**: Test with screen readers and keyboard navigation
6. **Performance**: Use CSS transforms for animations
7. **Touch Targets**: Minimum 44px × 44px for interactive elements

## File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── AnimatedCard.tsx
│   │   ├── BottomNav.tsx
│   │   ├── TopBar.tsx
│   │   ├── FloatingActionButton.tsx
│   │   ├── BackgroundPattern.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── PortfolioPage.tsx
│   │   ├── ActivityPage.tsx
│   │   └── SettingsPage.tsx
│   └── App.tsx
├── styles/
│   ├── fonts.css
│   ├── theme.css
│   └── index.css
```

## Resources

- Icons: Lucide React
- Charts: Recharts
- Animations: Motion (framer-motion v12)
- Notifications: Sonner
- Font: Inter (Google Fonts)
