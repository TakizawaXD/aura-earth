import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function AuthDialog() {
  const [open, setOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("login-email");
    
    toast.success(`Bienvenido! Sesión iniciada con ${email}`);
    setOpen(false);
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      toast.error("Debes aceptar los términos y condiciones");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const password = formData.get("register-password");
    const confirmPassword = formData.get("confirm-password");

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const name = formData.get("name");
    toast.success(`Registro exitoso! Bienvenido ${name}`);
    setOpen(false);
    setTermsAccepted(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="shadow-soft">
          <LogIn className="mr-2 h-4 w-4" />
          Ingresar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Aura Global</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Correo Electrónico</Label>
                <Input
                  id="login-email"
                  name="login-email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">Contraseña</Label>
                <Input
                  id="login-password"
                  name="login-password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="button" variant="link" className="px-0 text-sm">
                ¿Olvidaste tu contraseña?
              </Button>

              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="25"
                    min="1"
                    max="120"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="identification">Identificación</Label>
                  <Input
                    id="identification"
                    name="identification"
                    type="text"
                    placeholder="123456789"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Sexo</Label>
                  <select
                    id="gender"
                    name="gender"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Correo Electrónico</Label>
                <Input
                  id="register-email"
                  name="register-email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Contraseña</Label>
                <Input
                  id="register-password"
                  name="register-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Acepto los términos y condiciones
                </label>
              </div>

              <Button type="submit" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Crear Cuenta
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
