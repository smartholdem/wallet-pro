<!--
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
-->
<template>
  <div class="row mb-3">
    <!-- Встроить данные -->
    <div class="col-lg-6 px-3">
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

          <div class="row">
            <div class="col-md-3">
              <div class="image-preview float-left">
                <div v-if="selectedImage">
                  <img :src="selectedImage" :alt="$t('steggy.image_preview_alt')" />
                </div>
                <div
                  v-else
                  style="width: 120px; height: 120px; border: dashed 1px #ccc"
                >
                </div>
              </div>
            </div>
            <div class="col-md-8">
              <div class="image-info mt-2 float-start1" v-if="imageWidth && imageHeight">
                <p>{{ $t('steggy.image_resolution') }}: {{ imageWidth }} x {{ imageHeight }}</p>
                <p>{{ $t('steggy.max_capacity') }}: {{ maxEmbeddableBytes }} {{ $t('steggy.bytes') }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="data-input-section">
          <h5>{{ $t('steggy.enter_data') }}</h5>
          <textarea
            class="form-control"
            v-model="embedText"
            :placeholder="$t('steggy.embed_data_placeholder')"
            :disabled="!selectedImage"
          ></textarea>
          <div class="form-text">
            {{ embedTextBytesLength }} / {{ maxEmbeddableBytes }} {{ $t('steggy.bytes') }}
          </div>
          <div class="alert alert-warning mt-2" v-if="showCapacityWarning">
            {{ $t('steggy.capacity_warning') }}
          </div>
        </div>

        <div class="encryption-section mt-2 mb-2">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" v-model="useEncryption" id="useEncryptionCheck">
            <label class="form-check-label" for="useEncryptionCheck">
              {{ $t('steggy.encrypt_data') }}
            </label>
          </div>

          <div v-if="useEncryption" class="encryption-fields mt-2">
            <div class="mb-2">
              <label for="password" class="form-label">{{ $t('steggy.password_label') }}</label>
              <input type="text" class="form-control" id="password" v-model="password">
            </div>
            <button class="btn btn-secondary mb-2" @click="encryptText" :disabled="!embedText || !password">
              {{ $t('steggy.encrypt_button') }}
            </button>
            <div v-if="encryptedDataJson">
              <label for="encryptedData" class="form-label">{{ $t('steggy.encrypted_data_json') }}</label>
              <textarea id="encryptedData" class="form-control" :value="encryptedDataJson" readonly></textarea>
            </div>
          </div>
        </div>

        <div class="action-buttons mb-2">
          <button
            class="btn btn-primary"
            @click="embedData"
            :disabled="!selectedImage || !embedText"
          >
            {{ $t('steggy.embed_button') }}
          </button>
        </div>
      </div>
    </div>

    <div class="col-lg-6 px-3 pt-3 text-center" style="border: dashed 1px rgba(221,221,221,0.22);">
      <h5 class="text-center">{{ $t('steggy.result') }}</h5>
      <div v-if="resultImage">
        <div class="">
          <img style="max-height: 320px; border: solid 2px #0bc566" :src="resultImage" :alt="$t('steggy.result_image_alt')" />
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
      <div
        v-else
        style="width: 240px; height: 240px; border: dashed 1px #ccc; margin-left: auto; margin-right: auto;"
      ></div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStoreSteggy } from "@/stores/steggy";
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';

const steggyStore = useStoreSteggy();
const { t } = useI18n();

// Реактивные переменные
const imageInput = ref<HTMLInputElement | null>(null);
const selectedImage = ref<string | null>(null);
const resultImage = ref<string | null>(null);
const embedText = ref("");
const resultFilename = ref("steggy_result.png");
const imageWidth = ref<number | null>(null);
const imageHeight = ref<number | null>(null);

// Шифрование
const useEncryption = ref(false);
const password = ref("");
const encryptedDataJson = ref("");

const maxEmbeddableBytes = computed(() => {
  if (imageWidth.value && imageHeight.value) {
    const totalBits = imageWidth.value * imageHeight.value * 4;
    const availableBits = totalBits - (4 * 8);
    return Math.floor(Math.max(0, availableBits) / 8);
  }
  return 0;
});

const embedTextBytesLength = computed(() => {
  return new TextEncoder().encode(embedText.value).length;
});

const showCapacityWarning = computed(() => {
  if (!embedText.value || !maxEmbeddableBytes.value) {
    return false;
  }
  return embedTextBytesLength.value > maxEmbeddableBytes.value / 2;
});

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file && file.type.startsWith("image/")) {
    resultFilename.value = `STEG-${file.name}`; // Set the final filename here
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImage.value = e.target?.result as string;
      resultImage.value = null;
      embedText.value = "";
      encryptedDataJson.value = "";
      password.value = "";
      useEncryption.value = false;

      const img = new Image();
      img.onload = () => {
        imageWidth.value = img.width;
        imageHeight.value = img.height;
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const encryptText = () => {
  if (!embedText.value || !password.value) {
    alert(t('steggy.encryption_text_password_required'));
    return;
  }
  try {
    const encrypted = steggyStore.encryptData(embedText.value, password.value);
    const jsonObj = {
      provider: "sth",
      encryption_type: "AES",
      encryption_data: encrypted,
    };
    encryptedDataJson.value = JSON.stringify(jsonObj, null, 2);
  } catch (error) {
    alert(error);
  }
};

const embedData = () => {
  let dataToEmbed = embedText.value;
  if (useEncryption.value && encryptedDataJson.value) {
    dataToEmbed = encryptedDataJson.value;
  }
  
  if (!selectedImage.value || !dataToEmbed) return;

  const img = new Image();
  img.src = selectedImage.value;

  img.onload = () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        alert(t('steggy.canvas_error'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const textBytes = new TextEncoder().encode(dataToEmbed);
      const lengthBytes = new Uint8Array(4);
      new DataView(lengthBytes.buffer).setUint32(0, textBytes.length, false);

      const messageBytes = new Uint8Array(4 + textBytes.length);
      messageBytes.set(lengthBytes, 0);
      messageBytes.set(textBytes, 4);

      const requiredBits = messageBytes.length * 8;
      if (requiredBits > data.length) {
        alert(t('steggy.image_too_small'));
        return;
      }

      let bitIndex = 0;
      for (let i = 0; i < messageBytes.length; i++) {
        const byte = messageBytes[i];
        for (let bitPos = 7; bitPos >= 0; bitPos--) {
          if (bitIndex < data.length) {
            const bit = (byte >> bitPos) & 1;
            if (bit === 0) {
              data[bitIndex] = (data[bitIndex] & 0xFE);
            } else {
              data[bitIndex] = (data[bitIndex] & 0xFE) | 1;
            }
            bitIndex++;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const imageDataUrl = canvas.toDataURL("image/png");

      if (imageDataUrl.length > 1000000) {
        canvas.toBlob((blob) => {
          if (blob) {
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

const clearImage = () => {
  selectedImage.value = null;
  resultImage.value = null;
  embedText.value = "";
  imageWidth.value = null;
  imageHeight.value = null;
  resultFilename.value = "steggy_result.png";

  if (imageInput.value) {
    imageInput.value.value = "";
  }
};

const downloadImage = async () => {
  if (!resultImage.value) return;

  const getBase64Data = (url: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        if (url.startsWith('blob:')) {
          const response = await fetch(url);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = (reader.result as string).split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(blob);
        } else { // It's a dataURL
          const base64Data = url.split(',')[1];
          resolve(base64Data);
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  try {
    const fileName = resultFilename.value; // Use the filename set in onFileChange

    if (Capacitor.getPlatform() !== 'web') {
      // Capacitor/Android logic
      const base64 = await getBase64Data(resultImage.value);
      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Documents,
      });
      await Toast.show({
        text: `Файл сохранен: ${fileName}`,
        duration: 'long'
      });
    } else {
      // Default web logic
      const link = document.createElement("a");
      link.href = resultImage.value;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (e: any) {
    await Toast.show({
      text: `Ошибка сохранения: ${e.message}`,
      duration: 'long'
    });
    console.error('Download error', e);
  }
};
</script>

<style scoped>
.upload-section,
.data-input-section {
  margin-bottom: 20px;
}

.image-preview {
  margin-top: 10px;
  max-height: 120px;
  width: 100%;
}

.image-preview img {
  max-width: 100%;
  height: 120px;
  object-fit: contain;
  border: solid 2px #32465e;
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
</style>
