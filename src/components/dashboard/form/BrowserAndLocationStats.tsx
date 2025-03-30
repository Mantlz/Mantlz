"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Globe, MapPin } from "lucide-react"

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

export function BrowserAndLocationStats({ 
  browsers, 
  countries, 
  isLoading = false 
}: BrowserAndLocationStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-zinc-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-white">Browser</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 dark:border-zinc-800 border-t-slate-500 dark:border-t-zinc-600" />
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-white">Visitors</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 dark:border-zinc-800 border-t-slate-500 dark:border-t-zinc-600" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Browser Stats Card */}
      <Card className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-900 dark:text-white">Browser</CardTitle>
          <Badge variant="outline" className="font-mono text-xs">
            Visitors
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {browsers.length > 0 ? (
              browsers.map((browser) => (
                <div key={browser.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {browser.icon}
                    <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                      {browser.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-slate-900 dark:text-white">
                      {browser.count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <Globe className="h-10 w-10 text-slate-300 dark:text-zinc-700 mb-2" />
                <p className="text-sm text-slate-500 dark:text-zinc-400">No browser data yet</p>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 text-center">
                  Browser stats will appear after your first form submission
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Map Card */}
      <Card className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-900 dark:text-white">Visitors</CardTitle>
          <Badge variant="outline" className="font-mono text-xs">
            Countries
          </Badge>
        </CardHeader>
        <CardContent>
          {countries.length > 0 ? (
            <div className="relative">
              {/* World Map with Country Markers */}
              <div className="bg-slate-100 dark:bg-zinc-800 rounded-md h-[180px] mb-2 overflow-hidden relative">
                {/* World map SVG */}
                <svg 
                  width="100%" 
                  height="100%" 
                  viewBox="0 0 360 180" 
                  className="absolute inset-0 text-slate-300 dark:text-zinc-700 opacity-30"
                >
                  {/* Grid lines */}
                  <path d="M180,0 L180,180" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="2,2" />
                  <path d="M0,90 L360,90" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  
                  {/* North America */}
                  <path d="M30,40 C40,35 50,40 60,35 C70,30 80,25 90,30 C95,35 100,40 110,45 C120,50 125,55 130,60 C133,65 135,70 133,75 C130,80 125,85 120,87 C110,90 100,85 95,80 C90,75 85,70 80,65 C75,60 70,55 65,50 C60,45 55,40 50,35 C45,30 40,35 35,40 C30,45 25,40 30,40Z" 
                    stroke="currentColor" strokeWidth="1" fill="none" />
                  
                  {/* South America */}
                  <path d="M90,90 C95,95 100,100 105,105 C110,110 115,115 118,120 C120,125 122,130 125,135 C127,140 130,145 125,150 C120,155 115,150 110,145 C105,140 100,135 95,130 C90,125 85,120 80,115 C78,110 76,105 80,100 C85,95 90,90 90,90Z" 
                    stroke="currentColor" strokeWidth="1" fill="none" />
                  
                  {/* Europe */}
                  <path d="M175,35 C180,30 185,32 190,35 C195,40 200,42 205,45 C210,48 215,50 220,45 C225,40 230,38 235,40 C240,42 245,45 247,50 C250,55 252,60 250,65 C248,70 245,75 240,77 C235,80 230,78 225,75 C220,72 215,70 210,68 C205,65 200,62 195,60 C190,58 185,55 180,53 C175,50 170,47 175,45 C178,40 175,35 175,35Z" 
                    stroke="currentColor" strokeWidth="1" fill="none" />
                  
                  {/* Africa */}
                  <path d="M185,80 C190,75 195,70 200,75 C205,80 210,85 215,90 C220,95 225,100 230,105 C235,110 240,115 245,120 C250,125 248,130 245,135 C240,140 235,145 230,140 C225,135 220,130 215,125 C210,120 205,115 200,110 C195,105 190,100 185,95 C180,90 180,85 185,80Z" 
                    stroke="currentColor" strokeWidth="1" fill="none" />
                  
                  {/* Asia */}
                  <path d="M250,30 C255,25 260,20 265,25 C270,30 275,35 280,40 C285,45 290,50 295,55 C300,60 305,65 310,70 C315,75 320,80 325,85 C330,90 325,95 320,93 C315,90 310,85 305,80 C300,75 295,70 290,65 C285,60 280,55 275,50 C270,45 265,40 260,35 C255,30 250,30 250,30Z" 
                    stroke="currentColor" strokeWidth="1" fill="none" />
                  
                  {/* Australia */}
                  <path d="M300,120 C305,115 310,110 315,115 C320,120 325,125 330,130 C335,135 330,140 325,138 C320,135 315,130 310,125 C305,120 300,120 300,120Z" 
                    stroke="currentColor" strokeWidth="1" fill="none" />
                </svg>
                
                {/* Country markers */}
                {countries.map((country) => {
                  // Get coordinates for this country
                  const coords = COUNTRY_COORDINATES[country.name];
                  if (!coords) return null;
                  
                  // Convert geographic coordinates to SVG viewBox coordinates
                  const [lat, lng] = coords;
                  const x = ((lng + 180) / 360) * 360; // Convert -180...180 to 0...360
                  const y = ((90 - lat) / 180) * 180;  // Convert 90...-90 to 0...180
                  
                  return (
                    <div
                      key={country.name}
                      className="absolute flex flex-col items-center"
                      style={{
                        left: `${(x / 360) * 100}%`,
                        top: `${(y / 180) * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="relative">
                        <MapPin className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                        <span className="absolute top-[-8px] right-[-8px] bg-blue-500 dark:bg-blue-400 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {country.count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Top Countries */}
              <div className="mt-2 space-y-2">
                {countries.slice(0, 3).map((country) => (
                  <div key={country.name} className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-zinc-300">
                      {country.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={country.percentage * 100} 
                        className="h-2 w-24 bg-slate-100 dark:bg-zinc-800" 
                      />
                      <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 w-5 text-right">
                        {country.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <MapPin className="h-10 w-10 text-slate-300 dark:text-zinc-700 mb-2" />
              <p className="text-sm text-slate-500 dark:text-zinc-400">No location data yet</p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 text-center">
                Location stats will appear after your first form submission
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 