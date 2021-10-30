# TODO and Improvements

What is missing? 

- On the server we can look into caching, even though transient dependencies can resolve, we can apply simple cache with TTL
- Improve UI implementation, add validation for package name, or better input strategy (e.g. autocomplete for packages)
- Performance tests to validate that it will scale with traffic (which needs to be defined)
- Additional tests on server & UI, with also set of happy path e2e tests
- Production setup should use healthcheck endpoints 
