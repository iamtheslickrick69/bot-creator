"use client"

import { useState } from "react"
import { Check, Copy, ExternalLink, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BotInstallationGuideProps {
  botId: string
  appUrl?: string
}

const platforms = [
  {
    id: "shopify",
    name: "Shopify",
    icon: "🛍️",
    difficulty: "Easy",
    time: "2 minutes",
    steps: [
      {
        title: "Open Theme Editor",
        description: "Go to Online Store → Themes → Actions → Edit Code",
        details: "In your Shopify admin panel, navigate to the theme customizer."
      },
      {
        title: "Find theme.liquid",
        description: "In the Layout folder, click on theme.liquid",
        details: "This is your main template file that appears on all pages."
      },
      {
        title: "Paste the code",
        description: "Scroll down and paste the code just before the </body> tag",
        details: "Look for </body> near the bottom of the file and paste the embed code right above it."
      },
      {
        title: "Save and test",
        description: "Click Save and visit your store to see your bot live!",
        details: "The chat widget should appear in the bottom corner of your store."
      }
    ],
    videoUrl: "https://www.youtube.com/watch?v=shopify-tutorial",
    docsUrl: "https://help.shopify.com/en/manual/online-store/themes/theme-structure/extend/edit-theme-code"
  },
  {
    id: "wordpress",
    name: "WordPress",
    icon: "📝",
    difficulty: "Easy",
    time: "2 minutes",
    steps: [
      {
        title: "Install Plugin (Recommended)",
        description: "Install 'Insert Headers and Footers' or 'WPCode' plugin",
        details: "Go to Plugins → Add New, search for the plugin, and click Install & Activate."
      },
      {
        title: "Paste the code",
        description: "Go to Settings → Insert Headers and Footers → Footer section",
        details: "Paste your embed code in the Footer Scripts section."
      },
      {
        title: "Save changes",
        description: "Click Save and visit your website",
        details: "The bot will now appear on all pages of your WordPress site."
      }
    ],
    altMethod: {
      title: "Alternative: Theme Editor",
      steps: "Go to Appearance → Theme File Editor → footer.php → Paste before </body> → Update File"
    },
    videoUrl: "https://www.youtube.com/watch?v=wordpress-tutorial",
    docsUrl: "https://wordpress.org/support/"
  },
  {
    id: "wix",
    name: "Wix",
    icon: "🎨",
    difficulty: "Easy",
    time: "1 minute",
    steps: [
      {
        title: "Open Settings",
        description: "Click Settings in your Wix dashboard",
        details: "Look for the settings gear icon in the left sidebar."
      },
      {
        title: "Custom Code",
        description: "Go to Advanced → Custom Code",
        details: "This is where you can add custom scripts to your Wix site."
      },
      {
        title: "Add code snippet",
        description: "Click + Add Custom Code → Paste your code → Set to 'Body - end'",
        details: "Make sure to select 'Load code on all pages' and position as 'Body - end'."
      },
      {
        title: "Apply and publish",
        description: "Click Apply, then Publish your site",
        details: "Your bot will appear after you publish the changes."
      }
    ],
    videoUrl: "https://www.youtube.com/watch?v=wix-tutorial",
    docsUrl: "https://support.wix.com/en/article/embedding-custom-code-to-your-site"
  },
  {
    id: "squarespace",
    name: "Squarespace",
    icon: "⬛",
    difficulty: "Easy",
    time: "1 minute",
    steps: [
      {
        title: "Open Settings",
        description: "Go to Settings → Advanced → Code Injection",
        details: "This feature is available on Business and Commerce plans."
      },
      {
        title: "Paste in Footer",
        description: "Paste the code in the FOOTER section",
        details: "The Footer injection appears on every page of your site."
      },
      {
        title: "Save and test",
        description: "Click Save and visit your website",
        details: "The chat widget should appear immediately."
      }
    ],
    videoUrl: "https://www.youtube.com/watch?v=squarespace-tutorial",
    docsUrl: "https://support.squarespace.com/hc/en-us/articles/205815908-Using-code-injection"
  },
  {
    id: "webflow",
    name: "Webflow",
    icon: "🌊",
    difficulty: "Easy",
    time: "1 minute",
    steps: [
      {
        title: "Open Project Settings",
        description: "Click Project Settings in your Webflow dashboard",
        details: "The gear icon at the top left of your project."
      },
      {
        title: "Custom Code",
        description: "Go to Custom Code tab",
        details: "This is where you add site-wide code."
      },
      {
        title: "Paste in Footer",
        description: "Paste the code in the Footer Code section",
        details: "Footer code loads on every page after the </body> tag."
      },
      {
        title: "Publish site",
        description: "Save and publish your site to see the bot live",
        details: "The changes will be live once you publish."
      }
    ],
    videoUrl: "https://www.youtube.com/watch?v=webflow-tutorial",
    docsUrl: "https://university.webflow.com/lesson/custom-code-in-the-head-and-body-tags"
  },
  {
    id: "html",
    name: "HTML Website",
    icon: "💻",
    difficulty: "Easy",
    time: "30 seconds",
    steps: [
      {
        title: "Open your HTML file",
        description: "Open your website's HTML file in a text editor",
        details: "Usually named index.html or similar."
      },
      {
        title: "Find the closing body tag",
        description: "Search for </body> in your file",
        details: "This is usually near the end of the HTML file."
      },
      {
        title: "Paste the code",
        description: "Paste the embed code just before </body>",
        details: "Make sure it's inside the body tag, not after it."
      },
      {
        title: "Upload and test",
        description: "Save the file and upload to your server",
        details: "Use FTP or your hosting control panel to upload the updated file."
      }
    ],
    docsUrl: "https://developer.mozilla.org/en-US/docs/Learn/HTML"
  }
]

export function BotInstallationGuide({ botId, appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001" }: BotInstallationGuideProps) {
  const [selectedPlatform, setSelectedPlatform] = useState("shopify")
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedInstructions, setCopiedInstructions] = useState(false)

  const embedCode = `<script src="${appUrl}/embed.js" data-bot-id="${botId}"></script>`

  const platform = platforms.find(p => p.id === selectedPlatform) || platforms[0]

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const copyInstructions = () => {
    const instructions = platform.steps.map((step, i) =>
      `${i + 1}. ${step.title}\n   ${step.description}\n`
    ).join('\n')

    navigator.clipboard.writeText(`How to install on ${platform.name}:\n\n${instructions}\n\nEmbed Code:\n${embedCode}`)
    setCopiedInstructions(true)
    setTimeout(() => setCopiedInstructions(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Platform Selection */}
      <Card className="bg-white/[0.03] border-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Install Your Bot</CardTitle>
          <CardDescription className="text-gray-400">
            Choose your platform for step-by-step installation instructions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:scale-105",
                  selectedPlatform === p.id
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                )}
              >
                <span className="text-3xl">{p.icon}</span>
                <span className="text-sm font-medium text-white">{p.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Embed Code */}
      <Card className="bg-white/[0.03] border-white/5 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Your Embed Code</CardTitle>
              <CardDescription className="text-gray-400">
                Copy this code and follow the instructions below
              </CardDescription>
            </div>
            <Button
              onClick={copyCode}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
            >
              {copiedCode ? (
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
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto border border-white/10">
              <code className="text-sm text-green-400 font-mono">{embedCode}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Installation Instructions */}
      <Card className="bg-white/[0.03] border-white/5 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <span className="text-4xl">{platform.icon}</span>
              <div>
                <CardTitle className="text-white">{platform.name} Installation</CardTitle>
                <CardDescription className="text-gray-400 mt-1">
                  <span className="inline-flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      platform.difficulty === "Easy" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    )}>
                      {platform.difficulty}
                    </span>
                    <span>•</span>
                    <span>{platform.time}</span>
                  </span>
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {platform.videoUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-white hover:bg-white/5"
                  asChild
                >
                  <a href={platform.videoUrl} target="_blank" rel="noopener noreferrer">
                    <Play className="mr-2 h-4 w-4" />
                    Video
                  </a>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={copyInstructions}
                className="border-white/10 text-white hover:bg-white/5"
              >
                {copiedInstructions ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy All
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Steps */}
          <div className="space-y-4">
            {platform.steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 border-2 border-blue-500">
                    <span className="text-lg font-bold text-blue-400">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="text-base font-semibold text-white mb-1">{step.title}</h4>
                  <p className="text-sm text-gray-400 mb-1">{step.description}</p>
                  <p className="text-xs text-gray-500">{step.details}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Alternative Method */}
          {platform.altMethod && (
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
              <h4 className="text-sm font-semibold text-white mb-2">{platform.altMethod.title}</h4>
              <p className="text-sm text-gray-400">{platform.altMethod.steps}</p>
            </div>
          )}

          {/* Documentation Link */}
          {platform.docsUrl && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div>
                <p className="text-sm font-medium text-white">Need more help?</p>
                <p className="text-xs text-gray-400">Check the official {platform.name} documentation</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                asChild
              >
                <a href={platform.docsUrl} target="_blank" rel="noopener noreferrer">
                  View Docs
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support Card */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
              <span className="text-2xl">💬</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">
                Need Help Installing?
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                Our team is here to help! We can guide you through the installation process or even do it for you.
              </p>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                asChild
              >
                <a href="mailto:hello@haestus.dev?subject=Bot Installation Help">
                  Contact Support
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
