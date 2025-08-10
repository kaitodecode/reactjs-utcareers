import {
  createBrowserRouter,
} from "react-router";
import LoginPage from "../features/login";
import DashboardPage from "../features/dashboard";
import AdminLayout from "../layouts/admin";
import CompanyPage from "../features/company";
import JobPage from "../features/job";
import CandidatePage from "../features/candidate";
import DevisionPage from "../features/devision";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage/>,
  },
  {
    path: "/app",
    element: <AdminLayout/>,
    children: [
        {
            path: "/app/dashboard",
            element: <DashboardPage/>
        },
        {
            path: "/app/company",
            element: <CompanyPage/>
        },
        {
            path: "/app/devision",
            element: <DevisionPage/>
        },

        {
            path: "/app/job",
            element: <JobPage/>
        },
        {
            path: "/app/candidate",
            element: <CandidatePage />
        },

    ]
  }
]);