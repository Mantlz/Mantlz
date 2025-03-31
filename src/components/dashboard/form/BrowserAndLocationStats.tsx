"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Globe, MapPin, Loader2, AlertCircle, Maximize2, TrendingUp } from "lucide-react"
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker,
  ZoomableGroup
} from "react-simple-maps"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Add SVG namespace to JSX
declare namespace JSX {
  interface IntrinsicElements {
    foreignObject: React.SVGProps<SVGForeignObjectElement>;
  }
}

interface BrowserStat {
  name: string;
  count: number;
  percentage: number;
  icon?: React.ReactNode;
}

interface CountryStat {
  name: string;
  count: number;
  percentage: number;
}

interface BrowserAndLocationStatsProps {
  browsers: BrowserStat[];
  countries: CountryStat[];
  isLoading?: boolean;
}

// Country coordinates - approximate central points
const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  "United States": [40, -100],
  "United Kingdom": [55, 0],
  "Canada": [60, -95],
  "Australia": [-25, 135],
  "France": [47, 2],
  "Germany": [51, 10],
  "Japan": [36, 138],
  "China": [35, 105],
  "Spain": [40, -3],
  "Italy": [42, 12],
  "Russia": [60, 100],
  "Portugal": [39, -8],
  "Netherlands": [52, 5],
  "South Korea": [36, 128],
  "Brazil": [-10, -55],
  "Mexico": [23, -102],
  "India": [20, 77],
  "South Africa": [-30, 25],
  "Argentina": [-34, -64],
  "Indonesia": [-5, 120],
  "Poland": [52, 20],
  "Sweden": [62, 15],
  "Turkey": [39, 35],
  "Egypt": [27, 30],
  "Saudi Arabia": [25, 45],
  "Nigeria": [10, 8],
  "Kenya": [1, 38],
  "Thailand": [15, 100],
  "Vietnam": [16, 106],
  "Ireland": [53, -8],
  "Singapore": [1, 103],
  "New Zealand": [-40, 174],
  "Malaysia": [2, 112],
  "Philippines": [13, 122],
  "Chile": [-30, -71],
  "Colombia": [4, -72],
  "Peru": [-10, -76],
  "Ukraine": [49, 32],
  "Greece": [39, 22],
  "Austria": [47, 13],
  "Switzerland": [47, 8],
  "Belgium": [50, 4],
  "Denmark": [56, 10],
  "Finland": [64, 26],
  "Norway": [62, 10],
  "Czech Republic": [49, 15],
  "Hungary": [47, 20],
  "Romania": [46, 25],
  "Israel": [31, 35],
  "Taiwan": [23, 121],
  "Hong Kong": [22, 114],
  "Unknown": [0, 0] // Fallback for unknown countries
};

// GeoJSON for the world map
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

export function BrowserAndLocationStats({ 
  browsers, 
  countries, 
  isLoading = false 
}: BrowserAndLocationStatsProps) {
  // Add lazy loading for the map
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [mapExpanded, setMapExpanded] = React.useState(false);

  React.useEffect(() => {
    // Use Intersection Observer to lazy load the map when it comes into view
    if (typeof window !== "undefined" && !mapLoaded) {
      console.log("Setting up map observer");
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            console.log("Map is intersecting, setting mapLoaded to true");
            setMapLoaded(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      
      if (mapRef.current) {
        observer.observe(mapRef.current);
      }
      
      return () => {
        observer.disconnect();
      };
    }
  }, [mapLoaded]);

  // Transform browser data for the chart
  const browserChartData = React.useMemo(() => {
    return browsers.map(browser => ({
      browser: browser.name.toLowerCase(),
      visitors: browser.count,
      fill: `var(--color-${browser.name.toLowerCase()})`,
    }));
  }, [browsers]);

  // Chart configuration for browsers
  const browserChartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      visitors: {
        label: "Visitors",
      }
    };
    
    // Add each browser to the config
    browsers.forEach(browser => {
      const key = browser.name.toLowerCase();
      config[key] = {
        label: browser.name,
        color: `hsl(var(--chart-${browsers.indexOf(browser) + 1}))`,
      };
    });
    
    return config;
  }, [browsers]);

  // Transform country data for the chart
  const locationChartData = React.useMemo(() => {
    return countries.slice(0, 5).map(country => ({
      country: country.name.toLowerCase(),
      visitors: country.count,
      fill: `var(--color-${countries.indexOf(country) + 1})`,
    }));
  }, [countries]);

  // Chart configuration for countries
  const locationChartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      visitors: {
        label: "Visitors",
      }
    };
    
    // Add each country to the config
    countries.slice(0, 5).forEach(country => {
      const key = country.name.toLowerCase().replace(/\s+/g, '-');
      config[key] = {
        label: country.name,
        color: `hsl(var(--chart-${countries.indexOf(country) + 1}))`,
      };
    });
    
    return config;
  }, [countries]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[30vh] w-full">
        <div className="w-8 h-8 border-4 border-zinc-300 dark:border-zinc-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-sm font-mono uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
          Loading Data...
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Card - Visitors by Location - Updated to use chart */}
        <Card className="border border-zinc-200/50 dark:border-zinc-800/50 
          bg-white/80 dark:bg-zinc-900/70 backdrop-blur-sm
          shadow-lg hover:shadow-xl transition-all duration-300
          overflow-hidden min-h-[420px] rounded-xl">
          <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 pb-3 pt-4 px-5">
            <div className="flex justify-between items-center w-full">
              <CardTitle className="text-sm font-medium flex items-center">
                <div className="flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 w-6 h-6 rounded-md mr-2">
                  <MapPin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                Location Analytics
              </CardTitle>
              <Badge className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 
                hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors px-2 py-0.5 text-xs rounded-md">
                World Data
              </Badge>
            </div>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
              Geographic distribution of your visitors
            </CardDescription>
          </CardHeader>

          <CardContent className="px-5 pb-4 pt-3 relative">
            {countries.length > 0 ? (
              <div className="relative">
                {/* World Map reference - increased height */}
                <div 
                  ref={mapRef}
                  className="bg-white dark:bg-zinc-800/50 h-[250px] mb-1 overflow-hidden relative 
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
                  
                  {/* Map content - existing code */}
                  {mapLoaded && (
                    <ComposableMap
                      projectionConfig={{
                        scale: 160,
                        center: [0, 20]
                      }}
                      width={800}
                      height={400}
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "transparent"
                      }}
                    >
                      <ZoomableGroup 
                        zoom={1}
                        maxZoom={3}
                        minZoom={1}
                        translateExtent={[
                          [0, 0],
                          [800, 400]
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
                        
                        {/* Only show a few markers on the small map */}
                        {countries.slice(0, 5).map((country) => {
                          const coords = COUNTRY_COORDINATES[country.name];
                          if (!coords) return null;
                          const [lat, lng] = coords;
                          
                          return (
                            <Marker key={country.name} coordinates={[lng, lat]}>
                              <g transform="translate(-10, -10)" className="rsm-marker cursor-pointer">
                                <foreignObject width={20} height={20}>
                                  <div className="relative group">
                                    <div className="flex flex-col items-center">
                                      <div className="bg-indigo-500 dark:bg-indigo-400 flex items-center justify-center 
                                        min-w-[16px] min-h-[16px] px-1 text-[8px] font-medium text-white dark:text-zinc-900
                                        shadow-md rounded-md">
                                        {country.count}
                                      </div>
                                    </div>
                                  </div>
                                </foreignObject>
                              </g>
                            </Marker>
                          );
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
                
                {/* Location Chart - Updated with less spacing */}
                <div className="h-[160px] mt-1">
                  <ChartContainer config={locationChartConfig}>
                    <BarChart
                      accessibilityLayer
                      data={locationChartData}
                      layout="vertical"
                      margin={{
                        left: 0,
                        right: 20, // Reduced margin for labels
                      }}
                      barSize={24} // Even bigger bars
                      barGap={0} // No gap between bars
                    >
                      <YAxis
                        dataKey="country"
                        type="category"
                        tickLine={false}
                        tickMargin={6}
                        axisLine={false}
                        tickFormatter={(value) => {
                          const key = value.replace(/\s+/g, '-');
                          return (locationChartConfig[key as keyof typeof locationChartConfig]?.label || value) as string;
                        }}
                        // Make Y-axis spacing tighter
                        interval={0}
                        tick={{ fontSize: 12 }}
                        tickCount={5} // Control number of ticks displayed
                      />
                      <XAxis dataKey="visitors" type="number" hide />
                      <Bar 
                        dataKey="visitors" 
                        layout="vertical" 
                        radius={3}
                        label={{ 
                          position: 'right', 
                          fill: 'var(--foreground)', 
                          fontSize: 12,
                          fontWeight: 500 // Make numbers more visible
                        }}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-full mb-3">
                  <MapPin className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                </div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">No Location Data</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-center">
                  Waiting for first data transmission
                </p>
              </div>
            )}
          </CardContent>
          
          {countries.length > 0 && (
            <CardFooter className="flex-col items-start gap-2 text-sm px-5 py-3 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex gap-2 font-medium leading-none">
                Top Country: {countries[0]?.name} ({countries[0] ? Math.round(countries[0].percentage * 100) : 0}%)
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="leading-none text-muted-foreground text-xs">
                Visitors from {countries.length} countries
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Browser Stats Card */}
        <Card className="border border-zinc-200/50 dark:border-zinc-800/50 
          bg-white/80 dark:bg-zinc-900/70 backdrop-blur-sm
          shadow-lg hover:shadow-xl transition-all duration-300
          overflow-hidden min-h-[420px] rounded-xl">
          <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 pb-3 pt-4 px-5">
            <div className="flex justify-between items-center w-full">
              <CardTitle className="text-sm font-medium flex items-center">
                <div className="flex items-center justify-center bg-violet-100 dark:bg-violet-900/30 w-6 h-6 rounded-md mr-2">
                  <Globe className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                </div>
                Browser Analytics
              </CardTitle>
              <Badge className="bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 
                hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors px-2 py-0.5 text-xs rounded-md">
                Metrics
              </Badge>
            </div>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
              Browser usage distribution
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-5 pb-4 pt-3 relative">
            {browsers.length > 0 ? (
              <div className="h-[300px]">
                <ChartContainer config={browserChartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={browserChartData}
                    layout="vertical"
                    margin={{
                      left: 0,
                      right: 20, // Reduced margin for labels
                    }}
                    barSize={24} // Even bigger bars
                    barGap={0} // No gap between bars
                  >
                    <YAxis
                      dataKey="browser"
                      type="category"
                      tickLine={false}
                      tickMargin={6}
                      axisLine={false}
                      tickFormatter={(value) =>
                        (browserChartConfig[value as keyof typeof browserChartConfig]?.label || value) as string
                      }
                      // Make Y-axis spacing tighter
                      interval={0}
                      tick={{ fontSize: 12 }}
                      tickCount={browsers.length} // Control number of ticks displayed
                    />
                    <XAxis dataKey="visitors" type="number" hide />
                    <Bar 
                      dataKey="visitors" 
                      layout="vertical" 
                      radius={3}
                      label={{ 
                        position: 'right', 
                        fill: 'var(--foreground)', 
                        fontSize: 12,
                        fontWeight: 500 // Make numbers more visible
                      }}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-full mb-3">
                  <Globe className="h-6 w-6 text-violet-500 dark:text-violet-400" />
                </div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">No Browser Data</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-center">
                  Waiting for first data transmission
                </p>
              </div>
            )}
          </CardContent>
          
          {browsers.length > 0 && (
            <CardFooter className="flex-col items-start gap-2 text-sm px-5 py-3 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex gap-2 font-medium leading-none">
                Top Browser: {browsers[0]?.name} ({browsers[0] ? Math.round(browsers[0].percentage * 100) : 0}%)
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="leading-none text-muted-foreground text-xs">
                Showing browser distribution from {browsers.reduce((sum, b) => sum + b.count, 0)} visitors
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
            <div className="bg-white dark:bg-zinc-800/50 h-[500px] overflow-hidden relative 
              border border-zinc-200 dark:border-zinc-700/50 rounded-lg">
              <ComposableMap
                projectionConfig={{
                  scale: 220,
                  center: [0, 20]
                }}
                width={1000}
                height={600}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "transparent"
                }}
              >
                <ZoomableGroup 
                  zoom={1}
                  maxZoom={6}
                  minZoom={1}
                  translateExtent={[
                    [0, 0],
                    [1000, 600]
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
                  
                  {countries.map((country) => {
                    const coords = COUNTRY_COORDINATES[country.name];
                    if (!coords) return null;
                    const [lat, lng] = coords;
                    
                    return (
                      <Marker key={country.name} coordinates={[lng, lat]}>
                        <g transform="translate(-12, -12)" className="rsm-marker cursor-pointer">
                          <foreignObject width={24} height={24}>
                            <div className="relative group">
                              <div className="flex flex-col items-center">
                                <div className="bg-indigo-500 dark:bg-indigo-400 flex items-center justify-center 
                                  min-w-[24px] min-h-[24px] px-1 text-[11px] font-medium text-white dark:text-zinc-900
                                  shadow-md rounded-md
                                  group-hover:-translate-y-[2px] transition-transform z-30">
                                  {country.count}
                                </div>
                              </div>
                              
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 px-3 py-2 
                                bg-white dark:bg-zinc-800 text-xs whitespace-nowrap opacity-0 
                                group-hover:opacity-100 pointer-events-none transition-all z-40 
                                border border-zinc-200 dark:border-zinc-700
                                shadow-lg rounded-lg">
                                <div className="font-medium text-zinc-900 dark:text-zinc-100">{country.name}</div>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium text-indigo-600 dark:text-indigo-400">{country.count}</span> 
                                  <span className="text-zinc-500 dark:text-zinc-400">{country.count === 1 ? 'visitor' : 'visitors'}</span>
                                </div>
                              </div>
                            </div>
                          </foreignObject>
                        </g>
                      </Marker>
                    );
                  })}
                </ZoomableGroup>
              </ComposableMap>
            </div>
            
            <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 
              border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between items-center">
              <p>Displaying {countries.length} territories</p>
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