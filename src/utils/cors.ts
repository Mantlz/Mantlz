import { NextResponse, NextRequest } from 'next/server';

function isValidOrigin(origin: string | null): boolean {
  if (!origin) return false;

  try {
    const url = new URL(origin);

    // Basic checks: allow only http or https schemes
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    // Optional: restrict to certain TLDs or domains if you want
    // e.g., allow all subdomains of your domain:
    // if (!url.hostname.endsWith('.yourdomain.com')) return false;

    return true;
  } catch {
    return false;
  }
}

export function handlePreflightRequest() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export function addCorsHeadersToResponse(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin');
  const response = NextResponse.next();

  if (req.method === 'OPTIONS') {
    if (isValidOrigin(origin)) {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin!,
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
          'Access-Control-Allow-Credentials': 'true',
        },
      });
    }
    return new NextResponse('Origin not allowed', { status: 403 });
  }

  if (isValidOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin!);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}
