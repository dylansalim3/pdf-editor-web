# Scenario 03 — Rotate Pages Tool

> **Suite**: Page Management Tools  
> **Target URL**: https://pdf-editor-web.pages.dev/tools/rotate  
> **Prerequisites**: Upload PDF via `/upload` first  
> **Status**: ✅ FUNCTIONAL

---

## Scenario 3.1: Page Header and Controls

**Steps:**
1. Navigate to `/tools/rotate`
2. Verify breadcrumb: "Home / Tools / Rotate Pages"
3. Verify `<h1>` contains "Rotate PDF Pages"
4. Verify subtitle "Rotate pages left, right, or 180 degrees"
5. Verify buttons visible: Undo, Redo, Download
6. Take screenshot: `rotate-tool-header`

**Expected:**
- Header renders with breadcrumb, title, and action buttons

---

## Scenario 3.2: PDF Viewer Loads Document

**Steps:**
1. Upload PDF via `/upload` page with `sample-3page.pdf`
2. Navigate to `/tools/rotate`
3. Verify `<ngx-extended-pdf-viewer>` is rendered
4. Verify PDF displays in viewer area
5. Wait for `(pagesLoaded)` event
6. Verify `maxPage` shows correct page count (3)

**Expected:**
- PDF viewer shows uploaded document
- Page count correctly detected

---

## Scenario 3.3: Quick Rotate Left

**Steps:**
1. Upload PDF, navigate to `/tools/rotate`
2. Verify current page is 1
3. Click "Left 90°" button
4. Wait for loading overlay to appear and disappear
5. Verify page 1 is rotated 90° counter-clockwise
6. Verify page thumbnail shows "90°" rotation indicator

**Expected:**
- Page rotated successfully; viewer refreshes with new rotation

---

## Scenario 3.4: Quick Rotate Right

**Steps:**
1. Upload PDF, navigate to `/tools/rotate`
2. Click "Right 90°" button
3. Wait for processing
4. Verify page rotated 90° clockwise

**Expected:**
- Clockwise rotation applied

---

## Scenario 3.5: Quick Rotate 180°

**Steps:**
1. Upload PDF, navigate to `/tools/rotate`
2. Click "180°" button
3. Wait for processing
4. Verify page rotated 180°

**Expected:**
- 180° rotation applied

---

## Scenario 3.6: Rotation Mode — Current Page

**Steps:**
1. Upload PDF, navigate to `/tools/rotate`
2. Navigate to page 2 in PDF viewer
3. Verify "Current page (Page 2)" radio is available
4. Select "Current page" mode
5. Set angle to 90°, direction to Clockwise
6. Click "Apply Rotation"
7. Wait for processing
8. Verify page 2 is rotated, pages 1 and 3 are NOT rotated

**Expected:**
- Only current page affected

---

## Scenario 3.7: Rotation Mode — Specific Page

**Steps:**
1. Upload PDF, navigate to `/tools/rotate`
2. Select "Specific page" radio
3. Verify page number input appears
4. Enter page number 3
5. Set angle to 90°, direction to Clockwise
6. Click "Apply Rotation"
7. Verify only page 3 rotated

**Expected:**
- Custom page input works; only that page rotated

---

## Scenario 3.8: Rotation Mode — All Pages

**Steps:**
1. Upload 3-page PDF, navigate to `/tools/rotate`
2. Select "All pages" radio
3. Verify text shows "(3 total)"
4. Set angle to 90°
5. Click "Apply Rotation"
6. Wait for processing
7. Verify all 3 pages are rotated 90°

**Expected:**
- Batch rotation applied to every page

---

## Scenario 3.9: Rotation Angle Dropdown

**Steps:**
1. Navigate to rotate tool
2. Click "Rotation Angle" dropdown
3. Verify options: 90°, 180°, 270°
4. Select 270°
5. Verify dropdown shows "270 degrees"

**Expected:**
- Dropdown shows all angle options; selection updates model

---

## Scenario 3.10: Direction Dropdown

**Steps:**
1. Navigate to rotate tool
2. Click "Direction" dropdown
3. Verify options: Clockwise, Counter-clockwise
4. Select "Counter-clockwise"
5. Apply rotation
6. Verify rotation is counter-clockwise

**Expected:**
- Direction applies correctly (positive vs negative angle)

---

## Scenario 3.11: Batch Rotation — Page Selection

**Steps:**
1. Upload 3-page PDF, navigate to rotate tool
2. Scroll to "Page Thumbnails" section (ensure visible)
3. Click page 1 thumbnail
4. Verify page 1 highlighted (blue border + checkmark)
5. Click page 3 thumbnail
6. Verify page 3 also highlighted
7. Verify "2 pages selected" text shown in batch section
8. Click page 1 again to deselect
9. Verify only page 3 remains selected; count updates to "1 pages selected"

**Expected:**
- Click toggles page selection
- Count updates dynamically

---

## Scenario 3.12: Batch Rotation — Rotate Selected

**Steps:**
1. Upload 3-page PDF
2. Select pages 1 and 3 via thumbnails
3. Click "Rotate Selected Pages"
4. Wait for processing
5. Verify pages 1 and 3 are rotated; page 2 is NOT
6. Verify selection clears after rotation

**Expected:**
- Batch operation applies only to selected pages

---

## Scenario 3.13: Thumbnails Toggle

**Steps:**
1. Navigate to rotate tool
2. Find "Page Thumbnails" section with "Hide" button
3. Click "Hide"
4. Verify thumbnail grid is hidden
5. Button text changes to "Show"
6. Click "Show"
7. Verify thumbnails reappear

**Expected:**
- Thumbnails visibility toggles

---

## Scenario 3.14: Undo Rotation

**Steps:**
1. Upload PDF, rotate page 1 right 90°
2. Verify page is rotated
3. Click "Undo" button
4. Verify page reverts to original orientation

**Expected:**
- NGXS state undo restores previous PDF state

---

## Scenario 3.15: Redo After Undo

**Steps:**
1. Rotate page, then Undo
2. Click "Redo" button
3. Verify rotation is reapplied

**Expected:**
- Redo works after undo

---

## Scenario 3.16: Download Rotated PDF

**Steps:**
1. Upload PDF, rotate a page
2. Click "Download" button
3. Verify download triggered
4. Verify filename is "rotated-document.pdf"

**Expected:**
- Base64 data URI triggers download with correct filename

---

## Scenario 3.17: Loading Overlay During Processing

**Steps:**
1. Upload PDF, click "Apply Rotation"
2. Immediately check for loading overlay
3. Verify overlay with spinner and "Processing..." text appears
4. Wait for overlay to disappear

**Expected:**
- Loading state provides visual feedback during PDF manipulation

---

## Scenario 3.18: No PDF Loaded State

**Steps:**
1. Clear NGXS state (fresh browser session)
2. Navigate directly to `/tools/rotate`
3. Observe the PDF viewer area

**Expected:**
- Should show empty state or prompt to upload PDF
- **CURRENT**: Viewer shows empty/black area without guidance
- **IMPROVEMENT**: Show "Upload a PDF to get started" placeholder
