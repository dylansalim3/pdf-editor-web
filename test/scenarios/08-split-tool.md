# Scenario 08 — Split PDF Tool

> **Suite**: Document Operations  
> **Target URL**: https://pdf-editor-web.pages.dev/tools/split  
> **Prerequisites**: Multi-page PDF file  
> **Status**: ✅ FUNCTIONAL

---

## Scenario 8.1: Page Loads with Upload Area

**Steps:**
1. Navigate to `/tools/split`
2. Verify page title visible (e.g., "Split PDF")
3. Verify upload drag-drop area is present
4. Verify split mode options visible (Range, Every N Pages, Extract)
5. Take screenshot: `split-tool-initial`

**Expected:**
- Page renders with upload and options UI

---

## Scenario 8.2: Upload PDF and Detect Pages

**Steps:**
1. Navigate to split tool
2. Upload `sample-10page.pdf` (10 pages)
3. Wait for PDF processing
4. Verify total pages shows "10"
5. Verify end page defaults to 10

**Expected:**
- PDF loaded with `PDFDocument.load()`, page count detected

---

## Scenario 8.3: Split by Range

**Steps:**
1. Upload 10-page PDF
2. Select "Range" mode
3. Set start page = 3, end page = 7
4. Click "Split"
5. Wait for progress bar to complete
6. Verify 1 generated file: "pages-3-to-7.pdf"
7. Verify file contains 5 pages
8. Click Download on the file
9. Verify file downloads

**Expected:**
- Range extraction creates single PDF with pages 3-7

---

## Scenario 8.4: Split Every N Pages

**Steps:**
1. Upload 10-page PDF
2. Select "Every N Pages" mode
3. Set N = 3
4. Click "Split"
5. Wait for completion
6. Verify generated files:
   - `part-1-pages-1-3.pdf` (3 pages)
   - `part-2-pages-4-6.pdf` (3 pages)
   - `part-3-pages-7-9.pdf` (3 pages)
   - `part-4-pages-10-10.pdf` (1 page)

**Expected:**
- PDF split into ceil(10/3) = 4 files

---

## Scenario 8.5: Extract Specific Pages

**Steps:**
1. Upload 10-page PDF
2. Select "Extract" mode
3. Enter "1,3,5,7-9" in extract pages field
4. Click "Split"
5. Verify 1 generated file: "extracted-pages.pdf"
6. Verify file contains pages 1, 3, 5, 7, 8, 9

**Expected:**
- Comma-separated and range notation both work

---

## Scenario 8.6: File Size Display

**Steps:**
1. Upload and split a PDF
2. Check file size display for generated files
3. Verify size shown in human-readable format (KB, MB)

**Expected:**
- `formatFileSize()` correctly formats bytes

---

## Scenario 8.7: Download All

**Steps:**
1. Split PDF into 4 parts
2. Click "Download All"
3. Verify all 4 files download sequentially (500ms interval)

**Expected:**
- Sequential download avoids browser blocking

---

## Scenario 8.8: Reset / Split Another

**Steps:**
1. Complete a split operation
2. Click "Reset" or equivalent
3. Verify:
   - File list cleared
   - Generated files cleared
   - Progress reset to 0
   - Upload area visible again

**Expected:**
- Full state reset

---

## Scenario 8.9: Non-PDF File Rejection

**Steps:**
1. Navigate to split tool
2. Attempt to upload a .txt file
3. Verify file is rejected (beforeUpload returns false)

**Expected:**
- Only PDF files accepted

---

## Scenario 8.10: Edge Case — Single Page PDF

**Steps:**
1. Upload 1-page PDF
2. Try "Split every 1 page"
3. Verify 1 generated file with 1 page

**Expected:**
- No error; single file generated
