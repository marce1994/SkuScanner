const cors_proxy = require('cors-anywhere');

const proxy = cors_proxy.createServer({
    originWhitelist: [], // Permitir todas las orígenes
    requireHeader: [], // No requerir encabezados de origin ni x-requested-with
    removeHeaders: ['cookie', 'cookie2']
});

export const handler = async (event: any) => {
    return new Promise((resolve) => {
        // Extracción de la URL objetivo del evento
        const targetUrl = event.queryStringParameters?.url || '';

        if (!/^https?:\/\//i.test(targetUrl)) {
            resolve({
                statusCode: 400,
                body: 'Invalid URL: Must start with http:// or https://',
            });
            return;
        }

        // Crear objeto de solicitud simulado para pasar al proxy
        const req = {
            url: targetUrl,
            headers: {
                host: event.headers.host,
                origin: event.headers.origin,
                ...event.headers,
            },
            method: event.httpMethod,
        };

        const res = {
            setHeader: () => {},
            end: (body: any) => {
                resolve({
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*',
                    },
                    body,
                });
            },
        };

        proxy.emit('request', req, res);
    });
};
