import { defineStore } from "pinia";
import CryptoJS from "crypto-js";

export const useStoreSteggy = defineStore("steggyStore", {
  state: () => ({
    // Состояние пока не требуется
  }),
  actions: {
    // Шифрует данные с использованием AES-256 и предоставленного пароля
    encryptData(data: string, password: string): string {
      if (!password) {
        console.error("Пароль не предоставлен. Шифрование невозможно.");
        throw new Error("Пароль не может быть пустым.");
      }
      const hash = CryptoJS.SHA384(password).toString();
      const encrypted = CryptoJS.AES.encrypt(data, password + hash).toString();
      return encrypted;
    },

    // Расшифровывает данные, зашифрованные AES-256, с использованием пароля
    decryptData(encryptedData: string, password: string): string {
      if (!password) {
        console.error("Пароль не предоставлен. Расшифровка невозможна.");
        throw new Error("Пароль не может быть пустым.");
      }
      const hash = CryptoJS.SHA384(password).toString();
      const decrypted = CryptoJS.AES.decrypt(encryptedData, password + hash);
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) {
          // Эта проверка помогает отловить случаи, когда пароль неверный, 
          // так как CryptoJS вернет пустую строку.
          throw new Error("Ошибка расшифровки. Возможно, неверный пароль.");
      }
      
      return decryptedString;
    },
  },
});