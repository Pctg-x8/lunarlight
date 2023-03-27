declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** origin for api access. specified dynamically on launching container */
      readonly APP_BASE_URL?: string;
      /** base path where the application deployed onto. always starts with `/` and ends without `/` */
      readonly NEXT_PUBLIC_BASE_PATH?: string;
    }
  }
}

export {};
