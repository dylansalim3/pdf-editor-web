# Scenario 06 — Extract Pages Tool

> **Suite**: Page Management Tools  
> **Target URL**: https://pdf-editor-web.pages.dev/tools/extract  
> **Prerequisites**: Upload PDF  
> **Status**: 🔲 PLACEHOLDER — Not implemented

---

## Current State

The route `/tools/extract` loads but only displays:
```html
<p>extract works!</p>
```

---

## Planned Scenarios (Blocked — Needs Implementation)

### Scenario 6.1: Route Loads Without Error
**Steps:**
1. Navigate to `/tools/extract`
2. Verify "extract works!" text visible or page renders

**Status:** ✅ Verifiable

---

### Scenario 6.2: Select Pages to Extract (BLOCKED)
**Steps:**
1. Upload 10-page PDF
2. Navigate to extract tool
3. Select pages 2, 5, 8 via page thumbnails
4. Click "Extract Selected Pages"
5. Verify new 3-page PDF generated for download

**Status:** 🔲 BLOCKED

---

### Scenario 6.3: Extract Page Range (BLOCKED)
**Steps:**
1. Upload 10-page PDF
2. Set extract range: pages 3-7
3. Click "Extract"
4. Verify 5-page PDF generated

**Status:** 🔲 BLOCKED

---

### Scenario 6.4: Extract as Individual Files (BLOCKED)
**Steps:**
1. Upload 5-page PDF
2. Select "Extract each page as separate PDF"
3. Click "Extract"
4. Verify 5 PDF files generated
5. Download all as ZIP

**Status:** 🔲 BLOCKED

---

## Implementation Requirements

- Page selection UI (similar to delete tool's thumbnail grid)
- `PDFDocument.create()` + `copyPages()` from pdf-lib
- ZIP generation for multi-file download (JSZip library)
- Download individual or all extracted files
