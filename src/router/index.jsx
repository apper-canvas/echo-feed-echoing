import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy load components
const Feed = lazy(() => import("@/components/pages/Feed"));
const UserProfile = lazy(() => import("@/components/pages/UserProfile"));
const Notifications = lazy(() => import("@/components/pages/Notifications"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

// Suspense fallback component
const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-gray-600 font-medium">Loading Echo Feed...</p>
    </div>
  </div>
);

// Main routes configuration
const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <Feed />
      </Suspense>
    )
  },
  {
    path: "profile/:username",
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <UserProfile />
      </Suspense>
    )
},
  {
    path: "notifications",
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <Notifications />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <NotFound />
      </Suspense>
    )
  }
];

// Router configuration
const routes = [
  {
    path: "/",
    children: mainRoutes
  }
];

export const router = createBrowserRouter(routes);