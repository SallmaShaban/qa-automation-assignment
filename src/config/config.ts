/**
 * Configuration file for test credentials and endpoints
 */

export const CREDENTIALS = {
  VALID_USER: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  LOCKED_OUT_USER: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
};

export const BASE_URL = 'https://www.saucedemo.com';

export const PRODUCTS = {
  BACKPACK: {
    id: 'add-to-cart-sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    price: 29.99,
  },
  BIKE_LIGHT: {
    id: 'add-to-cart-sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light',
    price: 9.99,
  },
  BOLT_T_SHIRT: {
    id: 'add-to-cart-sauce-labs-bolt-t-shirt',
    name: 'Sauce Labs Bolt T-Shirt',
    price: 15.99,
  },
  FLEECE_JACKET: {
    id: 'add-to-cart-sauce-labs-fleece-jacket',
    name: 'Sauce Labs Fleece Jacket',
    price: 49.99,
  },
  ONESIE: {
    id: 'add-to-cart-sauce-labs-onesie',
    name: 'Sauce Labs Onesie',
    price: 7.99,
  },
  T_SHIRT_RED: {
    id: 'add-to-cart-test-allthethings-t-shirt-red',
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99,
  },
};

export const ERROR_MESSAGES = {
  LOCKED_OUT: 'Sorry, this user has been locked out.',
  INVALID_CREDENTIALS: 'Username and password do not match any user in this service',
};

export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
};
