# Sauce Demo QA Automation Test Plan

## Application Overview

Comprehensive test plan for Sauce Demo e-commerce application (https://www.saucedemo.com/). The application is a test e-commerce site that simulates product shopping, cart management, and checkout flow. Tests cover authentication, shopping cart operations, checkout processes, product sorting, and error handling scenarios.

## Test Scenarios

### 1. Authentication Tests

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC001: Successful login with standard user

**File:** `tests/ui/authentication.spec.ts`

**Steps:**
  1. Navigate to login page at https://www.saucedemo.com
    - expect: Login page is displayed
    - expect: Username and password input fields are visible
    - expect: Login button is present
  2. Enter 'standard_user' in the username field
    - expect: Username field contains 'standard_user'
  3. Enter 'secret_sauce' in the password field
    - expect: Password field contains the entered password (masked)
  4. Click the Login button
    - expect: User is redirected to inventory page (URL contains /inventory)
    - expect: Products are displayed on the page
    - expect: Shopping cart icon is visible

#### 1.2. TC002: Failed login with locked-out user

**File:** `tests/ui/authentication.spec.ts`

**Steps:**
  1. Navigate to login page at https://www.saucedemo.com
    - expect: Login page is displayed with credentials information visible
  2. Enter 'locked_out_user' in the username field
    - expect: Username field contains 'locked_out_user'
  3. Enter 'secret_sauce' in the password field
    - expect: Password field contains the entered password (masked)
  4. Click the Login button
    - expect: User remains on login page (URL does not change)
    - expect: Error message is displayed
    - expect: Error message contains 'Sorry, this user has been locked out'
    - expect: Error message is clearly visible in red/prominent styling

### 2. Shopping Cart Tests

**Seed:** `tests/seed.spec.ts`

#### 2.1. TC003: Add two specific products to the cart

**File:** `tests/ui/shopping-cart.spec.ts`

**Steps:**
  1. Log in with valid credentials (standard_user/secret_sauce)
    - expect: Inventory page is displayed
  2. Click 'Add to Cart' button for 'Sauce Labs Backpack'
    - expect: Button changes to 'Remove'
    - expect: Cart badge appears with count '1'
    - expect: Product is added to cart
  3. Click 'Add to Cart' button for 'Sauce Labs Bike Light'
    - expect: Button changes to 'Remove'
    - expect: Cart badge updates to count '2'
    - expect: Both products are in cart
  4. Verify cart contains 2 items
    - expect: Shopping cart badge shows '2'
    - expect: Cart icon is visible and clickable

#### 2.2. TC004: Remove one product and verify cart contents

**File:** `tests/ui/shopping-cart.spec.ts`

**Steps:**
  1. Add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light' to cart
    - expect: Both items added successfully
    - expect: Cart count shows 2
  2. Click on shopping cart icon to navigate to cart page
    - expect: Cart page is displayed (URL contains /cart)
    - expect: Page shows 'Your Cart' heading
    - expect: Both items are listed in the cart
  3. Click 'Remove' button next to 'Sauce Labs Backpack'
    - expect: Backpack is removed from cart
    - expect: Cart count decreases to 1
    - expect: Only 'Sauce Labs Bike Light' remains in cart
  4. Verify final cart state
    - expect: Cart displays only 1 item
    - expect: Bike Light product name is visible
    - expect: Correct price ($9.99) is displayed

#### 2.3. TC005: Complete the checkout flow and verify confirmation

**File:** `tests/ui/checkout.spec.ts`

**Steps:**
  1. Log in and add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light' to cart
    - expect: Both items added to cart successfully
    - expect: Cart count shows 2
  2. Navigate to cart page
    - expect: Cart page displays both items
  3. Click 'Checkout' button
    - expect: Checkout page (Step 1) is displayed
    - expect: Page shows 'Checkout: Your Information' heading
    - expect: First Name, Last Name, and Zip/Postal Code input fields are visible
  4. Fill in checkout form with: First Name='John', Last Name='Doe', Zip='12345'
    - expect: All fields are filled with entered values
  5. Click 'Continue' button
    - expect: User progresses to Checkout Step 2
    - expect: Page displays order summary with items and prices
  6. Review order summary on Step 2
    - expect: Both items are listed in summary
    - expect: Item prices are correct (Backpack $29.99, Bike Light $9.99)
    - expect: Subtotal, tax, and total are calculated and displayed
  7. Click 'Finish' button to complete purchase
    - expect: Order confirmation page is displayed
    - expect: Page shows success message (e.g., 'Thank you for your order')
    - expect: Order number or confirmation details are visible
    - expect: 'Back Home' button is available

#### 2.4. TC006: Sort products by Price (Low to High)

**File:** `tests/ui/sorting.spec.ts`

**Steps:**
  1. Log in with standard_user credentials
    - expect: Inventory page is displayed with 6 products
  2. Click on sort dropdown currently showing 'Name (A to Z)'
    - expect: Dropdown opens showing sort options: 'Name (A to Z)', 'Name (Z to A)', 'Price (low to high)', 'Price (high to low)'
  3. Select 'Price (low to high)' option
    - expect: Dropdown closes
    - expect: Products are reordered by price from lowest to highest
  4. Verify product prices are in ascending order
    - expect: First product shown: Onesie ($7.99)
    - expect: Second product shown: Bike Light ($9.99)
    - expect: Third product shown: Bolt T-Shirt ($15.99)
    - expect: Fourth product shown: T-Shirt Red ($15.99)
    - expect: Fifth product shown: Backpack ($29.99)
    - expect: Sixth product shown: Fleece Jacket ($49.99)

### 3. Error Handling Tests

**Seed:** `tests/seed.spec.ts`

#### 3.1. TC007: Validate error when leaving checkout fields blank

**File:** `tests/ui/checkout.spec.ts`

**Steps:**
  1. Log in and add any product to cart
    - expect: Product added to cart
  2. Navigate to cart and click 'Checkout'
    - expect: Checkout Step 1 page is displayed
  3. Leave all fields blank (First Name, Last Name, Zip/Postal Code)
    - expect: Input fields are empty
  4. Click 'Continue' button without filling any fields
    - expect: Error message is displayed
    - expect: Error message indicates which field(s) are required or invalid
    - expect: User remains on Checkout Step 1 page
    - expect: Continue button is still visible for retry

#### 3.2. TC008: Product persistence in cart after logout and login

**File:** `tests/ui/shopping-cart.spec.ts`

**Steps:**
  1. Log in with standard_user credentials
    - expect: Inventory page is displayed
  2. Add 'Sauce Labs Backpack' to cart
    - expect: Product added to cart
    - expect: Cart count shows 1
  3. Click menu and select 'Logout'
    - expect: User is redirected to login page
    - expect: Login form is displayed
  4. Log in again with same credentials
    - expect: User is logged in
    - expect: Inventory page is displayed
  5. Check shopping cart
    - expect: Cart is empty (application state reset after logout)
    - expect: This behavior may vary - verify actual application behavior

#### 3.3. TC009: Sort by Price (High to Low)

**File:** `tests/ui/sorting.spec.ts`

**Steps:**
  1. Log in and navigate to inventory page
    - expect: Inventory page is displayed
  2. Click sort dropdown and select 'Price (high to low)'
    - expect: Products are sorted by price from highest to lowest
  3. Verify products are in descending price order
    - expect: First product: Fleece Jacket ($49.99)
    - expect: Last product: Onesie ($7.99)
    - expect: All prices decrease from left to right

#### 3.4. TC010: Sort by Name (A to Z)

**File:** `tests/ui/sorting.spec.ts`

**Steps:**
  1. Log in and navigate to inventory page
    - expect: Inventory page is displayed with products in default order
  2. Click sort dropdown and select 'Name (A to Z)'
    - expect: Products are sorted alphabetically by name from A to Z
  3. Verify product names are in alphabetical order
    - expect: First product: Sauce Labs Backpack
    - expect: Second product: Sauce Labs Bike Light
    - expect: Products are ordered A to Z

#### 3.5. TC011: Sort by Name (Z to A)

**File:** `tests/ui/sorting.spec.ts`

**Steps:**
  1. Log in and navigate to inventory page
    - expect: Inventory page is displayed
  2. Click sort dropdown and select 'Name (Z to A)'
    - expect: Products are sorted alphabetically in reverse order
  3. Verify products are in reverse alphabetical order
    - expect: First product starts with letter later in alphabet
    - expect: Last product starts with letter earlier in alphabet
    - expect: Products ordered Z to A
