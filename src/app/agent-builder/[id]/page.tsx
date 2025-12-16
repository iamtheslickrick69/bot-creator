"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { BotInstallationGuide } from "@/components/bot-installation-guide"
import {
  ArrowLeft,
  Bot,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  MoreVertical,
  Play,
  Pause,
  Trash2,
  ExternalLink,
  FileText,
  LinkIcon,
  Type,
  Plus,
  RefreshCw,
  Palette,
  Settings,
  Code2,
  Copy,
  CheckCircle2,
  Globe,
  Loader2,
  X,
  Check,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data
const botData = {
  id: "1",
  name: "St. George Rentals Bot",
  status: "active" as const,
  website: "stgeorgerentals.com",
  industry: "Equipment Rental",
  createdAt: "2024-11-15",
  lastActive: "2 mins ago",
  stats: {
    totalConversations: 847,
    thisWeek: 124,
    leads: 52,
    leadsThisWeek: 8,
    avgResponseTime: "1.2s",
    satisfactionRate: 94,
  },
  appearance: {
    primaryColor: "#3B82F6",
    secondaryColor: "#1E40AF",
    position: "bottom-right",
    avatarPreset: "bot-1",
  },
  persona: {
    name: "Alex",
    tone: "friendly",
    welcomeMessage: "Hi! I'm Alex, your equipment rental assistant. How can I help you today?",
  },
}

const knowledgeSources = [
  {
    id: "1",
    type: "url",
    name: "https://stgeorgerentals.com",
    status: "completed" as const,
    chunks: 156,
    lastUpdated: "2024-12-01",
  },
  {
    id: "2",
    type: "url",
    name: "https://stgeorgerentals.com/equipment",
    status: "completed" as const,
    chunks: 89,
    lastUpdated: "2024-12-01",
  },
  {
    id: "3",
    type: "text",
    name: "Equipment FAQ",
    status: "completed" as const,
    chunks: 34,
    lastUpdated: "2024-11-28",
  },
  {
    id: "4",
    type: "text",
    name: "Rental Policies",
    status: "completed" as const,
    chunks: 22,
    lastUpdated: "2024-11-28",
  },
]

const recentConversations = [
  {
    id: "c1",
    visitor: "Visitor #1234",
    lastMessage: "Do you rent excavators for weekend projects?",
    time: "2 mins ago",
    messages: 5,
  },
  {
    id: "c2",
    visitor: "John D.",
    lastMessage: "Thanks for the help!",
    time: "15 mins ago",
    messages: 8,
  },
  {
    id: "c3",
    visitor: "Visitor #1232",
    lastMessage: "What are your hours?",
    time: "1 hour ago",
    messages: 3,
  },
]

const recentLeads = [
  {
    id: "l1",
    name: "Mike Johnson",
    email: "mike.j@email.com",
    phone: "(555) 123-4567",
    time: "30 mins ago",
  },
  {
    id: "l2",
    name: "Sarah Williams",
    email: "sarah.w@company.com",
    phone: null,
    time: "2 hours ago",
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

export default function BotManagementPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [isRetraining, setIsRetraining] = useState(false)
  const [copiedEmbed, setCopiedEmbed] = useState(false)

  const bot = botData // In production, fetch based on params.id
  const status = statusConfig[bot.status]

  const handleRetrain = () => {
    setIsRetraining(true)
    setTimeout(() => setIsRetraining(false), 3000)
  }

  const copyEmbedCode = () => {
    const code = `<script src="https://app.yourdomain.com/embed.js" data-bot-id="${bot.id}"></script>`
    navigator.clipboard.writeText(code)
    setCopiedEmbed(true)
    setTimeout(() => setCopiedEmbed(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/agent-builder")}
            className="mt-1 text-gray-400 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
              <Bot className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">{bot.name}</h1>
                <Badge variant="outline" className={cn("text-xs", status.class)}>
                  <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", status.dotClass)} />
                  {status.label}
                </Badge>
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {bot.website}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Last active {bot.lastActive}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-white/10 text-gray-300 hover:bg-white/5"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#12121a] border-white/10">
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
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="knowledge"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400"
          >
            <FileText className="mr-2 h-4 w-4" />
            Knowledge
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400"
          >
            <Palette className="mr-2 h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger
            value="embed"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400"
          >
            <Code2 className="mr-2 h-4 w-4" />
            Embed
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Conversations",
                value: bot.stats.totalConversations,
                subtext: `+${bot.stats.thisWeek} this week`,
                icon: MessageSquare,
              },
              {
                name: "Leads Captured",
                value: bot.stats.leads,
                subtext: `+${bot.stats.leadsThisWeek} this week`,
                icon: Users,
              },
              {
                name: "Avg Response Time",
                value: bot.stats.avgResponseTime,
                subtext: "AI-powered",
                icon: Clock,
              },
              {
                name: "Satisfaction Rate",
                value: `${bot.stats.satisfactionRate}%`,
                subtext: "Based on feedback",
                icon: TrendingUp,
              },
            ].map((stat) => (
              <Card key={stat.name} className="bg-white/[0.03] border-white/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-blue-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Conversations */}
            <Card className="bg-white/[0.03] border-white/5">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Recent Conversations</CardTitle>
                  <CardDescription className="text-gray-400">
                    Latest visitor interactions
                  </CardDescription>
                </div>
                <Link href="/agent-builder/conversations">
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentConversations.map((convo) => (
                  <div
                    key={convo.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{convo.visitor}</p>
                        <Badge variant="outline" className="text-xs text-gray-400 border-white/10">
                          {convo.messages} msgs
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 truncate mt-1">
                        {convo.lastMessage}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0 ml-4">{convo.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Leads */}
            <Card className="bg-white/[0.03] border-white/5">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Recent Leads</CardTitle>
                  <CardDescription className="text-gray-400">
                    Captured contact information
                  </CardDescription>
                </div>
                <Link href="/agent-builder/leads">
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white">{lead.name}</p>
                      <p className="text-sm text-gray-400">{lead.email}</p>
                      {lead.phone && (
                        <p className="text-sm text-gray-500">{lead.phone}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 shrink-0 ml-4">{lead.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Bot Info Card */}
          <Card className="bg-white/[0.03] border-white/5">
            <CardHeader>
              <CardTitle className="text-white">Bot Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Display Name</p>
                  <p className="text-white">{bot.persona.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tone</p>
                  <p className="text-white capitalize">{bot.persona.tone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Industry</p>
                  <p className="text-white">{bot.industry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Created</p>
                  <p className="text-white">{bot.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Website</p>
                  <p className="text-white">{bot.website}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bot ID</p>
                  <p className="text-white font-mono text-sm">{bot.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Tab */}
        <TabsContent value="knowledge" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Knowledge Sources</h2>
              <p className="text-sm text-gray-400">
                Content used to train your bot ({knowledgeSources.length} sources, {knowledgeSources.reduce((acc, s) => acc + s.chunks, 0)} chunks)
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRetrain}
                disabled={isRetraining}
                className="border-white/10 text-gray-300 hover:bg-white/5"
              >
                {isRetraining ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                {isRetraining ? "Retraining..." : "Retrain Bot"}
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Source
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {knowledgeSources.map((source) => (
              <Card key={source.id} className="bg-white/[0.03] border-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                        {source.type === "url" ? (
                          <LinkIcon className="h-5 w-5 text-blue-400" />
                        ) : (
                          <Type className="h-5 w-5 text-purple-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white truncate max-w-md">
                          {source.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500 capitalize">
                            {source.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {source.chunks} chunks
                          </span>
                          <span className="text-xs text-gray-500">
                            Updated {source.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-green-400 border-green-500/20">
                        <Check className="mr-1 h-3 w-3" />
                        {source.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-white/[0.03] border-white/5">
            <CardHeader>
              <CardTitle className="text-white">Visual Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Customize how your chat widget appears
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Colors */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-white mb-2 block">Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg border border-white/10"
                      style={{ backgroundColor: bot.appearance.primaryColor }}
                    />
                    <span className="text-white font-mono">
                      {bot.appearance.primaryColor}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-white mb-2 block">Secondary Color</Label>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg border border-white/10"
                      style={{ backgroundColor: bot.appearance.secondaryColor }}
                    />
                    <span className="text-white font-mono">
                      {bot.appearance.secondaryColor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Position */}
              <div>
                <Label className="text-white mb-2 block">Widget Position</Label>
                <p className="text-gray-400 capitalize">
                  {bot.appearance.position.replace("-", " ")}
                </p>
              </div>

              {/* Avatar */}
              <div>
                <Label className="text-white mb-2 block">Avatar</Label>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-gray-400">Preset: {bot.appearance.avatarPreset}</span>
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">
                Edit Appearance
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-white/[0.03] border-white/5">
            <CardHeader>
              <CardTitle className="text-white">Bot Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure bot behavior and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Toggle Settings */}
              {[
                {
                  id: "active",
                  label: "Bot Active",
                  description: "Enable or disable your bot",
                  defaultChecked: true,
                },
                {
                  id: "leadCapture",
                  label: "Lead Capture",
                  description: "Collect visitor contact information",
                  defaultChecked: true,
                },
                {
                  id: "humanHandoff",
                  label: "Human Handoff",
                  description: "Allow visitors to request human support",
                  defaultChecked: true,
                },
                {
                  id: "emailNotifications",
                  label: "Email Notifications",
                  description: "Receive email alerts for new leads",
                  defaultChecked: false,
                },
                {
                  id: "analytics",
                  label: "Analytics Tracking",
                  description: "Track conversation metrics and insights",
                  defaultChecked: true,
                },
              ].map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <div>
                    <Label htmlFor={setting.id} className="text-white font-medium">
                      {setting.label}
                    </Label>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  <Switch id={setting.id} defaultChecked={setting.defaultChecked} />
                </div>
              ))}

              {/* AI Model Selection */}
              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                <Label className="text-white font-medium mb-2 block">AI Model</Label>
                <p className="text-sm text-gray-500 mb-3">
                  Select the AI model for your bot
                </p>
                <Select defaultValue="gpt-4o-mini">
                  <SelectTrigger className="w-full md:w-64 bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12121a] border-white/10">
                    <SelectItem value="gpt-4o-mini" className="text-white focus:bg-white/10">
                      GPT-4o Mini (Recommended)
                    </SelectItem>
                    <SelectItem value="gpt-4o" className="text-white focus:bg-white/10">
                      GPT-4o (Advanced)
                    </SelectItem>
                    <SelectItem value="deepseek" className="text-white focus:bg-white/10">
                      DeepSeek (Cost-effective)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-red-500/5 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-400">Danger Zone</CardTitle>
              <CardDescription className="text-gray-400">
                Irreversible actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div>
                  <p className="text-white font-medium">Delete Bot</p>
                  <p className="text-sm text-gray-400">
                    Permanently delete this bot and all its data
                  </p>
                </div>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Bot
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Embed Tab */}
        <TabsContent value="embed" className="space-y-6">
          <BotInstallationGuide botId={bot.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
