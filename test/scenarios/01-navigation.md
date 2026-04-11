# Scenario 01 — Navigation & Layout

> **Suite**: Navigation & Layout  
> **Target URL**: https://pdf-editor-web.pages.dev/  
> **Prerequisites**: None

---

## Scenario 1.1: Sidebar Renders on Page Load

**Steps (BB Browser):**
1. Navigate to `https://pdf-editor-web.pages.dev/`
2. Wait for page load
3. Verify sidebar `<aside>` element is visible on the left
4. Verify sidebar contains logo area with text "PDF Editor"
5. Verify sidebar contains navigation links
6. Take screenshot: `sidebar-expanded`

**Expected:**
- Sidebar is visible with width ~256px (w-64)
- Logo "PDF Editor" text visible
- Navigation categories visible: General, Tools, Convert
- Navigation links listed under each category

---

## Scenario 1.2: Sidebar Collapse and Expand

**Steps:**
1. Navigate to `/`
2. Find collapse toggle button at bottom of sidebar (menu-fold icon)
3. Click the toggle button
4. Verify sidebar width shrinks to ~64px (w-16)
5. Verify navigation labels are hidden (opacity-0)
6. Verify category titles are hidden
7. Verify divider lines appear in place of category titles
8. Take screenshot: `sidebar-collapsed`
9. Click the toggle button again (now menu-unfold icon)
10. Verify sidebar expands back to ~256px
11. Verify labels are visible again

**Expected:**
- Sidebar toggles between collapsed (icon-only) and expanded states
- Transition animates smoothly (300ms)

---

## Scenario 1.3: Logo Links to Home

**Steps:**
1. Navigate to `/tools/rotate`
2. Click the "PDF Editor" logo link in sidebar
3. Verify URL changes to `/`
4. Verify Dashboard page content renders

**Expected:**
- Logo click navigates to dashboard

---

## Scenario 1.4: Active Route Highlighting

**Steps:**
1. Navigate to `/tools/rotate`
2. Find the "Rotate Pages" link in sidebar
3. Verify it has the `.active` class or active styling
4. Navigate to `/tools/delete`
5. Verify "Delete Pages" link now has active styling
6. Verify "Rotate Pages" link no longer has active styling

**Expected:**
- `routerLinkActive="active"` applies correct highlighting

---

## Scenario 1.5: All Sidebar Links Navigate Correctly

**Steps:**
1. For each sidebar link, click and verify:
   - Dashboard → `/`
   - Upload PDF → `/upload`
   - Rotate Pages → `/tools/rotate`
   - Delete Pages → `/tools/delete`
   - Reorder Pages → `/tools/reorder`
   - Extract Pages → `/tools/extract`
   - Watermark → `/tools/watermark`
   - Merge PDFs → `/tools/merge`
   - Split PDF → `/tools/split`
   - Compress → `/tools/compress`
   - Protect → `/tools/protect`
   - Sign PDF → `/tools/sign`
   - Annotate → `/tools/annotate`
   - Word to PDF → `/convert/word-to-pdf`
   - PDF to Word → `/convert/pdf-to-word`
   - PDF to Text → `/convert/pdf-to-text`
2. For each link verify no console errors and page renders

**Expected:**
- All links navigate without error
- No 404 pages

---

## Scenario 1.6: Top Navigation Bar

**Steps:**
1. Navigate to `/`
2. Verify header `<header>` element is visible
3. Verify breadcrumb shows "Home / PDF Editor"
4. Verify "Upload PDF" button is visible
5. Click "Upload PDF" button
6. Verify navigation to `/upload`

**Expected:**
- Header is sticky at top, with breadcrumb and action buttons

---

## Scenario 1.7: Mobile Viewport Hamburger Menu

**Steps:**
1. Set viewport to 375x812 (mobile)
2. Navigate to `/`
3. Verify sidebar is collapsed or hidden
4. Verify hamburger menu button is visible in header
5. Click hamburger button
6. Verify sidebar opens with overlay behind it
7. Click overlay
8. Verify sidebar closes

**Expected:**
- Mobile layout hides sidebar by default
- Hamburger opens sidebar with backdrop overlay
