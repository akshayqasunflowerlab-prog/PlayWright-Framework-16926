# New Test Case Validation Rule

Whenever a new test case is added, run both validation checks before considering the change complete:

```powershell
npm run typecheck
npm run lint
```

A new test case must not be considered ready until both commands pass successfully.
