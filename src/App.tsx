import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import Dashboard from "./pages/Dashboard"
import Pathways from "./pages/Pathways"
import Projects from "./pages/Projects"
import Plenaries from "./pages/Plenaries"
import Standards from "./pages/Standards"
import Users from "./pages/Users"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Calendar from "./pages/Calendar"

const queryClient = new QueryClient()

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth()
  
  if (!session) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Routes>
                          <Route index element={<Dashboard />} />
                          <Route path="standards" element={<Standards />} />
                          <Route path="pathways" element={<Pathways />} />
                          <Route path="projects" element={<Projects />} />
                          <Route path="plenaries" element={<Plenaries />} />
                          <Route path="users/*" element={<Users />} />
                          <Route path="profile" element={<Profile />} />
                          <Route path="calendar" element={<Calendar />} />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App