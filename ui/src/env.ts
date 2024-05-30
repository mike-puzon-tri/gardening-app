import { DefaultApi } from 'src/interface/api';
import { Configuration } from 'src/interface/configuration';

const basePath: string = API_BASE_URL;

export const getDefaultAPI = (token: string) => {
  const apiConfig: Configuration = new Configuration({
    accessToken: token,
    basePath
  });

  return new DefaultApi(apiConfig);
};

// https://gaganpreet.in/posts/hyperproductive-apis-fastapi/
// https://www.stefanwille.com/2021/05/2021-05-30-openapi-code-generator-for-typescript
// https://blog.josematos.work/use-auto-generated-client-code-to-consume-your-api-from-an-angular-app-363c64f6c83a
// https://richardwillis.info/blog/generate-a-type-script-http-client-from-an-open-api-spec-in-dot-net-5
// https://medium.com/@AlexanderObregon/building-type-safe-apis-with-typescript-and-openapi-1f78b4b94ee4
