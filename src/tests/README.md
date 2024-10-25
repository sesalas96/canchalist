# Tests

This folder contains all testing-related resources for the project. It is organized to facilitate the creation, management, and execution of tests, ensuring the quality and reliability of the application. Including:

-   testApp: a testing version of the app, configured with everything necessary to perform unit tests on it (be aware that some changes in the app.ts might need to be replicated in the test app)
-   mocks: mock data and service stubs used to simulate external dependencies during testing, allowing for isolated tests without the need for real integrations

```
tests
├── __mocks__
│   ├── service
│   └── other-service
├── index.ts
└── test-app.ts
```
