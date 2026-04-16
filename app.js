require("dotenv").config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");

const app = express();

const productRouter = require("./routes/products");
const supplierRouter = require("./routes/supplier");
const inventoryRoutes = require("./routes/inventory");
const customerRoutes = require("./routes/customer");
const authRouter = require("./routes/auth");
const salerRoutes = require("./routes/salerRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const dashboardRoutes = require("./routes/dashboard");
const stockRoutes = require("./routes/stockRoutes");
const salesRoutes = require("./routes/sales");
const userRoutes = require("./routes/users");

app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "http://192.168.100.97:3000"
      // You can add more network IPs here if they change
    ],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/v1/stock", stockRoutes);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

app.use(helmet());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/supplier", supplierRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/saler", salerRoutes);
app.use("/api/v1/invoice", invoiceRoutes);
app.use("/api/v1/sales", salesRoutes);
app.use("/api/v1/stock", stockRoutes);
app.use("/api/v1/users", userRoutes);
// error handlers
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// db
const connectDB = require("./db/connect");
const Invoice = require("./models/invoice");

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    // Remove stale unique index on invoiceNumber (schema uses invoice_number)
    try {
      await Invoice.collection.dropIndex("invoiceNumber_1");
      console.log("Dropped stale index invoiceNumber_1");
    } catch (idxErr) {
      const code = idxErr.code || idxErr.codeName;
      if (code !== 27 && code !== "IndexNotFound") {
        console.log("Drop index note:", idxErr.message);
      }
    }

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
