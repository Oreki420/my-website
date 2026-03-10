const form = document.getElementById("contactForm");
const emailField = document.getElementById("email");
const messageField = document.getElementById("message");

const spamWords = ["free money", "buy now", "click here", "subscribe", "promo"];
const MAX_SUBMISSIONS = 3;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MIN_FILL_TIME = 2000; // 2 seconds

const FORM_LOAD_KEY = "portfolio_form_load_time";
const SUBMIT_TIMES_KEY = "portfolio_submit_times";
const LAST_MESSAGE_KEY = "portfolio_last_message";

sessionStorage.setItem(FORM_LOAD_KEY, Date.now().toString());

function getSubmitTimes() {
  try {
    return JSON.parse(localStorage.getItem(SUBMIT_TIMES_KEY)) || [];
  } catch {
    return [];
  }
}

function saveSubmitTimes(times) {
  localStorage.setItem(SUBMIT_TIMES_KEY, JSON.stringify(times));
}

function isRateLimited() {
  const now = Date.now();
  let times = getSubmitTimes().filter((t) => now - t < RATE_LIMIT_WINDOW);

  if (times.length >= MAX_SUBMISSIONS) {
    saveSubmitTimes(times);
    return true;
  }

  times.push(now);
  saveSubmitTimes(times);
  return false;
}

function isTooFast() {
  const loadTime = Number(sessionStorage.getItem(FORM_LOAD_KEY)) || Date.now();
  return Date.now() - loadTime < MIN_FILL_TIME;
}

function containsSpam(message) {
  const lower = message.toLowerCase();
  return spamWords.some((word) => lower.includes(word));
}

function isRepeatedMessage(message) {
  const lastMessage = (localStorage.getItem(LAST_MESSAGE_KEY) || "").trim().toLowerCase();
  return lastMessage && lastMessage === message.trim().toLowerCase();
}

function saveLastMessage(message) {
  localStorage.setItem(LAST_MESSAGE_KEY, message.trim().toLowerCase());
}

function markInvalid(el, msg) {
  if (el) {
    el.style.outline = "2px solid crimson";
    el.style.outlineOffset = "2px";
  }
  alert(msg);
}

function clearInvalid(el) {
  if (el) {
    el.style.outline = "none";
    el.style.outlineOffset = "0";
  }
}

emailField?.addEventListener("input", () => clearInvalid(emailField));
messageField?.addEventListener("input", () => clearInvalid(messageField));

form?.addEventListener("submit", function (e) {
  const email = emailField.value.trim();
  const message = messageField.value.trim();

  if (isTooFast()) {
    e.preventDefault();
    alert("Submission was too fast. Please take a moment before sending.");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    e.preventDefault();
    markInvalid(emailField, "Enter a valid email address.");
    return;
  }

  if (containsSpam(message)) {
    e.preventDefault();
    markInvalid(messageField, "Your message contains blocked spam keywords.");
    return;
  }

  if (isRepeatedMessage(message)) {
    e.preventDefault();
    markInvalid(messageField, "You already sent the same message. Please edit it before sending again.");
    return;
  }

  if (isRateLimited()) {
    e.preventDefault();
    alert("Too many submissions. Please wait a minute before sending again.");
    return;
  }

  saveLastMessage(message);
  alert("Message sent! Thank you.");
});