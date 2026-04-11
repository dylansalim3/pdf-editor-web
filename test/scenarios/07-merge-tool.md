# Scenario 07 — Merge PDFs Tool

> **Suite**: Document Operations  
> **Target URL**: https://pdf-editor-web.pages.dev/tools/merge  
> **Prerequisites**: Multiple PDF files  
> **Status**: 🔲 PLACEHOLDER — Not implemented

---

## Current State

The route `/tools/merge` loads but only displays:
```html
<p>merge works!</p>
```

---

## Planned Scenarios (Blocked — Needs Implementation)

### Scenario 7.1: Route Loads Without Error
**Steps:**
1. Navigate to `/tools/merge`
2. Verify text "merge works!" visible

**Status:** ✅ Verifiable

---

### Scenario 7.2: Upload Multiple PDFs (BLOCKED)
**Steps:**
1. Navigate to merge tool
2. Upload 3 PDF files via drag-drop or browse
3. Verify file list shows all 3 files with names and sizes
4. Verify total page count displayed

**Status:** 🔲 BLOCKED

---

### Scenario 7.3: Reorder Files Before Merge (BLOCKED)
**Steps:**
1. Upload 3 PDFs
2. Drag file 3 to position 1
3. Verify file order updates
4. Merge
5. Verify pages in correct order from reordered files

**Status:** 🔲 BLOCKED

---

### Scenario 7.4: Remove File from List (BLOCKED)
**Steps:**
1. Upload 3 PDFs
2. Click remove/delete on file 2
3. Verify file list shows only 2 files
4. Merge and verify only 2 files merged

**Status:** 🔲 BLOCKED

---

### Scenario 7.5: Merge Execution (BLOCKED)
**Steps:**
1. Upload 2 PDFs (3 pages + 5 pages)
2. Click "Merge"
3. Verify progress indicator
4. Verify resulting PDF has 8 pages
5. Download merged PDF

**Status:** 🔲 BLOCKED

---

## Implementation Requirements

- Multi-file upload component
- File list with drag-and-drop reordering
- `PDFDocument.load()` + `copyPages()` for each file
- Merge into single PDFDocument
- Progress indicator for large merges
