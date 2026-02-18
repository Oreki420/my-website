console.log("Website loaded successfully.");


// ===============================
// Lab 6 - Exercise 2 (Part 2)
// a) Log form input values to console
// b) Greeting by hour
// c) Live digital clock (updates every second)
// ===============================

(function () {
  // ---- Greeting + clock helpers ----
  function pad(n) { return String(n).padStart(2, "0"); }

  function getGreeting(hour) {
    if (hour >= 5 && hour < 12) return "Good Morning!";
    if (hour >= 12 && hour < 17) return "Good Afternoon!";
    if (hour >= 17 && hour < 21) return "Good Evening!";
    return "Good Night!";
  }

  function updateClock() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    const timeEl = document.getElementById("clockTime");
    const dateEl = document.getElementById("clockDate");
    const greetEl = document.getElementById("clockGreet");

    if (timeEl) timeEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;

    if (dateEl) {
      const weekday = now.toLocaleString(undefined, { weekday: "long" });
      const month = now.toLocaleString(undefined, { month: "long" });
      const day = now.getDate();
      const year = now.getFullYear();
      dateEl.textContent = `${weekday}, ${month} ${day}, ${year}`;
    }

    if (greetEl) greetEl.textContent = getGreeting(h);
  }

  // Run clock immediately and every second
  updateClock();
  setInterval(updateClock, 1000);

  // Show greeting once per page load (counts for Exercise 2b)
  try {
    const hour = new Date().getHours();
    alert(getGreeting(hour));
  } catch (e) { /* ignore */ }

  // ---- Form logging (Exercise 2a) ----
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // prevents page refresh so you can screenshot console

      const fullName = document.getElementById("fullName")?.value || "";
      const email = document.getElementById("email")?.value || "";
      const topic = document.getElementById("topic")?.value || "";
      const message = document.getElementById("message")?.value || "";

      console.log("=== Contact Form Values ===");
      console.log("Full Name:", fullName);
      console.log("Email:", email);
      console.log("Topic:", topic);
      console.log("Message:", message);
      console.log("===========================");

      alert("Form values logged in the console (Press F12 → Console).");
    });
  }
})();
