import { defineFunction } from "@aws-amplify/backend";
    
export const proxy = defineFunction({
  name: "proxy",
  entry: "./handler.ts"
});