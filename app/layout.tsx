import { Outlet } from "react-router-dom";
import { StoreProvider } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout() {
  return (
    <StoreProvider>
      <div className="font-sans antialiased bg-background min-h-screen">
        <Outlet />
        <Toaster richColors position="top-center" />
      </div>
    </StoreProvider>
  );
}
