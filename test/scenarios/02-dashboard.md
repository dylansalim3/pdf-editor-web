# Scenario 02 — Dashboard

> **Suite**: Dashboard  
> **Target URL**: https://pdf-editor-web.pages.dev/  
> **Prerequisites**: None

---

## Scenario 2.1: Dashboard Page Renders

**Steps:**
1. Navigate to `/`
2. Verify `<h1>` contains "Dashboard"
3. Verify subtitle text: "Welcome back! Choose a tool to get started..."
4. Verify "Upload PDF" button link is present
5. Take screenshot: `dashboard-full`

**Expected:**
- Dashboard renders with page header, quick actions, and all tools sections

---

## Scenario 2.2: Quick Actions Grid

**Steps:**
1. Navigate to `/`
2. Scroll to "Quick Actions" section
3. Verify 4 quick action cards are visible:
   - "Rotate Pages" with rotate-right icon (blue)
   - "Delete Pages" with delete icon (red)
   - "Add Watermark" with copyright icon (purple)
   - "Merge PDFs" with merge-cells icon (green)
4. Verify each card shows name and description text

**Expected:**
- 4 quick action cards in a 2x2 grid (desktop: 4 columns)
- Each card has icon, name, and description

---

## Scenario 2.3: Quick Action Card Hover Effect

**Steps:**
1. Navigate to `/`
2. Hover over the "Rotate Pages" quick action card
3. Verify card shadow increases (hover:shadow-lg)
4. Verify icon scales up (group-hover:scale-110)

**Expected:**
- Smooth hover transition on cards
- Visual feedback on hover

---

## Scenario 2.4: Quick Action Navigation

**Steps:**
1. Navigate to `/`
2. Click "Rotate Pages" quick action card
3. Verify URL is `/tools/rotate`
4. Navigate back to `/`
5. Click "Delete Pages" card → verify `/tools/delete`
6. Navigate back, click "Add Watermark" → verify `/tools/watermark`
7. Navigate back, click "Merge PDFs" → verify `/tools/merge`

**Expected:**
- Each quick action card navigates to correct tool route

---

## Scenario 2.5: All Tools Section Categories

**Steps:**
1. Navigate to `/`
2. Scroll to "All Tools" section
3. Verify 4 category cards are present:
   - "Page Management" — Rotate, Delete, Reorder, Extract
   - "Content Modification" — Watermark, Sign, Annotate
   - "Document Operations" — Merge, Split, Compress, Protect
   - "Convert" — Word to PDF, PDF to Word, PDF to Text
4. Verify each tool within categories has icon, name, description
5. Verify right-arrow icon appears on hover of each tool link

**Expected:**
- All 14+ tools listed in correct categories
- Each tool is a clickable link with correct route

---

## Scenario 2.6: Tool Category Navigation

**Steps:**
1. Navigate to `/`
2. In "Page Management" category, click "Rotate Pages"
3. Verify navigation to `/tools/rotate`
4. Navigate back
5. In "Convert" category, click "Word to PDF"
6. Verify navigation to `/convert/word-to-pdf`

**Expected:**
- All tool links in All Tools section navigate correctly

---

## Scenario 2.7: Recent Files Hidden When Empty

**Steps:**
1. Clear localStorage (fresh state)
2. Navigate to `/`
3. Verify "Recent Files" section is NOT visible
4. Verify `*ngIf="recentFiles.length > 0"` evaluates to false

**Expected:**
- No recent files section shown on fresh load

---

## Scenario 2.8: Upload PDF Button on Dashboard

**Steps:**
1. Navigate to `/`
2. Find "Upload PDF" button with upload icon
3. Click the button
4. Verify navigation to `/upload`

**Expected:**
- Upload PDF button links to upload page
