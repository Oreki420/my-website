const form = document.querySelector("form");
const emailField = document.querySelector("input[name='email']");
const messageField = document.querySelector("textarea[name='message']");

// ----- Spam filters -----
let submitTimes = []; // rate limiting timestamps
const formLoadTime = Date.now(); // too-fast check

const spamWords = ["free money", "buy now", "click here", "subscribe", "promo"];

function isRateLimited() {
  const now = Date.now();
  submitTimes = submitTimes.filter(t => now - t < 60000); // last 60s
  if (submitTimes.length >= 3) return true;
  submitTimes.push(now);
  return false;
}

function isTooFast() {
  const secondsTaken = (Date.now() - formLoadTime) / 1000;
  return secondsTaken < 2;
}

function containsSpam(message) {
  const lower = message.toLowerCase();
  return spamWords.some(word => lower.includes(word));
}

// ----- UI feedback helpers -----
function markInvalid(el, msg) {
  el.style.outline = "2px solid crimson";
  el.style.outlineOffset = "2px";
  alert(msg);
}

function clearInvalid(el) {
  el.style.outline = "none";
  el.style.outlineOffset = "0";
}

// Clear invalid styling as user types
emailField?.addEventListener("input", () => clearInvalid(emailField));
messageField?.addEventListener("input", () => clearInvalid(messageField));

form.addEventListener("submit", function (e) {
  // Rate limiting
  if (isRateLimited()) {
    e.preventDefault();
    alert("Too many submissions. Please wait a minute.");
    return;
  }

  // Too fast
  if (isTooFast()) {
    e.preventDefault();
    alert("Submission was too fast. Please try again.");
    return;
  }

  // Email validation
  if (!emailField.value.includes("@")) {
    e.preventDefault();
    markInvalid(emailField, "Enter a valid email.");
    return;
  }

  // Spam keyword detection
  const msg = messageField.value || "";
  if (containsSpam(msg)) {
    e.preventDefault();
    markInvalid(messageField, "Your message contains blocked spam keywords.");
    return;
  }

  // If everything passes, allow submit to FormSubmit
  alert("Message sent! Thank you.");
});
