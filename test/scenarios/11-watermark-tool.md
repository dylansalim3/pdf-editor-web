# Scenario 11 — Watermark Tool

> **Suite**: Content Modification Tools  
> **Target URL**: https://pdf-editor-web.pages.dev/tools/watermark  
> **Status**: 🐛 ROUTING BUG — Routes to wrong module

---

## Critical Bug

**BUG-001**: The watermark route in `app-routing.module.ts` line 20 loads `PdfRotateModule` instead of a watermark-specific module:

```typescript
// Current (WRONG):
{ path: 'watermark', loadChildren: () => import('./pdf-rotate/pdf-rotate.module').then(m => m.PdfRotateModule) },

// Should be:
{ path: 'watermark', loadChildren: () => import('./tools/watermark/watermark.module').then(m => m.WatermarkModule) },
```

The watermark tool directory exists at `src/app/tools/watermark/` but the route points to the legacy `pdf-rotate` module (which is the generic upload/edit view, not watermark-specific).

---

## Scenario 11.1: Route Loads (BUG)

**Steps:**
1. Navigate to `/tools/watermark`
2. Observe what renders

**Expected (CURRENT — BUG):**
- Loads the generic PdfRotateModule (upload + viewer)
- Does NOT show watermark-specific controls

**Expected (FIXED):**
- Should show watermark tool with text input, color picker, style presets

---

## Blocked Scenarios (After Bug Fix)

### Scenario 11.2: Text Watermark Input
- Enter watermark text
- Verify text field updates

### Scenario 11.3: Color Selection
- Pick a color for watermark
- Verify color value stored

### Scenario 11.4: Style Presets
- Select: Diagonal, Reverse Diagonal, Horizontal
- Verify style applies to watermark

### Scenario 11.5: Apply Watermark
- Enter text, select style, click Apply
- Verify watermark rendered on PDF pages

### Scenario 11.6: Preview Before Apply
- Toggle preview mode
- See watermark overlaid on current view without saving

### Scenario 11.7: Download Watermarked PDF
- Apply watermark, download
- Verify watermark embedded in downloaded PDF

---

## Implementation Requirements

1. Fix routing in `app-routing.module.ts`
2. Create or verify `WatermarkModule` in `tools/watermark/`
3. Implement watermark component with:
   - Text input
   - Color picker
   - Font/size options
   - Opacity slider
   - Style presets (position, angle)
   - Apply using `pdf-lib` `drawText()` on each page
