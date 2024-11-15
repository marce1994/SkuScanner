import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return new Response(
      JSON.stringify({ error: 'Missing URL parameter' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const targetUrl = decodeURIComponent(url);

  // Validar si la URL comienza con http:// o https://
  if (!/^https?:\/\//i.test(targetUrl)) {
    return new Response(
      JSON.stringify({ error: 'Invalid URL: Must start with http:// or https://' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Hacer una solicitud GET a la URL de destino
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'Next.js Proxy' }, // Agregar encabezado de user-agent si es necesario
    });

    // Obtener los datos de la respuesta
    const contentType = response.headers.get('Content-Type');
    const data = await response.text();

    // Verificar el tipo de contenido y manejar la respuesta adecuadamente
    if (contentType && contentType.includes('application/json')) {
      return new Response(data, { status: response.status, headers: { 'Content-Type': 'application/json' } });
    } else {
      return new Response(data, { status: response.status, headers: { 'Content-Type': contentType || 'text/plain' } });
    }
  } catch (error) {
    console.error('Error fetching URL:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch the requested URL' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
