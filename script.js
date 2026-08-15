// ---------- LOGIN CHECK HELPER ----------
function requireLogin() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn !== "true") {
    alert("Please login to continue.");
    localStorage.setItem("redirectAfterLogin", window.location.pathname);
    window.location.href = "profile.html";
    return false;
  }
  return true;
}

// ---------- MENU DATA ----------
const menuItems = [
  { id: 1, name: "Cheese Burger", price: 99, img: "Cheeseburger.png" },
  { id: 2, name: "Pepperoni Pizza", price: 149, img: "5e18444867ea43289ede844dabc27917.webp" },
  { id: 3, name: "Creamy Pasta", price: 79, img: "OIP.jpg" },
  { id: 4, name: "Crispy Fries", price: 49, img: "oven-fries-square.jpeg" },
  { id: 5, name: "Veg Sandwich", price: 59, img: "OIP (1).jpg" },
  { id: 6, name: "Grilled Chicken", price: 179, img: "grill.jpg" },
  { id: 7, name: "Tandoori Wrap", price: 89, img: "62194857.jpg" },
  { id: 8, name: "Chocolate Shake", price: 69, img: "chocolate.jpg" },
  { id: 9, name: "Cold Coffee", price: 79, img: "Cold-Coffee.webp" },
  { id: 10, name: "Veggie Pizza", price: 129, img: "IMG_5449.webp" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let activeOrder = JSON.parse(localStorage.getItem("activeOrder")) || null;

// ---------- MENU PAGE ----------
if (document.getElementById("menuList")) {
  const menuList = document.getElementById("menuList");
  menuItems.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("menu-item");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.price}rs</p>
      <button onclick="addToCart(${item.id})">Add to Cart</button>
    `;
    menuList.appendChild(div);
  });
}

// ---------- ADD TO CART ----------
function addToCart(id) {
  if (!requireLogin()) return; // 🔒 Check login first

  const item = menuItems.find(i => i.id === id);
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${item.name} added to your cart!`);
}


// ---------- ORDER PAGE ----------
if (document.getElementById("orderList")) {
  updateOrderList();
}

function updateOrderList() {
  const orderList = document.getElementById("orderList");
  orderList.innerHTML = "";

  if (cart.length === 0) {
    orderList.innerHTML = "<p>No items in your cart.</p>";
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;

    const div = document.createElement("div");
    div.classList.add("order-card");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>Price: ${item.price.toFixed(2)}rs</p>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    orderList.appendChild(div);
  });

  const totalDiv = document.createElement("div");
  totalDiv.innerHTML = `<h3>Total: ${total.toFixed(2)}rs</h3>`;
  orderList.appendChild(totalDiv);
}

// ---------- REMOVE SINGLE ITEM ----------
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateOrderList();
  alert("Item removed from cart!");
}

// ---------- CLEAR ENTIRE CART ----------
function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  updateOrderList();
  alert("Your cart has been cleared!");
}

// ---------- PLACE ORDER ----------
function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  activeOrder = { items: cart, status: "Order placed" };
  localStorage.setItem("activeOrder", JSON.stringify(activeOrder));
  cart = [];
  localStorage.removeItem("cart");
  updateOrderList();
  alert("Order placed! Go to Track page to follow your order.");
  window.location.href = "track.html";
}


// ---------- PLACE ORDER ----------
function placeOrder() {
  if (!requireLogin()) return; // 🔒 Check login first

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Save cart temporarily before address confirmation
  localStorage.setItem("pendingOrder", JSON.stringify(cart));

  // Redirect to address page
  window.location.href = "address.html";
}


// ---------- TRACK PAGE ----------
if (document.getElementById("trackingContainer")) {
  const tracking = document.getElementById("trackingStatus");
  const steps = [
    "🛒 Order Received",
    "👨‍🍳 Preparing",
    "📦 Packed",
    "🚚 Out for Delivery",
    "🍽️ Delivered"
  ];
  
  if (!activeOrder) {
    tracking.textContent = "No active orders to track.";
  } else {
    tracking.textContent = "Tracking your order...";

    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        // Update status text
        tracking.textContent = steps[step];

        // Highlight active step
        const currentStep = document.getElementById(`step${step + 1}`);
        if (currentStep) currentStep.classList.add("active");

        step++;
      } else {
        clearInterval(interval);
        tracking.textContent = "Order Delivered Successfully! 🎉";
        localStorage.removeItem("activeOrder");
      }
    }, 2500); // updates every 2.5 seconds
  }
}
// ---------- OFFERS DATA ----------
const offers = [
  { id: 1, title: "🍕 Buy 1 Get 1 Pizza!", desc: "Order one Pepperoni Pizza and get another free!", img: "5e18444867ea43289ede844dabc27917.webp" },
  { id: 2, title: "🍔 20% Off Burgers", desc: "Get 20% off all burgers every weekend!", img: "Cheeseburger.png" },
  { id: 3, title: "🥤 Free Drink", desc: "Get a free drink on orders above ₹199!", img: "soft-drinks-water-splashes-color-natural-black-background_1091270-8936.jpg" }
];

// ---------- DASHBOARD OFFERS ----------
if (document.getElementById("offerList")) {
  const offerList = document.getElementById("offerList");
  offers.forEach(offer => {
    const div = document.createElement("div");
    div.classList.add("offer-card");
    div.innerHTML = `
      <img src="${offer.img}" alt="${offer.title}">
      <h3>${offer.title}</h3>
      <p>${offer.desc}</p>
    `;
    offerList.appendChild(div);
  });
}

function saveAddress(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const cartData = JSON.parse(localStorage.getItem("pendingOrder")) || [];

  if (!cartData.length) {
    alert("No order found. Please go back and add items to your cart.");
    return;
  }

  const activeOrder = {
    customer: { name, phone, address },
    items: cartData,
    status: "Order placed"
  };

  localStorage.setItem("activeOrder", JSON.stringify(activeOrder));
  localStorage.removeItem("pendingOrder");
  localStorage.removeItem("cart");

  alert("Order confirmed! Redirecting to tracking page...");
  window.location.href = "track.html";
}


// -------- Register User --------
function registerUser(event) {
  event.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  const user = { name, email, password };
  localStorage.setItem("freshbiteUser", JSON.stringify(user));
  alert("Signup successful! You can now log in.");
  window.location.href = "login.html";
}

// -------- Login User --------
function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const storedUser = JSON.parse(localStorage.getItem("freshbiteUser"));

  if (storedUser && storedUser.email === email && storedUser.password === password) {
    localStorage.setItem("isLoggedIn", "true");

    // Redirect back if user was sent from a protected page
    const redirectTo = localStorage.getItem("redirectAfterLogin");
    if (redirectTo && redirectTo !== "profile.html") {
      localStorage.removeItem("redirectAfterLogin");
      window.location.href = redirectTo;
      return;
    }

    // Otherwise just show the profile page
    showProfile(document.getElementById("profileContent"), storedUser);
  } else {
    alert("Invalid credentials!");
  }
}


// -------- Profile Page Logic --------
document.addEventListener("DOMContentLoaded", () => {
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");

  if (userName && userEmail) {
    const storedUser = JSON.parse(localStorage.getItem("freshbiteUser"));
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedUser && isLoggedIn === "true") {
      userName.textContent = storedUser.name;
      userEmail.textContent = storedUser.email;
    } else {
      userName.textContent = "Guest";
      userEmail.textContent = "guest@example.com";
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("profileContent");
  const user = JSON.parse(localStorage.getItem("freshbiteUser"));
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (user && isLoggedIn === "true") {
    showProfile(container, user);
  } else {
    showLoginForm(container);
  }
});

// ---------------- SHOW SECTIONS ----------------

function showLoginForm(container) {
  container.innerHTML = `
    <section class="auth-section">
      <h2>Login</h2>
      <form class="auth-form" onsubmit="loginUser(event)">
        <input type="email" id="loginEmail" placeholder="Email" required>
        <input type="password" id="loginPassword" placeholder="Password" required>
        <button type="submit">Login</button>
      </form>
      <div class="toggle-link">
        <p>Don't have an account? <a onclick="showSignupForm(document.getElementById('profileContent'))">Sign Up</a></p>
      </div>
    </section>
  `;
}

function showSignupForm(container) {
  container.innerHTML = `
    <section class="auth-section">
      <h2>Sign Up</h2>
      <form class="auth-form" onsubmit="registerUser(event)">
        <input type="text" id="signupName" placeholder="Full Name" required>
        <input type="email" id="signupEmail" placeholder="Email" required>
        <input type="password" id="signupPassword" placeholder="Password" required>
        <button type="submit">Sign Up</button>
      </form>
      <div class="toggle-link">
        <p>Already have an account? <a onclick="showLoginForm(document.getElementById('profileContent'))">Login</a></p>
      </div>
    </section>
  `;
}

function showProfile(container, user) {
  container.innerHTML = `
    <div class="profile-info">
      <h2>Welcome, ${user.name} 👋</h2>
      <p><b>Email:</b> ${user.email}</p>
      <button onclick="logoutUser()">Logout</button>
    </div>
  `;
}

// ---------------- AUTH LOGIC ----------------

function registerUser(event) {
  event.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  const user = { name, email, password };
  localStorage.setItem("freshbiteUser", JSON.stringify(user));
  localStorage.setItem("isLoggedIn", "true");

  alert("Signup successful! Welcome, " + name);
  showProfile(document.getElementById("profileContent"), user);
}

function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const storedUser = JSON.parse(localStorage.getItem("freshbiteUser"));

  if (storedUser && storedUser.email === email && storedUser.password === password) {
    localStorage.setItem("isLoggedIn", "true");
    showProfile(document.getElementById("profileContent"), storedUser);
  } else {
    alert("Invalid credentials!");
  }
}

function logoutUser() {
  localStorage.removeItem("isLoggedIn");
  alert("You’ve been logged out.");
  showLoginForm(document.getElementById("profileContent"));
}


