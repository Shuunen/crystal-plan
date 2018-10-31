import * as debounce from 'debounce'

const random = {
  image: 'https://bulma.io/images/placeholders/128x128.png',
  string: 'bar alto,sin seguritat,lorem ipsum,ciao,sit dolor,por erestet,tchu la comida,in amet,aqualeris baked,bouquet,zu amarillo,ploject,ruhe animals,ma plizure,bacon pasty,vinci mador,alan awake,malohe sutur,a priore sur,quel memento,kalitat,buru menhir'.split(',')
}

export default class Utils {
  static copy<T> (object: T): T {
    return JSON.parse(JSON.stringify(object))
  }
  static debounce (func: Function, interval = 1000, immediate = false): () => void {
    return debounce.default(func, interval) as any
  }
  static getRandomImage (): string {
    return (random.image + '')
  }
  static getRandomString (): string {
    return (
      random.string.pop() ||
      Math.random()
        .toString(36)
        .substring(7)
    )
  }
  static validLink (str: string): string {
    return (/^https?:\/\//.test(str) && str) || `https://${str}`
  }
}
