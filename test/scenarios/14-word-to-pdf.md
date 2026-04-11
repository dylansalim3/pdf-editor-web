# Scenario 14 — Word to PDF Converter

> **Suite**: Conversion Tools  
> **Target URL**: https://pdf-editor-web.pages.dev/convert/word-to-pdf  
> **Prerequisites**: .docx file  
> **Status**: ✅ FUNCTIONAL

---

## Scenario 14.1: Page Loads with UI

**Steps:**
1. Navigate to `/convert/word-to-pdf`
2. Verify page title "Word to PDF Converter" (or similar heading)
3. Verify upload drag-drop area visible
4. Verify "Supports: .doc, .docx" text
5. Verify conversion options section
6. Take screenshot: `word-to-pdf-initial`

**Expected:**
- Step-based layout: Upload → Options → Convert → Result

---

## Scenario 14.2: Upload DOCX File

**Steps:**
1. Navigate to word-to-pdf
2. Upload a valid `.docx` file
3. Verify file name appears in upload list
4. Verify file is accepted (beforeUpload validates MIME type and extension)

**Expected:**
- File added to `fileList[]`

---

## Scenario 14.3: Reject Non-Word Files

**Steps:**
1. Upload a `.pdf` file
2. Verify file is NOT added to list
3. Upload a `.txt` file
4. Verify file is NOT added

**Expected:**
- Only `.doc` and `.docx` files accepted

---

## Scenario 14.4: Default Conversion Options

**Steps:**
1. Check default option values:
   - Page Size: A4
   - Orientation: Portrait
   - Image Quality: High
   - Embed Fonts: ✅ checked
   - Preserve Links: ✅ checked
   - Preserve Comments: ❌ unchecked
   - Minimize Size: ❌ unchecked

**Expected:**
- Defaults match `ConversionOptions` interface defaults

---

## Scenario 14.5: Change Conversion Options

**Steps:**
1. Change Page Size to "Letter"
2. Change Orientation to "Landscape"
3. Change Image Quality to "Low"
4. Toggle Embed Fonts off
5. Verify all selections updated in model

**Expected:**
- Options are interactive and update component state

---

## Scenario 14.6: Convert to PDF

**Steps:**
1. Upload valid `.docx` file
2. Click "Convert to PDF" button
3. Verify converting state:
   - Progress bar appears
   - Progress animates (30% → 60% → 90% → 100%)
4. Wait for conversion to complete
5. Verify conversion result:
   - File name shows `.pdf` extension
   - File size shown
   - Page count shown

**Expected:**
- mammoth.js extracts text; jsPDF generates PDF
- Progress updates during conversion

---

## Scenario 14.7: Download Converted PDF

**Steps:**
1. Complete conversion
2. Click "Download PDF"
3. Verify download triggered
4. Verify filename ends with `.pdf`
5. Verify file is non-zero size

**Expected:**
- Blob URL download works correctly

---

## Scenario 14.8: Reset / Convert Another

**Steps:**
1. Complete conversion
2. Click "Convert Another" or reset button
3. Verify:
   - File list cleared
   - Converted state reset to false
   - Progress back to 0
   - Upload area visible again
   - Blob URL revoked

**Expected:**
- Clean state reset with memory cleanup

---

## Scenario 14.9: Convert Without File

**Steps:**
1. Don't upload any file
2. Click "Convert"
3. Verify nothing happens (guard: `if (this.fileList.length === 0) return`)

**Expected:**
- No error thrown; button does nothing without file

---

## Scenario 14.10: Error Handling

**Steps:**
1. Upload a corrupted or invalid file (e.g., rename .txt to .docx)
2. Click "Convert"
3. Verify error alert shown: "Error converting Word document..."
4. Verify app doesn't crash
5. Verify `converting` state resets to false

**Expected:**
- try/catch handles conversion errors gracefully

---

## Scenario 14.11: Large File Conversion

**Steps:**
1. Upload a large .docx file (5MB+)
2. Click "Convert"
3. Verify progress bar shows during processing
4. Verify conversion completes (may take longer)

**Expected:**
- No timeout or crash on large files
