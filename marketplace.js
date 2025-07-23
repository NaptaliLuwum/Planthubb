// Marketplace functionality
let cart = [];
let cartTotal = 0;
const productDatabase = {
  "peace-Lily": {
    id: 1,
    name: "Classic Peace Lily",
    price: 29.99,
    originalPrice: 39.99,  
    image: "./flowers/Want your peace lily to blossom with stunning….jpg",
    seller: "Green Paradise",
    rating: "4.8",
    reviews: 127,
    shipping: "Free shipping",
    description: "A classic peace lily for your home.",
    features: ["Air purifying", "Low maintenance"],
    care: ["Water weekly", "Indirect sunlight"],
  },
  "Premium-peace-lily": {
    id: 2,
    name: "Premium Peace Lily",
    price: 45.99,
    originalPrice: 50.99,  
    image: "./flowers/Peace lily.jpg",
    seller: "plant masters",
    rating: "4.6",
    reviews: 89,
    shipping: "Free shipping",
    description: "This premium variety features larger, more vibrant white blooms and lush green foliage, perfect for brightening any room.",
    features: ["Air purifying", "Low maintenance"],
    care: ["Water weekly", "Indirect sunlight"],
  },
  "tropical-foliage": {
    id: 3,
    name: "Tropical Foliage Mix",
    price: 34.99,
    originalPrice: 50.99,  
    image: "./flowers/🎍.jpg",
    seller: "Urban Jungle",
    rating: "4.9",
    reviews: 156,
    shipping: "Free shipping",
    description: "A lush mix of tropical plants with vibrant leaves that bring an exotic jungle vibe to your indoor space.",
    features: ["best fragrance", "Low maintenance"],
    care: ["Mist leaves daily", "Bright indirect light", "Keep soil moderately moist", "Fertilize monthly"],
  },
  "succulents-garden": {
    id: 4,
    name: "Delicate Succulents Garden",
    price: 27.99,
    originalPrice: 32.99,  
    image: "./flowers/Enhance your modern living space or office with….jpg",  
    seller: "Desert Bloom",
    rating: "4.5",
    reviews: 73,
    shipping: "Free shipping",
    description: "Beautiful succulent collection.",
    features: ["Drought resistant", "Low maintenance"],
    care: ["Water sparingly", "Bright light"],
  },
  "designer-lily": {
    id: 5,
    name: "Designer Lily Collection",
    price: 89.99,
    originalPrice: 120.99,  
    image: "./flowers/ec0fc747-d992-4ec7-a7cb-68041db68b0e.jpg",  
    seller: "Luxury Plant Co.",
    rating: "4.7",
    reviews: 94,
    shipping: "Free shipping",
    description: "Exclusive designer lily collection.",
    features: ["Premium quality", "Elegant display"],
    care: ["Regular watering", "Bright indirect light"],
  },
  "Luxury Vase Plant": {
    id: 6,
    name: "Luxury Designer Vase Plant",
    price: 129.99,
    originalPrice: 150.99,  
    image: "./flowers/2b0ee651-7de0-4bf5-a77b-0ce5da3f7242.jpg",  
    seller: "Elite Gardens",
    rating: "5.0",
    reviews: 42,
    shipping: "Free shipping",
    description: "Luxury plant in designer vase.",
    features: ["Premium materials", "Statement piece"],
    care: ["Moderate watering", "Bright light"],
  }
};

document.addEventListener("DOMContentLoaded", function() {
    initializeEventListeners();
    UpdateCartDisplay();
});

function initializeEventListeners() {
    document.getElementById("cart-toggle").addEventListener("click", toggleCart);
    document.getElementById("cart-close").addEventListener("click", closeCart);
    document.getElementById("search-btn").addEventListener("click", performSearch);
    document.getElementById("search-input").addEventListener("keypress", function(e) {
        if (e.key === "Enter") performSearch();
    });
    document.querySelector(".hero-btn").addEventListener("click", function() {
        document.getElementById("Categories").scrollIntoView({ behavior: "smooth" });
    });
    document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.addEventListener("click", function() {
            const filter = this.getAttribute("data-filter");
            filterProducts(filter);
            document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
            this.classList.add("active");
        });
    });
    document.querySelectorAll(".category-item").forEach((item) => {
        item.addEventListener("click", function() {
            const category = this.getAttribute("data-category");
            filterProducts(category);
            document.getElementById("Featured").scrollIntoView({ behavior: "smooth" });
            document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
            const filterBtn = document.querySelector(`[data-filter="${category}"]`);
            if (filterBtn) filterBtn.classList.add("active");
        });
    });
    document.addEventListener("click", function(e) {
        if (e.target.classList.contains("add-to-cart")) {
            const id = parseInt(e.target.getAttribute("data-id"));
            const name = e.target.getAttribute("data-name");
            const price = parseFloat(e.target.getAttribute("data-price"));
            addToCart(id, name, price);
            e.target.textContent = "Added!";
            e.target.style.background = "#27ae60";
            setTimeout(() => {
                e.target.textContent = "Add to cart";
                e.target.style.background = "#2d5a27";
            }, 1000);
        }
        if (e.target.classList.contains("quick-view")) {
            const productId = e.target.getAttribute("data-id");
            showQuickView(productId);
        }
        if (e.target.classList.contains("deal-btn")) {
            document.getElementById("Featured").scrollIntoView({ behavior: "smooth" });
        }
    });
    document.querySelector(".modal-close").addEventListener("click", closeModal);
    document.getElementById("quick-view-modal").addEventListener("click", function(e) {
        if (e.target === this) closeModal();
    });
    document.getElementById("overlay").addEventListener("click", function() {
        closeCart();
        closeModal();
    });
    document.querySelector(".checkout-btn").addEventListener("click", checkout);
}
function addToCart(id, name, price) {
  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = Object.values(productDatabase).find((p) => p.id === id);
    cart.push({
      id:id,
      name:name,
      price:price,
      quantity: 1,
      image: product ? product.image : "placeholder",
    });
  }
  cartTotal += price;
  UpdateCartDisplay();

  // Show cart briefly
  const cartSidebar = document.getElementById("cart-sidebar");
  cartSidebar?.classList.add("open");
  document.getElementById("overlay")?.classList.add("active");
  setTimeout(() => {
    if (!cartSidebar.matches(":hover")) {
      closeCart();
    }
  }, 2000);
}

function removeFromCart(id) {
  const itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex > -1) {
    const item = cart[itemIndex];
    cartTotal -= item.price * item.quantity;
    cart.splice(itemIndex, 1);
    UpdateCartDisplay();
  }
}

function UpdateCartDisplay() {
  const cartCount = document.querySelector(".cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");


  // Update cart count
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  if (cartCount) cartCount.textContent = totalItems;

  // Update cart total
  if (cartTotalElement) cartTotalElement.textContent = cartTotal.toFixed(2);

  // Update cart items
  if (!cartItems) return;
  cartItems.innerHTML = "";
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem">Your cart is empty</p>';
    return;
  }
  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
       <div class="cart-item78/9*--price">$${item.price.toFixed(2)} x ${item.quantity}</div>
        <button onclick="removeFromCart(${item.id})" style="background: #e74c3c; color:white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-top: 0.5rem;">remove</button>
      </div>`;
    cartItems.appendChild(cartItem);
  });
}

function toggleCart() {
  const cartSidebar = document.getElementById("cart-sidebar");
  const overlay = document.getElementById("overlay");
  cartSidebar?.classList.toggle("open");
  overlay?.classList.toggle("active");
}

function closeCart() {

  document.getElementById("cart-sidebar")?.classList.remove("open");
  document.getElementById("overlay")?.classList.remove("active");
}

// Product filtering
function filterProducts(category) {
  const products = document.querySelectorAll(".product-card");
  products.forEach((product) => {
    const productCategory = product.getAttribute("data-category");
    product.style.display = (category === "all" || productCategory === category) ? "block" : "none";
  });
}

// Search functionality
function performSearch() {
  const searchTerm = document.getElementById("search-input")?.value.toLowerCase();
  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => {
    const productName = product.querySelector("h3")?.textContent.toLowerCase() || "";
    const productSeller = product.querySelector(".seller")?.textContent.toLowerCase() || "";
    product.style.display = (productName.includes(searchTerm) || productSeller.includes(searchTerm)) ? "block" : "none";
  });

  // Scroll to products
  document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });
  
  // Reset filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
}

// Quick view modal
function showQuickView(productId) {
  const product = productDatabase[productId];
  if (!product) return;
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
    <div class="product-detail">
      <div><img src="${product.image}" alt="${product.name}" style="width:200px"></div>
      <div>
        <h1>${product.name}</h1>
        <div class="seller">Sold by: ${product.seller}</div>
        <div class="rating">
          <span class="stars">${product.rating}</span>
          <span class="rating-count">(${product.reviews} reviews)</span>
        </div>
        <div class="price-section">
          <span class="current-price">$${product.price}</span>
          ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ""}
        </div>
        <div class="shipping">${product.shipping}</div>
        <p>${product.description}</p>
        <div class="product-specs">
          <h4>Key Features:</h4>
          <ul>${product.features.map((f) => `<li>${f}</li>`).join("")}</ul>
          <h4>Care Instructions:</h4>
          <ul>${product.care.map((c) => `<li>${c}</li>`).join("")}</ul>
        </div>
        <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to cart - $${product.price}</button>
      </div>
    </div>`;
  document.getElementById("quick-view-modal").style.display = "block";
}

function closeModal() {
  document.getElementById("quick-view-modal").style.display = "none";
}

// Checkout functionality
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  const orderSummary = cart.map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join("\n");
  alert(`Order Summary:\n\n${orderSummary}\n\nTotal: $${cartTotal.toFixed(2)}\n\nThank you for your order! This is a Planthub marketplace.`);

  // Clear cart
  cart = [];
  cartTotal = 0;
  UpdateCartDisplay();
  closeCart();
}

// Search scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});