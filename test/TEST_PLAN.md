# PDF Editor — BB Browser UI Test Plan

> **Target**: `https://pdf-editor-web.pages.dev/`  
> **Runner**: BB Browser (headless Chromium subagent)  
> **Test files location**: `test/scenarios/`  
> **Sample fixtures**: `sample-pdf/*.pdf`, `test/fixtures/`  
> **Date**: 2026-04-11

---

## Table of Contents

1. [Test Architecture](#test-architecture)
2. [Suite 1 — Navigation & Layout](#suite-1--navigation--layout)
3. [Suite 2 — Dashboard](#suite-2--dashboard)
4. [Suite 3 — Page Management Tools](#suite-3--page-management-tools)
5. [Suite 4 — Document Operations](#suite-4--document-operations)
6. [Suite 5 — Content Modification Tools](#suite-5--content-modification-tools)
7. [Suite 6 — Conversion Tools](#suite-6--conversion-tools)
8. [Suite 7 — File Upload & State Management](#suite-7--file-upload--state-management)
9. [Suite 8 — Cross-Cutting Concerns](#suite-8--cross-cutting-concerns)
10. [Suite 9 — End-to-End Workflows](#suite-9--end-to-end-workflows)
11. [Missing Features & Bugs](#missing-features--bugs)

---

## Test Architecture

```
test/
├── TEST_PLAN.md              ← This file
├── fixtures/
│   ├── sample-3page.pdf      ← 3-page test PDF (generated)
│   ├── sample-10page.pdf     ← 10-page test PDF (generated)
│   ├── sample.docx           ← Word document for conversion tests
│   ├── sample.doc            ← Legacy Word format
│   ├── sample-image.png      ← Image for watermark/sign tests
│   ├── corrupted.pdf         ← Intentionally corrupted PDF
│   └── large-50page.pdf      ← Stress test PDF
├── scenarios/
│   ├── 01-navigation.md      ← Navigation & layout scenarios
│   ├── 02-dashboard.md       ← Dashboard scenarios
│   ├── 03-rotate-tool.md     ← Rotate Pages scenarios
│   ├── 04-delete-tool.md     ← Delete Pages scenarios
│   ├── 05-reorder-tool.md    ← Reorder Pages scenarios (PLACEHOLDER)
│   ├── 06-extract-tool.md    ← Extract Pages scenarios (PLACEHOLDER)
│   ├── 07-merge-tool.md      ← Merge PDFs scenarios (PLACEHOLDER)
│   ├── 08-split-tool.md      ← Split PDF scenarios
│   ├── 09-compress-tool.md   ← Compress PDF scenarios (SIMULATED)
│   ├── 10-protect-tool.md    ← Protect PDF scenarios (SIMULATED)
│   ├── 11-watermark-tool.md  ← Watermark scenarios (ROUTING BUG)
│   ├── 12-sign-tool.md       ← Sign PDF scenarios (PLACEHOLDER)
│   ├── 13-annotate-tool.md   ← Annotate scenarios (PLACEHOLDER)
│   ├── 14-word-to-pdf.md     ← Word to PDF conversion
│   ├── 15-pdf-to-word.md     ← PDF to Word conversion
│   ├── 16-pdf-to-text.md     ← PDF to Text extraction
│   ├── 17-upload-state.md    ← Upload & state management
│   ├── 18-cross-cutting.md   ← Responsive, a11y, performance
│   └── 19-e2e-workflows.md   ← Full end-to-end workflows
└── helpers/
    └── common-steps.md       ← Reusable step definitions
```

### Component Status Glossary

| Symbol | Meaning |
|--------|---------|
| ✅ FUNCTIONAL | Fully implemented with real logic |
| ⚠️ SIMULATED | UI exists but uses fake/simulated backend logic |
| 🔲 PLACEHOLDER | Route exists but shows only `"<tool> works!"` |
| 🐛 BUG | Known routing or logic bug |

---

## Suite 1 — Navigation & Layout

**File**: `test/scenarios/01-navigation.md`

### S1.1 — Sidebar Navigation

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 1.1.1 | Sidebar renders on page load | Navigate to `/` | Sidebar visible with logo "PDF Editor", navigation categories (General, Tools, Convert) | ✅ |
| 1.1.2 | Sidebar collapse/expand | Click collapse toggle button at sidebar bottom | Sidebar collapses to icon-only mode (w-16); labels hidden; click again to expand | ✅ |
| 1.1.3 | Logo links to home | Click "PDF Editor" logo in sidebar | Navigates to `/` (dashboard) | ✅ |
| 1.1.4 | Active route highlighting | Navigate to `/tools/rotate` | "Rotate Pages" link in sidebar has `.active` class styling | ✅ |
| 1.1.5 | All sidebar links are navigable | Click each sidebar link sequentially | Each link routes to correct page without 404 error | ✅ (routes exist) |
| 1.1.6 | Sidebar category headers | Observe sidebar | Categories "General", "Tools", "Convert" visible with uppercase labels | ✅ |
| 1.1.7 | Collapsed sidebar hides category titles | Collapse sidebar | Category text hidden, divider lines show instead | ✅ |

### S1.2 — Top Navigation Bar

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 1.2.1 | Header renders | Load any page | Top bar with breadcrumb and "Upload PDF" button visible | ✅ |
| 1.2.2 | Upload PDF button navigation | Click "Upload PDF" in top bar | Navigates to `/upload` page | ✅ |
| 1.2.3 | Breadcrumb shows path | Navigate to `/tools/rotate` | Breadcrumb shows "Home / PDF Editor" | ✅ |
| 1.2.4 | Help button visible | Observe top bar | Question-circle icon button present | ✅ |
| 1.2.5 | Mobile hamburger menu | Resize to <1024px width | Hamburger menu button appears (lg:hidden) | ✅ |

### S1.3 — Mobile Overlay

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 1.3.1 | Mobile overlay appears on sidebar open | Resize <1024px, open sidebar | Semi-transparent black overlay covers main content | ✅ |
| 1.3.2 | Clicking overlay closes sidebar | Click overlay | Sidebar closes; overlay disappears | ✅ |

---

## Suite 2 — Dashboard

**File**: `test/scenarios/02-dashboard.md`

### S2.1 — Page Layout

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 2.1.1 | Dashboard renders | Navigate to `/` | Page title "Dashboard", subtitle visible, "Upload PDF" button present | ✅ |
| 2.1.2 | Quick Actions grid | Observe Quick Actions section | 4 cards: Rotate Pages, Delete Pages, Add Watermark, Merge PDFs | ✅ |
| 2.1.3 | Quick Action card hover effect | Hover over a Quick Action card | Card gets shadow elevation; icon scales up | ✅ |
| 2.1.4 | Quick Action links work | Click "Rotate Pages" card | Navigates to `/tools/rotate` | ✅ |
| 2.1.5 | All Tools section renders | Scroll to "All Tools" | 4 category cards: Page Management, Content Modification, Document Operations, Convert | ✅ |

### S2.2 — Tool Categories

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 2.2.1 | Page Management tools listed | Check Page Management card | Rotate, Delete, Reorder, Extract Pages listed with correct icons | ✅ |
| 2.2.2 | Content Modification tools | Check card | Add Watermark, Sign PDF, Annotate listed | ✅ |
| 2.2.3 | Document Operations tools | Check card | Merge, Split, Compress, Protect listed | ✅ |
| 2.2.4 | Convert tools listed | Check card | Word to PDF, PDF to Word, PDF to Text listed | ✅ |
| 2.2.5 | Tool card links navigate correctly | Click each tool in All Tools section | Navigates to correct route | ✅ |

### S2.3 — Recent Files Section

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 2.3.1 | Recent Files hidden when empty | Load dashboard fresh | Recent Files section NOT visible (empty array) | ✅ |
| 2.3.2 | Recent Files shows after upload | Upload a PDF, return to dashboard | Recent Files section appears with file entry | 🔲 NOT IMPLEMENTED |

---

## Suite 3 — Page Management Tools

### S3.1 — Rotate Tool (`/tools/rotate`)

**File**: `test/scenarios/03-rotate-tool.md`  
**Status**: ✅ FUNCTIONAL

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 3.1.1 | Page loads with header | Navigate to `/tools/rotate` | Header shows "Rotate PDF Pages" with breadcrumb, Undo/Redo/Download buttons | ✅ |
| 3.1.2 | PDF viewer loads | Upload PDF via `/upload` first, then go to rotate | PDF viewer renders document; page count shown | ✅ |
| 3.1.3 | Quick Rotate Left button | Click "Left 90°" button | Current page rotated 90° counter-clockwise; PDF re-renders | ✅ |
| 3.1.4 | Quick Rotate Right button | Click "Right 90°" button | Current page rotated 90° clockwise | ✅ |
| 3.1.5 | Quick Rotate 180° button | Click "180°" button | Current page rotated 180° | ✅ |
| 3.1.6 | Rotation mode: Current page | Select "Current page" radio, click Apply | Only current page is rotated | ✅ |
| 3.1.7 | Rotation mode: Specific page | Select "Specific page", enter page number, Apply | Only specified page rotated | ✅ |
| 3.1.8 | Rotation mode: All pages | Select "All pages", Apply | Every page rotated by chosen angle | ✅ |
| 3.1.9 | Rotation angle dropdown | Select 90°/180°/270° from dropdown | Angle correctly applied on rotation | ✅ |
| 3.1.10 | Direction dropdown | Select Clockwise/Counter-clockwise | Rotation direction changes accordingly | ✅ |
| 3.1.11 | Batch rotation – select pages | Click page thumbnails to select | Selected pages highlighted with blue border and checkmark | ✅ |
| 3.1.12 | Batch rotation – rotate selected | Select 3 pages, click "Rotate Selected Pages" | Only selected pages rotated; selection clears after | ✅ |
| 3.1.13 | Page thumbnails toggle | Click "Hide"/"Show" on Page Thumbnails | Thumbnails grid toggles visibility | ✅ |
| 3.1.14 | Undo after rotation | Rotate a page, click Undo | PDF reverts to previous state | ✅ |
| 3.1.15 | Redo after undo | Undo rotation, then click Redo | Rotation re-applied | ✅ |
| 3.1.16 | Download rotated PDF | Click Download | Browser downloads `rotated-document.pdf` | ✅ |
| 3.1.17 | Loading spinner during processing | Click Apply Rotation | Loading overlay appears during processing | ✅ |
| 3.1.18 | No PDF loaded state | Navigate to `/tools/rotate` without uploading | PDF viewer area shows empty/error state | ⚠️ |
| 3.1.19 | Page navigation updates current page | Navigate between pages in viewer | Current page number updates in sidebar | ✅ |

### S3.2 — Delete Tool (`/tools/delete`)

**File**: `test/scenarios/04-delete-tool.md`  
**Status**: ✅ FUNCTIONAL

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 3.2.1 | Page loads with header | Navigate to `/tools/delete` | Header "Delete PDF Pages", Undo/Redo/Download buttons | ✅ |
| 3.2.2 | Delete mode: Single page | Select "Single" mode, set page number, click Delete | Confirmation modal appears | ✅ |
| 3.2.3 | Delete confirmation modal | Proceed from 3.2.2 | Modal: "Are you sure you want to delete 1 page(s)?" with Delete/Cancel buttons | ✅ |
| 3.2.4 | Delete single page execution | Confirm deletion | Page removed; page count decrements; success modal shown | ✅ |
| 3.2.5 | Delete mode: Range | Select "Range", set start=2 end=4, Delete | Confirmation modal for 3 pages | ✅ |
| 3.2.6 | Delete range execution | Confirm range deletion | Pages 2-4 removed; remaining pages renumbered | ✅ |
| 3.2.7 | Delete mode: Multiple select | Select "Multiple" mode, click pages 1, 3, 5 | Selected pages highlighted; count shown | ✅ |
| 3.2.8 | Delete multiple pages | Click Delete with multiple selected | Confirmation shows count; pages removed on confirm | ✅ |
| 3.2.9 | Keep Only Selected feature | Select specific pages, click "Keep Only Selected" | All un-selected pages deleted; modal confirms action | ✅ |
| 3.2.10 | Empty selection warning | Click Delete with no pages selected | Warning modal: "No Pages Selected" | ✅ |
| 3.2.11 | Error handling | Attempt to delete all pages | Error handling works; at least 1 page must remain | ⚠️ |
| 3.2.12 | Undo deletion | Delete a page, then Undo | PDF reverts to state before deletion | ✅ |

### S3.3 — Reorder Tool (`/tools/reorder`)

**File**: `test/scenarios/05-reorder-tool.md`  
**Status**: 🔲 PLACEHOLDER

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 3.3.1 | Route loads | Navigate to `/tools/reorder` | Page renders (currently shows "reorder works!") | 🔲 |
| 3.3.2 | Drag-and-drop reordering | Upload PDF, drag page thumbnails | Pages reorder via drag-and-drop | 🔲 NOT IMPLEMENTED |
| 3.3.3 | Move page from X to Y | Enter source/destination positions | Page moves to new position | 🔲 NOT IMPLEMENTED |

### S3.4 — Extract Tool (`/tools/extract`)

**File**: `test/scenarios/06-extract-tool.md`  
**Status**: 🔲 PLACEHOLDER

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 3.4.1 | Route loads | Navigate to `/tools/extract` | Page renders (currently shows "extract works!") | 🔲 |
| 3.4.2 | Select pages to extract | Upload PDF, select pages | Selected pages can be extracted as new PDF | 🔲 NOT IMPLEMENTED |
| 3.4.3 | Extract page range | Set range, extract | New PDF created from range | 🔲 NOT IMPLEMENTED |

---

## Suite 4 — Document Operations

### S4.1 — Merge Tool (`/tools/merge`)

**File**: `test/scenarios/07-merge-tool.md`  
**Status**: 🔲 PLACEHOLDER

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 4.1.1 | Route loads | Navigate to `/tools/merge` | Page renders (currently shows "merge works!") | 🔲 |
| 4.1.2 | Upload multiple PDFs | Upload 2+ PDF files | File list displayed; can reorder | 🔲 NOT IMPLEMENTED |
| 4.1.3 | Merge execution | Click Merge | Combined PDF created for download | 🔲 NOT IMPLEMENTED |

### S4.2 — Split Tool (`/tools/split`)

**File**: `test/scenarios/08-split-tool.md`  
**Status**: ✅ FUNCTIONAL

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 4.2.1 | Page loads | Navigate to `/tools/split` | Upload area with split options visible | ✅ |
| 4.2.2 | Upload PDF | Upload a multi-page PDF | Total pages detected and displayed | ✅ |
| 4.2.3 | Split by range | Set start=1, end=3, click Split | New PDF with pages 1-3 generated | ✅ |
| 4.2.4 | Split every N pages | Set mode "every", N=2 | Multiple PDFs generated, each with 2 pages | ✅ |
| 4.2.5 | Extract specific pages | Set mode "extract", enter "1,3,5" | New PDF with pages 1, 3, 5 created | ✅ |
| 4.2.6 | Download single split file | Click Download on generated file | File downloads correctly | ✅ |
| 4.2.7 | Download all split files | Click "Download All" | All files download sequentially | ✅ |
| 4.2.8 | File size display | Upload PDF | Generated file sizes shown correctly | ✅ |
| 4.2.9 | Reset after split | Click Reset/Convert Another | State cleared; ready for new upload | ✅ |
| 4.2.10 | Empty file rejection | Upload non-PDF file | File rejected silently | ✅ |

### S4.3 — Compress Tool (`/tools/compress`)

**File**: `test/scenarios/09-compress-tool.md`  
**Status**: ⚠️ SIMULATED

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 4.3.1 | Page loads | Navigate to `/tools/compress` | Upload area with quality options | ✅ |
| 4.3.2 | Upload PDF | Upload a PDF | Original file size shown | ✅ |
| 4.3.3 | Quality selection | Select Low/Medium/High | Quality option changes | ✅ |
| 4.3.4 | Compress execution | Click Compress | Progress bar animates to 100% | ⚠️ SIMULATED |
| 4.3.5 | Compression results | After compression | Original vs compressed size shown | ⚠️ SIMULATED (calculated, not real) |
| 4.3.6 | Download compressed file | Click Download | Download triggers (but file is NOT actually compressed) | 🐛 BUG: Downloads `#` not a real file |
| 4.3.7 | Reset state | Click Reset | Form resets to initial state | ✅ |

### S4.4 — Protect Tool (`/tools/protect`)

**File**: `test/scenarios/10-protect-tool.md`  
**Status**: ⚠️ SIMULATED

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 4.4.1 | Page loads | Navigate to `/tools/protect` | Upload area with password fields | ✅ |
| 4.4.2 | Upload PDF | Upload a PDF | File added to list | ✅ |
| 4.4.3 | Password input | Enter password | Password strength indicator updates | ✅ |
| 4.4.4 | Password strength levels | Enter "a", "Abc1", "Abc1234!", etc. | Shows Weak/Fair/Good/Strong | ✅ |
| 4.4.5 | Permission toggles | Toggle Allow Printing/Copying/Editing | Checkboxes toggle correctly | ✅ |
| 4.4.6 | Protect without password | Click Protect with empty password | Alert: "Please enter a password" | ✅ |
| 4.4.7 | Protect execution | Enter password, click Protect | Protecting spinner (2s delay); completes | ⚠️ SIMULATED |
| 4.4.8 | Download protected file | Click Download | Download triggers | 🐛 BUG: Downloads `#` not a real file |

---

## Suite 5 — Content Modification Tools

### S5.1 — Watermark Tool (`/tools/watermark`)

**File**: `test/scenarios/11-watermark-tool.md`  
**Status**: 🐛 ROUTING BUG

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 5.1.1 | Route loads | Navigate to `/tools/watermark` | Should show watermark-specific UI | 🐛 BUG: Routes to generic PdfRotateModule |
| 5.1.2 | Text watermark input | Enter watermark text | Text field accepts input | 🐛 BLOCKED (wrong module) |
| 5.1.3 | Color selection | Pick watermark color | Color picker works | 🐛 BLOCKED |
| 5.1.4 | Style presets | Select diagonal/horizontal style | Preset applies to watermark | 🐛 BLOCKED |

> **Bug**: `/tools/watermark` routes to `PdfRotateModule` instead of a dedicated `WatermarkModule`. This needs to be fixed.

### S5.2 — Sign Tool (`/tools/sign`)

**File**: `test/scenarios/12-sign-tool.md`  
**Status**: 🔲 PLACEHOLDER

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 5.2.1 | Route loads | Navigate to `/tools/sign` | Page loads (currently shows placeholder text) | 🔲 |
| 5.2.2 | Draw signature | Draw with mouse/touch | Signature captured | 🔲 NOT IMPLEMENTED |

### S5.3 — Annotate Tool (`/tools/annotate`)

**File**: `test/scenarios/13-annotate-tool.md`  
**Status**: 🔲 PLACEHOLDER

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 5.3.1 | Route loads | Navigate to `/tools/annotate` | Page loads (currently shows placeholder text) | 🔲 |
| 5.3.2 | Highlight text | Select text, choose highlight | Text highlighted | 🔲 NOT IMPLEMENTED |

---

## Suite 6 — Conversion Tools

### S6.1 — Word to PDF (`/convert/word-to-pdf`)

**File**: `test/scenarios/14-word-to-pdf.md`  
**Status**: ✅ FUNCTIONAL

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 6.1.1 | Page loads | Navigate to `/convert/word-to-pdf` | Title "Word to PDF Converter", upload area, options panel | ✅ |
| 6.1.2 | Upload DOCX file | Drag/drop or browse valid .docx | File added; name displayed | ✅ |
| 6.1.3 | Reject non-Word files | Upload a .pdf or .txt file | File rejected silently | ✅ |
| 6.1.4 | Conversion options defaults | Check default state | Page Size: A4, Image Quality: High, Embed Fonts: checked | ✅ |
| 6.1.5 | Change page size | Select "Letter" from dropdown | Option updates | ✅ |
| 6.1.6 | Convert to PDF | Upload .docx, click Convert | Progress bar animates; conversion completes | ✅ |
| 6.1.7 | Conversion result display | After conversion | File name (.pdf), size, and page count shown | ✅ |
| 6.1.8 | Download converted PDF | Click Download PDF | File downloads with correct name | ✅ |
| 6.1.9 | Reset / Convert Another | Click Convert Another | State resets; upload area reappears | ✅ |
| 6.1.10 | Convert without file | Click Convert with no file | Nothing happens (guard clause) | ✅ |
| 6.1.11 | Error handling for invalid file | Upload corrupted .docx | Error alert shown | ✅ |

### S6.2 — PDF to Word (`/convert/pdf-to-word`)

**File**: `test/scenarios/15-pdf-to-word.md`  
**Status**: ✅ FUNCTIONAL

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 6.2.1 | Page loads | Navigate to `/convert/pdf-to-word` | Upload area with conversion options | ✅ |
| 6.2.2 | Upload PDF | Upload valid PDF | File added; shown in list | ✅ |
| 6.2.3 | Output format selection | Select DOCX/DOC | Option updates | ✅ |
| 6.2.4 | Conversion execution | Click Convert | Progress bar; text extracted; DOCX generated | ✅ |
| 6.2.5 | Download DOCX | Click Download | File downloads as .docx | ✅ |
| 6.2.6 | Text preview | Toggle text preview | Extracted text shown | ✅ |
| 6.2.7 | Copy to clipboard | Click copy button | Text copied to clipboard | ✅ |
| 6.2.8 | Reset state | Click Reset | State cleared | ✅ |

### S6.3 — PDF to Text (`/convert/pdf-to-text`)

**File**: `test/scenarios/16-pdf-to-text.md`  
**Status**: ✅ FUNCTIONAL

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 6.3.1 | Page loads | Navigate to `/convert/pdf-to-text` | Upload area with extraction options | ✅ |
| 6.3.2 | Upload PDF | Upload valid PDF | File added; total pages detected | ✅ |
| 6.3.3 | Extract all pages | Set mode "All", click Extract | All text extracted with progress | ✅ |
| 6.3.4 | Extract page range | Set mode "Range", start=2, end=4 | Only pages 2-4 extracted | ✅ |
| 6.3.5 | Include page numbers option | Toggle "Include page numbers" | Page markers in output | ✅ |
| 6.3.6 | Extracted text display | After extraction | Text shown in scrollable area | ✅ |
| 6.3.7 | Copy to clipboard | Click Copy | Text copied; alert confirmation | ✅ |
| 6.3.8 | Download as TXT | Click Download | .txt file downloaded with extracted text | ✅ |
| 6.3.9 | Reset state | Click Reset | All state cleared; ready for new upload | ✅ |
| 6.3.10 | Invalid page range | Set start > end or out of bounds | Validation prevents extraction | ✅ |

---

## Suite 7 — File Upload & State Management

**File**: `test/scenarios/17-upload-state.md`

### S7.1 — PDF Upload (`/upload`)

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 7.1.1 | Upload page loads | Navigate to `/upload` | Drag-and-drop area with PDF viewer component | ✅ |
| 7.1.2 | Upload valid PDF | Upload a .pdf file | PDF renders in viewer | ✅ |
| 7.1.3 | Drag-and-drop upload | Drag PDF file onto drop zone | File uploads and displays | ✅ |
| 7.1.4 | Reject non-PDF files | Upload .jpg, .txt, etc. | File rejected or no render | ⚠️ |

### S7.2 — NGXS State Management

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 7.2.1 | Store blob file | Upload PDF | Blob stored in NGXS state | ✅ |
| 7.2.2 | State persists across tools | Upload PDF on `/upload`, navigate to `/tools/rotate` | PDF still loaded in viewer | ✅ |
| 7.2.3 | Undo state change | Modify PDF, click Undo | Previous state restored | ✅ |
| 7.2.4 | Redo state change | Undo change, click Redo | Change reapplied | ✅ |
| 7.2.5 | Clear state | Trigger clear action | State reset to initial | ✅ |

---

## Suite 8 — Cross-Cutting Concerns

**File**: `test/scenarios/18-cross-cutting.md`

### S8.1 — Responsive Design

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 8.1.1 | Desktop layout (>1024px) | View at 1920x1080 | Full sidebar, two-column layout for tools | ✅ |
| 8.1.2 | Tablet layout (640-1024px) | Resize to 768x1024 | Sidebar collapses; layout adapts | ⚠️ |
| 8.1.3 | Mobile layout (<640px) | Resize to 375x812 | Sidebar hidden; hamburger menu; stacked layout | ⚠️ |
| 8.1.4 | Dashboard grid responsive | Resize viewport across breakpoints | Tool cards re-flow to fit | ✅ |
| 8.1.5 | Tool sidebar panel on mobile | View rotate tool on mobile | Controls stack below PDF viewer | ⚠️ |

### S8.2 — Accessibility

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 8.2.1 | Keyboard navigation | Tab through sidebar links | All links focusable and activatable | ⚠️ |
| 8.2.2 | Screen reader labels | Audit with a11y tools | Interactive elements have ARIA labels | ⚠️ |
| 8.2.3 | Color contrast | Check text/background | WCAG 2.1 AA compliance | ⚠️ |
| 8.2.4 | Focus indicators | Tab through form fields | Visible focus outline | ⚠️ |

### S8.3 — Error Handling

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 8.3.1 | 404 route handling | Navigate to `/nonexistent` | App doesn't crash; some fallback shown | ⚠️ No wildcard route |
| 8.3.2 | Corrupted PDF upload | Upload corrupted PDF | Error message shown; app doesn't crash | ⚠️ |
| 8.3.3 | Network error resilience | Disconnect internet, upload | Graceful error handling | ⚠️ |

### S8.4 — Performance

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 8.4.1 | Page load time | Measure FCP on dashboard | < 1.5s First Contentful Paint | ⚠️ |
| 8.4.2 | Lazy loading works | Navigate to tool route | Module loaded only when needed | ✅ |
| 8.4.3 | Large PDF handling | Upload 50-page PDF | Renders without freezing | ⚠️ |

---

## Suite 9 — End-to-End Workflows

**File**: `test/scenarios/19-e2e-workflows.md`

### S9.1 — Multi-Tool Workflow

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 9.1.1 | Upload → Rotate → Download | Upload PDF at `/upload`, navigate to `/tools/rotate`, rotate page 1, download | Downloaded PDF has rotated page 1 | ✅ |
| 9.1.2 | Upload → Delete → Rotate → Download | Upload PDF, delete page 3, then rotate page 1, download | PDF has correct pages with rotations | ✅ |
| 9.1.3 | Upload → Multiple rotations → Undo all | Upload PDF, rotate 3 times, undo 3 times | PDF back to original state | ✅ |
| 9.1.4 | Word to PDF → Edit → Download | Convert DOCX to PDF, then navigate to rotate tool | Converted PDF available for editing | ⚠️ NO STATE BRIDGE |
| 9.1.5 | Split → Download all parts | Upload multi-page PDF, split every 2 pages, download all | All parts download correctly | ✅ |

### S9.2 — Standalone Workflows

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 9.2.1 | Convert Word and download | Go to Word to PDF, upload .docx, convert, download | PDF file downloads; opens correctly | ✅ |
| 9.2.2 | Extract text from PDF | Go to PDF to Text, upload PDF, extract, copy | Clipboard contains extracted text | ✅ |
| 9.2.3 | Split and download | Go to Split, upload PDF, split by range, download | Correct pages in downloaded file | ✅ |

---

## Missing Features & Bugs

> The following issues were discovered during test plan creation. These should be addressed as implementation tasks.

### 🐛 Bugs (Critical)

| ID | Severity | Description | Location | Fix |
|----|----------|-------------|----------|-----|
| BUG-001 | **HIGH** | Watermark tool routes to `PdfRotateModule` instead of dedicated watermark tool | `app-routing.module.ts:20` | Create dedicated `WatermarkToolComponent` or fix route to load existing watermark code |
| BUG-002 | **HIGH** | Compress tool downloads `#` instead of actual compressed file | `compress.component.ts:91` | Implement real compression logic (re-serialize PDF with `pdf-lib`, remove unused objects) |
| BUG-003 | **HIGH** | Protect tool downloads `#` instead of actual protected file | `protect.component.ts:101` | Implement real encryption/password logic with `pdf-lib` |
| BUG-004 | **MEDIUM** | Compress tool uses `Math.random()` for page count | `compress.component.ts:49` | Load PDF with `PDFDocument.load()` to get real page count |
| BUG-005 | **MEDIUM** | No 404/wildcard route handler | `app-routing.module.ts` | Add `{ path: '**', redirectTo: '' }` as last route |
| BUG-006 | **LOW** | Error handling uses `alert()` instead of proper UI notifications | Multiple components | Replace with `NzNotificationService` or toast component |

### 🔲 Missing Features (Implementation Needed)

| ID | Priority | Feature | Component | Effort |
|----|----------|---------|-----------|--------|
| FEAT-001 | **HIGH** | Reorder Pages tool — full implementation | `tools/reorder/` | Large — drag-drop UI, pdf-lib integration |
| FEAT-002 | **HIGH** | Extract Pages tool — full implementation | `tools/extract/` | Medium — page selection + pdf-lib copyPages |
| FEAT-003 | **HIGH** | Merge PDFs tool — full implementation | `tools/merge/` | Large — multi-file upload, reorder, merge logic |
| FEAT-004 | **HIGH** | Watermark tool — extract from legacy module | `tools/watermark/` | Medium — create standalone component |
| FEAT-005 | **MEDIUM** | Sign PDF tool — full implementation | `tools/sign/` | Large — canvas drawing, image upload, placement |
| FEAT-006 | **MEDIUM** | Annotate tool — full implementation | `tools/annotate/` | Very Large — annotation layer, shapes, comments |
| FEAT-007 | **MEDIUM** | Compress tool — real compression logic | `tools/compress/` | Medium — re-serialize PDF, image quality reduction |
| FEAT-008 | **MEDIUM** | Protect tool — real encryption logic | `tools/protect/` | Medium — pdf-lib may not support encryption; may need alternative |
| FEAT-009 | **LOW** | Recent files persistence | `dashboard/` | Small — localStorage read/write |
| FEAT-010 | **LOW** | Conversion to Edit bridge | State management | Small — store converted PDF blob into NGXS state |
| FEAT-011 | **LOW** | Tool-to-tool "What's Next" panel | All tool components | Medium — shared component with tool navigation |
| FEAT-012 | **LOW** | No-PDF-loaded empty state for tools | rotate, delete | Small — show upload prompt when no PDF in state |

### ⚠️ Quality Improvements

| ID | Priority | Description |
|----|----------|-------------|
| QA-001 | **MEDIUM** | Replace `alert()` calls with ng-zorro notification/message service |
| QA-002 | **MEDIUM** | Add loading/error states for tool pages when no PDF is loaded |
| QA-003 | **MEDIUM** | Add keyboard shortcuts documentation |
| QA-004 | **LOW** | Improve mobile responsiveness for tool sidebar panels |
| QA-005 | **LOW** | Add ARIA labels and roles for accessibility compliance |
| QA-006 | **LOW** | Add breadcrumb path updates per-route (currently static "PDF Editor") |

---

## Test Execution Notes

### Prerequisites for Running Tests
1. A deployed version at `https://pdf-editor-web.pages.dev/` OR local dev server (`npm run start`)
2. Sample PDF files in `test/fixtures/` directory
3. BB Browser agent with access to file system for upload operations

### Test Data Requirements
- **3-page PDF**: For basic operations (rotate, delete)
- **10-page PDF**: For range operations (split, delete range, batch rotate)
- **DOCX file**: For Word-to-PDF conversion testing
- **Corrupted PDF**: For error handling tests
- **Large PDF (50+ pages)**: For performance testing

### Test Priority Order
1. Navigation & Layout (sanity check)
2. Upload & State Management (dependency for all tools)
3. Rotate Tool (most complete implementation)
4. Delete Tool (second most complete)
5. Split Tool (fully functional)
6. Conversion Tools (all functional)
7. Placeholder & simulated tools (verify current state)
8. Cross-cutting concerns (responsive, a11y, performance)
9. End-to-end workflows
