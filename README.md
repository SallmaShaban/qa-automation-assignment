# QA Automation Assignment - Sauce Demo & REST API Testing

A comprehensive automation project demonstrating UI testing with Playwright and API testing with Postman/Newman for a mid-level QA automation engineer role.

## Project Structure

```
.
├── src/
│   ├── pages/              # Page Object Model classes
│   │   ├── BasePage.ts     # Base class for all pages
│   │   ├── LoginPage.ts    # Login page interactions
│   │   ├── InventoryPage.ts # Product inventory page
│   │   ├── CartPage.ts     # Shopping cart page
│   │   ├── CheckoutPage.ts # Checkout flow pages
│   │   └── index.ts        # Page object exports
│   └── config/
│       └── config.ts       # Test configuration, credentials, constants
├── tests/
│   └── ui/
│       ├── authentication.spec.ts # Login tests
│       ├── shopping-cart.spec.ts  # Cart management tests
│       ├── checkout.spec.ts       # Checkout flow tests
│       └── sorting.spec.ts        # Product sorting tests
├── postman/
│   ├── RestfulAPI.postman_collection.json # API test collection
│   └── RestfulAPI.postman_environment.json # Environment variables
├── playwright.config.ts      # Playwright configuration
├── package.json             # Project dependencies
├── README.md               # This file
└── NOTES.md                # Design decisions and technical notes
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Playwright browsers (installed automatically)
- Newman (for API test execution)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

## Configuration

### Credentials
Test credentials are stored in `src/config/config.ts`:
- **Standard User**: `standard_user` / `secret_sauce`
- **Locked-out User**: `locked_out_user` / `secret_sauce`

### Environment
- **Base URL**: `https://www.saucedemo.com`
- **API Base URL**: `https://api.restful-api.dev`

## Running Tests

### UI Tests (Playwright)

Run all UI tests:
```bash
npm run test
```

Run tests in headed mode (see browser):
```bash
npm run test:headed
```

Run tests in debug mode:
```bash
npm run test:debug
```

View test report after execution:
```bash
npm run test:report
```

### API Tests (Newman)

Run Postman collection via Newman:
```bash
npm run api:test
```

Generate HTML report:
```bash
npm run api:test:html
```

## Test Coverage

### UI Tests (Playwright)

**Authentication Tests**
- TC001: Successful login with standard user
- TC002: Failed login with locked-out user and error message verification

**Shopping Cart Tests**
- TC003: Add two products to cart
- TC004: Remove one product and verify cart contents

**Checkout Tests**
- TC005: Complete full checkout flow and verify order confirmation

**Sorting Tests**
- TC006: Sort products by price (low to high) and verify results

### API Tests (Newman)

**RESTful API Tests**
1. POST - Create new object and verify response
2. GET - Retrieve created object and verify data
3. PUT - Update object property and verify update
4. DELETE - Delete object
5. GET - Verify deleted object returns expected error
6. Negative Test - Invalid object ID returns 404 error

## Page Object Model Architecture

The project uses the Page Object Model (POM) pattern for maintainability and reusability:

- **BasePage**: Base class providing common functionality
- **LoginPage**: Handles login operations and error validation
- **InventoryPage**: Manages product browsing and sorting
- **CartPage**: Handles cart operations (add, remove, checkout)
- **CheckoutPage**: Manages checkout flow across multiple steps

## Playwright Features Used

- **Locators**: Stable, resilient element selection using `data-test` attributes
- **Waiting Mechanisms**: Built-in waits instead of hard-coded sleeps
- **Screenshots/Video**: Captured on test failures for debugging
- **HTML Reporter**: Comprehensive test execution reports
- **Trace Viewer**: Detailed execution traces for failed tests

## Postman Features Used

- **Collection Variables**: Store and reuse object IDs across requests
- **Test Scripts**: Pre-configured assertions for each API endpoint
- **Execution Flow**: Requests organized in logical sequence
- **Environment Variables**: Base URL and dynamic values management

## Key Design Decisions

1. **Page Object Model**: Centralizes element locators and actions, reducing code duplication
2. **Configuration File**: Separates test data from test logic for easy maintenance
3. **Data-Test Attributes**: Uses stable selectors instead of CSS/XPath for reliability
4. **Built-in Waits**: Leverages Playwright's automatic waiting to avoid flaky tests
5. **Organized Structure**: Separate folders for UI and API tests for clarity

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Install dependencies
  run: npm install

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run UI tests
  run: npm run test

- name: Run API tests
  run: npm run api:test

- name: Upload test results
  uses: actions/upload-artifact@v2
  if: always()
  with:
    name: test-results
    path: |
      playwright-report/
      test-results/
```

## Troubleshooting

### Tests timing out
- Increase timeout values in `playwright.config.ts`
- Check internet connection for application availability

### Locator not found errors
- Verify element selectors match current application DOM
- Use `--debug` mode to inspect elements interactively

### API tests failing
- Ensure REST API is accessible: `https://api.restful-api.dev`
- Verify Postman collection variables are properly set

## Reports

- **Playwright HTML Report**: Generated in `playwright-report/` directory
- **Newman Report**: Generated in `test-results/` directory after API test run

Open reports with:
```bash
npx playwright show-report
```

## Best Practices Implemented

✓ No hard-coded waits (sleep/timeout)  
✓ Page Object Model pattern  
✓ Externalized test data and credentials  
✓ Independent, order-agnostic tests  
✓ Meaningful test names and descriptions  
✓ Proper error handling and assertions  
✓ Screenshot/video on failures  
✓ HTML test reports  
✓ Clean project structure  
✓ Comprehensive documentation

## Support

For issues or questions, refer to:
- [Playwright Documentation](https://playwright.dev)
- [Postman Documentation](https://learning.postman.com)
- [Newman Documentation](https://github.com/postmanlabs/newman)

---

**Assignment Submission**: This project demonstrates professional-grade QA automation practices with focus on maintainability, reliability, and technical reasoning over volume of test cases.
