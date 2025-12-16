"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bot,
  LayoutDashboard,
  Plus,
  BarChart3,
  MessageSquare,
  Users,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Sparkles,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Logo } from "@/components/logo"

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const mainNavItems: NavItem[] = [
  { name: "Dashboard", href: "/agent-builder", icon: LayoutDashboard },
  { name: "Create Bot", href: "/agent-builder/new", icon: Plus },
]

const secondaryNavItems: NavItem[] = [
  { name: "Analytics", href: "/agent-builder/analytics", icon: BarChart3 },
  { name: "Conversations", href: "/agent-builder/conversations", icon: MessageSquare, badge: "12" },
  { name: "Leads", href: "/agent-builder/leads", icon: Users, badge: "5" },
]

const bottomNavItems: NavItem[] = [
  { name: "Settings", href: "/agent-builder/settings", icon: Settings },
  { name: "Help", href: "/agent-builder/help", icon: HelpCircle },
]

export default function AgentBuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/agent-builder") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const NavLink = ({ item, collapsed }: { item: NavItem; collapsed: boolean }) => {
    const active = isActive(item.href)
    const content = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          active
            ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
            : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <item.icon className={cn("h-5 w-5 shrink-0", active && "text-blue-400")} />
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="truncate"
            >
              {item.name}
            </motion.span>
          )}
        </AnimatePresence>
        {!collapsed && item.badge && (
          <Badge
            variant="secondary"
            className="ml-auto bg-blue-600/20 text-blue-400 border-blue-500/30"
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    )

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.name}
            {item.badge && (
              <Badge variant="secondary" className="ml-1 bg-blue-600/20 text-blue-400">
                {item.badge}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      )
    }

    return content
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-[#0a0a0f]">
        {/* Desktop Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: isCollapsed ? 72 : 256 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/5 bg-[#0c0c12]/80 backdrop-blur-xl",
            "hidden md:flex"
          )}
        >
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
            <Link href="/" className="flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={isCollapsed ? "w-12" : "w-32"}
                >
                  <Logo className="w-full h-auto" />
                </motion.div>
              </AnimatePresence>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col gap-1 p-3">
            {/* Main Navigation */}
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <NavLink key={item.href} item={item} collapsed={isCollapsed} />
              ))}
            </div>

            {/* Divider */}
            <div className="my-4 h-px bg-white/5" />

            {/* Secondary Navigation */}
            <div className="space-y-1">
              {secondaryNavItems.map((item) => (
                <NavLink key={item.href} item={item} collapsed={isCollapsed} />
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Upgrade Card */}
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-blue-400" />
                    <span className="font-semibold text-white">Upgrade to Pro</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    Get unlimited bots, advanced analytics, and priority support.
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Upgrade Now
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Navigation */}
            <div className="space-y-1">
              {bottomNavItems.map((item) => (
                <NavLink key={item.href} item={item} collapsed={isCollapsed} />
              ))}
            </div>
          </nav>

          {/* Collapse Toggle */}
          <div className="border-t border-white/5 p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full justify-center text-gray-400 hover:text-white hover:bg-white/5"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span>Collapse</span>
                </>
              )}
            </Button>
          </div>
        </motion.aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col border-r border-white/5 bg-[#0c0c12] md:hidden"
              >
                {/* Mobile Logo */}
                <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
                  <Link href="/" className="flex items-center">
                    <Logo className="w-32 h-auto" />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-1 flex-col gap-1 p-3">
                  <div className="space-y-1">
                    {mainNavItems.map((item) => (
                      <NavLink key={item.href} item={item} collapsed={false} />
                    ))}
                  </div>
                  <div className="my-4 h-px bg-white/5" />
                  <div className="space-y-1">
                    {secondaryNavItems.map((item) => (
                      <NavLink key={item.href} item={item} collapsed={false} />
                    ))}
                  </div>
                  <div className="flex-1" />
                  <div className="mb-4 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-5 w-5 text-blue-400" />
                      <span className="font-semibold text-white">Upgrade to Pro</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">
                      Get unlimited bots, advanced analytics, and priority support.
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Upgrade Now
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {bottomNavItems.map((item) => (
                      <NavLink key={item.href} item={item} collapsed={false} />
                    ))}
                  </div>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div
          className={cn(
            "flex flex-1 flex-col transition-all duration-300",
            isCollapsed ? "md:ml-[72px]" : "md:ml-64"
          )}
        >
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl px-4 md:px-6">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search bots, conversations..."
                  className="w-full pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-400 hover:text-white hover:bg-white/5"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500" />
              </Button>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                JD
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  )
}
