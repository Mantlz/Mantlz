declare module 'react-simple-maps' {
  import * as React from 'react';
  
  export interface ComposableMapProps {
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
      [key: string]: any;
    };
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }
  
  export interface ZoomableGroupProps {
    zoom?: number;
    center?: [number, number];
    maxZoom?: number;
    minZoom?: number;
    translateExtent?: [[number, number], [number, number]];
    children?: React.ReactNode;
  }
  
  export interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: Geography[] }) => React.ReactNode;
  }
  
  export interface Geography {
    rsmKey: string;
    svgPath: string;
    [key: string]: any;
  }
  
  export interface GeographyProps {
    geography: Geography;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
    style?: React.CSSProperties;
  }
  
  export interface MarkerProps {
    coordinates: [number, number];
    children?: React.ReactNode;
  }
  
  export const ComposableMap: React.FC<ComposableMapProps>;
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<GeographyProps>;
  export const Marker: React.FC<MarkerProps>;
} 