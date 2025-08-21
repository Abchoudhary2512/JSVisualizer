import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DebounceVisualizer } from "@/components/debounce-visualizer"
import { ThrottleVisualizer } from "@/components/throttle-visualizer"
import { BookOpen, Code, Zap } from "lucide-react"

export function ReactVisualizerPlatform() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">React Visualizer</h1>
                <p className="text-sm text-muted-foreground">Interactive Learning Platform</p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Zap className="w-3 h-3" />
              Interactive
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-bold text-foreground mb-4">Master React Performance Concepts</h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Learn debouncing and throttling through interactive visualizations, real-time code examples, and hands-on
            experimentation.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Interactive Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>Live Code Examples</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Real-time Visualization</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="debouncing" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="debouncing" className="text-base">
                Debouncing
              </TabsTrigger>
              <TabsTrigger value="throttling" className="text-base">
                Throttling
              </TabsTrigger>
            </TabsList>

            <TabsContent value="debouncing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold">D</span>
                    </div>
                    Debouncing
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Debouncing delays the execution of a function until after a specified period of inactivity. Perfect
                    for search inputs, form validation, and API calls that shouldn't fire on every keystroke.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DebounceVisualizer />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="throttling" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                      <span className="text-secondary font-bold">T</span>
                    </div>
                    Throttling
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Throttling limits the execution of a function to at most once per specified time interval. Ideal for
                    scroll events, resize handlers, and mouse movement tracking.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ThrottleVisualizer />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
