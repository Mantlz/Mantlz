"use client";

import { BrowserRouter, Route, Routes } from "react-router";
import { Suspense, lazy } from "react";

// Lazy load components for better performance
const LandingPage = lazy(() => import("../app/(landing)/page"));
const Dashboard = lazy(() => import("../app/dashboard/page"));
const Pricing = lazy(() => import("../app/pricing/page"));
const Blog = lazy(() => import("../app/blog/page"));
const Auth = lazy(() => import("../app/(auth)/sign-in/[[...rest]]/page"));
const SignUp = lazy(() => import("../app/(auth)/sign-up/[[...rest]]/page"));
const NotFound = lazy(() => import("../app/not-found"));

// Dashboard sub-pages
const DashboardBilling = lazy(() => import("../app/dashboard/billing/page"));
const DashboardCampaigns = lazy(
  () => import("../app/dashboard/campaigns/page")
);
const DashboardCampaignDetail = lazy(
  () => import("../app/dashboard/campaigns/[id]/page")
);
const DashboardForm = lazy(() => import("../app/dashboard/form/page"));
const DashboardFormDetail = lazy(
  () => import("../app/dashboard/form/[id]/page")
);
const DashboardFormCustomize = lazy(
  () => import("../app/dashboard/form/customize/page")
);
const DashboardLogs = lazy(() => import("../app/dashboard/logs/page"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication routes */}
        <Route path="/sign-in" element={<Auth />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Dashboard routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/billing" element={<DashboardBilling />} />
        <Route path="/dashboard/campaigns" element={<DashboardCampaigns />} />
        <Route
          path="/dashboard/campaigns/:id"
          element={<DashboardCampaignDetail />}
        />
        <Route path="/dashboard/form" element={<DashboardForm />} />
        <Route path="/dashboard/form/:id" element={<DashboardFormDetail />} />
        <Route
          path="/dashboard/form/customize"
          element={<DashboardFormCustomize />}
        />
        <Route path="/dashboard/logs" element={<DashboardLogs />} />

        {/* Public pages */}
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/blog/*" element={<Blog />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
