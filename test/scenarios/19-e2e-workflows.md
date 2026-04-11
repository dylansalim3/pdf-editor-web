# Scenario 19 — End-to-End Workflows

> **Suite**: End-to-End Integration Tests  
> **Target URL**: https://pdf-editor-web.pages.dev/  
> **Prerequisites**: Test fixture files  
> **Status**: Depends on individual tool implementations

---

## Workflow 1: Upload → Rotate → Download

**Priority**: HIGH  
**Dependencies**: Upload page, Rotate tool  
**Status**: ✅ FUNCTIONAL

**Steps:**
1. Navigate to `/upload`
2. Upload `sample-3page.pdf`
3. Wait for PDF to render in viewer
4. Navigate to `/tools/rotate` via sidebar
5. Verify PDF loaded in rotate tool viewer (page count = 3)
6. Select "All pages" rotation mode
7. Set angle to 90°, direction Clockwise
8. Click "Apply Rotation"
9. Wait for processing to complete
10. Click "Download"
11. Verify file downloads as "rotated-document.pdf"
12. *(Manual verification)*: Open downloaded PDF; all pages should be rotated 90° clockwise

**Success Criteria:**
- PDF state flows from upload to rotate tool via NGXS
- Rotation is applied correctly
- Download produces valid PDF

---

## Workflow 2: Upload → Delete Pages → Rotate Remaining → Download

**Priority**: HIGH  
**Dependencies**: Upload, Delete, Rotate tools  
**Status**: ✅ FUNCTIONAL

**Steps:**
1. Navigate to `/upload`, upload `sample-10page.pdf`
2. Navigate to `/tools/delete`
3. Set deletion mode to "Range", pages 5-10
4. Click "Delete", confirm in modal
5. Verify page count is now 4
6. Navigate to `/tools/rotate`
7. Verify PDF has 4 pages
8. Select "All pages", rotate 180°
9. Apply rotation
10. Click Download
11. Verify downloaded PDF has 4 pages, all rotated 180°

**Success Criteria:**
- Deletions persist in state
- Rotate tool sees the updated (deleted) PDF
- Final download reflects both operations

---

## Workflow 3: Upload → Rotate → Undo All → Download Original

**Priority**: MEDIUM  
**Dependencies**: Upload, Rotate, Undo/Redo  
**Status**: ✅ FUNCTIONAL

**Steps:**
1. Upload `sample-3page.pdf`
2. Navigate to `/tools/rotate`
3. Rotate page 1 right 90°
4. Rotate page 2 right 90°
5. Rotate page 3 right 90°
6. Click Undo 3 times
7. Verify PDF is back to original state (no rotations)
8. Download
9. Verify downloaded PDF matches original

**Success Criteria:**
- Undo stack tracks all changes
- Original state fully recoverable

---

## Workflow 4: Word to PDF → Download

**Priority**: HIGH  
**Dependencies**: Word to PDF converter  
**Status**: ✅ FUNCTIONAL

**Steps:**
1. Navigate to `/convert/word-to-pdf`
2. Upload `sample.docx`
3. Verify file accepted
4. Keep default options (A4, Portrait, High quality)
5. Click "Convert to PDF"
6. Watch progress bar: 0% → 30% → 60% → 90% → 100%
7. Verify conversion complete:
   - Filename: `sample.pdf`
   - Page count shown
   - File size shown
8. Click "Download PDF"
9. Verify PDF downloads

**Success Criteria:**
- mammoth.js extracts text
- jsPDF generates valid PDF
- Download works

---

## Workflow 5: PDF to Text → Copy → Verify Clipboard

**Priority**: MEDIUM  
**Dependencies**: PDF to Text extractor  
**Status**: ✅ FUNCTIONAL

**Steps:**
1. Navigate to `/convert/pdf-to-text`
2. Upload `sample-3page.pdf`
3. Wait for page count detection
4. Set mode to "All pages"
5. Enable "Include page numbers"
6. Click "Extract"
7. Wait for extraction to complete
8. Verify extracted text contains content from all 3 pages
9. Verify text includes "--- Page 1 ---", "--- Page 2 ---", "--- Page 3 ---"
10. Click "Copy" button
11. Verify clipboard contains the extracted text
12. Click "Download"
13. Verify `.txt` file downloads

**Success Criteria:**
- Text extraction preserves page structure
- Copy to clipboard works
- TXT download matches displayed text

---

## Workflow 6: Split PDF → Download All Parts

**Priority**: MEDIUM  
**Dependencies**: Split tool  
**Status**: ✅ FUNCTIONAL

**Steps:**
1. Navigate to `/tools/split`
2. Upload `sample-10page.pdf`
3. Select "Every N Pages" mode, N = 3
4. Click "Split"
5. Wait for splitting to complete
6. Verify 4 generated files:
   - part-1-pages-1-3.pdf (3 pages)
   - part-2-pages-4-6.pdf (3 pages)
   - part-3-pages-7-9.pdf (3 pages)
   - part-4-pages-10-10.pdf (1 page)
7. Click "Download All"
8. Verify all 4 files download sequentially

**Success Criteria:**
- Correct page distribution across split files
- All downloads succeed

---

## Workflow 7: Dashboard → Tool → Dashboard (Navigation Round-Trip)

**Priority**: LOW  
**Dependencies**: Dashboard, any tool  
**Status**: ✅ FUNCTIONAL

**Steps:**
1. Navigate to `/` (Dashboard)
2. Click "Rotate Pages" quick action
3. Verify routing to `/tools/rotate`
4. Click "Home" in breadcrumb or sidebar Dashboard link
5. Verify return to `/` (Dashboard)
6. Click "Word to PDF" in All Tools > Convert
7. Verify routing to `/convert/word-to-pdf`
8. Click sidebar "Dashboard" link
9. Verify return to `/`

**Success Criteria:**
- All navigation paths work bidirectionally

---

## Workflow 8: Conversion → Edit Bridge (NOT WORKING)

**Priority**: LOW  
**Dependencies**: Conversion tools, Tool state management  
**Status**: ⚠️ NOT IMPLEMENTED

**Steps:**
1. Navigate to `/convert/word-to-pdf`
2. Convert a .docx to PDF
3. Click "Edit PDF" (if button exists) or navigate to rotate tool
4. Verify converted PDF is available for editing

**Expected (CURRENT):**
- Conversion tools do NOT store result in NGXS state
- Navigating to rotate tool after conversion shows no PDF
- **FIX NEEDED**: Add "Edit in PDF Editor" button that dispatches `StoreBlobFile` with converted PDF

**Success Criteria (after fix):**
- Converted PDF flows into NGXS state
- Available for editing in any tool

---

## Workflow 9: Full Multi-Operation Workflow (Advanced)

**Priority**: LOW  
**Dependencies**: Multiple tools  
**Status**: ✅ FUNCTIONAL (with available tools)

**Steps:**
1. Upload 10-page PDF at `/upload`
2. Navigate to `/tools/delete` → delete pages 7-10 → verify 6 pages
3. Navigate to `/tools/rotate` → rotate page 1 by 90° → verify rotation
4. Navigate to `/tools/rotate` → rotate page 3 by 180° → verify
5. Download final PDF
6. Verify: 6 pages, page 1 rotated 90°, page 3 rotated 180°, others unchanged

**Success Criteria:**
- Multiple operations compound correctly
- State maintained across tool switches
