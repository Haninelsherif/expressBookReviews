const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const books_api = require('./router/books_api.js').books_api;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: false,
    saveUninitialized: false
  })
);

// JWT authentication for protected review routes.
// The token is stored in the user's session after login.
app.use("/customer/auth/*", function auth(req, res, next) {
  if (!req.session.authorization || !req.session.authorization.token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = req.session.authorization.token;

  jwt.verify(token, "access", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = decoded;
    next();
  });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/api", books_api);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
