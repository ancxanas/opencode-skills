------
{% raw %}
-----------|-----------|--------------|
| Invalid input | 400 | "Please check your input" |
| Unauthorized | 401 | "Please log in to continue" |
| Forbidden | 403 | "You don't have permission" |
| Not found | 404 | "Resource not found" |
| Conflict | 409 | "This already exists" |

## Implementation TODO

### Backend
- [ ] Create database migration for X table
- [ ] Implement X service with Y method
- [ ] Add API endpoint POST /api/x
- [ ] Add input validation schema
- [ ] Add authorization check

### Frontend
- [ ] Create X component
- [ ] Add form with validation
- [ ] Implement API integration
- [ ] Add loading/error states
- [ ] Add success feedback

### Testing
- [ ] Unit tests for X service
- [ ] Integration tests for API endpoint
- [ ] E2E test for complete user flow

## Out of Scope
- [Feature/capability explicitly not included]
- [Future enhancement to consider later]

## Open Questions
- [ ] [Question needing stakeholder input]
- [ ] [Technical decision pending]
```

## Save Location

Save as: `specs/{feature_name}.spec.md`

## Required Sections Checklist

| Section | Purpose | Required |
|---------|---------|----------|
| Overview | Quick understanding | Yes |
| Functional Requirements | What it does | Yes |
| Non-Functional Requirements | How well it does it | Yes |
| Acceptance Criteria | How to verify | Yes |
| Error Handling | Failure cases | Yes |
| Implementation TODO | Action items | Yes |
| Out of Scope | Prevent scope creep | Recommended |
| Open Questions | Track decisions | As needed |

{% endraw %}
