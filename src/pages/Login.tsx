import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function Login() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { theme } = useTheme()

  useEffect(() => {
    // Check if there's an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/')
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event)
      if (event === 'SIGNED_IN' && session) {
        toast({
          title: "Signed in successfully",
        })
        navigate('/')
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
        })
      } else if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password')
      } else if (event === 'USER_UPDATED') {
        toast({
          title: "Account updated",
        })
      }
    })

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, toast])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to Poiesis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please make sure you are using the correct email and password. If you haven't registered yet, please sign up first.
            </AlertDescription>
          </Alert>
          
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: { background: 'rgb(var(--primary))', color: 'white' },
                anchor: { color: 'rgb(var(--primary))' },
                input: {
                  backgroundColor: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  borderColor: 'hsl(var(--border))',
                },
                label: {
                  color: 'hsl(var(--foreground))',
                },
              },
              className: {
                input: 'bg-background text-foreground border-input',
                label: 'text-foreground',
              }
            }}
            providers={[]}
            theme={theme === 'dark' ? 'dark' : 'light'}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Sign in',
                  loading_button_label: 'Signing in...',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Sign up',
                  loading_button_label: 'Signing up...',
                },
              },
            }}
            view="sign_in"
          />
          <div className="text-center">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}