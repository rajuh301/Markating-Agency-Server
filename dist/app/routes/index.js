"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aurth_routes_1 = require("../modules/Auth/aurth.routes");
const user_routes_1 = require("../modules/User/user.routes");
const payment_route_1 = require("../modules/Payment/payment.route");
const client_route_1 = require("../modules/Client/client.route");
const project_route_1 = require("../modules/Project/project.route");
const stats_route_1 = require("../modules/Stats/stats.route");
const expense_route_1 = require("../modules/Expense/expense.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: aurth_routes_1.AuthRouter
    },
    {
        path: "/user",
        route: user_routes_1.UserRoutes
    },
    {
        path: "/payments",
        route: payment_route_1.PaymentRoutes
    },
    {
        path: "/clients",
        route: client_route_1.ClientRoutes
    },
    {
        path: "/projects",
        route: project_route_1.ProjectRoutes
    },
    {
        path: "/stats",
        route: stats_route_1.StatsRoutes
    },
    {
        path: "/expenses",
        route: expense_route_1.ExpenseRoutes
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
