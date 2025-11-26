require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Order = require('./models/order');
const Product = require('./models/product');
const Customer = require('./models/customer');
const User = require('./models/user');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let connectionPromise;
let defaultUserPromise;

async function ensureDefaultUser() {
  if (defaultUserPromise) return defaultUserPromise;

  defaultUserPromise = (async () => {
    const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME || "admin";
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "mus-dashboard";
    const defaultName = process.env.DEFAULT_ADMIN_NAME || "Administrator";

    const existing = await User.findOne({ username: defaultUsername });
    if (existing) return existing;

    const hashed = await bcrypt.hash(defaultPassword, 10);
    const created = await User.create({
      name: defaultName,
      username: defaultUsername,
      password: hashed,
    });

    console.log(
      `✅ Default admin dibuat: username="${defaultUsername}" (ganti password di env atau lewat UI)`
    );
    return created;
  })();

  return defaultUserPromise;
}

async function ensureDbConnection(req, res, next) {
  try {
    if (mongoose.connection.readyState === 1) return next();

    if (!connectionPromise) {
      connectionPromise = mongoose.connect(process.env.MONGODB_URI);
    }

    await connectionPromise;
    await ensureDefaultUser();
    return next();
  } catch (err) {
    console.error('❌ MongoDB error:', err);
    return res.status(500).json({ message: 'Database connection error' });
  }
}

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(ensureDbConnection);

// ROUTE TEST
app.get('/', (req, res) => {
  res.json({ message: 'mus-dashboard API running' });
});

// =====================================================================
// 🔐 AUTH SYSTEM (REGISTER - LOGIN - ME - UPDATE PROFILE - UPDATE PASS)
// =====================================================================

// REGISTER USER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      password: hashedPassword,
    });

    res.json({
      message: "User created",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Register failed", error: err.message });
  }
});

// LOGIN USER (MONGODB)
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isHash = typeof user.password === "string" && user.password.startsWith("$2");

    let match = false;

    if (isHash) {
      match = await bcrypt.compare(password, user.password);
    } else {
      match = password === user.password;

      // Jika password tersimpan plaintext (misalnya dibuat manual di DB), hash-kan
      // ulang supaya login berikutnya tetap aman.
      if (match) {
        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;
        await user.save();
      }
    }

    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "SECRET_KEY_MUS",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login success",
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
      },
      token,
    });

  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// GET CURRENT USER
app.get("/api/auth/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY_MUS");

    const user = await User.findById(decoded.id).select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Failed get user", error: err.message });
  }
});

// UPDATE PROFILE NAME
app.put("/api/auth/update-profile", async (req, res) => {
  try {
    const { id, _id, name } = req.body;
    const userId = id || _id;

    const updated = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update profile failed" });
  }
});

app.put("/api/auth/update-password", async (req, res) => {
  try {
    const { id, _id, newPassword } = req.body;
    const userId = id || _id;  // 🔥 fix penting

    const hashed = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(userId, { password: hashed });

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: "Update password failed" });
  }
});

// =====================================================================
// 📦 PRODUCT ROUTES
// =====================================================================

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const payload = req.body;

    // Kalau body berupa ARRAY → insertMany
    if (Array.isArray(payload)) {
      const products = await Product.insertMany(payload);
      return res.status(201).json(products);
    }

    // Kalau body berupa OBJECT → save biasa
    const product = new Product(payload);
    await product.save();
    res.status(201).json(product);

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error creating product', error: err });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);

  } catch (err) {
    res.status(400).json({ message: 'Error updating product', error: err });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err });
  }
});

// =====================================================================
// 📦 ORDER ROUTES
// =====================================================================

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order', error: err });
  }
});

// CREATE ORDER (single atau bulk)
app.post("/api/orders", async (req, res) => {
  // Kalau body array → anggap bulk, kalau bukan → jadikan array 1 elemen
  const payload = Array.isArray(req.body) ? req.body : [req.body];

  try {
    const createdOrders = [];

    for (const orderData of payload) {
      const { orderNumber, customerName, status, items } = orderData;

      // Validasi basic
      if (!orderNumber || !customerName || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          message: "orderNumber, customerName, dan minimal 1 item wajib diisi",
        });
      }

      // Hitung totalAmount
      const totalAmount = items.reduce((sum, item) => {
        return sum + (Number(item.price) || 0) * (Number(item.qty) || 0);
      }, 0);

      // Cek & kurangi stok per item
      for (const item of items) {
        const product = await Product.findOne({ name: item.productName });

        if (!product) {
          return res
            .status(400)
            .json({ message: `Product ${item.productName} tidak ditemukan` });
        }

        if (product.stock < item.qty) {
          return res.status(400).json({
            message: `Stok ${product.name} tidak cukup. Stok: ${product.stock}, diminta: ${item.qty}`,
          });
        }

        product.stock -= item.qty;
        await product.save();
      }

      // Simpan order
      const newOrder = await Order.create({
        orderNumber,
        customerName,
        status,
        items,
        totalAmount,
      });

      createdOrders.push(newOrder);
    }

    // Kalau kirim array → balikin array, kalau 1 object → balikin object
    if (Array.isArray(req.body)) {
      return res.status(201).json({
        message: `Berhasil membuat ${createdOrders.length} order`,
        orders: createdOrders,
      });
    } else {
      return res.status(201).json(createdOrders[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal membuat order" });
  }
});


// UPDATE ORDER STATUS (dan restore stock saat cancelled)
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const previousStatus = order.status;

    order.status = status;
    await order.save();

    // restore stock when cancelled
    if (status === "cancelled" && previousStatus !== "cancelled") {
      for (const item of order.items) {
        const product = await Product.findOne({ name: item.productName });
        if (product) {
          product.stock += item.qty;
          await product.save();
        }
      }
    }

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: "Error updating order" });
  }
});

// DELETE ORDER
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: 'Order tidak ditemukan' });

    res.json({ message: 'Order berhasil dihapus' });

  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus order' });
  }
});

// =====================================================================
// 👥 CUSTOMER ROUTES
// =====================================================================

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customers', error: err });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customer', error: err });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ message: 'Error creating customer', error: err });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    res.json(customer);

  } catch (err) {
    res.status(400).json({ message: 'Error updating customer', error: err });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    res.json({ message: "Customer deleted" });

  } catch (err) {
    res.status(500).json({ message: 'Error deleting customer', error: err });
  }
});

// =====================================================================
// 📊 ANALYTICS ROUTES
// =====================================================================

// NOTE: Revenue sekarang hanya dihitung dari order dengan status 'paid' atau 'shipped'
const PAID_STATUSES = ["paid", "shipped"];

app.get('/api/analytics/overview', async (req, res) => {
  try {
    const [totalOrders, totalProducts, totalCustomers, revenueAgg] =
      await Promise.all([
        Order.countDocuments(),
        Product.countDocuments(),
        Customer.countDocuments(),
        Order.aggregate([
          { $match: { status: { $in: PAID_STATUSES } } },            // 👈 filter status
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" }
            }
          }
        ])
      ]);

    const totalRevenue =
      revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    res.json({ totalOrders, totalRevenue, totalProducts, totalCustomers });

  } catch (err) {
    res.status(500).json({ message: "Error fetching overview analytics" });
  }
});

// REVENUE PER HARI (hanya paid + shipped)
app.get('/api/analytics/revenue', async (req, res) => {
  try {
    const agg = await Order.aggregate([
      { $match: { status: { $in: PAID_STATUSES } } },                // 👈 filter status
      {
        $group: {
          _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(agg.map(r => ({ date: r._id, revenue: r.revenue })));

  } catch (err) {
    res.status(500).json({ message: "Error fetching revenue analytics" });
  }
});

// ORDER STATUS (tetap hitung semua status)
app.get('/api/analytics/order-status', async (req, res) => {
  try {
    const agg = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json(agg.map(r => ({ name: r._id || "unknown", count: r.count })));

  } catch (err) {
    res.status(500).json({ message: "Error fetching status analytics" });
  }
});

// REVENUE BY STATUS (Pie) – hanya paid + shipped
app.get('/api/analytics/customers', async (req, res) => {
  try {
    const agg = await Order.aggregate([
      { $match: { status: { $in: PAID_STATUSES } } },                // 👈 filter status
      {
        $group: {
          _id: "$status",
          totalRevenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(
      agg.map(s => ({ label: s._id || "unknown", value: s.totalRevenue || 0 }))
    );

  } catch (err) {
    res.status(500).json({ message: "Error fetching revenue by status" });
  }
});

// TOP PRODUCTS – hanya dari order paid + shipped
app.get('/api/analytics/top-products', async (req, res) => {
  try {
    const agg = await Order.aggregate([
      { $match: { status: { $in: PAID_STATUSES } } },                // 👈 filter status
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productName",
          count: { $sum: "$items.qty" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, name: "$_id", count: 1 } }
    ]);

    res.json(agg);

  } catch (err) {
    res.status(500).json({ message: "Error fetching top products analytics" });
  }
});

function createApp() {
  return app;
}

module.exports = { createApp, app };
