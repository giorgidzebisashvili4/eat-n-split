console.log('Hello from the parsely console!');
/* eslint-disable */

import '@babel/polyfill';
import { login } from './login.js';

// DOM
const loginForm = document.querySelector('.form');

// VALUES

// document.querySelector('.form').addEventListener('submit', (e) => {
//   e.preventDefault();
//   const email = document.getElementById('email').value;
//   const password = document.getElementById('password').value;

//   login(email, password);
// });

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password);
    login(email, password);
  });
}
