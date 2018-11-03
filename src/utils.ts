import * as debounce from 'debounce'

const random = {
  image: 'https://bulma.io/images/placeholders/128x128.png',
  string: 'Bar Alto,Sin Seguritat,Lorem Ipsum,Ciao,Sit dolor,Por erestet,Tchu la Comida,Amet Inn,Aqualeris baked,Bouquet,Zu Amarillo,Ploject,Ruhe animals,Mah Plizure,Baacon pasty,Vinci mador,Alan Awake,Malohe Sutur,A priore sur,Quel memento,Kalitat arae,Buru menhir'.split(',')
}

export default class Utils {
  static copy<T> (object: T): T {
    return JSON.parse(JSON.stringify(object))
  }
  static debounce (func: Function, interval = 1000, immediate = false): () => void {
    return debounce.default(func, interval) as any
  }
  static slugify (str: string): string {
    // does not handle accentuated
    // ex : Déjà Vu => d-j-vu
    return str.toLowerCase().trim() // Lower case everything & trim
      .replace(/\W+/gi, '-') // Replace all non word with dash
      .replace(/^-+/, '') // Trim dash from start
      .replace(/-+$/, '') // Trim dash from end
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
  static wrapWithClass (text: string, cls: string): string {
    return text.replace(
      /^(\s)*([A-zÀ-ÿ-_\s]+[A-zÀ-ÿ-_])(\s)*$/,
      '$1<span class="' + cls + '">$2</span>$3'
    )
  }
  static validLink (str: string): string {
    return (/^https?:\/\//.test(str) && str) || `https://${str}`
  }
}
