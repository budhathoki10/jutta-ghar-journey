import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import Index from "./pages/Index.tsx";
import ProductCatalog from "./pages/ProductCatalog";
import ShoeDetail from "./pages/ShoeDetail";
import ShopFloors from "./pages/ShopFloors";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminShoes from "./pages/admin/Shoes";
import AddShoe from "./pages/admin/AddShoe";
import EditShoe from "./pages/admin/EditShoe";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SiteHeader />
          <main className="min-h-[calc(100vh-6rem)]">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/catalog" element={<ProductCatalog />} />
              <Route path="/shoes" element={<ProductCatalog />} />
              <Route path="/shoes/:id" element={<ShoeDetail />} />
              <Route path="/shop-floors" element={<ShopFloors />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/shoes" element={<AdminShoes />} />
              <Route path="/admin/add-shoe" element={<AddShoe />} />
              <Route path="/admin/edit-shoe/:id" element={<EditShoe />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <SiteFooter />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
