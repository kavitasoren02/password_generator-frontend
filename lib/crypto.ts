import CryptoJS from "crypto-js"

export const cryptoService = {
    encrypt(text: string, masterKey: string): string {
        return CryptoJS.AES.encrypt(text, masterKey).toString()
    },

    decrypt(encryptedText: string, masterKey: string): string {
        const bytes = CryptoJS.AES.decrypt(encryptedText, masterKey)
        return bytes.toString(CryptoJS.enc.Utf8)
    },

    generateKey(password: string, email: string): string {
        return CryptoJS.PBKDF2(password, email, {
            keySize: 256 / 32,
            iterations: 10000,
        }).toString()
    },
}
