# QA Notes

## 1. Highest-Risk Area

The highest-risk area of the visitor check-in feature is the **visitor lifecycle and status management**, particularly the interaction between registration, active visits, checkout, deactivation, and repeat visits.

This area has several related states:

* A visitor can be registered.
* A registered visitor becomes part of the active visitor list.
* A visitor can be checked out.
* An administrator can deactivate a visitor.
* A deactivated visitor must not appear in the active visitor list.
* A deactivated visitor must not be selectable for repeat visits.

A defect in one part of this lifecycle can cause incorrect visitor visibility or allow an operation that should not be permitted. For example, simply hiding a deactivated visitor in the frontend would not be sufficient if the backend still allowed that visitor to be registered again.

For this reason, I would prioritize end-to-end testing of visitor status transitions and the rules governing repeat visits before sign-off.

---

## 2. Product Owner Question Before Sign-Off

**Question:**

> When a visitor has been checked out but has not been deactivated, should that visitor always remain eligible for a future repeat visit, and are there any additional business rules that should prevent a checked-out visitor from being registered again?

### Why I would ask this

The requirements explicitly distinguish between checking out a visitor and deactivating a visitor. They also specify that deactivated visitors must not be selectable for repeat visits.

I would confirm the intended behavior for checked-out but still active/eligible visitor records before sign-off so that the implementation and test cases reflect the Product Owner's expected business rule rather than making an assumption.
