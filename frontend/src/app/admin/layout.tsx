"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Package2,
  Boxes,
  MessageSquare,
  LogOut,
  Users,
  Keyboard,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
// import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";

function AdminSidebarContent() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isDashboardActive = pathname === "/admin";
  const isCategoriesActive = pathname.startsWith("/admin/categories");
  const isProductsActive = pathname.startsWith("/admin/products");
  const isSubmissionsActive = pathname.startsWith("/admin/submissions");
  const isUsersActive = pathname.startsWith("/admin/users");

  if (!user) return null;

  return (
    <>
      <Sidebar className="">
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2  py-4 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Kevasiya Admin Panel</span>
            {/* <Image src="/logo.png" alt="Kevasiya" width={300} height={50} />  */}
          </Link>
        </SidebarHeader>
        <SidebarContent className="overflow-hidden">
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isDashboardActive}
                    tooltip="Dashboard"
                  >
                    <Link href="/admin">
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isCategoriesActive}
                    tooltip="Categories"
                  >
                    <Link href="/admin/categories">
                      <Boxes className="h-4 w-4" />
                      <span>Categories</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isProductsActive}
                    tooltip="Products"
                  >
                    <Link href="/admin/products">
                      <Package className="h-4 w-4" />
                      <span>Products</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isSubmissionsActive}
                    tooltip="Submissions"
                  >
                    <Link href="/admin/submissions">
                      <MessageSquare className="h-4 w-4" />
                      <span>Submissions</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isUsersActive}
                    tooltip="Users"
                  >
                    <Link href="/admin/users">
                      <Users className="h-4 w-4" />
                      <span>Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator/>
          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="text-xs text-muted-foreground px-2 py-1">
                <div className="flex items-center gap-1 mb-1">
                  <Keyboard className="h-3 w-3" />
                  <span>Keyboard Shortcuts</span>
                </div>
                <div className="space-y-1 text-[10px]">
                  <div>⌘|Ctrl + B: Toggle sidebar</div>
                  <div>⌘|Ctrl + K: Quick search</div>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">Logged in as:</span>
            <span className="text-xs font-medium">{user.username}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuth();
  const pathname = usePathname();

  const isDashboardActive = pathname === "/admin";
  const isCategoriesActive = pathname.startsWith("/admin/categories");
  const isProductsActive = pathname.startsWith("/admin/products");
  const isSubmissionsActive = pathname.startsWith("/admin/submissions");
  const isUsersActive = pathname.startsWith("/admin/users");

  // Wait for auth to be initialized before rendering
  // ProtectedRoute already handles this, but adding extra safety
  if (!isInitialized || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebarContent />
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6 transition-all duration-200 ease-linear">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="hidden md:inline-block">
                {isDashboardActive && "Dashboard"}
                {isCategoriesActive && "Categories & Sub-Categories"}
                {isProductsActive && "Products"}
                {isSubmissionsActive && "Contact Submissions"}
                {isUsersActive && "Admin Users"}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="text-xs text-muted-foreground hidden lg:block">
                Press ⌘/Ctrl + B to toggle sidebar
              </div>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
            {children}
          </main>
          <Toaster />
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // The AuthProvider should wrap everything to provide context.
  // The ProtectedRoute will handle rendering logic based on the auth state.
  return (
    <AuthProvider>
      {pathname !== "/admin/login" ? (
        <ProtectedRoute>
          <AdminLayoutContent>{children}</AdminLayoutContent>
        </ProtectedRoute>
      ) : (
        // Render the login page without the protected route or admin layout
        children
      )}
    </AuthProvider>
  );
}
