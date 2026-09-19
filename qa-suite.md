# QA Test Suite — Visitor Check-In

## Test Case Status

* `[ ]` Not executed
* `[pass]` Passed
* `[fail]` Failed

---

## TC-VIS-001 — Verify visitor registration with valid information

**Type:** Happy Path

**Preconditions:**

* Application is running.
* Receptionist is on the visitor registration page.
* Required visitor information is available.

**Steps:**

1. Check that the registration form is displayed.
2. Enter a valid full name.
3. Enter a valid company name.
4. Select a valid host employee.
5. Enter a valid visit purpose.
6. Submit the registration form.
7. Check the response/message shown by the application.
8. Check the active visitor list.

**Expected Result:**

* The visitor is registered successfully.
* A successful confirmation is displayed.
* The visitor appears in the active visitor list.
* The check-in time is displayed.

**Result:** [ pass ]

---

## TC-VIS-002 — Verify registration with missing required fields

**Type:** Negative

**Preconditions:**

* Registration page is available.

**Steps:**

1. Check that the registration form is displayed.
2. Leave one or more required fields empty.
3. Submit the form.
4. Check the validation feedback.

**Expected Result:**

* The visitor is not registered.
* Appropriate validation feedback is displayed.
* No incomplete visitor record is created.

**Result:** [ pass ]

---

## TC-VIS-003 — Verify registration with invalid visitor information

**Type:** Negative

**Preconditions:**

* Registration page is available.

**Steps:**

1. Enter invalid data into a field that has validation rules.
2. Complete the remaining required fields with valid information.
3. Submit the form.
4. Check the response and validation feedback.

**Expected Result:**

* The invalid request is rejected.
* Appropriate validation feedback is displayed.
* No invalid visitor record is created.

**Result:** [ pass ]

---

## TC-VIS-004 — Verify successful visitor check-out

**Type:** Happy Path

**Preconditions:**

* At least one visitor is currently active.

**Steps:**

1. Check the active visitor list.
2. Locate an active visitor.
3. Check the available check-out action.
4. Check out the visitor.
5. Check the active visitor list again.

**Expected Result:**

* The visitor is successfully checked out.
* The visitor no longer appears in the active visitor list.

**Result:** [ pass ]

---

## TC-VIS-005 — Verify a checked-out visitor cannot remain active

**Type:** Negative

**Preconditions:**

* A visitor has been successfully checked out.

**Steps:**

1. Check the active visitor list.
2. Check whether the previously checked-out visitor is present.
3. Refresh the page if necessary.
4. Check the active visitor list again.

**Expected Result:**

* The checked-out visitor does not appear in the active visitor list.

**Result:** [ pass ]

---

## TC-VIS-006 — Verify administrator can deactivate a visitor

**Type:** Happy Path

**Preconditions:**

* An existing visitor record is available.
* Administrator access is available.

**Steps:**

1. Check the visitor record.
2. Check the administrator controls.
3. Deactivate the visitor.
4. Check the result of the operation.

**Expected Result:**

* The visitor is marked as deactivated successfully.
* The application reflects the updated visitor status.

**Result:** [ pass ]

---

## TC-VIS-007 — Verify deactivated visitor is excluded from active visitors

**Type:** Negative

**Preconditions:**

* A visitor has been deactivated.

**Steps:**

1. Open the active visitor list.
2. Check whether the deactivated visitor appears.
3. Refresh the list.
4. Check the list again.

**Expected Result:**

* The deactivated visitor does not appear in the active visitor list.

**Result:** [ pass ]

---

## TC-VIS-008 — Verify deactivated visitor cannot be selected for a repeat visit

**Type:** Negative

**Preconditions:**

* A visitor exists and has been deactivated.
* The registration form supports selecting an existing visitor for a repeat visit.

**Steps:**

1. Open the visitor registration form.
2. Check the existing visitor selection.
3. Search for the deactivated visitor.
4. Check whether the deactivated visitor is available for selection.

**Expected Result:**

* The deactivated visitor is not available for repeat-visit selection.

**Result:** [ pass ]

---

## TC-VIS-009 — Verify active visitor can be selected for a repeat visit

**Type:** Happy Path

**Preconditions:**

* An existing visitor is active.
* The application supports repeat visits.

**Steps:**

1. Open the visitor registration form.
2. Check the existing visitor selection.
3. Locate an active visitor.
4. Select the visitor.
5. Complete the visit information.
6. Submit the registration.

**Expected Result:**

* The active visitor can be selected.
* The repeat visit is registered successfully.
* The resulting visitor/visit appears according to the application's expected behavior.

**Result:** [ pass ]

---

## TC-VIS-010 — Verify visitor list pagination at 20 records

**Type:** Boundary

**Preconditions:**

* At least 21 active visitor records exist.

**Steps:**

1. Open the active visitor list.
2. Check the number of visitors displayed on the first page.
3. Check the pagination controls.
4. Move to the next page.
5. Check the visitors displayed on the second page.

**Expected Result:**

* The first page contains no more than 20 active visitor records.
* The next page is available when more than 20 records exist.
* Remaining records are available on subsequent pages.
* A visitor is not duplicated between pages.

**Result:** [ pass ]

---

## TC-VIS-011 — Verify visitor list with exactly 20 records

**Type:** Boundary

**Preconditions:**

* Exactly 20 active visitor records exist.

**Steps:**

1. Open the active visitor list.
2. Check the number of records displayed.
3. Check the pagination controls.

**Expected Result:**

* All 20 visitors are displayed.
* No additional page is required solely because there are exactly 20 records.

**Result:** [ pass ]

---

## TC-VIS-012 — Verify visitor list with fewer than 20 records

**Type:** Boundary

**Preconditions:**

* Fewer than 20 active visitor records exist.

**Steps:**

1. Open the active visitor list.
2. Check the number of displayed visitors.
3. Check the pagination controls.

**Expected Result:**

* All active visitors are displayed.
* The application does not display unnecessary additional pages.

**Result:** [ pass ]

---

## TC-VIS-013 — Verify empty visitor list

**Type:** Boundary

**Preconditions:**

* There are zero active visitors.

**Steps:**

1. Open the active visitor list.
2. Check the result displayed by the application.

**Expected Result:**

* The application displays an appropriate empty state.
* No visitor records are displayed as active.
* The page does not appear broken or blank without explanation.

**Result:** [ pass ]

---

## TC-VIS-014 — Verify visitor check-in time is displayed in the expected local timezone

**Type:** Boundary / Timezone

**Preconditions:**

* Application is configured for the required timezone behavior.
* A visitor can be registered.

**Steps:**

1. Register a visitor.
2. Check the check-in time shown for the visitor.
3. Compare the displayed time with the expected receptionist-local time.

**Expected Result:**

* The check-in time is displayed using the expected local timezone.
* The displayed time is not incorrectly shifted because of UTC/local timezone conversion.

**Result:** [ pass ]

---

## TC-VIS-015 — Verify registration after checking out a visitor

**Type:** Happy Path

**Preconditions:**

* An existing visitor has been checked out.
* The visitor remains eligible for another visit according to the application's rules.

**Steps:**

1. Open the registration form.
2. Check the available visitor selection.
3. Locate the previously checked-out visitor.
4. Register a new visit if the visitor is available.
5. Check the active visitor list.

**Expected Result:**

* The checked-out visitor can be registered again when permitted by the application rules.
* The new visit appears as an active visitor.

**Result:** [ pass ]

---

# Regression Subset — Minor Registration Form Update

## Purpose

The following regression tests should be executed after a minor change to the visitor registration form.

The subset focuses on functionality most likely to be affected by changes to form fields, validation, submission, and visitor selection.

---

### Included Tests

| Test ID    | Include | Rationale                                                                          |
| ---------- | ------- | ---------------------------------------------------------------------------------- |
| TC-VIS-001 | Yes     | Confirms that the main registration workflow still works after the form change.    |
| TC-VIS-002 | Yes     | Form changes can affect required-field validation.                                 |
| TC-VIS-003 | Yes     | Confirms invalid input is still rejected correctly.                                |
| TC-VIS-009 | Yes     | Registration-form changes may affect existing visitor selection and repeat visits. |
| TC-VIS-015 | Yes     | Confirms the registration workflow still works for an existing eligible visitor.   |
| TC-VIS-014 | Yes     | Registration changes can affect when/how check-in time is created and displayed.   |


### Excluded Tests

| Test ID    | Exclude | Rationale                                                                                                                                                              |
| ---------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-VIS-004 | Yes     | Check-out functionality is not directly affected by a minor registration form change.                                                                                  |
| TC-VIS-005 | Yes     | This tests post-checkout active-list behavior rather than registration-form behavior.                                                                                  |
| TC-VIS-006 | Yes     | Administrator deactivation is outside the registration form.                                                                                                           |
| TC-VIS-007 | Yes     | Active-list filtering after deactivation is not directly affected by a form-only change.                                                                               |
| TC-VIS-008 | Yes     | Deactivation behavior is primarily a visitor-status/business-rule concern; include it in a broader regression run if the form change modifies visitor selection logic. |
| TC-VIS-010 | Yes     | Pagination is independent of the registration form.                                                                                                                    |
| TC-VIS-011 | Yes     | Pagination boundary behavior is independent of the registration form.                                                                                                  |
| TC-VIS-012 | Yes     | Pagination behavior is independent of the registration form.                                                                                                           |
| TC-VIS-013 | Yes     | Empty active-list behavior is not directly changed by a minor form update.                                                                                             |

---

### Regression Decision

The regression subset prioritizes tests that exercise the registration form's inputs, validation, visitor selection, submission, and resulting check-in behavior. Tests unrelated to the registration workflow are excluded to keep the subset focused while retaining a broader suite for full regression testing.
