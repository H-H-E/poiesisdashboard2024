import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { AuthProvider } from "@/contexts/AuthContext"
import { useAuth } from "@/contexts/AuthContext"
import Dashboard from "./pages/Dashboard"
import Pathways from "./pages/Pathways"
import Projects from "./pages/Projects"
import Users from "./pages/Users"
import Points from "./pages/Points"
import Login from "./pages/Login"

const queryClient = new QueryClient()

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth()
  
  if (!session) {
    return <Navigate to="/login" />
  }
  
  return children
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/pathways" element={<Pathways />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/points" element={<Points />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App