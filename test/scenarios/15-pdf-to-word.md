# Scenario 15 — PDF to Word Converter

> **Suite**: Conversion Tools  
> **Target URL**: https://pdf-editor-web.pages.dev/convert/pdf-to-word  
> **Prerequisites**: PDF file  
> **Status**: ✅ FUNCTIONAL

---

## Scenario 15.1: Page Loads

**Steps:**
1. Navigate to `/convert/pdf-to-word`
2. Verify page heading visible
3. Verify upload area present
4. Verify options: Output Format, Preserve Layout, Extract Images, etc.

**Expected:**
- Page renders with upload and options UI

---

## Scenario 15.2: Upload PDF

**Steps:**
1. Upload a valid PDF file
2. Verify file accepted (MIME type + extension check)
3. Verify file appears in list

**Expected:**
- Only PDF files accepted

---

## Scenario 15.3: Reject Non-PDF Files

**Steps:**
1. Upload .docx, .txt, .jpg files
2. Verify each rejected silently

**Expected:**
- `beforeUpload` returns false for non-PDF

---

## Scenario 15.4: Output Format Selection

**Steps:**
1. Check default output format: "docx"
2. Change to "doc"
3. Verify selection updates
4. Convert and verify filename uses selected extension

**Expected:**
- Output format affects downloaded filename

---

## Scenario 15.5: Conversion Execution

**Steps:**
1. Upload PDF
2. Click "Convert"
3. Verify progress bar animates (20% → text extraction → DOCX generation → 100%)
4. Verify conversion completes
5. Verify result shows: filename, size, page count

**Expected:**
- pdf.js extracts text; docx library creates Word document

---

## Scenario 15.6: Download DOCX

**Steps:**
1. Complete conversion
2. Click "Download"
3. Verify download triggered
4. Verify filename ends with `.docx`

**Expected:**
- Blob URL download works

---

## Scenario 15.7: Text Preview

**Steps:**
1. Complete conversion
2. Toggle "Show Preview" (if available)
3. Verify extracted text is displayed

**Expected:**
- `extractedText` shown in preview area

---

## Scenario 15.8: Copy to Clipboard

**Steps:**
1. Complete conversion
2. Click copy to clipboard button
3. Verify alert "Text copied to clipboard!"
4. Paste in text editor to confirm content

**Expected:**
- `navigator.clipboard.writeText()` executed successfully

---

## Scenario 15.9: Reset State

**Steps:**
1. Complete conversion
2. Click Reset
3. Verify all state cleared
4. Verify Blob URL revoked (memory cleanup)

**Expected:**
- Clean reset with `URL.revokeObjectURL()`

---

## Scenario 15.10: Multi-Page PDF Conversion

**Steps:**
1. Upload 10-page PDF
2. Convert
3. Verify progress updates per-page
4. Verify all pages' text extracted
5. Verify DOCX contains paragraphs from all pages

**Expected:**
- All pages processed; progress reflects per-page completion
