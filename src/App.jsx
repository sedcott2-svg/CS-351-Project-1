import { useEffect, useState } from "react";
import "./App.css";
import ProductDetail from "./ProductDetail";
import ProductList from "./ProductList";
import ShoppingCart from "./ShoppingCart";

function App() {
  const [users, setUsers] = useState([]);
  const [activeView, setActiveView] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [accountMode, setAccountMode] = useState("login");
  const [loginInfo, setLoginInfo] = useState({ username: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});
  const [createAccountInfo, setCreateAccountInfo] = useState({
    login: "",
    password: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });
  const [createAccountErrors, setCreateAccountErrors] = useState({});
  const [accountSuccess, setAccountSuccess] = useState("");

  function navigateTo(view) {
    setSelectedProduct(null);
    setActiveView(view);
  }

  function openProduct(product) {
    setSelectedProduct(product);
    setActiveView("detail");
  }

  function addToCart(product, variation, polarity) {
    if (product.Variation?.length && !product.Variation.includes(variation)) {
      return false;
    }

    if ((product.polarities ?? []).length > 0 && !product.polarities.includes(polarity)) {
      return false;
    }

    const stock = Number(product.quantityInStock);
    if (!Number.isInteger(stock) || stock < 1) {
      return false;
    }

    const existingItem = cartItems.find(
      item => item.product.id === product.id && item.variation === variation && item.polarity === polarity,
    );

    if (existingItem) {
      if (existingItem.quantity >= stock) {
        return false;
      }

      setCartItems(cartItems.map(item =>
        item === existingItem ? { ...item, quantity: item.quantity + 1 } : item,
      ));
    } else {
      setCartItems([...cartItems, { product, variation, polarity, quantity: 1 }]);
    }

    return true;
  }

  function updateCartQuantity(productId, variation, polarity, quantity) {
    if (!Number.isInteger(quantity)) {
      return;
    }

    setCartItems(currentItems => {
      const item = currentItems.find(
        cartItem => cartItem.product.id === productId && cartItem.variation === variation && cartItem.polarity === polarity,
      );

      if (
        !item ||
        quantity < 1 ||
        quantity > Number(item.product.quantityInStock)
      ) {
        return currentItems;
      }

      return currentItems.map(cartItem =>
        cartItem === item ? { ...cartItem, quantity } : cartItem,
      );
    });
  }

  function removeFromCart(productId, variation, polarity) {
    setCartItems(cartItems.filter(
      item => item.product.id !== productId || item.variation !== variation || item.polarity !== polarity,
    ));
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function handleLoginSubmit(event) {
    event.preventDefault();
    const errors = {};

    if (!loginInfo.username.trim()) {
      errors.username = "Username is required.";
    }

    if (!loginInfo.password) {
      errors.password = "Password is required.";
    }

    setLoginErrors(errors);

    if (Object.keys(errors).length === 0) {
      setAccountSuccess("Login successful.");
    }
  }

  function handleCreateAccountSubmit(event) {
    event.preventDefault();
    const errors = {};
    const optionalAddressFields = [createAccountInfo.street, createAccountInfo.city, createAccountInfo.state, createAccountInfo.zip];
    const hasAddressData = optionalAddressFields.some(value => value.trim() !== "");

    if (!createAccountInfo.login.trim()) {
      errors.login = "Login is required.";
    }

    if (!createAccountInfo.password) {
      errors.password = "Password is required.";
    }

    if (!createAccountInfo.email.trim()) {
      errors.email = "Email is required.";
    } else if (!validateEmail(createAccountInfo.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (hasAddressData) {
      if (!createAccountInfo.street.trim()) {
        errors.street = "Street is required when any address information is provided.";
      }
      if (!createAccountInfo.city.trim()) {
        errors.city = "City is required when any address information is provided.";
      }
      if (!createAccountInfo.state.trim()) {
        errors.state = "State is required when any address information is provided.";
      } else if (!/^[A-Za-z]{2}$/.test(createAccountInfo.state.trim())) {
        errors.state = "State must be a 2-letter abbreviation.";
      }
      if (!createAccountInfo.zip.trim()) {
        errors.zip = "ZIP code is required when any address information is provided.";
      } else if (!/^\d{5}(-\d{4})?$/.test(createAccountInfo.zip.trim())) {
        errors.zip = "ZIP code must be 5 digits or ZIP+4.";
      }
    }

    if (createAccountInfo.phone.trim() && !/^[0-9()+\-.\s]{7,20}$/.test(createAccountInfo.phone.trim())) {
      errors.phone = "Phone number format is invalid.";
    }

    setCreateAccountErrors(errors);

    if (Object.keys(errors).length === 0) {
      setAccountSuccess("Account created successfully.");
    }
  }

   useEffect(() => {

     async function loadUsers() {

       //Send request and wait for response
       const response = await fetch( "products.json");

       // Convert JSON into JavaScript objects
       const data =  await response.json();

       // Save users in React state
       setUsers(data);
     }

     loadUsers();

 }, []);

 return (
    <div className="store-app">
      <nav className="store-nav" aria-label="Main navigation">
        <div className="nav-group">
          <button className="nav-link" aria-current={activeView === "home" ? "page" : undefined} onClick={() => navigateTo("home")}>Home</button>
          <button className="nav-link" aria-current={activeView === "shop" || activeView === "detail" ? "page" : undefined} onClick={() => navigateTo("shop")}>Shop</button>
        </div>
        <div className="nav-group">
          <button className="nav-link" aria-current={activeView === "account" ? "page" : undefined} onClick={() => navigateTo("account")}>Account</button>
          <button className="nav-link cart-nav-link" aria-current={activeView === "cart" ? "page" : undefined} onClick={() => navigateTo("cart")}>
            Cart <span className="cart-count" aria-label={`${cartCount} items`}>{cartCount}</span>
          </button>
        </div>
      </nav>

      <main className="page-content">
        {activeView === "home" && (
          <section className="text-center">
            <img
              src="Warframe-Emblem.png"
              alt="Warframe emblem"
              className="img-fluid mb-4"
              style={{ maxWidth: "180px" }}
            />
            <h1>Welcome, Tenno!</h1>
            <p>Looking to expand your arsenal? Look no further and shop around for your next warframe, necramech, or sentinel!</p>
            <div className="mt-1 mb-3" style={{ borderTop: "1px solid rgba(213, 213, 213, 0.35)" }} />
            <h4>About Warframes</h4>
            <p>Warframes are elite combat suits built for the Tenno, blending impossible mobility, adaptive armor, and devastating abilities into one adaptable battlefield platform. Each frame offers a distinct playstyle, letting you shift from agile duelist to tank, support, or high-impact damage dealer.</p>
            <div className="mt-1 mb-3" style={{ borderTop: "1px solid rgba(213, 213, 213, 0.35)" }} />
            <h4>About Necramechs</h4>
            <p>Necramechs are towering war machines forged from Old War technology, designed for raw power and relentless pressure in the most dangerous zones of the system. With immense durability and heavy firepower, they give the Tenno a new way to dominate the battlefield when a frame is not enough.</p>
            <div className="mt-1 mb-3" style={{ borderTop: "1px solid rgba(213, 213, 213, 0.35)" }} />
            <h4>About Sentinels</h4>
            <p>Sentinels are intelligent drones that accompany the Tenno, offering utility, defense, and specialized support in the field. Whether they are amplifying your combat efficiency, repairing your defenses, or scouting ahead, they become invaluable tools for any mission.</p>
          </section>
        )}
        {activeView === "shop" && (
          <section>
            <h1>Shop</h1>
            <ProductList products={users} onSelectProduct={openProduct} />
          </section>
        )}
        {activeView === "detail" && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onBack={() => navigateTo("shop")}
            onAddToCart={addToCart}
          />
        )}
        {activeView === "cart" && (
          <ShoppingCart
            items={cartItems}
            onQuantityChange={updateCartQuantity}
            onRemove={removeFromCart}
            onContinueShopping={() => navigateTo("shop")}
          />
        )}
        {activeView === "account" && (
          <section className="account-panel w-100">
            <h1>Account</h1>
            <div className="account-toggle">
              <button
                type="button"
                className={`btn ${accountMode === "login" ? "btn-primary account-toggle-button" : "btn-outline-secondary account-toggle-button"}`}
                onClick={() => {
                  setAccountMode("login");
                  setAccountSuccess("");
                }}
              >
                Login
              </button>
              <button
                type="button"
                className={`btn ${accountMode === "create" ? "btn-primary account-toggle-button" : "btn-outline-secondary account-toggle-button"}`}
                onClick={() => {
                  setAccountMode("create");
                  setAccountSuccess("");
                }}
              >
                Create Account
              </button>
            </div>

            {accountMode === "login" && (
              <form className="account-form" onSubmit={handleLoginSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label" htmlFor="login-username">Username</label>
                  <input
                    id="login-username"
                    className={`form-control account-input ${loginErrors.username ? "is-invalid" : ""}`}
                    type="text"
                    value={loginInfo.username}
                    onChange={event => {
                      setLoginInfo({ ...loginInfo, username: event.target.value });
                      setLoginErrors({ ...loginErrors, username: "" });
                    }}
                    placeholder="Enter your username"
                  />
                  {loginErrors.username && <div className="invalid-feedback d-block">{loginErrors.username}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    className={`form-control account-input ${loginErrors.password ? "is-invalid" : ""}`}
                    type="password"
                    value={loginInfo.password}
                    onChange={event => {
                      setLoginInfo({ ...loginInfo, password: event.target.value });
                      setLoginErrors({ ...loginErrors, password: "" });
                    }}
                    placeholder="Enter your password"
                  />
                  {loginErrors.password && <div className="invalid-feedback d-block">{loginErrors.password}</div>}
                </div>

                <button type="submit" className="btn btn-primary account-submit-btn">Log in</button>
              </form>
            )}

            {accountMode === "create" && (
              <form className="account-form" onSubmit={handleCreateAccountSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="create-login">Login</label>
                    <input
                      id="create-login"
                      className={`form-control account-input ${createAccountErrors.login ? "is-invalid" : ""}`}
                      type="text"
                      value={createAccountInfo.login}
                      onChange={event => {
                        setCreateAccountInfo({ ...createAccountInfo, login: event.target.value });
                        setCreateAccountErrors({ ...createAccountErrors, login: "" });
                      }}
                      placeholder="Create a username"
                    />
                    {createAccountErrors.login && <div className="invalid-feedback d-block">{createAccountErrors.login}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="create-password">Password</label>
                    <input
                      id="create-password"
                      className={`form-control account-input ${createAccountErrors.password ? "is-invalid" : ""}`}
                      type="password"
                      value={createAccountInfo.password}
                      onChange={event => {
                        setCreateAccountInfo({ ...createAccountInfo, password: event.target.value });
                        setCreateAccountErrors({ ...createAccountErrors, password: "" });
                      }}
                      placeholder="Create a password"
                    />
                    {createAccountErrors.password && <div className="invalid-feedback d-block">{createAccountErrors.password}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label" htmlFor="create-email">Email</label>
                    <input
                      id="create-email"
                      className={`form-control account-input ${createAccountErrors.email ? "is-invalid" : ""}`}
                      type="email"
                      value={createAccountInfo.email}
                      onChange={event => {
                        setCreateAccountInfo({ ...createAccountInfo, email: event.target.value });
                        setCreateAccountErrors({ ...createAccountErrors, email: "" });
                      }}
                      placeholder="Enter your email"
                    />
                    {createAccountErrors.email && <div className="invalid-feedback d-block">{createAccountErrors.email}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label" htmlFor="create-street">Street</label>
                    <input
                      id="create-street"
                      className={`form-control account-input ${createAccountErrors.street ? "is-invalid" : ""}`}
                      type="text"
                      value={createAccountInfo.street}
                      onChange={event => {
                        setCreateAccountInfo({ ...createAccountInfo, street: event.target.value });
                        setCreateAccountErrors({ ...createAccountErrors, street: "" });
                      }}
                      placeholder="Street address (optional)"
                    />
                    {createAccountErrors.street && <div className="invalid-feedback d-block">{createAccountErrors.street}</div>}
                  </div>

                  <div className="col-md-5">
                    <label className="form-label" htmlFor="create-city">City</label>
                    <input
                      id="create-city"
                      className={`form-control account-input ${createAccountErrors.city ? "is-invalid" : ""}`}
                      type="text"
                      value={createAccountInfo.city}
                      onChange={event => {
                        setCreateAccountInfo({ ...createAccountInfo, city: event.target.value });
                        setCreateAccountErrors({ ...createAccountErrors, city: "" });
                      }}
                      placeholder="City"
                    />
                    {createAccountErrors.city && <div className="invalid-feedback d-block">{createAccountErrors.city}</div>}
                  </div>

                  <div className="col-md-3">
                    <label className="form-label" htmlFor="create-state">State</label>
                    <input
                      id="create-state"
                      className={`form-control account-input ${createAccountErrors.state ? "is-invalid" : ""}`}
                      type="text"
                      value={createAccountInfo.state}
                      onChange={event => {
                        setCreateAccountInfo({ ...createAccountInfo, state: event.target.value });
                        setCreateAccountErrors({ ...createAccountErrors, state: "" });
                      }}
                      placeholder="CA"
                    />
                    {createAccountErrors.state && <div className="invalid-feedback d-block">{createAccountErrors.state}</div>}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label" htmlFor="create-zip">ZIP</label>
                    <input
                      id="create-zip"
                      className={`form-control account-input ${createAccountErrors.zip ? "is-invalid" : ""}`}
                      type="text"
                      value={createAccountInfo.zip}
                      onChange={event => {
                        setCreateAccountInfo({ ...createAccountInfo, zip: event.target.value });
                        setCreateAccountErrors({ ...createAccountErrors, zip: "" });
                      }}
                      placeholder="12345"
                    />
                    {createAccountErrors.zip && <div className="invalid-feedback d-block">{createAccountErrors.zip}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label" htmlFor="create-phone">Phone</label>
                    <input
                      id="create-phone"
                      className={`form-control account-input ${createAccountErrors.phone ? "is-invalid" : ""}`}
                      type="tel"
                      value={createAccountInfo.phone}
                      onChange={event => {
                        setCreateAccountInfo({ ...createAccountInfo, phone: event.target.value });
                        setCreateAccountErrors({ ...createAccountErrors, phone: "" });
                      }}
                      placeholder="(555) 123-4567"
                    />
                    {createAccountErrors.phone && <div className="invalid-feedback d-block">{createAccountErrors.phone}</div>}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary account-submit-btn mt-3">Create account</button>
              </form>
            )}

            {accountSuccess && <p className="text-success mt-3 mb-0" role="status">{accountSuccess}</p>}
          </section>
        )}
      </main>
    </div>
  );

}

export default App;