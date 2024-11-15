import type { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";
const cors_proxy = require("cors-anywhere");

const proxy = cors_proxy.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: [], // Do not require origin or x-requested-with header
  removeHeaders: ["cookie", "cookie2"],
});

export const handler: APIGatewayProxyHandlerV2 = async (event): Promise<APIGatewayProxyResultV2> => {
  return new Promise((resolve) => {
    console.log("Received event:", event);

    // Extract the target URL from query parameters
    const targetUrl = event.queryStringParameters?.url || "";

    if (!/^https?:\/\//i.test(targetUrl)) {
      resolve({
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify({
          error: "Invalid URL: Must start with http:// or https://",
        }),
      });
      return;
    }

    // Create a mock request object to pass to the proxy
    const req = {
      url: targetUrl,
      headers: {
        host: event.headers.host || "",
        origin: event.headers.origin || "",
        ...event.headers,
      },
      method: event.requestContext.http.method,
    };

    // Create a mock response object
    const res = {
      setHeader: () => {},
      end: (body: any) => {
        resolve({
          statusCode: 200,
          headers: {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
          },
          body,
        });
      },
    };

    // Emit the request to the proxy server
    proxy.emit("request", req, res);
  });
};
