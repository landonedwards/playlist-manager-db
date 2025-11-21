import { signIn, signUp } from "./auth.js";

const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

const loginButton = document.querySelector("#login");
const signupButton = document.querySelector("#signup");

signupButton.addEventListener("click", () => {
    signUp(emailInput.value, passwordInput.value);
})

loginButton.addEventListener("click", () => {
    signIn(emailInput.value, passwordInput.value);
})