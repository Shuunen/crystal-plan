import * as debounce from 'debounce'

export default class Utils {
  static debounce (func: Function, interval = 1000, immediate = false): () => void {
    return debounce.default(func, interval) as any
  }
  static wrapWithClass (text: string, cls: string): string {
    return text.replace(
      /^(\s)*([A-Za-zÀ-ÿ-_\s]+[A-Za-zÀ-ÿ-_])(\s)*$/,
      '$1<span class="' + cls + '">$2</span>$3'
    )
  }
  static validLink (str: string): string {
    return (/^https?:\/\//.test(str) && str) || `https://${str}`
  }
}
