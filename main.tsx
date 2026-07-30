import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./app/layout";
import LoginPage from "./app/page";
import ResidentLayout from "./app/resident/layout";
import ResidentDashboard from "./app/resident/page";
import NewPassPage from "./app/resident/new/page";
import HistoryPage from "./app/resident/history/page";
import PassDetailPage from "./app/resident/pass/[id]/page";
import GuardLayout from "./app/guard/layout";
import GuardDashboard from "./app/guard/page";
import AdminLayout from "./app/admin/layout";
import AdminDashboard from "./app/admin/page";
import "./app/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/resident" element={<ResidentLayout />}>
            <Route index element={<ResidentDashboard />} />
            <Route path="new" element={<NewPassPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="pass/:id" element={<PassDetailPage />} />
          </Route>
          <Route path="/guard" element={<GuardLayout />}>
            <Route index element={<GuardDashboard />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
