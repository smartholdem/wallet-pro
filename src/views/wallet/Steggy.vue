<template>
  <div class="container mt-4">
    <card>
      <div class="card-header">
        <h4 class="mb-0">{{ $t('steggy.title') }}</h4>
      </div>
      <div class="card-body">
        <p>
          {{ $t('steggy.description') }}
        </p>
        <div class="row">
          <div class="col-lg-6">
            <div class="">
              <div class="upload-section">
                <h5>{{ $t('steggy.upload_image') }}</h5>

                <div class="row">
                  <div class="col-lg-8">
                    <input
                      class="form-control mb-2"
                      type="file"
                      accept="image/*"
                      @change="onFileChange"
                      ref="imageInput"
                    />
                  </div>

                  <div class="col-lg-4">
                    <button @click="clearImage" class="btn btn-secondary">
                      {{ $t('steggy.clear_image') }}
                    </button>
                  </div>
                </div>




                <div class="image-preview">
                  <div v-if="selectedImage">
                    <img :src="selectedImage" :alt="$t('steggy.image_preview_alt')" />
                  </div>
                </div>
              </div>

              <div class="data-input-section">
                <h3>{{ $t('steggy.enter_data') }}</h3>
                <textarea
                  class="form-control"
                  v-model="embedText"
                  :placeholder="$t('steggy.embed_data_placeholder')"
                  :disabled="!selectedImage"
                ></textarea>
              </div>


              <div class="action-buttons">
                <button
                  class="btn btn-primary"
                  @click="embedData"
                  :disabled="!selectedImage || !embedText"
                >
                  {{ $t('steggy.embed_button') }}
                </button>
                <button
                  class="btn btn-warning"
                  @click="extractData"
                  :disabled="!selectedImage"
                >
                  {{ $t('steggy.extract_button') }}
                </button>
              </div>


            </div>
          </div>

          <div class="col-lg-6">
            <div v-if="resultImage">
              <h5>{{ $t('steggy.result') }}</h5>
              <div class="mt-5 pt-3">
                <img style="max-height: 200px; border: solid 2px #eee" :src="resultImage" :alt="$t('steggy.result_image_alt')" />
              </div>

              <div class="mt-2">
                <button
                  @click="downloadImage"
                  class="btn btn-success"
                >
                  {{ $t('steggy.download_button') }}
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// Реактивные переменные
const imageInput = ref<HTMLInputElement | null>(null);
const selectedImage = ref<string | null>(null);
const resultImage = ref<string | null>(null);
const embedText = ref("");
const resultFilename = ref("steggy_result.png");

/**
 * Обработка изменения файла изображения
 */
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImage.value = e.target?.result as string;
      resultImage.value = null; // Сброс результата при новом изображении
      embedText.value = "";    // Сброс текста при новом изображении
    };
    reader.readAsDataURL(file);
  }
};

/**
 * Встраивание данных в изображение с использованием LSB метода
 */
const embedData = () => {
  if (!selectedImage.value || !embedText.value) return;

  // Создаем изображение из base64
  const img = new Image();
  img.src = selectedImage.value;

  img.onload = () => {
    try {
      // Создаем canvas для работы с изображением
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        alert(t('steggy.canvas_error'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Получаем данные изображения
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Добавляем длину сообщения (4 байта) перед самим сообщением
      const textBytes = new TextEncoder().encode(embedText.value);
      const lengthBytes = new Uint8Array(4);
      new DataView(lengthBytes.buffer).setUint32(0, textBytes.length, false); // big-endian

      // Объединяем длину и текст
      const messageBytes = new Uint8Array(4 + textBytes.length);
      messageBytes.set(lengthBytes, 0);
      messageBytes.set(textBytes, 4);

      // Проверим, достаточно ли пикселей для встраивания текста
      const requiredBits = messageBytes.length * 8; // 8 битов на байт
      if (requiredBits > data.length) {
        alert(t('steggy.image_too_small'));
        return;
      }

      // Встраиваем байты текста в младшие биты пикселей (по 1 биту на компонент)
      let bitIndex = 0;
      for (let i = 0; i < messageBytes.length; i++) {
        const byte = messageBytes[i];

        // Встраиваем байт в 8 последовательных байтов данных (R, G, B, A компоненты)
        for (let bitPos = 7; bitPos >= 0; bitPos--) {
          if (bitIndex < data.length) {
            // Получаем конкретный бит из байта (от старшего к младшему)
            const bit = (byte >> bitPos) & 1;

            // Удаляем последний бит и добавляем наш
            // Убедимся, что значение не будет изменено при обработке canvas
            if (bit === 0) {
              // Устанавливаем значение, которое гарантированно имеет 0 в младшем бите
              data[bitIndex] = (data[bitIndex] & 0xFE); // только четное значение
            } else {
              // Устанавливаем значение, которое гарантированно имеет 1 в младшем бите
              data[bitIndex] = (data[bitIndex] & 0xFE) | 1; // только нечетное значение
            }

            bitIndex++;
          }
        }
      }

      // Обновляем изображение с встроенными данными
      ctx.putImageData(imageData, 0, 0);

      // ИСПРАВЛЕНО: Используем PNG вместо JPEG, чтобы избежать сжатия, которое разрушает скрытые данные
      const imageDataUrl = canvas.toDataURL("image/png");

      // Проверяем длину URL и при необходимости используем Blob для скачивания
      if (imageDataUrl.length > 1000000) { // Max: 1000000
        // Создаем Blob из canvas данных
        canvas.toBlob((blob) => {
          if (blob) {
            // Создаем URL из Blob
            const blobUrl = URL.createObjectURL(blob);
            resultImage.value = blobUrl;
            resultFilename.value = "steggy_output.png";
          }
        }, "image/png");
      } else {
        resultImage.value = imageDataUrl;
        resultFilename.value = "steggy_output.png";
      }
    } catch (error) {
      console.error(t('steggy.embed_error'), error);
      alert(t('steggy.embed_error_msg'));
    }
  };
};

/**
 * Извлечение данных из изображения
 */
const extractData = () => {
  if (!selectedImage.value) return;

  // Создаем изображение из base64
  const img = new Image();
  img.src = selectedImage.value;

  img.onload = () => {
    try {
      // Создаем canvas для работы с изображением
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        alert(t('steggy.canvas_error'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Получаем данные изображения
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Извлекаем длину сообщения из первых 32 бит (4 байта)
      let bitIndex = 0;
      let lengthBytes = [];
      for (let byteIdx = 0; byteIdx < 4; byteIdx++) {
        let currentByte = 0;

        for (let bitPos = 7; bitPos >= 0; bitPos--) {
          if (bitIndex < data.length) {
            const bit = data[bitIndex] & 1; // Извлекаем только младший бит
            currentByte |= (bit << bitPos);
            bitIndex++;
          }
        }
        lengthBytes.push(currentByte);
      }

      // Восстанавливаем длину сообщения из 4 байтов
      const messageLength = new DataView(new Uint8Array(lengthBytes).buffer).getUint32(0, false); // big-endian

      // Проверяем, можно ли извлечь столько байтов
      if (messageLength * 8 > data.length - bitIndex) {
        alert(t('steggy.header_too_long'));
        return;
      }

      // Извлекаем само сообщение
      let extractedBytes = [];
      for (let byteIdx = 0; byteIdx < messageLength; byteIdx++) {
        let currentByte = 0;

        for (let bitPos = 7; bitPos >= 0; bitPos--) {
          if (bitIndex < data.length) {
            const bit = data[bitIndex] & 1; // Извлекаем только младший бит
            currentByte |= (bit << bitPos);
            bitIndex++;
          }
        }
        extractedBytes.push(currentByte);
      }

      if (extractedBytes.length > 0) {
        // Преобразуем байты в строку
        const extractedText = new TextDecoder().decode(new Uint8Array(extractedBytes));
        embedText.value = extractedText;
        //alert(`${t('steggy.extracted_data')}: ${extractedText}`);
      } else {
        alert(t('steggy.no_hidden_data'));
      }
    } catch (error) {
      console.error(t('steggy.extract_error'), error);
      alert(t('steggy.extract_error_msg'));
    }
  };
};

/**
 * Очистка загруженного изображения
 */
const clearImage = () => {
  selectedImage.value = null;
  resultImage.value = null;
  embedText.value = "";

  // Очищаем input
  if (imageInput.value) {
    imageInput.value.value = "";
  }
};

/**
 * Скачивание изображения
 */
const downloadImage = () => {
  if (!resultImage.value) return;

  // Проверяем, является ли URL Blob
  if (resultImage.value.startsWith("blob:")) {
    // Если URL - это Blob, создаем ссылку и запускаем скачивание
    const link = document.createElement("a");
    link.href = resultImage.value;
    link.download = resultFilename.value;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // Если обычный URL, проверяем его длину и при необходимости конвертируем в Blob
    if (resultImage.value.length > 1000000) {
      // Преобразуем data URL в Blob
      const byteCharacters = atob(resultImage.value.split(",")[1]);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      // ИСПРАВЛЕНО: Используем правильный MIME-тип в зависимости от расширения файла
      const mimeType = resultFilename.value.endsWith(".png") ? "image/png" : "image/jpeg";
      const blob = new Blob(byteArrays, { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = resultFilename.value;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Освобождаем память
      URL.revokeObjectURL(blobUrl);
    } else {
      // Иначе используем обычное скачивание
      const link = document.createElement("a");
      link.href = resultImage.value;
      link.download = resultFilename.value;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>

<style scoped>
.steggy-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.steggy-content {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.upload-section,
.data-input-section {
  margin-bottom: 20px;
}

.image-preview {;
  margin-top: 10px;
  min-height: 200px;
  width: 100%;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border: solid 2px #ccc;
}

.mt-2 {
  margin-top: 0.5rem;
}

textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[type="file"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-buttons .btn {
  flex: 1;
  min-width: 120px;
}

.result-section {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #28a745;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.result-section img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  margin-bottom: 15px;
}

.download-section {
  text-align: center;
}
</style>