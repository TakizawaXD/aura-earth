import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { User, LogOut } from "lucide-react";

const AuthDialog = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {user ? (
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleAuthClick}>
            <User className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button onClick={handleAuthClick}>
          <User className="h-4 w-4 mr-2" />
          Iniciar Sesión
        </Button>
      )}
    </>
  );
};

export default AuthDialog;
