import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import { CorsHttpMethod, HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { proxy } from './proxy/resource';

const backend = defineBackend({
  proxy
});

// Create a new API stack
const apiStack = backend.createStack("api-stack");

// Create a new HTTP Lambda integration for your proxy function
const httpLambdaIntegration = new HttpLambdaIntegration(
  "LambdaIntegration",
  backend.proxy.resources.lambda
);

// Create a new HTTP API (public access, no authentication)
const httpApi = new HttpApi(apiStack, "HttpApi", {
  apiName: "proxyHttpApi",
  corsPreflight: {
    // CORS settings to allow public access
    allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.POST, CorsHttpMethod.OPTIONS, CorsHttpMethod.PUT, CorsHttpMethod.DELETE],
    allowOrigins: ["*"], // Allow requests from any origin
    allowHeaders: ["*"],  // Allow any headers
  },
  createDefaultStage: true,
});

// Add a single proxy route to the API (public access)
httpApi.addRoutes({
  path: "/proxy/{proxy+}", // Catch-all route to proxy any sub-path
  methods: [HttpMethod.ANY],
  integration: httpLambdaIntegration,
});

// Output the configuration
backend.addOutput({
  custom: {
    API: {
      [httpApi.httpApiName!]: {
        endpoint: httpApi.url,
        region: Stack.of(httpApi).region,
        apiName: httpApi.httpApiName,
      },
    },
  },
});
