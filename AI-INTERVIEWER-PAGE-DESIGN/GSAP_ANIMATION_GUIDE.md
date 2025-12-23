# GSAP ScrollTrigger Layer Animation - Technical Documentation

## Overview
This document explains the GSAP ScrollTrigger animation pattern used in the AI modal section. The animation creates a "layer peeling" effect where outer layers slide away to reveal inner content as the user scrolls.

---

## Table of Contents
1. [What is GSAP ScrollTrigger?](#what-is-gsap-scrolltrigger)
2. [How the Animation Works](#how-the-animation-works)
3. [Code Structure](#code-structure)
4. [Animation Phases](#animation-phases)
5. [Key Concepts](#key-concepts)
6. [Customization Guide](#customization-guide)
7. [Troubleshooting](#troubleshooting)

---

## What is GSAP ScrollTrigger?

**GSAP (GreenSock Animation Platform)** is a JavaScript animation library that provides high-performance animations.

**ScrollTrigger** is a GSAP plugin that triggers animations based on scroll position, allowing you to:
- Pin sections during scroll
- Scrub animations (tie animation progress to scroll position)
- Create timeline-based sequences
- Build complex scroll-driven interactions

### Installation
```bash
npm install gsap
```

### Import
```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
```

---

## How the Animation Works

### Visual Flow
```
User Scrolls Down
      ↓
[Phase 1: Zoom & Fade]
- Container scales up (1.0 → 1.3x)
- Background grid fades out
      ↓
[Phase 2: Layer Peeling]
- Top layer slides up and fades
- Left layer slides left and fades
- Right layer slides right and fades
- Bottom layer slides down and fades
      ↓
[Phase 3: Content Reveal]
- Inner content fades in and scales up
- Title appears with slide-up
- Input fields appear with delay
- Button appears last
      ↓
Animation Complete - Scroll Continues
```

### Technical Flow
1. **Trigger Detection**: ScrollTrigger monitors when the section enters viewport
2. **Pin Activation**: Section becomes fixed at viewport top
3. **Scrub Mode**: Animation progress = scroll progress (1:1 mapping)
4. **Timeline Execution**: Sequential phases play as user scrolls
5. **Unpin**: After 2500px of scroll, section releases and page continues

---

## Code Structure

### React Component Setup
```javascript
const GetStarted = () => {
  const aiAnimationRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation code here
    }, aiAnimationRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <section ref={aiAnimationRef}>
      {/* Animation elements */}
    </section>
  );
};
```

### GSAP Context Pattern
```javascript
const ctx = gsap.context(() => {
  // All animations here are scoped to aiAnimationRef
  // Automatic cleanup when component unmounts
}, aiAnimationRef);

return () => ctx.revert(); // Cleans up all animations
```

**Why use `gsap.context()`?**
- Scopes animations to a specific container
- Automatic cleanup (prevents memory leaks)
- React-friendly lifecycle management

---

## Animation Phases

### Phase 1: Zoom & Fade (Duration: 2 units)
```javascript
timeline.add([
  gsap.to(".ai-container", {
    scale: 1.3,        // Zoom in 30%
    duration: 2
  }),
  gsap.to(".ai-background", {
    opacity: 0,        // Fade out completely
    duration: 2
  })
])
```

**What happens:**
- Container grows from 1.0x to 1.3x scale
- Background grid fades from 20% to 0% opacity
- Both animations run simultaneously (array syntax)

---

### Phase 2: Layer Peeling (Duration: 2 units)
```javascript
.add([
  gsap.to(".ai-layer-top", {
    y: -400,           // Move up 400px
    opacity: 0,        // Fade out
    duration: 2
  }),
  gsap.to(".ai-layer-left", {
    x: -400,           // Move left 400px
    opacity: 0,
    duration: 2
  }),
  gsap.to(".ai-layer-right", {
    x: 400,            // Move right 400px
    opacity: 0,
    duration: 2
  }),
  gsap.to(".ai-layer-bottom", {
    y: 400,            // Move down 400px
    opacity: 0,
    duration: 2
  })
])
```

**What happens:**
- Top layer slides upward and disappears
- Left layer slides leftward and disappears
- Right layer slides rightward and disappears
- Bottom layer slides downward and disappears
- All four layers animate simultaneously
- Creates "peeling away" effect

---

### Phase 3: Content Reveal (Duration: 2 units with stagger)
```javascript
.add([
  gsap.to(".ai-inner-content", {
    opacity: 1,
    scale: 1,          // Scale from 0.75 to 1
    duration: 2
  }),
  gsap.to(".ai-title", {
    opacity: 1,
    y: 0,              // Slide up from translateY(10px)
    duration: 2
  }),
  gsap.to(".ai-input", {
    opacity: 1,
    y: 0,
    duration: 2,
    delay: 0.2         // Starts 0.2 units after title
  }),
  gsap.to(".ai-button", {
    opacity: 1,
    y: 0,
    duration: 2,
    delay: 0.4         // Starts 0.4 units after title
  })
])
```

**What happens:**
- Inner container scales up and fades in
- Title slides up from below and fades in
- Input fields appear 0.2 units later (staggered)
- Button appears 0.4 units later (staggered)
- Creates cascading reveal effect

---

## Extended Multi-Step Pipeline Pattern

### Overview
After the initial "Create with AI" animation completes, the timeline extends into a multi-step pipeline section inspired by Dora AI. This demonstrates how to create sequential workflow stages within a single pinned ScrollTrigger.

### Pipeline Structure

```
Phase 4: Transition to Pipeline (1.5 units)
Phase 5: Show Pipeline Container (2 units)
Phase 6: Step 1 - "Crafting designs" (2 units)
Phase 7: Step 2 - "Tweak, iterate" (2 units)
Phase 8: Step 3 - "Publish" (2 units)
```

### Phase 4: Transition to Pipeline
```javascript
.add([
  gsap.to(".ai-inner-content", {
    opacity: 0,
    scale: 0.95,
    duration: 1.5
  })
], "+=0.5") // Pause before transition
```

**What happens:**
- Previous content fades out and scales down slightly
- Creates breathing room between sections
- `"+=0.5"` adds 0.5 unit pause before starting

---

### Phase 5: Show Pipeline Container
```javascript
.add([
  gsap.to(".pipeline-container", {
    opacity: 1,
    scale: 1,
    duration: 2
  }),
  gsap.to(".pipeline-progress-bar", {
    opacity: 1,
    duration: 1.5
  }),
  gsap.to(".pipeline-content", {
    opacity: 1,
    duration: 1.5
  })
], "pipelineStart") // Named label for reference
```

**What happens:**
- Pipeline container fades in and scales to normal
- Progress bar on left becomes visible
- Content area on right becomes visible
- All three elements animate simultaneously

**Timeline Label:** `"pipelineStart"` marks this position for future reference

---

### Phase 6: Step 1 - "Crafting designs"
```javascript
.add([
  gsap.to(".progress-indicator", {
    top: "0%",              // Position at first step
    duration: 2
  }),
  gsap.to(".step-1", {
    opacity: 1,
    color: "#ffffff",       // Highlight active step
    scale: 1.1,             // Enlarge slightly
    duration: 1.5
  }),
  gsap.to(".step-2, .step-3", {
    opacity: 0.4,           // Dim inactive steps
    scale: 1,
    duration: 1.5
  }),
  gsap.to(".preview-1", {
    opacity: 1,
    x: 0,                   // Slide to center
    duration: 2
  }),
  gsap.to(".preview-2, .preview-3", {
    opacity: 0,
    x: 100,                 // Hide to the right
    duration: 1.5
  })
], "step1")
```

**What happens:**
- Vertical progress indicator moves to top position (0%)
- Step 1 text becomes bright white and scales up
- Other steps dim to 40% opacity
- Preview 1 content slides into view from left
- Other previews hide to the right

**Key Features:**
- **Single Active Step**: Only one step highlighted at a time
- **Progress Tracking**: Vertical bar shows current position
- **Content Swap**: Preview changes match active step
- **Smooth Transitions**: All changes happen simultaneously

---

### Phase 7: Step 2 - "Tweak, iterate"
```javascript
.add([
  gsap.to(".progress-indicator", {
    top: "33.33%",          // Move to second step
    duration: 2
  }),
  gsap.to(".step-2", {
    opacity: 1,
    color: "#ffffff",
    scale: 1.1,
    duration: 1.5
  }),
  gsap.to(".step-1, .step-3", {
    opacity: 0.4,
    scale: 1,
    duration: 1.5
  }),
  gsap.to(".preview-1", {
    opacity: 0,
    x: -100,                // Exit to left
    duration: 1.5
  }),
  gsap.to(".preview-2", {
    opacity: 1,
    x: 0,                   // Enter from right
    duration: 2
  }),
  gsap.to(".preview-3", {
    opacity: 0,
    x: 100,
    duration: 1.5
  })
], "step2")
```

**What happens:**
- Progress indicator slides down to 33.33% (second position)
- Step 2 activates, Steps 1 & 3 dim
- Preview 1 slides out left
- Preview 2 slides in from right
- Preview 3 remains hidden

**Direction Flow:**
- Previous preview exits left
- Current preview centers
- Next preview waits right

---

### Phase 8: Step 3 - "Publish"
```javascript
.add([
  gsap.to(".progress-indicator", {
    top: "66.66%",          // Move to third step
    duration: 2
  }),
  gsap.to(".step-3", {
    opacity: 1,
    color: "#ffffff",
    scale: 1.1,
    duration: 1.5
  }),
  gsap.to(".step-1, .step-2", {
    opacity: 0.4,
    scale: 1,
    duration: 1.5
  }),
  gsap.to(".preview-2", {
    opacity: 0,
    x: -100,
    duration: 1.5
  }),
  gsap.to(".preview-3", {
    opacity: 1,
    x: 0,
    duration: 2
  })
], "step3")
```

**What happens:**
- Progress indicator reaches 66.66% (final step)
- Step 3 activates, others dim
- Preview 2 exits left
- Preview 3 (final) slides to center
- Animation sequence completes

---

## Multi-Step Pattern: Key Concepts

### 1. Timeline Labels
```javascript
.add([/* animations */], "labelName")
```
- Labels mark positions in timeline
- Can reference later: `timeline.seek("step2")`
- Useful for debugging and control

### 2. Relative Positioning
```javascript
.add([/* animations */], "+=0.5")  // Add 0.5 unit delay
.add([/* animations */], "-=0.2")  // Overlap by 0.2 units
```
- `+=` adds pause/gap
- `-=` creates overlap
- Controls pacing between phases

### 3. Progress Indicator Movement
```javascript
// CSS: position: absolute
top: "0%"      // First step
top: "33.33%"  // Second step
top: "66.66%"  // Third step
```
- Percentage-based positioning
- Divides height by number of steps
- Smooth animated transition

### 4. Active Step Highlighting
```javascript
// Active step
opacity: 1
color: "#ffffff"
scale: 1.1

// Inactive steps
opacity: 0.4
scale: 1
```
- Clear visual hierarchy
- Only one step emphasized
- Smooth state transitions

### 5. Content Carousel Pattern
```javascript
// Current content
opacity: 1, x: 0

// Previous content (exit left)
opacity: 0, x: -100

// Next content (hide right)
opacity: 0, x: 100
```
- Horizontal slide transitions
- Pre-position off-screen
- Smooth directional flow

---

## HTML Structure for Multi-Step Pipeline

```jsx
<div className="pipeline-container">
  {/* LEFT: Progress Steps */}
  <div className="pipeline-progress-bar">
    <div className="progress-indicator" />
    <div className="step-1">...</div>
    <div className="step-2">...</div>
    <div className="step-3">...</div>
  </div>
  
  {/* RIGHT: Preview Content */}
  <div className="pipeline-content">
    <div className="preview-1">...</div>
    <div className="preview-2">...</div>
    <div className="preview-3">...</div>
  </div>
</div>
```

### Required CSS
```css
/* Container */
.pipeline-container {
  opacity: 0;
  transform: scale(0.95);
  position: absolute;
  inset: 0;
}

/* Progress Indicator */
.progress-indicator {
  position: absolute;
  top: 0%;
  transition: top 0.3s ease;
}

/* Steps */
.step-1, .step-2, .step-3 {
  opacity: 0.4;
  transform: scale(1);
  transition: all 0.5s ease;
}

/* Previews */
.preview-1, .preview-2, .preview-3 {
  position: absolute;
  inset: 0;
  opacity: 0;
}

.preview-1 { transform: translateX(0); }
.preview-2, .preview-3 { transform: translateX(100px); }
```

---

## Customizing the Multi-Step Pipeline

### Add More Steps
```javascript
// Add Phase 9: Step 4
.add([
  gsap.to(".progress-indicator", {
    top: "100%",  // Calculate: (stepIndex / totalSteps) * 100
    duration: 2
  }),
  gsap.to(".step-4", {
    opacity: 1,
    color: "#ffffff",
    scale: 1.1,
    duration: 1.5
  }),
  gsap.to(".step-1, .step-2, .step-3", {
    opacity: 0.4,
    scale: 1,
    duration: 1.5
  }),
  gsap.to(".preview-4", {
    opacity: 1,
    x: 0,
    duration: 2
  }),
  gsap.to(".preview-3", {
    opacity: 0,
    x: -100,
    duration: 1.5
  })
], "step4")
```

**Remember:** Increase `end: "+=5000"` to `end: "+=6500"` for more steps

### Change Step Transition Speed
```javascript
// Faster transitions
gsap.to(".step-2", {
  opacity: 1,
  color: "#ffffff",
  scale: 1.1,
  duration: 0.8  // Was 1.5
})
```

### Modify Progress Bar Style
```javascript
// Animated gradient progress bar
gsap.to(".progress-indicator", {
  top: "33.33%",
  background: "linear-gradient(to bottom, #8b5cf6, #3b82f6)",
  duration: 2
})
```

### Add Rotation/Complex Transitions
```javascript
gsap.to(".preview-2", {
  opacity: 1,
  x: 0,
  rotation: 360,  // Add spin
  duration: 2,
  ease: "back.out(1.7)"  // Bounce effect
})
```

---

## Total Timeline Duration

```
Initial Phases (Create with AI):
- Phase 1: 2 units (Zoom & Fade)
- Phase 2: 2 units (Layer Peeling)
- Phase 3: 2 units (Content Reveal)
Total: 6 units

Pipeline Transition:
- Phase 4: 1.5 units + 0.5 pause = 2 units

Pipeline Steps:
- Phase 5: 2 units (Show Container)
- Phase 6: 2 units (Step 1)
- Phase 7: 2 units (Step 2)
- Phase 8: 2 units (Step 3)
Total: 8 units

GRAND TOTAL: 16 units of animation
Scroll Distance: 5000px
Per Unit: ~312px of scroll
```

### Adjusting Total Duration
```javascript
scrollTrigger: {
  end: "+=5000",  // Current
  // Or adjust: "+=6000" for slower, "+=4000" for faster
}
```

---

## Best Practices for Multi-Step Animations

### 1. Consistent Step Duration
- Keep all steps the same duration (e.g., 2 units each)
- Creates predictable, rhythmic pacing
- User knows how much to scroll per step

### 2. Clear Visual Hierarchy
- Only ONE element highlighted at a time
- Use distinct colors/scales for active state
- Dim inactive elements significantly (0.4 opacity or less)

### 3. Directional Consistency
- Content always enters from same side (right)
- Content always exits to same side (left)
- Creates learnable pattern

### 4. Progress Indicator Must Be Visible
- Always show progress bar during steps
- Animate smoothly between positions
- Consider adding percentage numbers

### 5. Content Pre-loading
- All preview content rendered upfront
- Hidden with opacity/position
- No loading delays during animation

### 6. Accessibility Considerations
```html
<div role="progressbar" aria-valuenow="33" aria-valuemin="0" aria-valuemax="100">
  <!-- Progress indicator -->
</div>
```

---

## Troubleshooting Multi-Step Issues

### Steps skip/jump
**Cause:** Duration too short for scroll distance  
**Fix:** Increase `end` value or reduce per-step duration

### Progress bar doesn't align
**Cause:** Percentage calculations off  
**Fix:** Ensure steps divide evenly (3 steps = 0%, 33.33%, 66.66%)

### Content flickers during transition
**Cause:** Overlapping opacity animations  
**Fix:** Ensure exiting content finishes before entering

### Multiple steps highlighted
**Cause:** Previous step not resetting  
**Fix:** Include ALL non-active steps in dim animation:
```javascript
gsap.to(".step-1, .step-3", { opacity: 0.4 })
```

### Animation feels sluggish
**Cause:** Too many elements animating  
**Fix:** Reduce concurrent animations or optimize with `will-change`:
```css
.step-1, .step-2, .step-3 {
  will-change: opacity, transform;
}
```

---

## Example: Adding a Fourth Step

```javascript
// In timeline, after Phase 8
.add([
  gsap.to(".progress-indicator", {
    top: "100%",
    duration: 2
  }),
  gsap.to(".step-4", {
    opacity: 1,
    color: "#ffffff",
    scale: 1.1,
    duration: 1.5
  }),
  gsap.to(".step-1, .step-2, .step-3", {
    opacity: 0.4,
    scale: 1,
    duration: 1.5
  }),
  gsap.to(".preview-3", {
    opacity: 0,
    x: -100,
    duration: 1.5
  }),
  gsap.to(".preview-4", {
    opacity: 1,
    x: 0,
    duration: 2
  })
], "step4")
```

**Don't forget:**
1. Add HTML for `.step-4` and `.preview-4`
2. Increase `end: "+=6500"` (add 1500 for new step)
3. Update progress calculations (4 steps = 0%, 25%, 50%, 75%, 100%)

---

## Key Concepts

### 1. Timeline
```javascript
const timeline = gsap.timeline({
  scrollTrigger: { /* config */ }
});
```
- **Timeline** = Container for multiple animations
- Animations play sequentially by default
- `.add()` method adds animation steps

### 2. ScrollTrigger Configuration
```javascript
scrollTrigger: {
  trigger: aiAnimationRef.current,  // Element to watch
  start: "top top",                 // When to start (trigger top hits viewport top)
  end: "+=2500",                    // When to end (2500px of scroll later)
  scrub: 1,                         // Smooth scrubbing with 1s lag
  pin: true,                        // Pin element during animation
}
```

**Key Properties:**
- `trigger`: DOM element that activates animation
- `start`: When animation starts ("trigger_position viewport_position")
- `end`: When animation ends (relative or absolute)
- `scrub`: Ties animation to scroll (true = instant, number = lag time)
- `pin`: Keeps element fixed during animation

### 3. Scrubbing
```
scrub: true   → Animation follows scroll instantly (no lag)
scrub: 1      → Animation follows scroll with 1 second smooth lag
scrub: false  → Animation plays on trigger, not tied to scroll
```

**Our choice:** `scrub: 1` for smooth, natural feel

### 4. Pin Duration Calculation
```
Scroll Distance = end - start
2500px = Total scroll needed to complete animation

Phase 1: ~833px  (duration: 2 / 6 total)
Phase 2: ~833px  (duration: 2 / 6 total)
Phase 3: ~833px  (duration: 2 / 6 total)
```

### 5. Element Selection
```javascript
gsap.to(".ai-container", { /* props */ })
```
- Uses **CSS class selectors** (not refs)
- GSAP queries within the context scope
- Multiple elements can share same class

---

## Customization Guide

### Adjust Animation Speed
**Make it faster:**
```javascript
end: "+=1500",  // Less scroll distance = faster
```

**Make it slower:**
```javascript
end: "+=4000",  // More scroll distance = slower
```

### Change Layer Movement Distance
```javascript
gsap.to(".ai-layer-top", {
  y: -600,  // Move further (was -400)
  opacity: 0,
  duration: 2
})
```

### Add More Phases
```javascript
timeline
  .add([/* Phase 1 */])
  .add([/* Phase 2 */])
  .add([/* Phase 3 */])
  .add([/* Phase 4 - NEW */
    gsap.to(".new-element", {
      opacity: 1,
      duration: 2
    })
  ])
```
**Note:** Increase `end` value to accommodate more phases

### Modify Stagger Timing
```javascript
gsap.to(".ai-button", {
  opacity: 1,
  y: 0,
  duration: 2,
  delay: 0.8  // Longer delay = more stagger
})
```

### Change Scale Amount
```javascript
gsap.to(".ai-container", {
  scale: 2.0,  // Zoom in more (was 1.3)
  duration: 2
})
```

### Add Rotation
```javascript
gsap.to(".ai-layer-top", {
  y: -400,
  rotation: 45,  // Add rotation
  opacity: 0,
  duration: 2
})
```

---

## HTML/CSS Structure Requirements

### Element Hierarchy
```jsx
<section ref={aiAnimationRef}>
  <div className="ai-background">
    {/* Background pattern */}
  </div>
  
  <div className="ai-container">
    <div className="ai-layer-top" />
    <div className="ai-layer-left" />
    <div className="ai-layer-right" />
    <div className="ai-layer-bottom" />
    
    <div className="ai-inner-content">
      <div className="ai-title" />
      <div className="ai-input" />
      <div className="ai-button" />
    </div>
  </div>
</section>
```

### Required CSS Properties
```css
/* Initial states for animated elements */
.ai-inner-content {
  opacity: 0;
  transform: scale(0.75);
}

.ai-title, .ai-input, .ai-button {
  opacity: 0;
  transform: translateY(10px);
}

/* Parent container must have position */
.ai-container {
  position: relative;
}

/* Layers must be absolutely positioned */
.ai-layer-top, .ai-layer-left, 
.ai-layer-right, .ai-layer-bottom {
  position: absolute;
}
```

---

## Troubleshooting

### Animation doesn't trigger
**Check:**
1. Is ScrollTrigger registered? `gsap.registerPlugin(ScrollTrigger);`
2. Does ref point to correct element? `console.log(aiAnimationRef.current)`
3. Are class names correct? Match exactly with HTML

**Debug with markers:**
```javascript
scrollTrigger: {
  markers: true,  // Shows start/end points
  // ... other config
}
```

### Animation is jerky/laggy
**Solutions:**
1. Reduce `scrub` value: `scrub: 0.5` (was 1)
2. Use `will-change` CSS:
```css
.ai-container {
  will-change: transform;
}
```
3. Reduce animated elements count

### Elements jump at start/end
**Cause:** CSS initial state doesn't match animation start state

**Fix:** Set initial CSS to match animation's `from` values:
```css
.ai-inner-content {
  opacity: 0;      /* Matches gsap.to({ opacity: 1 })
  transform: scale(0.75);
}
```

### Multiple instances conflict
**Use unique refs per instance:**
```javascript
const ref1 = useRef(null);
const ref2 = useRef(null);

// Separate contexts
gsap.context(() => { /* animation 1 */ }, ref1);
gsap.context(() => { /* animation 2 */ }, ref2);
```

### Memory leaks
**Always cleanup:**
```javascript
useEffect(() => {
  const ctx = gsap.context(() => { /* animations */ });
  
  return () => ctx.revert(); // REQUIRED for React
}, []);
```

---

## Performance Tips

### 1. Use `will-change` sparingly
```css
.ai-container {
  will-change: transform;  /* Only on elements that actually animate */
}
```

### 2. Avoid animating expensive properties
✅ **Good:** `transform`, `opacity`  
❌ **Bad:** `width`, `height`, `top`, `left`

### 3. Use GPU acceleration
```javascript
force3D: true  // Add to animation properties
```

### 4. Limit concurrent animations
```javascript
// Instead of 10 items at once:
items.forEach(item => gsap.to(item, { opacity: 1 }))

// Stagger them:
gsap.to(".items", { opacity: 1, stagger: 0.1 })
```

---

## Advanced Patterns

### Bidirectional Animations
```javascript
scrollTrigger: {
  scrub: 1,
  toggleActions: "play reverse play reverse"
  // scroll down: play forward
  // scroll up: play backward
}
```

### Responsive Animation
```javascript
ScrollTrigger.matchMedia({
  "(min-width: 768px)": function() {
    // Desktop animation
  },
  "(max-width: 767px)": function() {
    // Mobile animation (simplified)
  }
});
```

### On-Complete Callback
```javascript
scrollTrigger: {
  onEnter: () => console.log("Entered"),
  onLeave: () => console.log("Left"),
  onUpdate: (self) => console.log("Progress:", self.progress)
}
```

---

## Comparison: GSAP vs Framer Motion

| Feature | GSAP ScrollTrigger | Framer Motion |
|---------|-------------------|---------------|
| **Scroll Pinning** | Native support | Requires manual implementation |
| **Scrubbing** | Built-in, smooth | Limited, requires custom hooks |
| **Timeline Control** | Powerful, flexible | Basic sequencing |
| **Performance** | Excellent | Good |
| **Learning Curve** | Moderate | Easy |
| **React Integration** | Requires cleanup | Native |
| **Bundle Size** | ~50kb | ~35kb |

**When to use GSAP:**
- Complex scroll-based animations
- Need precise timeline control
- Layer peeling, parallax effects
- High performance required

**When to use Framer Motion:**
- Simple animations
- React-first workflow
- Component-based animations
- Gesture-based interactions

---

## References

- [GSAP Documentation](https://greensock.com/docs/)
- [ScrollTrigger Documentation](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [GSAP React Guide](https://greensock.com/react/)
- [ScrollTrigger Demos](https://greensock.com/st-demos/)

---

## Example Use Cases

### 1. Product Reveal
Show product layers/components assembling as user scrolls

### 2. Story Telling
Sequential content reveal for narrative experiences

### 3. Onboarding Flow
Step-by-step tutorial with scroll-based progression

### 4. Portfolio Showcase
Projects reveal with layer transitions

### 5. Data Visualization
Charts/graphs build up during scroll

---

## License & Credits

This pattern is inspired by:
- GSAP's official ScrollTrigger demos
- Modern SaaS landing page designs
- Apple product reveal animations

**Created for:** AI Interviewer Platform  
**Date:** December 19, 2025  
**Author:** Development Team

---

## Quick Reference Cheat Sheet

```javascript
// Basic setup
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// React component
const ref = useRef(null);
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: "top top",
        end: "+=2500",
        scrub: 1,
        pin: true,
      }
    })
    .add([/* animations */])
    .add([/* animations */]);
  }, ref);
  return () => ctx.revert();
}, []);

// Common properties
opacity: 0 → 1          // Fade in
scale: 0.5 → 1          // Scale up
x: -100 → 0             // Slide from left
y: 100 → 0              // Slide from bottom
rotation: 0 → 360       // Rotate
duration: 2             // Animation length
delay: 0.5              // Start delay
```

---

**End of Documentation**
