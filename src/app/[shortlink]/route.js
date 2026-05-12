import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request, { params }) {
  const { shortlink } = await params;

  const { data } = await supabase
    .from('links')
    .select('destination, is_file')
    .eq('slug', shortlink)
    .maybeSingle();

  if (!data) {
    return new NextResponse(null, { status: 404 });
  }

  if (data.is_file) {
    const upstream = await fetch(data.destination);
    return new NextResponse(upstream.body, {
      headers: {
        'content-type': upstream.headers.get('content-type') || 'application/octet-stream',
        'content-length': upstream.headers.get('content-length') || '',
        'cache-control': 'public, max-age=3600',
      },
    });
  }

  return NextResponse.redirect(data.destination);
}
