// In: app/api/image-proxy/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch image from external source');
    }
    const imageBlob = await response.blob();
    
    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/png',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json({ error: 'Failed to proxy image' }, { status: 500 });
  }
}