# Backend Notes

## 1. Why I Selected These Three Defects

## 1. Selected Defects

I selected three server-side defects based on their impact on the core visitor check-in workflow.

### DEF-[ID-1] — [Defect title]

**Why I selected it:**
This defect affects [visitor registration / active visitor list / checkout / deactivation / repeat visits]. It can result in [brief impact].

**Fix implemented:**
I updated the backend logic so that [describe the actual change].

**Request spec:**
I added a request spec covering this behavior. The spec:

1. Creates the required test data.
2. Sends the relevant API request.
3. Checks the HTTP response.
4. Checks the response data/database state.
5. Confirms the expected behavior.

The spec **failed against the original `main` branch** and **passes after the fix**.

---

### DEF-[ID-2] — [Defect title]

**Why I selected it:**
This defect affects [brief impact].

**Fix implemented:**
I changed [controller/model/query/service/etc.] so that service work ok.

**Request spec:**
I added a request spec that reproduces the original problem and confirms the corrected behavior.

The spec **failed against the original `main` branch** and **passes after the fix**.

---

### DEF-[ID-3] — [Defect title]

**Why I selected it:**
This defect affects [brief impact].

**Fix implemented:**
I changed [backend component] to [brief explanation].

**Request spec:**
I added a request spec covering the defect and its expected behavior.

The spec **failed against the original `main` branch** and **passes after the fix**.

---



## 2. Performance Measurement

### Performance defect addressed

[If one of the selected defects is a performance defect, describe it here.]

**Methodology:**

* Environment: [local development environment]
* Dataset size: [number of records]
* Endpoint tested: `[HTTP method and endpoint]`
* Number of requests/tests: [number]
* Measurement method: [Rails logs / query count / benchmark / request timing]
* Main measurement: [response time / SQL query count / other]

### Before fix

* Response time: [actual measurement]
* SQL queries: [actual measurement, if measured]
* Other observation: [actual observation]

### After fix

* Response time: [actual measurement]
* SQL queries: [actual measurement, if measured]
* Other observation: [actual observation]

The measurements were taken using the same environment and test conditions before and after the change.

[If no performance defect was identified, write:]

> I did not identify a reproducible performance defect during testing. Therefore, I did not fabricate performance measurements or make an unrelated performance change solely to satisfy this section.

---

## 3. Request Specs

I added one request spec for each selected backend defect.
For each defect, I first ran the corresponding spec against the original implementation to confirm that the test failed.
After implementing the fix, I ran the same spec again and confirmed that it passed.

### DEF-001

Original implementation: [FAIL — actual result]
Updated implementation: [PASS — actual result]
Test file:

`[actual test file path]`

### DEF-002

Original implementation: [FAIL — actual result]
Updated implementation: [PASS — actual result]
Test file:

`[actual test file path]`

### DEF-003

Original implementation: [FAIL — actual result]
Updated implementation: [PASS — actual result]
Test file:

`[actual test file path]`

---

## 4. Performance Measurements

### Measurement Methodology

I measured [endpoint/operation] before and after the relevant fix.

**Endpoint/operation:**
`[actual endpoint]`

**Dataset:**
[Actual number and type of records used.]

**Environment:**
[Local development environment / other actual environment.]

**Measurement method:**
[Describe exactly how you measured response time/query count/etc.]

**Number of measurements:**
[Actual number.]

### Before the Fix

**Average response time:**
[Actual measurement]

**Database queries:**
[Actual measurement, if applicable]

**Other observations:**
[Actual observations.]

### After the Fix

**Average response time:**
[Actual measurement]

**Database queries:**
[Actual measurement, if applicable]

**Other observations:**
[Actual observations.]

The same environment, endpoint, and dataset were used for the before-and-after comparison.

If no performance defect was identified, no performance-specific defect was artificially introduced or claimed.

---

## 6. API Response Structure

The backend fixes were implemented without changing the existing API response structure wherever possible.
[If none of your fixes changed the API response, keep the above statement.]
[If one of your fixes changed the API response, replace this section with a description of the exact response change and why it was necessary.]
The effect of the changes on existing API consumers was also considered.

> The fixes do not intentionally change the existing API response structure. Existing fields and response formats were preserved so that the frontend does not need to change its API contract.

**If response structure changed:**

> One of the fixes changes the API response structure. The change is [describe the change] because [reason]. The affected frontend/API consumers were checked to ensure they continue to handle the response correctly.

---

## 7. Testing

The backend test suite was run after the changes.

Command:

```bash
bundle exec rspec
```

Result:
The request specs cover:
The three request specs corresponding to the selected defects pass against the updated implementation.

* Expected HTTP responses
* Relevant database/state changes
* Important edge cases related to the fixes

I tested the backend changes using the project's existing test setup.
All newly added tests pass after the fixes.

---

## 8. Final Notes

The changes were intentionally limited to the identified server-side defects and their required tests.
Behavior that was not explicitly defined by the assessment was not changed solely based on assumptions.
The main goal of the backend changes was to make the smallest reasonable changes that correct the identified defects while preserving the existing API behavior and application requirements.
I also avoided changing behavior that was not clearly specified by the assessment requirements.
