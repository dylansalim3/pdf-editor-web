# Scenario 10 — Protect PDF Tool

> **Suite**: Document Operations  
> **Target URL**: https://pdf-editor-web.pages.dev/tools/protect  
> **Prerequisites**: PDF file  
> **Status**: ⚠️ SIMULATED — UI exists but protection is fake

---

## Known Issues

- **BUG-003**: Download button sets `href="#"` — does NOT download actual protected file
- Protection logic is simulated with a 2-second `setTimeout`
- No actual encryption is applied to the PDF

---

## Scenario 10.1: Page Loads

**Steps:**
1. Navigate to `/tools/protect`
2. Verify upload area visible
3. Verify password input fields (User Password, Owner Password)
4. Verify permission checkboxes
5. Verify encryption level dropdown

**Expected:**
- UI renders with all form elements

---

## Scenario 10.2: Upload PDF

**Steps:**
1. Upload a PDF file
2. Verify file shown in upload list
3. Verify only PDF files accepted

**Expected:**
- File validation works

---

## Scenario 10.3: Password Strength Indicator

**Steps:**
1. Enter password "a"
2. Verify strength: "Weak" (red, 25%)
3. Enter password "Abc1"
4. Verify strength: "Good" (yellow, 75%)
5. Enter password "Abc1234!"
6. Verify strength: "Strong" (green, 100%)
7. Clear password
8. Verify strength resets

**Expected:**
- Password strength updates dynamically based on:
  - Length >= 8
  - Has lowercase
  - Has uppercase
  - Has number/special char

---

## Scenario 10.4: Permission Toggles

**Steps:**
1. Verify default state:
   - Allow Printing: checked
   - Allow Copying: unchecked
   - Allow Editing: unchecked
   - Allow Annotating: unchecked
2. Toggle each permission
3. Verify state updates

**Expected:**
- Checkboxes toggle correctly

---

## Scenario 10.5: Protect Without Password

**Steps:**
1. Upload PDF
2. Leave password empty
3. Click "Protect"
4. Verify alert: "Please enter a password"

**Expected:**
- Validation prevents protection without password

---

## Scenario 10.6: Protect Execution (Simulated)

**Steps:**
1. Upload PDF
2. Enter password "Test1234!"
3. Click "Protect"
4. Verify protecting spinner appears
5. Wait 2 seconds
6. Verify "protected" state shown

**Expected:**
- Protection simulated with timeout
- **NOTE**: No actual encryption applied

---

## Scenario 10.7: Download Protected File (BUG)

**Steps:**
1. Complete protection
2. Click "Download"
3. Verify download behavior

**Expected (CURRENT — BUG):**
- Downloads `#` — not a real file
- **FIX NEEDED**: Implement actual PDF encryption (may need library beyond pdf-lib)

---

## Scenario 10.8: Encryption Level Selection

**Steps:**
1. Verify default: 256-bit
2. Change to 128-bit
3. Verify selection updates

**Expected:**
- Dropdown works (value stored but not used functionally)

---

## Scenario 10.9: Reset State

**Steps:**
1. Complete protection
2. Click Reset
3. Verify password cleared, protected state reset, file cleared

**Expected:**
- Full state reset
