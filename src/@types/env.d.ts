declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** base path where the application deployed onto. always starts with `/` and ends without `/` */
      readonly NEXT_PUBLIC_BASE_PATH?: string;
    }
  }
}

export { };

