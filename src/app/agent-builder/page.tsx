"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Bot,
  MessageSquare,
  Users,
  TrendingUp,
  Plus,
  MoreVertical,
  Play,
  Pause,
  Pencil,
  Trash2,
  Copy,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Zap,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for demonstration
const stats: Array<{
  name: string
  value: string
  change: string
  changeType: "positive" | "neutral" | "negative"
  icon: React.ComponentType<{ className?: string }>
}> = [
  {
    name: "Total Conversations",
    value: "1,234",
    change: "+12%",
    changeType: "positive",
    icon: MessageSquare,
  },
  {
    name: "Leads Captured",
    value: "89",
    change: "+23%",
    changeType: "positive",
    icon: Users,
  },
  {
    name: "Response Rate",
    value: "94%",
    change: "+2%",
    changeType: "positive",
    icon: TrendingUp,
  },
  {
    name: "Active Bots",
    value: "3",
    change: "of 5",
    changeType: "neutral",
    icon: Bot,
  },
]

// Mock bots moved to component state - will fetch from API

const quickActions = [
  {
    title: "Setup Guide",
    description: "Complete your bot setup in 5 easy steps",
    icon: BookOpen,
    href: "/agent-builder/help/setup",
    progress: 60,
  },
  {
    title: "View Conversations",
    description: "12 new conversations today",
    icon: MessageSquare,
    href: "/agent-builder/conversations",
    badge: "12",
  },
  {
    title: "Export Leads",
    description: "Download your leads as CSV",
    icon: Users,
    href: "/agent-builder/leads",
  },
]

const statusConfig = {
  active: {
    label: "Active",
    class: "bg-green-500/10 text-green-400 border-green-500/20",
    dotClass: "bg-green-500",
  },
  paused: {
    label: "Paused",
    class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    dotClass: "bg-yellow-500",
  },
  training: {
    label: "Training",
    class: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dotClass: "bg-blue-500 animate-pulse",
  },
  error: {
    label: "Error",
    class: "bg-red-500/10 text-red-400 border-red-500/20",
    dotClass: "bg-red-500",
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

export default function AgentBuilderDashboard() {
  const [selectedBot, setSelectedBot] = useState<string | null>(null)
  const [bots, setBots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const response = await fetch('/api/bots')
        if (!response.ok) throw new Error('Failed to fetch bots')
        const data = await response.json()
        setBots(data.bots || [])
      } catch (error) {
        console.error('Error fetching bots:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBots()
  }, [])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-gray-400">
            Welcome back! Here's what's happening with your bots.
          </p>
        </div>
        <Link href="/agent-builder/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
            <Plus className="mr-2 h-4 w-4" />
            Create Bot
          </Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.name}
            className="bg-white/[0.03] border-white/5 backdrop-blur-xl"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <stat.icon className="h-6 w-6 text-blue-400" />
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    stat.changeType === "positive" && "text-green-400",
                    stat.changeType === "negative" && "text-red-400",
                    stat.changeType === "neutral" && "text-gray-400"
                  )}
                >
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Bots List */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="bg-white/[0.03] border-white/5 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Your Bots</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage and monitor your AI assistants
                </CardDescription>
              </div>
              <Link href="/agent-builder/new">
                <Button variant="outline" size="sm" className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  New Bot
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : bots.length > 0 ? (
                <div className="space-y-4">
                  {bots.map((bot) => {
                    const status = statusConfig[bot.status as keyof typeof statusConfig] || statusConfig.active
                    return (
                      <motion.div
                        key={bot.id}
                        whileHover={{ scale: 1.01 }}
                        className={cn(
                          "group relative rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/10 hover:bg-white/[0.04]",
                          selectedBot === bot.id && "border-blue-500/30 bg-blue-500/5"
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          {/* Bot Info */}
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                              <Bot className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/agent-builder/${bot.id}`}
                                  className="text-lg font-semibold text-white hover:text-blue-400 transition-colors"
                                >
                                  {bot.name}
                                </Link>
                                <Badge
                                  variant="outline"
                                  className={cn("text-xs", status.class)}
                                >
                                  <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", status.dotClass)} />
                                  {status.label}
                                </Badge>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">{bot.website_url || 'No website'}</p>
                              <div className="mt-3 flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1.5 text-gray-400">
                                  <MessageSquare className="h-4 w-4" />
                                  0 conversations
                                </span>
                                <span className="flex items-center gap-1.5 text-gray-400">
                                  <Users className="h-4 w-4" />
                                  0 leads
                                </span>
                                <span className="flex items-center gap-1.5 text-gray-500">
                                  <Clock className="h-4 w-4" />
                                  {new Date(bot.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/5"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-[#12121a] border-white/10">
                              <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-white/5">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Bot
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-white/5">
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Embed Code
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-white/5">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View on Site
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10" />
                              {bot.status === "active" ? (
                                <DropdownMenuItem className="text-yellow-400 focus:text-yellow-300 focus:bg-yellow-500/10">
                                  <Pause className="mr-2 h-4 w-4" />
                                  Pause Bot
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-400 focus:text-green-300 focus:bg-green-500/10">
                                  <Play className="mr-2 h-4 w-4" />
                                  Activate Bot
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-red-500/10">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Bot
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 mb-4">
                    <Bot className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No bots yet
                  </h3>
                  <p className="text-gray-400 max-w-sm mb-6">
                    Create your first AI assistant to start engaging with your
                    website visitors automatically.
                  </p>
                  <Link href="/agent-builder/new">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Bot
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="group bg-white/[0.03] border-white/5 backdrop-blur-xl hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                      <action.icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                          {action.title}
                        </h4>
                        {action.badge && (
                          <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                            {action.badge}
                          </Badge>
                        )}
                        <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="mt-1 text-sm text-gray-400">
                        {action.description}
                      </p>
                      {action.progress !== undefined && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-500">Progress</span>
                            <span className="text-blue-400">{action.progress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                              style={{ width: `${action.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Recent Activity */}
          <Card className="bg-white/[0.03] border-white/5 backdrop-blur-xl mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { text: "New lead captured", bot: "St. George Rentals Bot", time: "2m ago", icon: Users },
                  { text: "Conversation resolved", bot: "Support Assistant", time: "15m ago", icon: CheckCircle2 },
                  { text: "Bot training completed", bot: "Sales Bot", time: "1h ago", icon: Zap },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                      <activity.icon className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{activity.text}</p>
                      <p className="text-xs text-gray-500 truncate">{activity.bot}</p>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
