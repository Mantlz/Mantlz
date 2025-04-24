import { NextResponse } from "next/server";

// Get allowed origin for CORS
export const getAllowedOrigin = (): string => {
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://form-quay.vercel.app';
};

// Handle CORS preflight requests
export const handlePreflightRequest = (): NextResponse => {
  const headers = {
    'Access-Control-Allow-Origin': getAllowedOrigin(),
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
  
  return new NextResponse(null, { headers });
};

// Add CORS headers to API routes
export const addCorsHeadersToResponse = (response: NextResponse): NextResponse => {
  response.headers.set('Access-Control-Allow-Origin', getAllowedOrigin());
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}; 