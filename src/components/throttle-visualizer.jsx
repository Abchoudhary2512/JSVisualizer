import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Timer } from "lucide-react"

export function ThrottleVisualizer() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [throttledPosition, setThrottledPosition] = useState({ x: 0, y: 0 })
  const [interval, setInterval] = useState([100])
  const [moveCount, setMoveCount] = useState(0)
  const [throttledCallCount, setThrottledCallCount] = useState(0)
  const [isThrottled, setIsThrottled] = useState(false)
  const [events, setEvents] = useState([])
  const trackingAreaRef = useRef(null)

  // Throttle function
  const throttle = useCallback((func, limit) => {
    let inThrottle
    return (...args) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setIsThrottled(true)
        setTimeout(() => {
          inThrottle = false
          setIsThrottled(false)
        }, limit)
      }
    }
  }, [])

  // Throttled function
  const throttledSetPosition = useCallback(
    throttle((x, y) => {
      setThrottledPosition({ x, y })
      setThrottledCallCount((prev) => prev + 1)
      setEvents((prev) =>
        [
          ...prev,
          {
            id: Date.now() + Math.random(),
            type: "throttled",
            timestamp: Date.now(),
            x,
            y,
          },
        ].slice(-10)
      )
    }, interval[0]),
    [interval[0], throttle]
  )

  // Handle mouse move
  const handleMouseMove = (e) => {
    if (!trackingAreaRef.current) return

    const rect = trackingAreaRef.current.getBoundingClientRect()
    const x = Math.round(e.clientX - rect.left)
    const y = Math.round(e.clientY - rect.top)

    setMousePosition({ x, y })
    setMoveCount((prev) => prev + 1)
    setEvents((prev) =>
      [
        ...prev,
        {
          id: Date.now() + Math.random(),
          type: "move",
          timestamp: Date.now(),
          x,
          y,
        },
      ].slice(-10)
    )

    throttledSetPosition(x, y)
  }

  // Reset function
  const reset = () => {
    setMousePosition({ x: 0, y: 0 })
    setThrottledPosition({ x: 0, y: 0 })
    setMoveCount(0)
    setThrottledCallCount(0)
    setIsThrottled(false)
    setEvents([])
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interactive Demo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Throttle Interval: {interval[0]}ms</Label>
              <Slider value={interval} onValueChange={setInterval} max={1000} min={50} step={50} className="w-full" />
            </div>

            <div
              ref={trackingAreaRef}
              className="relative h-48 bg-muted rounded-lg border-2 border-dashed border-border cursor-crosshair overflow-hidden"
              onMouseMove={handleMouseMove}
            >
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                Move your mouse here to see throttling in action
              </div>

              {/* Real-time mouse position */}
              <div
                className="absolute w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-none pointer-events-none"
                style={{
                  left: mousePosition.x,
                  top: mousePosition.y,
                  opacity: moveCount > 0 ? 1 : 0,
                }}
              />

              {/* Throttled position */}
              <div
                className="absolute w-4 h-4 bg-secondary rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none border-2 border-background"
                style={{
                  left: throttledPosition.x,
                  top: throttledPosition.y,
                  opacity: throttledCallCount > 0 ? 1 : 0,
                }}
              />
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>Real-time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span>Throttled</span>
              </div>
            </div>

            <Button onClick={reset} variant="outline" className="w-full bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Demo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{moveCount}</div>
                <div className="text-sm text-muted-foreground">Mouse Events</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-secondary">{throttledCallCount}</div>
                <div className="text-sm text-muted-foreground">Throttled Calls</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Current Position:</span>
                <Badge variant="outline">
                  {moveCount > 0 ? `${mousePosition.x}, ${mousePosition.y}` : "No movement"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Throttled Position:</span>
                <Badge variant={isThrottled ? "secondary" : "default"}>
                  {isThrottled ? (
                    <>
                      <Timer className="w-3 h-3 mr-1" />
                      Throttled
                    </>
                  ) : throttledCallCount > 0 ? (
                    `${throttledPosition.x}, ${throttledPosition.y}`
                  ) : (
                    "No calls"
                  )}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Event Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Move your mouse in the tracking area to see events...
              </p>
            ) : (
              events
                .slice()
                .reverse()
                .map((event) => (
                  <div
                    key={event.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      event.type === "move"
                        ? "bg-primary/10 border-l-4 border-primary"
                        : "bg-secondary/10 border-l-4 border-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant={event.type === "move" ? "default" : "secondary"} className="text-xs">
                        {event.type === "move" ? "MOVE" : "THROTTLED"}
                      </Badge>
                      <span className="text-sm font-mono">
                        ({event.x}, {event.y})
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Code Example */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">React Hook Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { useCallback, useRef } from 'react'

function useThrottle(callback, delay) {
  const throttleRef = useRef(false)

  return useCallback((...args) => {
    if (!throttleRef.current) {
      callback(...args)
      throttleRef.current = true
      
      setTimeout(() => {
        throttleRef.current = false
      }, delay)
    }
  }, [callback, delay])
}

// Usage in component
function ScrollComponent() {
  const handleScroll = useThrottle((e) => {
    console.log('Scroll position:', e.target.scrollTop)
    // Update UI or make API calls here
  }, ${interval[0]})

  return (
    <div 
      onScroll={handleScroll}
      style={{ height: '400px', overflow: 'auto' }}
    >
      {/* Scrollable content */}
    </div>
  )
}`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
