# Scenario 17 — Upload & State Management

> **Suite**: File Upload & State Management  
> **Target URLs**: `/upload`, all tool pages  
> **Prerequisites**: PDF files  
> **Status**: ✅ FUNCTIONAL (upload + NGXS)

---

## Scenario 17.1: Upload Page Renders

**Steps:**
1. Navigate to `/upload`
2. Verify drag-and-drop upload area visible
3. Verify PDF viewer component present
4. Take screenshot: `upload-page`

**Expected:**
- Upload page with file picker and PDF viewer

---

## Scenario 17.2: Upload Valid PDF

**Steps:**
1. Navigate to `/upload`
2. Upload `sample-3page.pdf` via browse button
3. Wait for PDF to render in viewer
4. Verify PDF displays page content
5. Verify page navigation controls work (prev/next)

**Expected:**
- PDF renders in `ngx-extended-pdf-viewer`
- Blob stored in NGXS state via `StoreBlobFile` action

---

## Scenario 17.3: State Persists Across Tool Navigation

**Steps:**
1. Upload PDF at `/upload`
2. Navigate to `/tools/rotate`
3. Verify PDF is loaded in rotate tool's viewer
4. Navigate to `/tools/delete`
5. Verify same PDF loaded in delete tool's viewer

**Expected:**
- NGXS state shared across tool components via `@Select(PdfRotateState.getBlobFile)`

---

## Scenario 17.4: Undo State Change

**Steps:**
1. Upload PDF, navigate to `/tools/rotate`
2. Rotate page 1 by 90°
3. Verify page is rotated
4. Navigate remains on rotate tool
5. Click "Undo"
6. Verify PDF reverts to pre-rotation state

**Expected:**
- `UndoBlobFileChanges` action dispatched
- State stack navigated backward

---

## Scenario 17.5: Redo After Undo

**Steps:**
1. Rotate page, then Undo
2. Click "Redo"
3. Verify rotation is reapplied

**Expected:**
- `RedoBlobFileChanges` action dispatched
- State stack navigated forward

---

## Scenario 17.6: Multiple Undo/Redo

**Steps:**
1. Upload PDF
2. Perform 3 rotations (90° right each time)
3. Page should be at 270° total
4. Undo 3 times
5. Verify page back to original (0°)
6. Redo 2 times
7. Verify page is at 180°

**Expected:**
- Full undo/redo stack with multiple levels

---

## Scenario 17.7: Clear State

**Steps:**
1. Upload PDF
2. Modify PDF (rotate a page)
3. Trigger `ClearState` action (if accessible via UI)
4. Verify state cleared
5. Navigate to a tool
6. Verify no PDF loaded

**Expected:**
- Clean slate after clear

---

## Scenario 17.8: Upload Replaces Previous PDF

**Steps:**
1. Upload PDF A at `/upload`
2. Navigate to rotate tool, verify PDF A loaded
3. Navigate back to `/upload`
4. Upload PDF B
5. Navigate to rotate tool
6. Verify PDF B is now loaded (not PDF A)

**Expected:**
- New upload replaces previous state

---

## Scenario 17.9: Non-PDF File Handling on Upload Page

**Steps:**
1. Navigate to `/upload`
2. Attempt to upload an image file (.jpg)
3. Verify behavior — should reject or show error

**Expected:**
- Non-PDF files handled gracefully (depends on upload component implementation)
