# Scenario 09 — Compress PDF Tool

> **Suite**: Document Operations  
> **Target URL**: https://pdf-editor-web.pages.dev/tools/compress  
> **Prerequisites**: PDF file  
> **Status**: ⚠️ SIMULATED — UI exists but compression is fake

---

## Known Issues

- **BUG-002**: Download button sets `href="#"` — does NOT download actual file
- **BUG-004**: Page count uses `Math.random()` instead of reading PDF
- Compression progress is simulated with `setInterval`
- Compressed size is calculated from a static ratio, not actual compression

---

## Scenario 9.1: Page Loads

**Steps:**
1. Navigate to `/tools/compress`
2. Verify upload area visible
3. Verify quality options visible (Low, Medium, High)
4. Verify additional options: Optimize Images, Remove Metadata, Compress Fonts

**Expected:**
- UI renders correctly

---

## Scenario 9.2: Upload PDF

**Steps:**
1. Upload a PDF file
2. Verify file name shown
3. Verify original file size displayed (from `file.size`)
4. Verify page count shown (⚠️ currently random)

**Expected:**
- File info displayed
- **BUG**: Page count is `Math.floor(Math.random() * 50) + 5` — should use `PDFDocument.load()`

---

## Scenario 9.3: Quality Level Selection

**Steps:**
1. Upload PDF
2. Select "Low" quality
3. Verify description: "Smallest file size, lower quality"
4. Select "High" quality
5. Verify description: "Best quality, moderate compression"

**Expected:**
- Quality descriptions match selection

---

## Scenario 9.4: Compress Execution (Simulated)

**Steps:**
1. Upload PDF
2. Click "Compress"
3. Verify progress bar starts animating (5% every 150ms)
4. Wait for progress to reach 100%
5. Verify compressed state shown with before/after sizes
6. Verify compression ratio percentage displayed

**Expected:**
- Progress animates to completion
- **NOTE**: This is entirely simulated — no actual compression occurs

---

## Scenario 9.5: Download Compressed File (BUG)

**Steps:**
1. Complete compression
2. Click "Download"
3. Verify download behavior

**Expected (CURRENT — BUG):**
- Download triggers with `href="#"` — browser navigates to `#` instead of downloading
- **FIX NEEDED**: Use `PDFDocument.save()` to generate real compressed PDF bytes

---

## Scenario 9.6: Compression Ratio Display

**Steps:**
1. Upload 1MB PDF
2. Compress with "Medium" quality
3. Verify compression ratio shows ~55%
4. Verify compressed size shows ~450KB

**Expected:**
- Ratio calculated correctly from simulated formula

---

## Scenario 9.7: Reset State

**Steps:**
1. Complete compression
2. Click Reset
3. Verify all state cleared
4. Upload area visible again

**Expected:**
- Full state reset
