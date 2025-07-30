"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Globe, MapPin, Maximize2, ChevronRight, BarChart2 } from "lucide-react"
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker, 
  ZoomableGroup,
} from "react-simple-maps"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Add proper module declaration for SVG elements if needed
declare module 'react' {
  interface SVGAttributes<T> extends React.AriaAttributes, React.DOMAttributes<T> {
    // Any additional SVG attributes can be added here if required
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
}: {
  icon: React.ElementType
  title: string
}) => (
  <CardTitle className="text-base font-medium flex items-center">
    <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-900 mr-3">
      <Icon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
    </div>
    {title}
  </CardTitle>
)

const StatItem = ({
  name,
  count,
  percentage,
  color = "orange",
  rank = 0,
  isTop = false,
}: {
  name: string
  count: number
  percentage: number
  color?: string
  rank?: number
  isTop?: boolean
}) => (
  <div className={cn(
    "flex items-center justify-between p-2.5 rounded-lg transition-all duration-200",
    "hover:bg-zinc-50 dark:hover:bg-zinc-900/70",
    isTop && "bg-zinc-50/50 dark:bg-zinc-900/20"
  )}>
    <div className="flex items-center gap-2.5">
      {rank > 0 ? (
        <span className={cn(
          "text-xs font-medium min-w-[20px] text-center rounded-lg py-0.5 px-1",
          rank <= 3 
            ? "bg-zinc-100 dark:bg-zinc-900/40 text-orange-700 dark:text-orange-300" 
            : "bg-zinc-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400"
        )}>
          {rank}
        </span>
      ) : (
        <div className={`w-2 h-2 rounded-lg bg-${color}-500 opacity-90`} />
      )}
      <span className="text-sm font-medium">{name}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{count}</span>
      <span className={cn(
        "text-xs py-0.5 px-1.5 rounded-lg",
        "bg-zinc-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400"
      )}>
        {Math.round(percentage * 100)}%
      </span>
    </div>
  </div>
)

const EmptyState = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-16 h-16 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-5 animate-pulse">
      <Icon className="h-7 w-7 text-gray-400 dark:text-gray-600" />
    </div>
    <p className="text-lg font-medium">{title}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center max-w-[280px] leading-relaxed">{description}</p>
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
  // Add lazy loading for the map
  const [mapLoaded, setMapLoaded] = React.useState(false)
  const mapRef = React.useRef<HTMLDivElement>(null)
  const [mapExpanded, setMapExpanded] = React.useState(false)
  
  // Pagination for countries and browsers lists
  const ITEMS_PER_PAGE = 5;
  const [countriesPage, setCountriesPage] = React.useState(1);
  const [browsersPage, setBrowsersPage] = React.useState(1);
  
  // State to toggle between map and list on mobile
  const [mobileView, setMobileView] = React.useState<'map' | 'list'>('map');

  // Sort locations by count
  const sortedLocations = [...locations].sort((a, b) => b.count - a.count);
  const totalVisitors = locations.reduce((sum, loc) => sum + loc.count, 0);
  const totalBrowsers = browsers.reduce((sum, b) => sum + b.count, 0);

  React.useEffect(() => {
    // Use Intersection Observer to lazy load the map when it comes into view
    if (typeof window !== "undefined" && !mapLoaded) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
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

  // Calculate pagination for countries
  const maxCountriesPages = Math.ceil(sortedLocations?.length / ITEMS_PER_PAGE) || 1;
  const paginatedLocations = React.useMemo(() => {
    const startIdx = (countriesPage - 1) * ITEMS_PER_PAGE;
    return sortedLocations?.slice(startIdx, startIdx + ITEMS_PER_PAGE) || [];
  }, [sortedLocations, countriesPage]);
  
  // Calculate pagination for browsers
  const maxBrowsersPages = Math.ceil(browsers?.length / ITEMS_PER_PAGE) || 1;
  const paginatedBrowsers = React.useMemo(() => {
    const startIdx = (browsersPage - 1) * ITEMS_PER_PAGE;
    return browsers?.slice(startIdx, startIdx + ITEMS_PER_PAGE) || [];
  }, [browsers, browsersPage]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-black rounded-xl p-6">
          <div className="animate-pulse space-y-5">
            <div className="h-5 bg-zinc-100 dark:bg-zinc-900 rounded-lg w-1/3"></div>
            <div className="space-y-3">
              <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg"></div>
              <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg w-5/6"></div>
              <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg w-4/6"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-black rounded-xl p-6">
          <div className="animate-pulse space-y-5">
            <div className="h-5 bg-zinc-100 dark:bg-zinc-900 rounded-lg w-1/3"></div>
            <div className="space-y-3">
              <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg"></div>
              <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg w-5/6"></div>
              <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Mobile view toggle - simplified and more elegant */}
      <div className="lg:hidden flex justify-center items-center mb-4">
        <div className="flex rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
          <button 
            onClick={() => setMobileView('map')}
            className={`px-4 py-2 text-xs font-medium ${
              mobileView === 'map' 
                ? 'bg-zinc-50 dark:bg-zinc-900/30 text-orange-700 dark:text-orange-400' 
                : 'bg-white dark:bg-black text-gray-700 dark:text-gray-300'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setMobileView('list')}
            className={`px-4 py-2 text-xs font-medium ${
              mobileView === 'list' 
                ? 'bg-zinc-50 dark:bg-zinc-900/30 text-orange-700 dark:text-orange-400' 
                : 'bg-white dark:bg-black text-gray-700 dark:text-gray-300'
            }`}
          >
            Browsers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Map Card - Hidden on mobile if list view is selected */}
        <Card className={`bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl lg:col-span-3 overflow-hidden transition-all duration-300  ${mobileView !== 'map' ? 'hidden lg:block' : ''}`}>
          <CardHeader className="pb-3 px-6 pt-5">
            <div className="flex justify-between items-center w-full">
              <CardTitleWithIcon icon={MapPin} title="Geographic Distribution" />
              <button 
                onClick={() => setMapExpanded(true)}
                // className="text-xs bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg py-1.5 px-3 transition-colors cursor-pointer"
                              className="h-8 px-2 text-md bg-orange-500 text-white dark:text-black dark:border-background border text-sm  shadow-zinc-950/30 ring ring-inset ring-white/20 transition-[filter] duration-200 hover:brightness-125 active:brightness-95 cursor-pointer"

              >
                <span className="flex items-center gap-1.5 text-white hover:text-white dark:hover:text-white">
                  Full map <Maximize2 className="h-3 w-3" />
                </span>
              </button>
            </div>
            {locations.length > 0 && (
              <CardDescription className="text-gray-500 dark:text-gray-200 text-sm mt-1.5">
                {totalVisitors.toLocaleString()} visitors from {locations.length} countries
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-2 relative">
            {locations.length > 0 ? (
              <div className="relative">
                <div className="flex flex-col lg:flex-row gap-5">
                  {/* World Map container - simplified */}
                  <div className="lg:flex-grow">
                    <div
                      ref={mapRef}
                      className="bg-white dark:bg-black h-[340px] overflow-hidden relative rounded-xl border border-zinc-200 dark:border-zinc-900"
                    >
                      {/* Map content */}
                      {mapLoaded ? (
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
                              {({ geographies }) =>
                                geographies.map((geo) => {
                                  // Check if this country is in our locations data
                                  const geoProps = geo.properties as Record<string, string | number | boolean>;
                                  const geoName = geoProps.name as string | undefined;
                                  const isHighlighted = locations.some(
                                    loc => {
                                      return geoName && (
                                        geoName === loc.name || 
                                        geoName.includes(loc.name) || 
                                        loc.name.includes(geoName)
                                      );
                                    }
                                  );
                                  
                                  return (
                                    <Geography
                                      key={geo.rsmKey}
                                      geography={geo}
                                      fill="currentColor"
                                      className={isHighlighted ? 
                                        "text-orange-50 dark:text-orange-950" : 
                                        "text-gray-100 dark:text-gray-900"
                                      }
                                      stroke="#fff"
                                      strokeWidth={0.5}
                                    />
                                  );
                                })
                              }
                            </Geographies>

                            {/* Show only top 8 markers for clarity */}
                            {sortedLocations.slice(0, 8).map((country, idx) => {
                              const coords = COUNTRY_COORDINATES[country.name]
                              if (!coords) return null
                              const [lat, lng] = coords
                              const count = country.count;
                              const isTop3 = idx < 3;
                              const radius = isTop3 ? 7 : 5;

                              return (
                                <Marker key={country.name} coordinates={[lng, lat]}>
                                  <g className="rsm-marker cursor-pointer transition-all duration-300 hover:scale-110">
                                     <circle
                                      r={radius}
                                      className={isTop3 ? "fill-orange-600 dark:fill-orange-500" : "fill-orange-400 dark:fill-orange-700"}
                                      stroke="#fff"
                                      strokeWidth="1.5"
                                    />
                                    <text
                                      textAnchor="middle"
                                      y={radius * 0.35}
                                      className="fill-white font-medium pointer-events-none"
                                      style={{ fontSize: isTop3 ? "10px" : "8px" }}
                                    >
                                      {count}
                                    </text>
                                    <title>{`${country.name}: ${count.toLocaleString()} visitor${count === 1 ? '' : 's'}`}</title>
                                  </g>
                                </Marker>
                              )
                            })}
                          </ZoomableGroup>
                        </ComposableMap>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-5 h-5 border border-zinc-300 dark:border-zinc-700 border-t-orange-500 rounded-full animate-spin"></div>
                        </div>
                      )}
                      
                      {/* Top country callout at bottom */}
                      {sortedLocations.length > 0 && (
                        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-lg py-2 px-3 border border-zinc-200 dark:border-zinc-800">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-lg bg-zinc-500"></div>
                            <span className="text-xs font-medium">{sortedLocations[0]?.name}</span>
                            <span className="text-xs text-gray-500">{sortedLocations[0] ? Math.round(sortedLocations[0].percentage * 100) : 0}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top 5 Countries - simplified list */}
                  <div className="lg:w-2/5 max-w-xs">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-medium">Top Countries</h3>
                      {maxCountriesPages > 1 && (
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => setCountriesPage(prev => Math.max(prev - 1, 1))}
                            disabled={countriesPage === 1}
                            className="p-1 rounded-lg disabled:opacity-50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          >
                            <ChevronRight className="h-3 w-3 transform rotate-180" />
                          </button>
                          <span className="text-xs text-gray-500">{countriesPage}/{maxCountriesPages}</span>
                          <button 
                            onClick={() => setCountriesPage(prev => Math.min(prev + 1, maxCountriesPages))}
                            disabled={countriesPage === maxCountriesPages}
                            className="p-1 rounded-lg disabled:opacity-50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          >
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Country list with better scrolling */}
                    <div className="space-y-1.5">
                      {paginatedLocations.map((country, idx) => (
                        <StatItem
                          key={country.name}
                          name={country.name}
                          count={country.count}
                          percentage={country.percentage}
                          rank={(countriesPage - 1) * ITEMS_PER_PAGE + idx + 1}
                          isTop={(countriesPage === 1 && idx === 0)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={MapPin}
                title="No Location Data Yet"
                description="Waiting for your visitors. Data will appear here once users start visiting your site."
              />
            )}
          </CardContent>
        </Card>

        {/* Browser Stats Card - Hidden on mobile if map view is selected */}
        <Card className={`bg-white dark:bg-zinc-900/50  border border-zinc-200 dark:border-zinc-800 rounded-xl lg:col-span-2 transition-all duration-300 hover:shadow-md ${mobileView !== 'list' ? 'hidden lg:block' : ''}`}>
          <CardHeader className="pb-3 px-6 pt-5">
            <div className="flex justify-between items-center w-full">
              <CardTitleWithIcon icon={Globe} title="Browsers" />
              {maxBrowsersPages > 1 && (
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => setBrowsersPage(prev => Math.max(prev - 1, 1))}
                    disabled={browsersPage === 1}
                    className="p-1 rounded-lg disabled:opacity-50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <ChevronRight className="h-3 w-3 transform rotate-180" />
                  </button>
                  <span className="text-xs text-gray-500">{browsersPage}/{maxBrowsersPages}</span>
                  <button 
                    onClick={() => setBrowsersPage(prev => Math.min(prev + 1, maxBrowsersPages))}
                    disabled={browsersPage === maxBrowsersPages}
                    className="p-1 rounded-lg disabled:opacity-50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
            {browsers.length > 0 && (
              <CardDescription className="text-gray-500 text-sm mt-1.5">
                {totalBrowsers.toLocaleString()} visitors tracked
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-2 relative">
            {browsers.length > 0 ? (
              <div>
                {/* Progress bar with all browsers */}
                <div className="flex h-2 mb-3 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  {browsers.map((browser, idx) => {
                    const colors = ["orange", "indigo", "violet", "orange", "cyan", "sky", "teal", "emerald", "green", "lime"];
                    return (
                      <div
                        key={browser.name}
                        style={{
                          width: `${browser.percentage * 100}%`,
                        }}
                        className={`bg-${colors[idx % colors.length]}-500`}
                        title={`${browser.name}: ${Math.round(browser.percentage * 100)}%`}
                      />
                    );
                  })}
                </div>
                
                {/* Color legend - simplified and horizontal */}
                <div className="mb-5 flex flex-wrap gap-x-4 gap-y-2">
                  {browsers.slice(0, 5).map((browser, idx) => {
                    const colors = ["orange", "indigo", "violet", "orange", "cyan"];
                    return (
                      <div key={browser.name} className="flex items-center gap-1.5 text-xs">
                        <div className={`w-2 h-2 rounded-lg bg-${colors[idx % colors.length]}-500`}></div>
                        <span>{browser.name}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Browser list */}
                <div className="space-y-1.5 mt-4">
                  {paginatedBrowsers.map((browser, idx) => (
                    <StatItem
                      key={browser.name}
                      name={browser.name}
                      count={browser.count}
                      percentage={browser.percentage}
                      color={["orange", "indigo", "violet", "orange", "cyan"][idx % 5]}
                      isTop={(browsersPage === 1 && idx === 0)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                icon={Globe}
                title="No Browser Data"
                description="Browser statistics will appear here when you get visitors"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog for expanded map view - simplified to avoid redundancy */}
      <Dialog open={mapExpanded} onOpenChange={setMapExpanded}>
        <DialogContent
          className="sm:max-w-[900px] p-0 overflow-hidden bg-background dark:bg-zinc-950/50
           rounded-xl backdrop-blur-3xl shadow-2xl  border border-zinc-200 dark:border-zinc-950"
        >
          <DialogHeader className="px-8 pt-6 pb-4">
            <DialogTitle className="text-xl font-medium flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 opacity-70" />
              Geographic Analytics
            </DialogTitle>
            <DialogDescription>
              {totalVisitors.toLocaleString()} Submissions from {locations.length} countries
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <div className="h-[400px] overflow-hidden relative rounded-xl border border-zinc-200 dark:border-zinc-900">
                  <ComposableMap
                    projectionConfig={{
                      scale: 170,
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
                        {({ geographies }) =>
                          geographies.map((geo) => {
                            const geoProps = geo.properties as Record<string, string | number | boolean>;
                            const geoName = geoProps.name as string | undefined;
                            const isHighlighted = locations.some(
                              loc => {
                                return geoName && (
                                  geoName === loc.name || 
                                  geoName.includes(loc.name) || 
                                  loc.name.includes(geoName)
                                );
                              }
                            );
                            
                            return (
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="currentColor"
                                className={isHighlighted ? 
                                  "text-orange-50 dark:text-orange-950" : 
                                  "text-gray-100 dark:text-gray-900"
                                }
                                stroke="#ffffff"
                                strokeWidth={0.5}
                              />
                            );
                          })
                        }
                      </Geographies>

                      {sortedLocations.slice(0, 15).map((country, idx) => {
                        const coords = COUNTRY_COORDINATES[country.name]
                        if (!coords) return null
                        const [lat, lng] = coords
                        const count = country.count;
                        const isTop5 = idx < 5;
                        const radius = isTop5 ? 8 : 6;

                        return (
                          <Marker key={country.name} coordinates={[lng, lat]}>
                            <g className="rsm-marker cursor-pointer transition-all duration-300 hover:scale-110">
                              <circle
                                r={radius}
                                className={isTop5 ? "fill-orange-600 dark:fill-orange-500" : "fill-orange-400 dark:fill-orange-700"}
                                stroke="#fff"
                                strokeWidth="1.5"
                              />
                              <text
                                textAnchor="middle"
                                y={radius * 0.35}
                                className="fill-white font-medium pointer-events-none"
                                style={{ fontSize: isTop5 ? "11px" : "9px" }}
                              >
                                {count}
                              </text>
                              <title>{`${country.name}: ${count.toLocaleString()} visitor${count === 1 ? '' : 's'}`}</title>
                            </g>
                          </Marker>
                        )
                      })}
                    </ZoomableGroup>
                  </ComposableMap>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {sortedLocations.slice(0, 5).map((country) => (
                    <Badge 
                      key={country.name}
                      className="bg-zinc-50 dark:bg-zinc-900 text-gray-700 dark:text-gray-300"
                    >
                      {country.name}: {Math.round(country.percentage * 100)}%
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="h-[400px] overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-900 divide-y divide-gray-100 dark:divide-gray-900">
                  {sortedLocations.slice(0, 20).map((country, _) => (
                    <div key={country.name} className="flex items-center justify-between px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium py-0.5 px-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 min-w-[20px] text-center">
                          {_ + 1}
                        </span>
                        <span className="text-sm font-medium">{country.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{country.count}</span>
                        <span className="text-xs py-0.5 px-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400">
                          {Math.round(country.percentage * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
