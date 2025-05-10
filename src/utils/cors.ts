import { NextResponse, NextRequest } from 'next/server';

function isValidOrigin(origin: string | null): boolean {
  if (!origin) return false;

  try {
    const url = new URL(origin);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function handlePreflightRequest(req: NextRequest) {
  const origin = req.headers.get('origin');
  
  if (!isValidOrigin(origin)) {
    (`Rejected preflight from invalid origin: ${origin}`);
    return new NextResponse('Origin not allowed', { status: 403 });
  }
  
  (`Allowing preflight from origin: ${origin}`);
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin!,
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export function addCorsHeadersToResponse(response: NextResponse, req: NextRequest) {
  const origin = req.headers.get('origin');
  
  if (isValidOrigin(origin)) {
    (`Adding CORS headers for origin: ${origin}`);
    response.headers.set('Access-Control-Allow-Origin', origin!);
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  } else {
    (`Not adding CORS headers for invalid origin: ${origin}`);
  }
  
  return response;
}

// New function to handle redirects with CORS headers
export function handleRedirectWithCors(req: NextRequest, redirectUrl: string) {
  const origin = req.headers.get('origin');
  const response = NextResponse.redirect(redirectUrl);
  
  if (isValidOrigin(origin)) {
    (`Adding CORS headers for redirect to: ${redirectUrl}`);
    response.headers.set('Access-Control-Allow-Origin', origin!);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  return response;
}
