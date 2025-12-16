"use client"

import { Bot } from "lucide-react"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <Bot className="h-5 w-5 text-white" />
      </div>
      <span className="font-bold text-white text-lg">Bot Creator</span>
    </div>
  )
}

export function LogoWithText({ className = "" }: { className?: string }) {
  return <Logo className={className} />
}
