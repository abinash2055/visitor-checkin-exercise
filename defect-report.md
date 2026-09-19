# Defect Report

This document contains the defects identified while testing the Visitor Check-in application against the requirements provided in the assessment.

---

## DEF-001 — [Actual defect title]

**Summary:**
Deactivated visitor remains selectable for repeat visits.

**Type:**
Functional

**Description:**
After an administrator deactivates a visitor record, the visitor remains available when selecting a visitor for a repeat visit.

**Steps to Reproduce:**

1. Start the Rails API.
2. Start the React frontend.
3. Register a visitors.
4. Open the administrator functionality.
5. Deactivate the visitor.
6. Open the visitor registration form.
7. Open the existing visitor/repeat-visit selection.
8. Look for the deactivated visitor.
9. Observe the result.

**Expected Result:**  
The deactivated visitor should not be selectable for a repeat visit.

**Actual Result:**  
The deactivated visitor remains available for selection.