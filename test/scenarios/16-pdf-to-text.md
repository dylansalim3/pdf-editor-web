# Scenario 16 — PDF to Text Extractor

> **Suite**: Conversion Tools  
> **Target URL**: https://pdf-editor-web.pages.dev/convert/pdf-to-text  
> **Prerequisites**: PDF file  
> **Status**: ✅ FUNCTIONAL

---

## Scenario 16.1: Page Loads

**Steps:**
1. Navigate to `/convert/pdf-to-text`
2. Verify page heading visible
3. Verify upload area present
4. Verify extraction options visible:
   - Extraction Mode (All / Range / Specific Pages)
   - Preserve Line Breaks toggle
   - Include Page Numbers toggle
   - OCR option
   - Output Format

**Expected:**
- Full options UI renders

---

## Scenario 16.2: Upload PDF and Detect Pages

**Steps:**
1. Upload a 10-page PDF
2. Verify total pages detected and displayed (`totalPages = 10`)
3. Verify end page defaults to total pages

**Expected:**
- pdf.js loads PDF and counts pages

---

## Scenario 16.3: Extract All Pages

**Steps:**
1. Upload PDF
2. Set extraction mode to "All"
3. Click "Extract"
4. Verify progress bar animates per page
5. Verify extracted text appears in display area
6. Verify text contains content from all pages

**Expected:**
- All pages' text extracted sequentially

---

## Scenario 16.4: Extract Page Range

**Steps:**
1. Upload 10-page PDF
2. Set mode to "Range"
3. Set start = 3, end = 5
4. Click "Extract"
5. Verify only pages 3-5 text extracted
6. Verify page number markers show "Page 3", "Page 4", "Page 5"

**Expected:**
- Range extraction respects start/end boundaries

---

## Scenario 16.5: Include Page Numbers Toggle

**Steps:**
1. Upload PDF
2. Enable "Include Page Numbers"
3. Extract all pages
4. Verify output contains `--- Page N ---` markers
5. Disable "Include Page Numbers"
6. Re-extract
7. Verify no page markers in output

**Expected:**
- Page number markers controlled by toggle

---

## Scenario 16.6: Copy to Clipboard

**Steps:**
1. Extract text from PDF
2. Click "Copy" button
3. Verify alert: "Text copied to clipboard!"
4. Paste in text editor
5. Verify pasted text matches displayed text

**Expected:**
- Clipboard write succeeds

---

## Scenario 16.7: Download as TXT

**Steps:**
1. Extract text from "report.pdf"
2. Click "Download"
3. Verify file downloads as "report.txt"
4. Verify file content matches extracted text

**Expected:**
- Blob download with `.txt` extension (replaces `.pdf`)

---

## Scenario 16.8: Reset State

**Steps:**
1. Complete extraction
2. Click "Reset"
3. Verify:
   - File list cleared
   - Extracted text cleared
   - Progress reset
   - Total pages reset
   - Options reset to defaults

**Expected:**
- Full `onReset()` cleanup

---

## Scenario 16.9: Invalid Page Range Validation

**Steps:**
1. Upload 10-page PDF
2. Set mode to "Range"
3. Set start = 8, end = 3 (invalid: start > end)
4. Verify `pageRangeValid` returns false
5. Verify extract button disabled or extraction prevented

**Expected:**
- Validation prevents invalid ranges

---

## Scenario 16.10: OCR Option (UI Only)

**Steps:**
1. Enable "Use OCR" toggle
2. Verify OCR language dropdown appears
3. Verify language options: English, Spanish, French, German, Italian
4. Select "French"

**Expected:**
- OCR UI works but actual OCR is not implemented (Tesseract.js not integrated)
- **NOTE**: This is a UI-only test; actual OCR functionality is a future feature
