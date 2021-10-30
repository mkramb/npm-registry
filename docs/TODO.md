# TODO and Improvements

What is missing?

- Improve UI implementation, add validation for package name, or better input strategy (e.g. autocomplete for package)
- On the server even though transient dependencies can be updated, we can apply simple cache with TTL
- Performance tests to validate that it will scale with traffic (which needs to be defined)
- API rate limiting (should be configured on the infrastructure), to prevent DoS attacks
- Production setup should utilize healthcheck endpoints (to determine if pod needs to be restarted)
- Additional tests on server & UI (currently no tests), with also set of happy path e2e tests
