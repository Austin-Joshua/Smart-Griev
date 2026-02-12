import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X, Sun, Moon, User, Settings, LogOut, LogIn, Bot, BarChart3, Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationCenter } from "@/components/NotificationCenter";

const getNavLinks = (role?: string) => {
  const links = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "My Grievances" },
    { href: "/submit", label: "Submit" },
    { href: "/chatbot", label: "AI Chat", icon: Bot },
    { href: "/tracker", label: "Public Tracker", icon: Globe },
  ];

  if (role === "officer" || role === "admin") {
    links.push({ href: "/officer", label: "Officer Portal" });
  }
  if (role === "admin") {
    links.push({ href: "/admin", label: "Admin" });
    links.push({ href: "/analytics", label: "Analytics", icon: BarChart3 });
  }

  return links;
};

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  const navLinks = getNavLinks(user?.role);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center shadow-soft group-hover:shadow-card transition-shadow">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-xl">SmartGriev</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5",
                location.pathname === link.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {"icon" in link && link.icon && <link.icon className="w-3.5 h-3.5" />}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: Notifications + Dark mode + Profile */}
        <div className="flex items-center gap-1.5">
          {/* Notification Center */}
          {isAuthenticated && <NotificationCenter />}

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400" />
            )}
          </Button>

          {/* Profile Icon / Login */}
          {isAuthenticated && user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-full hero-gradient flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-soft hover:shadow-card transition-shadow cursor-pointer"
                title={user.fullName}
              >
                {user.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-72 bg-card border rounded-xl shadow-elevated z-50 animate-scale-in overflow-hidden">
                  <div className="p-4 bg-muted/30 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {user.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary-light text-primary">
                        <Shield className="w-3 h-3" />
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors">
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      Settings
                    </Link>
                    <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors">
                      <User className="w-4 h-4 text-muted-foreground" />
                      My Grievances
                    </Link>
                    <Link to="/chatbot" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors">
                      <Bot className="w-4 h-4 text-muted-foreground" />
                      AI Assistant
                    </Link>
                  </div>

                  <div className="border-t py-1">
                    <button
                      onClick={() => { logout(); setProfileOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-urgent hover:bg-urgent-light transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to="/login">
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="lg:hidden border-t bg-background animate-fade-in">
          <div className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 text-sm font-medium rounded-lg transition-colors flex items-center gap-2",
                  location.pathname === link.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {"icon" in link && link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium rounded-lg text-primary hover:bg-accent/50 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
