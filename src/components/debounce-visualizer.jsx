import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Clock, Search, RotateCcw, TrendingUp, TrendingDown } from "lucide-react"

export function DebounceVisualizer() {
  const [inputValue, setInputValue] = useState("")
  const [debouncedValue, setDebouncedValue] = useState("")
  const [delay, setDelay] = useState([500])
  const [callCount, setCallCount] = useState(0)
  const [debouncedCallCount, setDebouncedCallCount] = useState(0)
  const [normalApiCallCount, setNormalApiCallCount] = useState(0)
  const [isWaiting, setIsWaiting] = useState(false)
  const [events, setEvents] = useState([])

  // Debounce function
  const debounce = useCallback((func, delay) => {
    let timeoutId
    return (...args) => {
      setIsWaiting(true)
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
        setIsWaiting(false)
      }, delay)
    }
  }, [])

  // Debounced function
  const debouncedSetValue = useCallback(
    debounce((value) => {
      setDebouncedValue(value)
      setDebouncedCallCount((prev) => prev + 1)
      setEvents((prev) =>
        [
          ...prev,
          {
            id: Date.now() + Math.random(),
            type: "debounced",
            timestamp: Date.now(),
            value,
          },
        ].slice(-10)
      )
    }, delay[0]),
    [delay[0], debounce]
  )

  // Handle input change
  const handleInputChange = (value) => {
    setInputValue(value)
    setCallCount((prev) => prev + 1)
    setNormalApiCallCount((prev) => prev + 1)
    setEvents((prev) =>
      [
        ...prev,
        {
          id: Date.now() + Math.random(),
          type: "input",
          timestamp: Date.now(),
          value,
        },
      ].slice(-10)
    )
    debouncedSetValue(value)
  }

  // Reset function
  const reset = () => {
    setInputValue("")
    setDebouncedValue("")
    setCallCount(0)
    setDebouncedCallCount(0)
    setNormalApiCallCount(0)
    setIsWaiting(false)
    setEvents([])
  }

  const savingsPercentage =
    normalApiCallCount > 0 ? Math.round(((normalApiCallCount - debouncedCallCount) / normalApiCallCount) * 100) : 0

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
              <Label htmlFor="search-input">Search Input</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search-input"
                  placeholder="Type to see debouncing in action..."
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Delay: {delay[0]}ms</Label>
              <Slider value={delay} onValueChange={setDelay} max={2000} min={100} step={100} className="w-full" />
            </div>

            <Button onClick={reset} variant="outline" className="w-full bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Demo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">API Call Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Without Debouncing</span>
                </div>
                <div className="text-xl font-bold text-red-600">{normalApiCallCount}</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">With Debouncing</span>
                </div>
                <div className="text-xl font-bold text-green-600">{debouncedCallCount}</div>
              </div>

              {normalApiCallCount > 0 && (
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-2xl font-bold text-blue-600">{savingsPercentage}%</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">API Calls Saved</div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Current Input:</span>
                <Badge variant="outline">{inputValue || "Empty"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Debounced Value:</span>
                <Badge variant={isWaiting ? "secondary" : "default"}>
                  {isWaiting ? (
                    <>
                      <Clock className="w-3 h-3 mr-1" />
                      Waiting...
                    </>
                  ) : (
                    debouncedValue || "Empty"
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
              <p className="text-muted-foreground text-center py-4">Start typing to see events...</p>
            ) : (
              events
                .slice()
                .reverse()
                .map((event) => (
                  <div
                    key={event.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      event.type === "input"
                        ? "bg-primary/10 border-l-4 border-primary"
                        : "bg-secondary/10 border-l-4 border-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant={event.type === "input" ? "default" : "secondary"} className="text-xs">
                        {event.type === "input" ? "INPUT" : "DEBOUNCED"}
                      </Badge>
                      <span className="text-sm font-mono">{event.value || "(empty)"}</span>
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
            <code>{`import { useState, useEffect } from 'react'

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Usage in component
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, ${delay[0]})

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Make API call here
      console.log('Searching for:', debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  )
}`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
