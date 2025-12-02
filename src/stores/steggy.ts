/*
* Copyright (c) 2025 TechnoL0g.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
*/

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