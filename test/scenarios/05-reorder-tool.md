# Scenario 05 — Reorder Pages Tool

> **Suite**: Page Management Tools  
> **Target URL**: https://pdf-editor-web.pages.dev/tools/reorder  
> **Prerequisites**: Upload PDF via `/upload`  
> **Status**: 🔲 PLACEHOLDER — Not implemented

---

## Current State

The route `/tools/reorder` loads but only displays:
```html
<p>reorder works!</p>
```

No functional UI has been implemented.

---

## Planned Scenarios (Blocked — Needs Implementation)

### Scenario 5.1: Route Loads Without Error
**Steps:**
1. Navigate to `/tools/reorder`
2. Verify page loads without JavaScript errors
3. Verify text "reorder works!" is visible

**Expected:** Page renders placeholder text  
**Status:** ✅ Verifiable

---

### Scenario 5.2: Page Thumbnails Grid (BLOCKED)
**Steps:**
1. Upload multi-page PDF
2. Navigate to `/tools/reorder`
3. Verify page thumbnails are displayed in a grid/list
4. Each thumbnail shows page number and preview

**Expected:** Visual page grid for reordering  
**Status:** 🔲 BLOCKED — Not implemented

---

### Scenario 5.3: Drag-and-Drop Reordering (BLOCKED)
**Steps:**
1. Upload 5-page PDF
2. Drag page 5 thumbnail to position 1
3. Verify pages reorder: 5, 1, 2, 3, 4
4. Click "Apply" to save changes

**Expected:** Drag-and-drop changes page order  
**Status:** 🔲 BLOCKED — Requires @angular/cdk drag-drop

---

### Scenario 5.4: Move Page by Position Input (BLOCKED)
**Steps:**
1. Enter "Move page 3 to position 1"
2. Click Apply
3. Verify page 3 is now page 1

**Expected:** Numeric input reordering  
**Status:** 🔲 BLOCKED

---

### Scenario 5.5: Undo Reorder (BLOCKED)
**Steps:**
1. Reorder pages
2. Click Undo
3. Verify original order restored

**Expected:** NGXS state undo works  
**Status:** 🔲 BLOCKED

---

## Implementation Requirements

To unblock these scenarios, implement:
1. **PageThumbnailComponent** — renders page previews
2. **CdkDragDrop integration** — for drag-and-drop reordering
3. **pdf-lib page manipulation** — `copyPages()` to rebuild PDF in new order
4. **State management** — store reordered PDF in NGXS
