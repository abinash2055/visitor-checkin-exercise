# Frontend Notes

## 1. Key Component Structure Decision

I separated the visitor list and registration form into focused components.
The visitor list is responsible for displaying visitors and handling its loading, empty, and error states.
The registration form is responsible for collecting visitor information, handling client-side validation, submitting registration requests, and displaying registration errors.
This structure keeps each component focused on a specific responsibility and makes the application easier to understand and maintain.

### Alternative Structure Considered

I considered keeping the visitor list, registration form, API calls, validation, and related state management inside a single large component.
I rejected this approach because it would make the component more difficult to maintain and would mix unrelated responsibilities.
Separating the functionality also makes it easier to reason about asynchronous states and future changes.

---

## 2. Loading State

I implemented a loading state for the visitor list so that users receive feedback while the application is waiting for the API response.
The registration form also indicates when registration is being submitted.
This prevents users from confusing an in-progress request with an empty result and helps prevent unintended repeated submissions.

---

## 3. Empty State

When the API successfully returns no active visitors, the visitor list displays an empty state.
The empty state is based on the API response and does not require changing or removing seed data.
This allows the application to correctly represent a genuine state in which there are currently no active visitors.

---

## 4. Error State

The visitor list displays an error state when the API request fails.
The registration form also handles unsuccessful API responses and provides appropriate feedback to the user.
The application does not display a successful registration result when the server has rejected the request.

---

## 5. Handling Valid Client Data but API Errors

Client-side validation only verifies the rules implemented by the frontend.
Even when the form data is valid according to those rules, the server may reject the request because of server-side validation, business rules, database constraints, authorization, or another server-side error.
Therefore, after submitting the form, the frontend checks the API response.

If the API returns an error:

1. The registration is not treated as successful.
2. The error state is updated.
3. The user receives an appropriate error message.
4. The form remains available for correction or retry.

This ensures that frontend validation is not treated as a replacement for server-side validation.

---

## 6. Client-Fixable Defects

The following defects were addressed on the client side:

### DEF-001 — [Time of Asia/Kathmandu]
Changed USA time to cureent Location Time.

### DEF-002 — [Current System Date]
Added visible Date in Frontend which was stored in Backend only.

The changes were limited to issues that could be correctly resolved by the frontend without relying on unsupported assumptions about server behavior.

---

## 7. Defects Requiring Server-Side Changes

Some issues may appear to be fixable through the UI but require server-side enforcement.
For example, hiding a deactivated visitor from a dropdown improves the user interface, but the backend should also reject an invalid request if a client attempts to use a deactivated visitor directly.
Frontend restrictions should therefore not be considered a replacement for server-side business rules.
---

## 8. Timezone Handling

The application is designed for the `Asia/Kathmandu` timezone.
I checked the display and handling of visitor check-in times and paid particular attention to behavior around midnight, where an incorrect timezone conversion could cause the displayed date or time to change unexpectedly.

---

## 9. What I Would Do Differently Given More Time

Given additional time, I would expand automated frontend test coverage around asynchronous behavior.

In particular, I would add or strengthen tests for:

* visitor-list loading;
* visitor-list empty state;
* visitor-list API errors;
* registration success;
* registration API errors;
* repeated registration attempts;
* pagination;
* deactivated visitors;
* timezone-sensitive timestamps.

I would also review the API/client contract more extensively to ensure consistent error handling across all API requests.

---

## 10. Final Notes

The frontend changes were focused on the defects identified during application testing and on the explicit loading, empty, and error-state requirements.
I avoided changing behavior that was not specified by the assessment and treated ambiguous behavior as an open question rather than automatically classifying it as a defect.
