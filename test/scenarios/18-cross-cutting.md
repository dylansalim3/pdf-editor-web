# Scenario 18 — Cross-Cutting Concerns

> **Suite**: Responsive Design, Accessibility, Error Handling, Performance  
> **Target URL**: All pages  
> **Status**: ⚠️ Partial coverage

---

## Section A: Responsive Design

### Scenario 18.1: Desktop Layout (1920x1080)

**Steps:**
1. Set viewport to 1920x1080
2. Navigate to `/`
3. Verify:
   - Sidebar expanded (w-64 = 256px)
   - Dashboard content fills remaining width
   - Quick Actions in 4-column grid
   - All Tools category cards in 4-column grid
4. Navigate to `/tools/rotate`
5. Verify:
   - PDF viewer takes left portion
   - Sidebar controls panel (w-80 = 320px) on right
   - Both visible simultaneously
6. Take screenshot: `desktop-dashboard`

**Expected:**
- Full desktop layout with sidebar and split-pane tool view

---

### Scenario 18.2: Tablet Layout (768x1024)

**Steps:**
1. Set viewport to 768x1024
2. Navigate to `/`
3. Verify:
   - Dashboard Quick Actions in 2-column grid
   - All Tools in 2-column grid
4. Navigate to `/tools/rotate`
5. Verify:
   - Layout adapts (may stack or reduce panel widths)
6. Take screenshot: `tablet-dashboard`

**Expected:**
- Responsive grid adapts to tablet width

---

### Scenario 18.3: Mobile Layout (375x812)

**Steps:**
1. Set viewport to 375x812
2. Navigate to `/`
3. Verify:
   - Sidebar collapsed/hidden by default
   - Hamburger menu visible
   - Quick Actions in 2-column grid
   - All Tools in single column
4. Navigate to `/tools/rotate`
5. Verify:
   - Tool controls stack below/above viewer
   - OR: scrollable layout allowing access to all controls
6. Take screenshot: `mobile-dashboard`

**Expected:**
- Mobile-friendly layout
- Touch targets >= 44px

---

### Scenario 18.4: Sidebar Responsive Behavior

**Steps:**
1. Desktop: sidebar visible, expanded
2. Resize to 1023px: verify sidebar behavior changes
3. Resize to 375px: verify sidebar hidden, hamburger visible
4. Open sidebar on mobile: verify overlay backdrop
5. Resize back to 1920px: verify sidebar auto-expanded

**Expected:**
- Sidebar adapts across breakpoints

---

## Section B: Accessibility

### Scenario 18.5: Keyboard Navigation — Sidebar

**Steps:**
1. Press Tab from page start
2. Verify sidebar links are focusable
3. Press Enter on focused link
4. Verify navigation occurs

**Expected:**
- All interactive elements keyboard-accessible

---

### Scenario 18.6: Keyboard Navigation — Tool Controls

**Steps:**
1. Navigate to `/tools/rotate`
2. Tab to each control:
   - Quick Rotate buttons
   - Radio buttons
   - Dropdowns
   - Apply Rotation button
3. Enter/Space to activate each control

**Expected:**
- All form controls keyboard-operable

---

### Scenario 18.7: ARIA Labels

**Steps:**
1. Inspect interactive elements for ARIA attributes:
   - Buttons: `aria-label` or text content
   - Icons: `aria-hidden="true"` or descriptive label
   - Form fields: associated `<label>` elements
   - Sidebar toggle: `aria-expanded` attribute

**Expected:**
- ⚠️ Currently lacking — needs ARIA labels added
- Icon-only buttons need `aria-label`

---

### Scenario 18.8: Color Contrast

**Steps:**
1. Check key text/background combinations:
   - Primary text (#1E293B) on white → 13.5:1 ✅
   - Secondary text (#64748B) on white → 4.6:1 ✅ (AA)
   - Muted text (#94A3B8) on white → 3.0:1 ⚠️ (fails AA)
   - Primary button text (white) on #2563EB → 4.6:1 ✅

**Expected:**
- Most combinations pass AA; muted text may need darkening

---

## Section C: Error Handling

### Scenario 18.9: Navigate to Non-Existent Route

**Steps:**
1. Navigate to `/nonexistent-page`
2. Observe behavior

**Expected (CURRENT):**
- No wildcard route — may show blank page or app shell with empty content
- **FIX**: Add `{ path: '**', redirectTo: '' }` or 404 component

---

### Scenario 18.10: Upload Corrupted PDF

**Steps:**
1. Navigate to `/upload`
2. Upload a corrupted/invalid PDF file
3. Observe error handling

**Expected:**
- `PDFDocument.load()` throws error
- Error caught in try/catch
- User sees error message (currently `console.error`)
- App remains functional

---

### Scenario 18.11: Console Errors on Page Load

**Steps:**
1. Open browser developer console
2. Navigate through all pages
3. Check for JavaScript errors

**Expected:**
- No uncaught exceptions
- No critical errors
- Warning-level messages acceptable

---

## Section D: Performance

### Scenario 18.12: Dashboard Load Time

**Steps:**
1. Clear cache
2. Navigate to `/`
3. Measure:
   - First Contentful Paint
   - Largest Contentful Paint
   - Time to Interactive

**Expected:**
- FCP < 1.5s
- TTI < 3.5s

---

### Scenario 18.13: Lazy Loading Verification

**Steps:**
1. Load dashboard (observe network tab)
2. Navigate to `/tools/rotate`
3. Verify rotate module chunk loaded on navigation
4. Navigate to `/convert/word-to-pdf`
5. Verify word-to-pdf chunk loaded on navigation

**Expected:**
- Modules loaded on demand, not all at once
- `loadChildren` routes trigger lazy chunk loading

---

### Scenario 18.14: Large PDF Performance

**Steps:**
1. Upload 50-page PDF
2. Navigate to rotate tool
3. Verify:
   - PDF viewer renders within 5 seconds
   - Page navigation is responsive
   - Rotation operation completes within 3 seconds

**Expected:**
- Application handles large documents without freezing

---

### Scenario 18.15: Memory Cleanup on Route Change

**Steps:**
1. Upload large PDF
2. Navigate between multiple tool pages
3. Monitor browser memory usage
4. Verify no significant memory leaks

**Expected:**
- `OnDestroy` hooks unsubscribe from observables
- Blob URLs revoked when components destroyed
