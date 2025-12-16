"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { BotCreatedSuccessModal } from "@/components/bot-created-success-modal"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Globe,
  FileText,
  Upload,
  MessageSquare,
  Palette,
  Users,
  Rocket,
  Bot,
  Sparkles,
  Link as LinkIcon,
  Type,
  File,
  X,
  Plus,
  Loader2,
  Send,
  User,
  ChevronDown,
  Copy,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"

// Types
interface BotConfig {
  // Step 1: Basics
  name: string
  websiteUrl: string
  industry: string
  description: string
  // Step 2: Knowledge
  knowledgeSources: KnowledgeSource[]
  // Step 3: Persona
  botName: string
  tone: string
  customInstructions: string
  welcomeMessage: string
  fallbackMessage: string
  // Step 4: Appearance
  avatarType: "preset" | "upload" | "initials"
  avatarPreset: string
  avatarUrl: string
  primaryColor: string
  secondaryColor: string
  position: "bottom-right" | "bottom-left"
  // Step 5: Lead Capture
  leadCaptureEnabled: boolean
  collectName: boolean
  nameRequired: boolean
  collectEmail: boolean
  emailRequired: boolean
  collectPhone: boolean
  phoneRequired: boolean
  triggerType: "before_first" | "after_messages" | "on_handoff"
  triggerAfterMessages: number
}

interface KnowledgeSource {
  id: string
  type: "url" | "text" | "file"
  name: string
  content: string
  status: "pending" | "processing" | "completed" | "error"
}

interface Message {
  role: "user" | "assistant"
  content: string
}

// Steps configuration
const steps = [
  { id: 1, name: "Basics", icon: Globe, description: "Name & website" },
  { id: 2, name: "Knowledge", icon: FileText, description: "Train your bot" },
  { id: 3, name: "Persona", icon: MessageSquare, description: "Voice & style" },
  { id: 4, name: "Appearance", icon: Palette, description: "Look & feel" },
  { id: 5, name: "Lead Capture", icon: Users, description: "Collect info" },
  { id: 6, name: "Launch", icon: Rocket, description: "Review & deploy" },
]

const industries = [
  "Equipment Rental",
  "Professional Services",
  "Home Services",
  "Retail/E-commerce",
  "Healthcare",
  "Real Estate",
  "Hospitality",
  "Technology",
  "Education",
  "Other",
]

const tones = [
  { value: "professional", label: "Professional", description: "Formal and business-like" },
  { value: "friendly", label: "Friendly", description: "Warm and approachable" },
  { value: "casual", label: "Casual", description: "Relaxed and conversational" },
  { value: "custom", label: "Custom", description: "Define your own style" },
]

const avatarPresets = [
  { id: "bot-1", label: "Bot Classic", gradient: "from-blue-500 to-blue-700" },
  { id: "bot-2", label: "Bot Modern", gradient: "from-purple-500 to-pink-600" },
  { id: "bot-3", label: "Bot Tech", gradient: "from-cyan-500 to-blue-600" },
  { id: "bot-4", label: "Bot Warm", gradient: "from-orange-500 to-red-600" },
  { id: "bot-5", label: "Bot Nature", gradient: "from-green-500 to-emerald-600" },
]

const colorPresets = [
  { primary: "#3B82F6", secondary: "#1E40AF", label: "Blue" },
  { primary: "#8B5CF6", secondary: "#6D28D9", label: "Purple" },
  { primary: "#10B981", secondary: "#059669", label: "Green" },
  { primary: "#F59E0B", secondary: "#D97706", label: "Orange" },
  { primary: "#EF4444", secondary: "#DC2626", label: "Red" },
  { primary: "#EC4899", secondary: "#DB2777", label: "Pink" },
]

// Initial state
const initialConfig: BotConfig = {
  name: "",
  websiteUrl: "",
  industry: "",
  description: "",
  knowledgeSources: [],
  botName: "AI Assistant",
  tone: "friendly",
  customInstructions: "",
  welcomeMessage: "Hi! How can I help you today?",
  fallbackMessage: "I'm not sure about that. Would you like to speak with a human?",
  avatarType: "preset",
  avatarPreset: "bot-1",
  avatarUrl: "",
  primaryColor: "#3B82F6",
  secondaryColor: "#1E40AF",
  position: "bottom-right",
  leadCaptureEnabled: true,
  collectName: true,
  nameRequired: false,
  collectEmail: true,
  emailRequired: true,
  collectPhone: false,
  phoneRequired: false,
  triggerType: "after_messages",
  triggerAfterMessages: 2,
}

export default function CreateBotWizard() {
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [config, setConfig] = useState<BotConfig>(initialConfig)
  const [isCreating, setIsCreating] = useState(false)
  const [previewMessages, setPreviewMessages] = useState<Message[]>([])
  const [previewInput, setPreviewInput] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdBotId, setCreatedBotId] = useState<string | null>(null)

  // Update config helper
  const updateConfig = useCallback((updates: Partial<BotConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }, [])

  // Navigation
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return config.name.trim() !== "" && config.websiteUrl.trim() !== ""
      case 2:
        return true // Knowledge is optional
      case 3:
        return config.botName.trim() !== ""
      case 4:
        return true
      case 5:
        return true
      case 6:
        return true
      default:
        return false
    }
  }

  const nextStep = () => {
    if (currentStep < 6 && canProceed()) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  // Knowledge source management
  const addKnowledgeSource = (source: Omit<KnowledgeSource, "id" | "status">) => {
    const newSource: KnowledgeSource = {
      ...source,
      id: Date.now().toString(),
      status: "pending",
    }
    updateConfig({
      knowledgeSources: [...config.knowledgeSources, newSource],
    })
    // Simulate processing
    setTimeout(() => {
      setConfig((prev) => ({
        ...prev,
        knowledgeSources: prev.knowledgeSources.map((s) =>
          s.id === newSource.id ? { ...s, status: "completed" } : s
        ),
      }))
    }, 2000)
  }

  const removeKnowledgeSource = (id: string) => {
    updateConfig({
      knowledgeSources: config.knowledgeSources.filter((s) => s.id !== id),
    })
  }

  // Preview chat
  const sendPreviewMessage = () => {
    if (!previewInput.trim()) return
    const userMessage: Message = { role: "user", content: previewInput }
    setPreviewMessages((prev) => [...prev, userMessage])
    setPreviewInput("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        role: "assistant",
        content: "Thanks for your message! This is a preview of how your bot will respond. In production, responses will be powered by AI and trained on your knowledge base.",
      }
      setPreviewMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  // Create bot
  const handleCreate = async () => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: config.name,
          description: config.description,
          websiteUrl: config.websiteUrl,
          industry: config.industry,
          botName: config.botName,
          tone: config.tone,
          customInstructions: config.customInstructions,
          welcomeMessage: config.welcomeMessage,
          fallbackMessage: config.fallbackMessage,
          // Appearance settings
          avatarType: config.avatarType,
          avatarPreset: config.avatarPreset,
          avatarUrl: config.avatarUrl,
          primaryColor: config.primaryColor,
          secondaryColor: config.secondaryColor,
          position: config.position,
          // Lead capture settings
          leadCaptureEnabled: config.leadCaptureEnabled,
          collectName: config.collectName,
          nameRequired: config.nameRequired,
          collectEmail: config.collectEmail,
          emailRequired: config.emailRequired,
          collectPhone: config.collectPhone,
          phoneRequired: config.phoneRequired,
          triggerType: config.triggerType,
          triggerAfterMessages: config.triggerAfterMessages,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create bot')
      }

      const { bot } = await response.json()

      // Show success modal instead of immediate redirect
      setCreatedBotId(bot.id)
      setShowSuccessModal(true)
      setIsCreating(false)
    } catch (error) {
      console.error('Error creating bot:', error)
      alert('Failed to create bot. Please try again.')
      setIsCreating(false)
    }
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    if (createdBotId) {
      router.push(`/agent-builder/${createdBotId}`)
    }
  }

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepBasics config={config} updateConfig={updateConfig} />
      case 2:
        return (
          <StepKnowledge
            config={config}
            addSource={addKnowledgeSource}
            removeSource={removeKnowledgeSource}
          />
        )
      case 3:
        return <StepPersona config={config} updateConfig={updateConfig} />
      case 4:
        return <StepAppearance config={config} updateConfig={updateConfig} />
      case 5:
        return <StepLeadCapture config={config} updateConfig={updateConfig} />
      case 6:
        return <StepReview config={config} />
      default:
        return null
    }
  }

  return (
    <>
      <BotCreatedSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        botId={createdBotId || ""}
        botName={config.name}
      />

      <div className="min-h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/agent-builder")}
            className="text-gray-400 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Create New Bot</h1>
            <p className="text-gray-400">
              Step {currentStep} of 6: {steps[currentStep - 1].name}
            </p>
          </div>
          </div>
        </div>

        {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-3 cursor-pointer group",
                  currentStep >= step.id ? "text-white" : "text-gray-500"
                )}
                onClick={() => currentStep > step.id && setCurrentStep(step.id)}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    currentStep === step.id
                      ? "border-blue-500 bg-blue-500/20"
                      : currentStep > step.id
                      ? "border-green-500 bg-green-500/20"
                      : "border-white/10 bg-white/5 group-hover:border-white/20"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5 text-green-400" />
                  ) : (
                    <step.icon
                      className={cn(
                        "h-5 w-5",
                        currentStep === step.id ? "text-blue-400" : "text-gray-500"
                      )}
                    />
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{step.name}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "hidden md:block h-0.5 w-12 lg:w-24 mx-4",
                    currentStep > step.id ? "bg-green-500" : "bg-white/10"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="order-2 lg:order-1">
          <Card className="bg-white/[0.03] border-white/5 backdrop-blur-xl h-full">
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="order-1 lg:order-2">
          <BotPreview
            config={config}
            messages={previewMessages}
            input={previewInput}
            setInput={setPreviewInput}
            onSend={sendPreviewMessage}
          />
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="text-gray-400 hover:text-white hover:bg-white/5"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {currentStep} / {steps.length}
          </span>
          <Progress value={(currentStep / steps.length) * 100} className="w-32 h-2 bg-white/10" />
        </div>
        {currentStep < 6 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Rocket className="mr-2 h-4 w-4" />
                Launch Bot
              </>
            )}
          </Button>
        )}
      </div>
      </div>
    </>
  )
}

// Step 1: Basics
function StepBasics({
  config,
  updateConfig,
}: {
  config: BotConfig
  updateConfig: (updates: Partial<BotConfig>) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Basic Information</h2>
        <p className="text-gray-400">
          Let's start with the basics. What should we call your bot?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Bot Name <span className="text-red-400">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Customer Support Bot"
            value={config.name}
            onChange={(e) => updateConfig({ name: e.target.value })}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500">Internal name for your reference</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="text-white">
            Website URL <span className="text-red-400">*</span>
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="website"
              placeholder="https://yourwebsite.com"
              value={config.websiteUrl}
              onChange={(e) => updateConfig({ websiteUrl: e.target.value })}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>
          <p className="text-xs text-gray-500">We'll use this to train your bot</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry" className="text-white">
            Industry
          </Label>
          <Select
            value={config.industry}
            onValueChange={(value) => updateConfig({ industry: value })}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent className="bg-[#12121a] border-white/10">
              {industries.map((industry) => (
                <SelectItem
                  key={industry}
                  value={industry}
                  className="text-white focus:bg-white/10"
                >
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Helps us optimize for your use case</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">
            Business Description
          </Label>
          <Textarea
            id="description"
            placeholder="Tell us about your business and what you'd like your bot to help with..."
            value={config.description}
            onChange={(e) => updateConfig({ description: e.target.value })}
            rows={4}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 resize-none"
          />
        </div>
      </div>
    </div>
  )
}

// Step 2: Knowledge
function StepKnowledge({
  config,
  addSource,
  removeSource,
}: {
  config: BotConfig
  addSource: (source: Omit<KnowledgeSource, "id" | "status">) => void
  removeSource: (id: string) => void
}) {
  const [activeTab, setActiveTab] = useState("url")
  const [urlInput, setUrlInput] = useState("")
  const [textInput, setTextInput] = useState("")
  const [textName, setTextName] = useState("")

  const handleAddUrl = () => {
    if (!urlInput.trim()) return
    addSource({ type: "url", name: urlInput, content: urlInput })
    setUrlInput("")
  }

  const handleAddText = () => {
    if (!textInput.trim()) return
    addSource({
      type: "text",
      name: textName || "Custom Content",
      content: textInput,
    })
    setTextInput("")
    setTextName("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Train Your Bot</h2>
        <p className="text-gray-400">
          Add content to teach your bot about your business. The more you add, the
          smarter your bot becomes.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger
            value="url"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400"
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            Website URLs
          </TabsTrigger>
          <TabsTrigger
            value="text"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400"
          >
            <Type className="mr-2 h-4 w-4" />
            Text Content
          </TabsTrigger>
          <TabsTrigger
            value="file"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400"
          >
            <File className="mr-2 h-4 w-4" />
            Upload Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://yoursite.com/about"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
            />
            <Button
              onClick={handleAddUrl}
              disabled={!urlInput.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            We'll crawl and extract content from these pages
          </p>
        </TabsContent>

        <TabsContent value="text" className="mt-4 space-y-4">
          <Input
            placeholder="Content name (e.g., FAQ, Policies)"
            value={textName}
            onChange={(e) => setTextName(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
          />
          <Textarea
            placeholder="Paste your content here (FAQs, policies, product info...)"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={6}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 resize-none"
          />
          <Button
            onClick={handleAddText}
            disabled={!textInput.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Content
          </Button>
        </TabsContent>

        <TabsContent value="file" className="mt-4">
          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer">
            <Upload className="h-10 w-10 mx-auto text-gray-500 mb-4" />
            <p className="text-white font-medium mb-2">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, DOCX, TXT (Max 10MB per file)
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Added Sources */}
      {config.knowledgeSources.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white">Added Sources</h3>
          {config.knowledgeSources.map((source) => (
            <div
              key={source.id}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-3">
                {source.type === "url" && <LinkIcon className="h-4 w-4 text-blue-400" />}
                {source.type === "text" && <Type className="h-4 w-4 text-purple-400" />}
                {source.type === "file" && <File className="h-4 w-4 text-green-400" />}
                <div>
                  <p className="text-sm text-white truncate max-w-[200px]">
                    {source.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{source.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {source.status === "pending" && (
                  <Badge variant="outline" className="text-yellow-400 border-yellow-500/20">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Processing
                  </Badge>
                )}
                {source.status === "completed" && (
                  <Badge variant="outline" className="text-green-400 border-green-500/20">
                    <Check className="mr-1 h-3 w-3" />
                    Ready
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSource(source.id)}
                  className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Step 3: Persona
function StepPersona({
  config,
  updateConfig,
}: {
  config: BotConfig
  updateConfig: (updates: Partial<BotConfig>) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Bot Persona</h2>
        <p className="text-gray-400">
          Define how your bot communicates with visitors.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="botName" className="text-white">
            Display Name <span className="text-red-400">*</span>
          </Label>
          <Input
            id="botName"
            placeholder="e.g., Alex, Helper, Support"
            value={config.botName}
            onChange={(e) => updateConfig({ botName: e.target.value })}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500">Visitors will see this name</p>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Tone</Label>
          <div className="grid grid-cols-2 gap-3">
            {tones.map((tone) => (
              <div
                key={tone.value}
                onClick={() => updateConfig({ tone: tone.value })}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-all",
                  config.tone === tone.value
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                )}
              >
                <p className="font-medium text-white">{tone.label}</p>
                <p className="text-xs text-gray-500 mt-1">{tone.description}</p>
              </div>
            ))}
          </div>
        </div>

        {config.tone === "custom" && (
          <div className="space-y-2">
            <Label htmlFor="customInstructions" className="text-white">
              Custom Instructions
            </Label>
            <Textarea
              id="customInstructions"
              placeholder="Describe how you want your bot to communicate..."
              value={config.customInstructions}
              onChange={(e) => updateConfig({ customInstructions: e.target.value })}
              rows={4}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 resize-none"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="welcomeMessage" className="text-white">
            Welcome Message
          </Label>
          <Textarea
            id="welcomeMessage"
            placeholder="Hi! How can I help you today?"
            value={config.welcomeMessage}
            onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
            rows={2}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fallbackMessage" className="text-white">
            Fallback Message
          </Label>
          <Textarea
            id="fallbackMessage"
            placeholder="I'm not sure about that. Would you like to speak with a human?"
            value={config.fallbackMessage}
            onChange={(e) => updateConfig({ fallbackMessage: e.target.value })}
            rows={2}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 resize-none"
          />
          <p className="text-xs text-gray-500">
            Shown when the bot can't answer a question
          </p>
        </div>
      </div>
    </div>
  )
}

// Step 4: Appearance
function StepAppearance({
  config,
  updateConfig,
}: {
  config: BotConfig
  updateConfig: (updates: Partial<BotConfig>) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Appearance</h2>
        <p className="text-gray-400">
          Customize how your chat widget looks on your website.
        </p>
      </div>

      <div className="space-y-6">
        {/* Avatar Selection */}
        <div className="space-y-3">
          <Label className="text-white">Avatar Style</Label>
          <div className="grid grid-cols-5 gap-3">
            {avatarPresets.map((preset) => (
              <div
                key={preset.id}
                onClick={() =>
                  updateConfig({ avatarType: "preset", avatarPreset: preset.id })
                }
                className={cn(
                  "aspect-square rounded-xl flex items-center justify-center cursor-pointer border-2 transition-all",
                  config.avatarPreset === preset.id && config.avatarType === "preset"
                    ? "border-blue-500 ring-2 ring-blue-500/30"
                    : "border-transparent hover:border-white/20"
                )}
              >
                <div
                  className={cn(
                    "h-12 w-12 rounded-full bg-gradient-to-br flex items-center justify-center",
                    preset.gradient
                  )}
                >
                  <Bot className="h-6 w-6 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-3">
          <Label className="text-white">Color Theme</Label>
          <div className="flex gap-3 flex-wrap">
            {colorPresets.map((color) => (
              <div
                key={color.primary}
                onClick={() =>
                  updateConfig({
                    primaryColor: color.primary,
                    secondaryColor: color.secondary,
                  })
                }
                className={cn(
                  "h-10 w-10 rounded-full cursor-pointer border-2 transition-all",
                  config.primaryColor === color.primary
                    ? "border-white ring-2 ring-white/30"
                    : "border-transparent hover:border-white/50"
                )}
                style={{ backgroundColor: color.primary }}
                title={color.label}
              />
            ))}
          </div>
        </div>

        {/* Custom Color Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor" className="text-white">
              Primary Color
            </Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={config.primaryColor}
                onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                className="h-10 w-14 p-1 bg-transparent border-white/10 cursor-pointer"
              />
              <Input
                id="primaryColor"
                value={config.primaryColor}
                onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                className="bg-white/5 border-white/10 text-white font-mono text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryColor" className="text-white">
              Secondary Color
            </Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={config.secondaryColor}
                onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                className="h-10 w-14 p-1 bg-transparent border-white/10 cursor-pointer"
              />
              <Input
                id="secondaryColor"
                value={config.secondaryColor}
                onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                className="bg-white/5 border-white/10 text-white font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Position */}
        <div className="space-y-3">
          <Label className="text-white">Widget Position</Label>
          <div className="grid grid-cols-2 gap-3">
            {["bottom-right", "bottom-left"].map((pos) => (
              <div
                key={pos}
                onClick={() =>
                  updateConfig({ position: pos as "bottom-right" | "bottom-left" })
                }
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-all",
                  config.position === pos
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                )}
              >
                <div className="h-16 w-full bg-white/5 rounded-lg relative mb-2">
                  <div
                    className={cn(
                      "absolute bottom-2 h-4 w-4 rounded-full bg-blue-500",
                      pos === "bottom-right" ? "right-2" : "left-2"
                    )}
                  />
                </div>
                <p className="text-sm text-white capitalize text-center">
                  {pos.replace("-", " ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 5: Lead Capture
function StepLeadCapture({
  config,
  updateConfig,
}: {
  config: BotConfig
  updateConfig: (updates: Partial<BotConfig>) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Lead Capture</h2>
        <p className="text-gray-400">
          Collect visitor information to follow up with potential customers.
        </p>
      </div>

      {/* Enable/Disable */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
        <div>
          <p className="font-medium text-white">Enable Lead Capture</p>
          <p className="text-sm text-gray-500">
            Collect contact information from visitors
          </p>
        </div>
        <Switch
          checked={config.leadCaptureEnabled}
          onCheckedChange={(checked) =>
            updateConfig({ leadCaptureEnabled: checked })
          }
        />
      </div>

      {config.leadCaptureEnabled && (
        <>
          {/* Fields */}
          <div className="space-y-3">
            <Label className="text-white">Collect Fields</Label>
            <div className="space-y-3">
              {[
                { key: "Name", collect: "collectName", required: "nameRequired" },
                { key: "Email", collect: "collectEmail", required: "emailRequired" },
                { key: "Phone", collect: "collectPhone", required: "phoneRequired" },
              ].map((field) => (
                <div
                  key={field.key}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={config[field.collect as keyof BotConfig] as boolean}
                      onCheckedChange={(checked) =>
                        updateConfig({ [field.collect]: checked })
                      }
                    />
                    <span className="text-white">{field.key}</span>
                  </div>
                  {config[field.collect as keyof BotConfig] && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Required</span>
                      <Switch
                        checked={config[field.required as keyof BotConfig] as boolean}
                        onCheckedChange={(checked) =>
                          updateConfig({ [field.required]: checked })
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Trigger */}
          <div className="space-y-3">
            <Label className="text-white">When to Show Form</Label>
            <Select
              value={config.triggerType}
              onValueChange={(value: "before_first" | "after_messages" | "on_handoff") =>
                updateConfig({ triggerType: value })
              }
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#12121a] border-white/10">
                <SelectItem value="before_first" className="text-white focus:bg-white/10">
                  Before first response
                </SelectItem>
                <SelectItem value="after_messages" className="text-white focus:bg-white/10">
                  After a few messages
                </SelectItem>
                <SelectItem value="on_handoff" className="text-white focus:bg-white/10">
                  When requesting human
                </SelectItem>
              </SelectContent>
            </Select>

            {config.triggerType === "after_messages" && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Show after</span>
                <Select
                  value={config.triggerAfterMessages.toString()}
                  onValueChange={(value) =>
                    updateConfig({ triggerAfterMessages: parseInt(value) })
                  }
                >
                  <SelectTrigger className="w-20 bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12121a] border-white/10">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem
                        key={n}
                        value={n.toString()}
                        className="text-white focus:bg-white/10"
                      >
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-400">messages</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// Step 6: Review
function StepReview({ config }: { config: BotConfig }) {
  const [copied, setCopied] = useState(false)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://your-app.vercel.app')

  const embedCode = `<script src="${appUrl}/embed.js" data-bot-id="YOUR_BOT_ID"></script>`

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Review & Launch</h2>
        <p className="text-gray-400">
          Review your bot configuration before launching.
        </p>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {/* Basics */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-blue-400" />
                <span className="font-medium text-white">Basic Information</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 pb-1 px-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Name</span>
                <span className="text-white">{config.name || "Not set"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Website</span>
                <span className="text-white truncate max-w-[200px]">{config.websiteUrl || "Not set"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Industry</span>
                <span className="text-white">{config.industry || "Not set"}</span>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Knowledge */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-purple-400" />
                <span className="font-medium text-white">Knowledge Sources</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 pb-1 px-4">
              {config.knowledgeSources.length > 0 ? (
                <div className="space-y-2">
                  {config.knowledgeSources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 truncate max-w-[200px]">{source.name}</span>
                      <Badge variant="outline" className="text-green-400 border-green-500/20">
                        <Check className="mr-1 h-3 w-3" />
                        Ready
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No sources added</p>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Persona */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-green-400" />
                <span className="font-medium text-white">Persona</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 pb-1 px-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Display Name</span>
                <span className="text-white">{config.botName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tone</span>
                <span className="text-white capitalize">{config.tone}</span>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Appearance */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-orange-400" />
                <span className="font-medium text-white">Appearance</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 pb-1 px-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Primary Color</span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded"
                    style={{ backgroundColor: config.primaryColor }}
                  />
                  <span className="text-white font-mono text-xs">{config.primaryColor}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Position</span>
                <span className="text-white capitalize">{config.position.replace("-", " ")}</span>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Lead Capture */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-pink-400" />
                <span className="font-medium text-white">Lead Capture</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 pb-1 px-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Enabled</span>
                <span className={config.leadCaptureEnabled ? "text-green-400" : "text-gray-500"}>
                  {config.leadCaptureEnabled ? "Yes" : "No"}
                </span>
              </div>
              {config.leadCaptureEnabled && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Fields</span>
                    <span className="text-white">
                      {[
                        config.collectName && "Name",
                        config.collectEmail && "Email",
                        config.collectPhone && "Phone",
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Trigger</span>
                    <span className="text-white capitalize">
                      {config.triggerType.replace("_", " ")}
                    </span>
                  </div>
                </>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>

      {/* Embed Code Preview */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-white">Embed Code</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyCode}
            className="text-gray-400 hover:text-white"
          >
            {copied ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
        <pre className="text-xs text-gray-400 bg-black/30 p-3 rounded-lg overflow-x-auto">
          {embedCode}
        </pre>
      </div>
    </div>
  )
}

// Bot Preview Component
function BotPreview({
  config,
  messages,
  input,
  setInput,
  onSend,
}: {
  config: BotConfig
  messages: Message[]
  input: string
  setInput: (value: string) => void
  onSend: () => void
}) {
  const avatarGradient = avatarPresets.find((p) => p.id === config.avatarPreset)?.gradient || "from-blue-500 to-blue-700"

  return (
    <Card className="bg-white/[0.03] border-white/5 backdrop-blur-xl sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-400" />
          Live Preview
        </CardTitle>
        <CardDescription className="text-gray-400">
          See how your bot will appear to visitors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          {/* Chat Widget Preview */}
          <div
            className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(180deg, #1a1a24 0%, #12121a 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Header */}
            <div
              className="p-4 flex items-center gap-3"
              style={{ backgroundColor: config.primaryColor }}
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-full bg-gradient-to-br flex items-center justify-center",
                  avatarGradient
                )}
              >
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">{config.botName || "AI Assistant"}</p>
                <p className="text-xs text-white/70">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="h-64 p-4 space-y-4 overflow-y-auto">
              {/* Welcome Message */}
              <div className="flex items-start gap-2">
                <div
                  className={cn(
                    "h-7 w-7 rounded-full bg-gradient-to-br flex items-center justify-center shrink-0",
                    avatarGradient
                  )}
                >
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm text-white">{config.welcomeMessage}</p>
                </div>
              </div>

              {/* Chat Messages */}
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-2",
                    message.role === "user" && "flex-row-reverse"
                  )}
                >
                  {message.role === "assistant" ? (
                    <div
                      className={cn(
                        "h-7 w-7 rounded-full bg-gradient-to-br flex items-center justify-center shrink-0",
                        avatarGradient
                      )}
                    >
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-gray-600 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 max-w-[80%]",
                      message.role === "user"
                        ? "rounded-tr-sm"
                        : "rounded-tl-sm bg-white/10"
                    )}
                    style={{
                      backgroundColor:
                        message.role === "user" ? config.primaryColor : undefined,
                    }}
                  >
                    <p className="text-sm text-white">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSend()}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-sm"
                />
                <Button
                  size="icon"
                  onClick={onSend}
                  style={{ backgroundColor: config.primaryColor }}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
