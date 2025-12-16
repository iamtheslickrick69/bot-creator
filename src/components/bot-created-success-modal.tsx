"use client"

import { useState } from "react"
import { Check, Copy, ExternalLink, Rocket, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BotCreatedSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  botId: string
  botName: string
  appUrl?: string
}

export function BotCreatedSuccessModal({
  isOpen,
  onClose,
  botId,
  botName,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
}: BotCreatedSuccessModalProps) {
  const [copied, setCopied] = useState(false)

  const embedCode = `<script src="${appUrl}/embed.js" data-bot-id="${botId}"></script>`

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-[#1a1a24] border-white/10">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            🎉 {botName} is Ready!
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Your AI assistant has been created successfully. Let's get it on your website.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-bold text-white">✅</div>
              <div className="text-xs text-gray-400 mt-1">Active</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-bold text-white">🚀</div>
              <div className="text-xs text-gray-400 mt-1">Ready to Deploy</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-bold text-white">💬</div>
              <div className="text-xs text-gray-400 mt-1">AI Powered</div>
            </div>
          </div>

          {/* Embed Code */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Your Embed Code</h3>
              <Button
                onClick={copyCode}
                size="sm"
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
            <div className="relative">
              <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto border border-white/10">
                <code className="text-sm text-green-400 font-mono">{embedCode}</code>
              </pre>
            </div>
            <p className="text-xs text-gray-500">
              Paste this code in your website's HTML, just before the closing {'</body>'} tag
            </p>
          </div>

          {/* Quick Platform Buttons */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Installing on:</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: "Shopify", icon: "🛍️" },
                { name: "WordPress", icon: "📝" },
                { name: "Wix", icon: "🎨" },
                { name: "Squarespace", icon: "⬛" },
                { name: "Webflow", icon: "🌊" },
                { name: "HTML", icon: "💻" },
              ].map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => {
                    onClose()
                    // Scroll to embed tab is handled by parent component
                  }}
                  className="flex items-center gap-2 p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all text-left"
                >
                  <span className="text-xl">{platform.icon}</span>
                  <span className="text-sm text-white font-medium">{platform.name}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center">
              Click to see step-by-step instructions for your platform
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={onClose}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              View Installation Guide
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-white/10 text-white hover:bg-white/5"
              asChild
            >
              <a href={`${appUrl}/agent-builder/${botId}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Dashboard
              </a>
            </Button>
          </div>

          {/* Support Note */}
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
            <p className="text-sm text-gray-300">
              Need help installing? Our team is here to assist you!
            </p>
            <a
              href="mailto:hello@haestus.dev?subject=Bot Installation Help"
              className="text-sm text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 mt-2"
            >
              Contact Support <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
