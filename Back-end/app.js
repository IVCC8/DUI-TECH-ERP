const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

const healthRoutes = require("./src/routers/health.routes");
const productsRoutes = require("./src/routers/products.routes");
const kpiRoutes = require("./src/routers/kpi.routes");
const employeesRoutes = require("./src/routers/employees.routes");
const financialRoutes = require("./src/routers/financial.routes");
const authRoutes = require("./src/routers/auth.routes");
const { errorHandler, notFoundHandler } = require("./src/middlewares/error.middleware");

const app = express();

app.use(compression());
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/kpis", kpiRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/financial", financialRoutes);
app.use("/api/auth", authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app