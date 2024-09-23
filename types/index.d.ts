declare namespace NodeJS {
    interface ProcessEnv {
        HOST: string
        PORT: number
        USER: string
        PASSWORD: string
        NAME: string
        AUTH_KEY:string
    }
}