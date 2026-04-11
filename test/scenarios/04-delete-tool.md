# Scenario 04 — Delete Pages Tool

> **Suite**: Page Management Tools  
> **Target URL**: https://pdf-editor-web.pages.dev/tools/delete  
> **Prerequisites**: Upload PDF via `/upload` first  
> **Status**: ✅ FUNCTIONAL

---

## Scenario 4.1: Page Header and Controls

**Steps:**
1. Navigate to `/tools/delete`
2. Verify header shows "Delete PDF Pages"
3. Verify Undo, Redo, Download buttons are present
4. Verify breadcrumb navigation
5. Take screenshot: `delete-tool-header`

**Expected:**
- Header, breadcrumb, and action buttons render correctly

---

## Scenario 4.2: Single Page Deletion

**Steps:**
1. Upload 3-page PDF, navigate to `/tools/delete`
2. Select "Single" deletion mode
3. Set page number to 2
4. Click "Delete" button
5. Verify confirmation modal appears: "Are you sure you want to delete 1 page(s)?"
6. Click "Delete" in modal
7. Wait for processing
8. Verify success modal: "Successfully deleted 1 page(s)"
9. Verify page count is now 2

**Expected:**
- Single page deleted with confirmation workflow

---

## Scenario 4.3: Cancel Deletion

**Steps:**
1. Upload PDF, select single page deletion
2. Click "Delete"
3. In confirmation modal, click "Cancel"
4. Verify page count remains unchanged
5. Verify PDF is unmodified

**Expected:**
- Cancellation preserves original document

---

## Scenario 4.4: Range Deletion

**Steps:**
1. Upload 10-page PDF, navigate to delete tool
2. Select "Range" deletion mode
3. Set start page = 3, end page = 6
4. Click "Delete"
5. Verify confirmation: "4 page(s)"
6. Confirm deletion
7. Verify page count is now 6 (10 - 4)

**Expected:**
- Range deletion removes pages 3 through 6

---

## Scenario 4.5: Multiple Page Selection

**Steps:**
1. Upload 10-page PDF
2. Select "Multiple" deletion mode
3. Click thumbnails for pages 1, 5, 9
4. Verify 3 pages highlighted with selection indicator
5. Verify count shows "3 pages selected" (or similar)
6. Click "Delete"
7. Confirm in modal
8. Verify page count is now 7

**Expected:**
- Non-contiguous page selection and deletion works

---

## Scenario 4.6: Keep Only Selected

**Steps:**
1. Upload 10-page PDF
2. Select "Multiple" mode
3. Select pages 2, 4, 6
4. Click "Keep Only Selected"
5. Verify confirmation modal: "delete 7 pages and keep 3 selected pages"
6. Confirm
7. Verify page count is now 3

**Expected:**
- Inverse selection — keeps chosen pages, deletes rest

---

## Scenario 4.7: No Pages Selected Warning

**Steps:**
1. Upload PDF
2. Select "Multiple" mode without selecting any pages
3. Click "Delete"
4. Verify warning modal: "No Pages Selected"

**Expected:**
- Proper validation when no pages selected

---

## Scenario 4.8: Undo Deletion

**Steps:**
1. Upload 3-page PDF
2. Delete page 2
3. Verify page count is 2
4. Click "Undo"
5. Verify page count returns to 3
6. Verify page 2 is restored

**Expected:**
- NGXS undo restores deleted pages

---

## Scenario 4.9: Delete Last Remaining Page Guard

**Steps:**
1. Upload 1-page PDF (or delete until 1 page remains)
2. Try to delete the last page
3. Verify error handling — should not allow deleting ALL pages

**Expected:**
- Application prevents creating empty PDF
- **NOTE**: Current implementation may not guard against this — verify behavior

---

## Scenario 4.10: Download After Deletion

**Steps:**
1. Upload 3-page PDF
2. Delete page 2
3. Click "Download"
4. Verify download triggered with filename "modified-document.pdf"

**Expected:**
- Downloaded PDF has correct page count (2 pages)
