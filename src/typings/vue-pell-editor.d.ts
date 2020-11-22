declare module 'vue-pell-editor'

interface PellInstance {
  exec: (command: string, value?: string) => unknown
}

declare const pell: PellInstance
