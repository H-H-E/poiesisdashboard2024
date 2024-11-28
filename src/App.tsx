import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "next-themes"
import Layout from "@/components/Layout"
import Login from "@/pages/Login"
import ForgotPassword from "@/pages/ForgotPassword"
import ResetPassword from "@/pages/ResetPassword"
import Dashboard from "@/pages/Dashboard"
import Profile from "@/pages/Profile"
import Users from "@/pages/Users"
import Projects from "@/pages/Projects"
import Pathways from "@/pages/Pathways"
import Points from "@/pages/Points"
import Standards from "@/pages/Standards"
import Plenaries from "@/pages/Plenaries"
import Calendar from "@/pages/Calendar"
import { AuthProvider } from "@/contexts/AuthContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/users" element={<Users />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/pathways" element={<Pathways />} />
                <Route path="/points" element={<Points />} />
                <Route path="/standards" element={<Standards />} />
                <Route path="/plenaries" element={<Plenaries />} />
                <Route path="/calendar" element={<Calendar />} />
              </Route>
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}