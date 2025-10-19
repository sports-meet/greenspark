import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Leaf, Home, Trophy, Shield, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import AuthModal from "./components/auth/AuthModal";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    await base44.auth.logout();
    setUser(null);
    setIsProfileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(150,30%,98%)] to-white pb-20">
      <style>{`
        :root {
          --primary-green: 150 80% 40%;
          --secondary-cyan: 200 90% 50%;
          --accent-teal: 170 60% 50%;
        }
        
        /* Hide scrollbar for mobile */
        ::-webkit-scrollbar {
          display: none;
        }
        
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Mobile Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(150,80%,40%)] to-[hsl(170,70%,45%)] flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[hsl(150,80%,40%)] to-[hsl(170,70%,45%)] bg-clip-text text-transparent">
                GreenSpark
              </span>
            </Link>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {/* Points Badge */}
                  <Badge className="bg-gradient-to-r from-[hsl(150,80%,40%)] to-[hsl(170,70%,45%)] text-white px-3 py-1.5 shadow-md flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" />
                    <span className="font-semibold text-sm">{user.points || 0}</span>
                  </Badge>

                  {/* Profile Sheet */}
                  <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                    <SheetTrigger asChild>
                      <button className="flex items-center">
                        <Avatar className="w-9 h-9 border-2 border-[hsl(150,80%,40%)]">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-[hsl(150,80%,40%)] to-[hsl(170,70%,45%)] text-white font-semibold">
                            {user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Profile</SheetTitle>
                      </SheetHeader>
                      
                      <div className="mt-6 space-y-6">
                        {/* User Info */}
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[hsl(150,80%,40%)]/10 to-[hsl(170,70%,45%)]/10 rounded-xl">
                          <Avatar className="w-14 h-14 border-2 border-[hsl(150,80%,40%)]">
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback className="bg-gradient-to-br from-[hsl(150,80%,40%)] to-[hsl(170,70%,45%)] text-white font-semibold text-lg">
                              {user.username?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-gray-900">{user.username || 'User'}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>

                        {/* Points Display */}
                        <div className="p-4 bg-white rounded-xl border-2 border-[hsl(150,80%,40%)]/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Trophy className="w-5 h-5 text-[hsl(150,80%,40%)]" />
                              <span className="font-semibold text-gray-700">GreenPoints</span>
                            </div>
                            <span className="text-2xl font-bold text-[hsl(150,80%,40%)]">
                              {user.points || 0}
                            </span>
                          </div>
                        </div>

                        {/* Admin Access */}
                        {user.is_admin && (
                          <Link to={createPageUrl("Admin")} onClick={() => setIsProfileOpen(false)}>
                            <Button className="w-full bg-gradient-to-r from-[hsl(150,80%,40%)] to-[hsl(170,70%,45%)] text-white">
                              <Shield className="w-4 h-4 mr-2" />
                              Admin Dashboard
                            </Button>
                          </Link>
                        )}

                        {/* Logout */}
                        <Button 
                          onClick={handleLogout}
                          variant="outline" 
                          className="w-full border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              ) : (
                <Button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-gradient-to-r from-[hsl(150,80%,40%)] to-[hsl(170,70%,45%)] text-white hover:opacity-90 shadow-lg text-sm px-4 py-2"
                >
                  Join
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-140px)]">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-2 h-16">
          <Link 
            to={createPageUrl("Home")}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive(createPageUrl("Home")) 
                ? 'text-[hsl(150,80%,40%)]' 
                : 'text-gray-500'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          
          <Link 
            to={createPageUrl("Home")}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center gap-1 text-gray-500 transition-colors active:text-[hsl(150,80%,40%)]"
          >
            <Trophy className="w-5 h-5" />
            <span className="text-xs font-medium">Challenges</span>
          </Link>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={checkUser}
      />
    </div>
  );
}
