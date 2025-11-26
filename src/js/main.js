import { signIn, signUp } from "./auth.js";

const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

const loginButton = document.querySelector("#login");
const signupButton = document.querySelector("#signup");

// A simple message box
const message = document.querySelector("#message");

function showMessage(text, type = "info") {
  message.textContent = text;
  message.style.color = type === "error" ? "red" : "green";
}

signupButton.addEventListener("click", async () => {
  const { error } = await signUp(emailInput.value, passwordInput.value);

  if (error) {
    showMessage(error.message, "error");
  } else {
    showMessage("Account created successfully! Please check your email.");
  }
});

loginButton.addEventListener("click", async () => {
  const { error } = await signIn(emailInput.value, passwordInput.value);

  if (error) {
    showMessage(error.message, "error");
  } else {
    showMessage("Login successful! Redirecting...");
    setTimeout(() => {
      window.location.href = "/src/pages/dashboard.html";
    }, 800);
  }
});
