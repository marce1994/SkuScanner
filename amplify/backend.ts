import { defineBackend } from '@aws-amplify/backend';
import { proxy } from './proxy/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  proxy
});
