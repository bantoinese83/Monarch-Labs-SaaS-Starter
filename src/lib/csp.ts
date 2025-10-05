export function generateNonce(length = 16): string {
  const array = new Uint8Array(length)
  // Edge runtime supports Web Crypto
  globalThis.crypto.getRandomValues(array)
  let str = ''
  for (let i = 0; i < array.length; i++) {
    str += String.fromCharCode(array[i])
  }
  // Base64-url encode
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
