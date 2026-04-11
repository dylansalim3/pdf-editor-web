# Common Steps — BB Browser Test Helpers

> Reusable step definitions used across all scenario files.
> These describe the common actions BB Browser performs.

---

## Navigation Steps

### `STEP: Navigate to {url}`
```
1. Open browser to https://pdf-editor-web.pages.dev{url}
2. Wait for page to fully load (DOM content loaded)
3. Verify no JavaScript console errors
```

### `STEP: Click sidebar link {label}`
```
1. Find sidebar <a> element containing text "{label}"
2. Click the element
3. Wait for route change / page content update
4. Verify URL changed to expected route
```

### `STEP: Verify page title is {title}`
```
1. Find <h1> element on page
2. Assert its text content equals "{title}"
```

---

## File Upload Steps

### `STEP: Upload PDF file {filename}`
```
1. Find <nz-upload> or file input element on page
2. Set file input to test/fixtures/{filename}
3. Wait for file processing (loading indicators)
4. Verify file name appears in upload area
```

### `STEP: Upload PDF via /upload page`
```
1. Navigate to /upload
2. Find file input / drag-drop area
3. Set file to test/fixtures/sample-3page.pdf
4. Wait for PDF viewer to render
5. Verify page count shows in viewer
6. Navigate to target tool page
7. Verify PDF is loaded in tool's viewer
```

---

## Assertion Steps

### `STEP: Verify element {selector} is visible`
```
1. Find element matching CSS selector "{selector}"
2. Assert element is visible (display not none, opacity > 0)
```

### `STEP: Verify element {selector} contains text {text}`
```
1. Find element matching "{selector}"
2. Assert textContent includes "{text}"
```

### `STEP: Verify download triggered with filename {filename}`
```
1. Monitor download events
2. Assert a download was triggered
3. Assert downloaded filename matches "{filename}"
```

### `STEP: Verify modal appears with title {title}`
```
1. Wait for modal overlay to appear (nz-modal)
2. Find modal title element
3. Assert title text matches "{title}"
```

### `STEP: Verify URL is {path}`
```
1. Get current page URL
2. Assert pathname equals "{path}"
```

---

## Interaction Steps

### `STEP: Click button {text}`
```
1. Find <button> or <a> element containing text "{text}"
2. Click the element
3. Wait briefly for any animations/state changes
```

### `STEP: Select radio option {label}`
```
1. Find <label> element with nz-radio containing text "{label}"
2. Click to select
3. Verify radio is now checked
```

### `STEP: Select dropdown value {value}`
```
1. Find <nz-select> component
2. Click to open dropdown
3. Find and click option with label "{value}"
4. Verify selection updated
```

### `STEP: Enter text {text} in field {label}`
```
1. Find input/textarea associated with label "{label}"
2. Clear existing value
3. Type "{text}"
4. Verify value set
```

---

## State Verification Steps

### `STEP: Verify PDF viewer shows {pageCount} pages`
```
1. Find page count indicator in PDF viewer
2. Assert it shows "{pageCount}" pages
```

### `STEP: Verify loading spinner is visible/hidden`
```
1. Find <nz-spin> element
2. Assert visibility matches expected state
```

### `STEP: Take screenshot {name}`
```
1. Capture current viewport as screenshot
2. Save to test/screenshots/{name}.png
3. (Used for visual regression reference)
```

---

## Viewport Steps

### `STEP: Set viewport to {width}x{height}`
```
1. Resize browser window to {width}x{height}
2. Wait for layout reflow
3. Allow 500ms for responsive adjustments
```

### Preset Viewports
- **Desktop**: 1920x1080
- **Laptop**: 1366x768
- **Tablet**: 768x1024
- **Mobile**: 375x812
