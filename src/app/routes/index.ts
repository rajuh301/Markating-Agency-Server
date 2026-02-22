import express from "express"
import { AuthRouter } from "../modules/Auth/aurth.routes";
import { UserRoutes } from "../modules/User/user.routes";
import { PaymentRoutes } from "../modules/Payment/payment.route";
import { ClientRoutes } from "../modules/Client/client.route";
import { ProjectRoutes } from "../modules/Project/project.route";
import { StatsRoutes } from "../modules/Stats/stats.route";
import { ExpenseRoutes } from "../modules/Expense/expense.route";
import { OrganizationRoutes } from "../modules/organization/organization.routes";
import { ReportRoutes } from "../modules/Report/report.routes";
import { InvoiceRoutes } from "../modules/Invoice/invoice.routes";
import { QuotationRoutes } from "../modules/Quotation/quotation.routes";
import { RoleRoutes } from "../modules/Role/role.route";



const router = express.Router();

const moduleRoutes = [
   
 
    {
        path: "/auth",
        route: AuthRouter
    },
  
    {
        path: "/user",
        route: UserRoutes
    },
  
    {
        path: "/payments",
        route: PaymentRoutes
    },
  
    {
        path: "/clients",
        route: ClientRoutes
    },
    {
        path: "/projects",
        route: ProjectRoutes
    },
    {
        path: "/stats",
        route: StatsRoutes
    },
  
    {
        path: "/expenses",
        route: ExpenseRoutes
    },
    {
        path: "/organization",
        route: OrganizationRoutes
    },
    {
        path: "/reports",
        route: ReportRoutes
    },

    {
        path: "/invoice",
        route: InvoiceRoutes
    },
  
    {
        path: "/quotation",
        route: QuotationRoutes
    },
    {
        path: "/role",
        route: RoleRoutes
    },
  
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;