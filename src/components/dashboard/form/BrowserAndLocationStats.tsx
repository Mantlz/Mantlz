"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Globe, MapPin, Maximize2, TrendingUp } from "lucide-react"
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Add type declaration for foreignObject
declare global {
  namespace JSX {
    interface IntrinsicElements {
      foreignObject: React.SVGProps<SVGForeignObjectElement>
    }
  }
}

interface BrowserAndLocationStatsProps {
  browsers: Array<{
    name: string;
    count: number;
    percentage: number;
    icon: React.ReactNode;
  }>;
  locations: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  isLoading?: boolean;
}

// Reusable components to reduce repetition
const CardTitleWithIcon = ({
  icon: Icon,
  title,
  iconColor = "indigo",
}: {
  icon: React.ElementType
  title: string
  iconColor?: string
}) => (
  <CardTitle className="text-sm font-medium flex items-center">
    <div
      className={`flex items-center justify-center bg-${iconColor}-100 dark:bg-${iconColor}-900/30 w-6 h-6 rounded-md mr-2`}
    >
      <Icon className={`h-3.5 w-3.5 text-${iconColor}-600 dark:text-${iconColor}-400`} />
    </div>
    {title}
  </CardTitle>
)

const StatItem = ({
  name,
  count,
  percentage,
  color = "indigo",
}: {
  name: string
  count: number
  percentage: number
  color?: string
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full bg-${color}-500 dark:bg-${color}-400`}></div>
      <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{name}</span>
    </div>
    <div className="flex items-center gap-1">
      <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{count}</span>
      <span className="text-[10px] text-zinc-500 dark:text-zinc-400">({Math.round(percentage * 100)}%)</span>
    </div>
  </div>
)

const EmptyState = ({
  icon: Icon,
  title,
  description,
  iconColor = "indigo",
}: {
  icon: React.ElementType
  title: string
  description: string
  iconColor?: string
}) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className={`bg-${iconColor}-50 dark:bg-${iconColor}-900/20 p-5 rounded-full mb-4 animate-pulse`}>
      <Icon className={`h-7 w-7 text-${iconColor}-500 dark:text-${iconColor}-400`} />
    </div>
    <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">{title}</p>
    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 text-center max-w-[200px]">{description}</p>
  </div>
)

// Country coordinates - approximate central points
const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  "United States": [40, -100],
  "United Kingdom": [55, 0],
  Canada: [60, -95],
  Australia: [-25, 135],
  France: [47, 2],
  Germany: [51, 10],
  Japan: [36, 138],
  China: [35, 105],
  Spain: [40, -3],
  Italy: [42, 12],
  Russia: [60, 100],
  Portugal: [39, -8],
  Netherlands: [52, 5],
  "South Korea": [36, 128],
  Brazil: [-10, -55],
  Mexico: [23, -102],
  India: [20, 77],
  "South Africa": [-30, 25],
  Argentina: [-34, -64],
  Indonesia: [-5, 120],
  Poland: [52, 20],
  Sweden: [62, 15],
  Turkey: [39, 35],
  Egypt: [27, 30],
  "Saudi Arabia": [25, 45],
  Nigeria: [10, 8],
  Kenya: [1, 38],
  Thailand: [15, 100],
  Vietnam: [16, 106],
  Ireland: [53, -8],
  Singapore: [1, 103],
  "New Zealand": [-40, 174],
  Malaysia: [2, 112],
  Philippines: [13, 122],
  Chile: [-30, -71],
  Colombia: [4, -72],
  Peru: [-10, -76],
  Ukraine: [49, 32],
  Greece: [39, 22],
  Austria: [47, 13],
  Switzerland: [47, 8],
  Belgium: [50, 4],
  Denmark: [56, 10],
  Finland: [64, 26],
  Norway: [62, 10],
  "Czech Republic": [49, 15],
  Hungary: [47, 20],
  Romania: [46, 25],
  Israel: [31, 35],
  Taiwan: [23, 121],
  "Hong Kong": [22, 114],
  Unknown: [0, 0], // Fallback for unknown countries
}

// GeoJSON for the world map
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

export function BrowserAndLocationStats({
  browsers,
  locations,
  isLoading
}: BrowserAndLocationStatsProps) {
  // Debug log for incoming props
  React.useEffect(() => {
    console.log('BrowserAndLocationStats Props:', {
      browsers,
      locations,
      isLoading,
      hasBrowsers: browsers?.length > 0,
      hasLocations: locations?.length > 0
    });
  }, [browsers, locations, isLoading]);

  // Add lazy loading for the map
  const [mapLoaded, setMapLoaded] = React.useState(false)
  const mapRef = React.useRef<HTMLDivElement>(null)
  const [mapExpanded, setMapExpanded] = React.useState(false)

  React.useEffect(() => {
    // Use Intersection Observer to lazy load the map when it comes into view
    if (typeof window !== "undefined" && !mapLoaded) {
      console.log("Setting up map observer")
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            console.log("Map is intersecting, setting mapLoaded to true")
            setMapLoaded(true)
            observer.disconnect()
          }
        },
        { threshold: 0.1 },
      )

      if (mapRef.current) {
        observer.observe(mapRef.current)
      }

      return () => {
        observer.disconnect()
      }
    }
  }, [mapLoaded])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800/50">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800/50">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Debug log for rendering state
  console.log('BrowserAndLocationStats Rendering:', {
    browsersLength: browsers?.length,
    locationsLength: locations?.length,
    browsers,
    locations
  });

  return (
    <div className="w-full space-y-1">
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-5">
        {/* Map Card - Now takes 3/4 of the grid width */}
        <Card
          className={cn(
            "border border-zinc-200/50 dark:border-zinc-800/50",
            "bg-white/80 dark:bg-zinc-900/70 backdrop-blur-sm",
            "shadow-lg hover:shadow-xl transition-all duration-300",
            "overflow-hidden rounded-xl",
            "min-h-[500px] lg:col-span-8",
          )}
        >
          <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 pb-3 pt-4 px-5">
            <div className="flex justify-between items-center w-full">
              <CardTitleWithIcon icon={MapPin} title="Location Analytics" iconColor="indigo" />
              <Badge
                className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 
                hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors px-2 py-0.5 text-xs rounded-md"
              >
                World Data
              </Badge>
            </div>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
              Geographic distribution of your visitors
            </CardDescription>
          </CardHeader>

          <CardContent className="px-5 pb-0 pt-3 relative">
            {locations.length > 0 ? (
              <div className="relative">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* World Map container - taking 5/6 of the space */}
                  <div className="lg:w-4/6">
                    <div
                      ref={mapRef}
                      className="bg-white dark:bg-zinc-800/50 h-[400px] overflow-hidden relative 
                        border border-zinc-200 dark:border-zinc-700/50 rounded-lg"
                    >
                      {/* Expand button */}
                      <button
                        onClick={() => setMapExpanded(true)}
                        className="absolute top-2 right-2 bg-white/90 dark:bg-zinc-800/90 p-1.5 
                          rounded-md backdrop-blur-sm z-50 hover:bg-white dark:hover:bg-zinc-700 
                          shadow-sm hover:shadow transition-all"
                        aria-label="Expand map"
                      >
                        <Maximize2 className="h-3.5 w-3.5 text-zinc-700 dark:text-zinc-300" />
                      </button>

                      {/* Map content */}
                      {mapLoaded && (
                        <ComposableMap
                          projectionConfig={{
                            scale: 160,
                            center: [0, 20],
                          }}
                          width={800}
                          height={400}
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "transparent",
                          }}
                        >
                          <ZoomableGroup
                            zoom={1}
                            maxZoom={3}
                            minZoom={1}
                            translateExtent={[
                              [0, 0],
                              [800, 400],
                            ]}
                          >
                            <Geographies geography={geoUrl}>
                              {({ geographies }: { geographies: any[] }) =>
                                geographies.map((geo: any) => (
                                  <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill="currentColor"
                                    className="text-zinc-100 dark:text-zinc-800/80"
                                    stroke="#E4E4E7"
                                    strokeWidth={0.3}
                                  />
                                ))
                              }
                            </Geographies>

                            {/* Show markers for all countries on the main map */}
                            {locations.slice(0, 15).map((country) => {
                              const coords = COUNTRY_COORDINATES[country.name]
                              if (!coords) return null
                              const [lat, lng] = coords
                              const count = country.count; // Ensure count is defined
                              const radius = 8; // Fixed radius for main map
                              const fontSize = 10; // Fixed font size for main map

                              return (
                                <Marker key={country.name} coordinates={[lng, lat]}>
                                  <g className="rsm-marker cursor-pointer group">
                                     <circle
                                      r={radius}
                                      className="fill-indigo-500 dark:fill-indigo-400 opacity-80 group-hover:opacity-100 transition-opacity"
                                      stroke="#fff" // Add white stroke for better contrast
                                      strokeWidth="1"
                                    />
                                    <text
                                      textAnchor="middle"
                                      y={radius * 0.35} // Vertically center text (approx)
                                      className="fill-white dark:fill-zinc-900 font-medium pointer-events-none transition-all"
                                      style={{ fontSize: `${fontSize}px` }} // Fixed font size
                                    >
                                      {count}
                                    </text>
                                    {/* Simple SVG Tooltip (renders as native browser tooltip) */}
                                    <title>{`${country.name}: ${count} visitor${count === 1 ? '' : 's'}`}</title>
                                  </g>
                                </Marker>
                              )
                            })}
                          </ZoomableGroup>
                        </ComposableMap>
                      )}

                      {/* Loading indicator */}
                      {!mapLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-zinc-300 dark:border-zinc-600 border-t-indigo-500 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Country statistics - taking 1/6 of the space */}
                  <div className="lg:w-1/3">
                    <div className="h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700/50 p-3 mb-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">Top Countries</span>
                          <Badge className="bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 text-[10px] rounded-sm">
                            {locations.length}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {locations.slice(0, 9).map((country, idx) => (
                            <StatItem
                              key={country.name}
                              name={country.name}
                              count={country.count}
                              percentage={country.percentage}
                              color={["indigo", "violet", "blue", "cyan", "emerald"][idx % 5]}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={MapPin}
                title="No Location Data"
                description="Waiting for first data transmission from your visitors"
                iconColor="indigo"
              />
            )}
          </CardContent>

          {locations.length > 0 && (
            <CardFooter className="flex-col items-start gap-2 text-sm px-5 py-3 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex gap-2 font-medium leading-none">
                Top Country: {locations[0]?.name} ({locations[0] ? Math.round(locations[0].percentage * 100) : 0}%)
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="leading-none text-muted-foreground text-xs">
                Visitors from {locations.length} countries
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Browser Stats Card - Now takes 1/4 of the grid width */}
        <Card
          className={cn(
            "border border-zinc-200/50 dark:border-zinc-800/50",
            "bg-white/80 dark:bg-zinc-900/70 backdrop-blur-sm",
            "shadow-lg hover:shadow-xl transition-all duration-300",
            "overflow-hidden rounded-xl",
            "min-h-[500px] lg:col-span-3",
          )}
        >
          <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 pb-3 pt-4 px-4">
            <div className="flex justify-between items-center w-full">
              <CardTitleWithIcon icon={Globe} title="Browser Stats" iconColor="violet" />
              <Badge
                className="bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 
                hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors px-2 py-0.5 text-xs rounded-md"
              >
                {browsers.length}
              </Badge>
            </div>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
              Browser usage distribution
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 py-3 relative">
            {browsers.length > 0 ? (
              <div className="flex flex-col space-y-4">
                {/* Browser distribution percentages with colored indicators */}
                <div className="bg-zinc-50/80 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700/50 p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">Distribution</span>
                    <Badge className="bg-violet-100/80 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 px-1.5 py-0.5 text-[10px] rounded-sm">
                      {browsers.reduce((sum, b) => sum + b.count, 0)}
                    </Badge>
                  </div>
                  <div className="flex mb-1.5">
                    {browsers.map((browser, idx) => (
                      <div
                        key={browser.name}
                        className="h-2"
                        style={{
                          width: `${browser.percentage * 100}%`,
                          backgroundColor: `var(--${["indigo", "violet", "blue", "cyan", "emerald", "amber", "rose"][idx % 7]}-500)`,
                          borderRadius: idx === 0 ? "4px 0 0 4px" : idx === browsers.length - 1 ? "0 4px 4px 0" : "0",
                        }}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-1 gap-2 mt-3">
                    {browsers.map((browser, idx) => (
                      <StatItem
                        key={browser.name}
                        name={browser.name}
                        count={browser.count}
                        percentage={browser.percentage}
                        color={["indigo", "violet", "blue", "cyan", "emerald", "amber", "rose"][idx % 7]}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={Globe}
                title="No Browser Data"
                description="Waiting for first data transmission from your visitors"
                iconColor="violet"
              />
            )}
          </CardContent>

          {browsers.length > 0 && (
            <CardFooter className="flex-col items-start gap-2 text-sm px-4 py-3 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex gap-2 font-medium leading-none">
                Top: {browsers[0]?.name} ({browsers[0] ? Math.round(browsers[0].percentage * 100) : 0}%)
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="leading-none text-muted-foreground text-xs">
                Total: {browsers.reduce((sum, b) => sum + b.count, 0)} visitors
              </div>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Dialog for expanded map view */}
      <Dialog open={mapExpanded} onOpenChange={setMapExpanded}>
        <DialogContent
          className="sm:max-w-[800px] p-0 overflow-hidden 
            bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg
            border border-zinc-200 dark:border-zinc-800
            shadow-2xl rounded-xl"
        >
          <DialogHeader className="px-6 pt-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <DialogTitle className="text-xl font-medium text-zinc-900 dark:text-zinc-100 flex items-center">
              Location Analytics
            </DialogTitle>
            <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
              Explore visitor distribution across the world
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 pt-4">
            <div
              className="bg-white dark:bg-zinc-800/50 h-[500px] overflow-hidden relative 
              border border-zinc-200 dark:border-zinc-700/50 rounded-lg"
            >
              <ComposableMap
                projectionConfig={{
                  scale: 220,
                  center: [0, 20],
                }}
                width={1000}
                height={600}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "transparent",
                }}
              >
                <ZoomableGroup
                  zoom={1}
                  maxZoom={6}
                  minZoom={1}
                  translateExtent={[
                    [0, 0],
                    [1000, 600],
                  ]}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }: { geographies: any[] }) =>
                      geographies.map((geo: any) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="currentColor"
                          className="text-zinc-100 dark:text-zinc-800/80"
                          stroke="#E4E4E7"
                          strokeWidth={0.3}
                        />
                      ))
                    }
                  </Geographies>

                  {locations.map((country) => {
                    const coords = COUNTRY_COORDINATES[country.name]
                    if (!coords) return null
                    const [lat, lng] = coords

                    // Define marker size based on count for expanded map
                    const count = country.count;
                    const baseRadius = 8; // Base radius for the circle
                    const radius = baseRadius + Math.min(Math.log2(count + 1) * 1.5, 8); // Scale radius logarithmically, max increase of 8
                    const fontSize = Math.max(8, Math.min(11 + Math.log2(count + 1) * 0.5, 14)); // Scale font size slightly, cap at 14px

                    return (
                      <Marker key={country.name} coordinates={[lng, lat]}>
                        <g className="rsm-marker cursor-pointer group">
                           <circle
                            r={radius}
                            className="fill-indigo-500 dark:fill-indigo-400 opacity-80 group-hover:opacity-100 transition-opacity"
                            stroke="#fff" // Add white stroke for better contrast
                            strokeWidth="1"
                          />
                          <text
                            textAnchor="middle"
                            y={radius * 0.35} // Vertically center text (approx)
                            className="fill-white dark:fill-zinc-900 font-medium pointer-events-none transition-all"
                            style={{ fontSize: `${fontSize}px` }} // Dynamic font size
                          >
                            {count}
                          </text>
                          {/* Simple SVG Tooltip (renders as native browser tooltip) */}
                          <title>{`${country.name}: ${count} visitor${count === 1 ? '' : 's'}`}</title>
                        </g>
                      </Marker>
                    )
                  })}
                </ZoomableGroup>
              </ComposableMap>
            </div>

            <div
              className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 
              border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between items-center"
            >
              <p>Displaying {locations.length} territories</p>
              <Badge className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                Use mouse wheel to zoom
              </Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
