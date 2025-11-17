import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupFullName, setSignupFullName] = useState("");
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(loginEmail, loginPassword);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("¡Bienvenido de nuevo!");
      navigate("/dashboard");
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signUp(signupEmail, signupPassword, signupFullName);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("¡Cuenta creada! Redirigiendo al dashboard...");
      navigate("/dashboard");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--background))_0%,hsl(var(--card))_50%,hsl(var(--primary)/0.05)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.1),transparent_50%)]" />
      
      <Card className="w-full max-w-md relative z-10 border-border/50 backdrop-blur-sm bg-card/95 shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center space-y-3 pb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary via-accent to-success flex items-center justify-center text-3xl shadow-lg animate-in zoom-in-50 duration-700">
            🌍
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent animate-in fade-in-50 duration-700 delay-100">
            Aura Global
          </CardTitle>
          <CardDescription className="text-base animate-in fade-in-50 duration-700 delay-200">
            Tu dashboard climático personalizado con datos técnicos en tiempo real
          </CardDescription>
        </CardHeader>
        <CardContent className="animate-in fade-in-50 duration-700 delay-300">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1">
              <TabsTrigger value="login" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                Registrarse
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="animate-in fade-in-50 slide-in-from-top-2 duration-300">
              <form onSubmit={handleLogin} className="space-y-5 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium">Contraseña</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:scale-[1.02] transition-all duration-200" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="animate-in fade-in-50 slide-in-from-top-2 duration-300">
              <form onSubmit={handleSignup} className="space-y-5 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-sm font-medium">Nombre Completo</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    required
                    className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">Contraseña</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-success to-primary hover:shadow-lg hover:scale-[1.02] transition-all duration-200" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    "Crear Cuenta"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-6 border-t animate-in fade-in-50 duration-700 delay-500">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span>Clima preciso en tiempo real</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Powered by OpenWeatherMap API • Datos técnicos profesionales
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
