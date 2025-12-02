<template>
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

        <div class="action-buttons">
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
      <div v-if="extractedText">
        <h5>{{ $t('steggy.extracted_data') }}</h5>
        <textarea
            class="form-control"
            v-model="extractedText"
            readonly
        ></textarea>
      </div>
    </div>
  </div>

  <!-- Modal for Decryption Password -->
  <Teleport to="body">
    <div class="modal fade" id="decryptionModal" tabindex="-1" aria-labelledby="decryptionModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="decryptionModalLabel">Зашифрованные данные</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Извлекаемые данные защищены паролем. Укажите пароль для расшифровки.</p>
            <div class="mb-3">
              <label for="passwordInput" class="form-label">Пароль</label>
              <input type="password" class="form-control" id="passwordInput" v-model="password">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button type="button" class="btn btn-primary" @click="handleDecryption">Расшифровать</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useStoreSteggy } from "@/stores/steggy";
import { Modal } from 'bootstrap';

const steggyStore = useStoreSteggy();
const { t } = useI18n();

// Реактивные переменные
const imageInput = ref<HTMLInputElement | null>(null);
const selectedImage = ref<string | null>(null);
const extractedText = ref("");

// Для расшифровки
const isEncryptedData = ref(false);
const dataToDecrypt = ref("");
const password = ref("");
let decryptionModal: Modal | null = null;

onMounted(() => {
  const modalElement = document.getElementById('decryptionModal');
  if (modalElement) {
    decryptionModal = new Modal(modalElement);
  }
});

onMounted(() => {
  const modalElement = document.getElementById('decryptionModal');
  if (modalElement) {
    decryptionModal = new Modal(modalElement);
  }
});

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImage.value = e.target?.result as string;
      extractedText.value = "";
      isEncryptedData.value = false;
      dataToDecrypt.value = "";
      password.value = "";
    };
    reader.readAsDataURL(file);
  }
};

const extractData = () => {
  if (!selectedImage.value) return;

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

      let bitIndex = 0;
      let lengthBytes = [];
      for (let byteIdx = 0; byteIdx < 4; byteIdx++) {
        let currentByte = 0;
        for (let bitPos = 7; bitPos >= 0; bitPos--) {
          if (bitIndex < data.length) {
            const bit = data[bitIndex] & 1;
            currentByte |= (bit << bitPos);
            bitIndex++;
          }
        }
        lengthBytes.push(currentByte);
      }

      const messageLength = new DataView(new Uint8Array(lengthBytes).buffer).getUint32(0, false);

      if (messageLength * 8 > data.length - bitIndex) {
        alert(t('steggy.header_too_long'));
        return;
      }

      let extractedBytes = [];
      for (let byteIdx = 0; byteIdx < messageLength; byteIdx++) {
        let currentByte = 0;
        for (let bitPos = 7; bitPos >= 0; bitPos--) {
          if (bitIndex < data.length) {
            const bit = data[bitIndex] & 1;
            currentByte |= (bit << bitPos);
            bitIndex++;
          }
        }
        extractedBytes.push(currentByte);
      }

      if (extractedBytes.length > 0) {
        const decodedText = new TextDecoder().decode(new Uint8Array(extractedBytes));
        try {
          const jsonObj = JSON.parse(decodedText);
          if (jsonObj.provider === 'sth' && jsonObj.encryption_type === 'AES') {
            isEncryptedData.value = true;
            dataToDecrypt.value = jsonObj.encryption_data;
            decryptionModal?.show();
          } else {
            extractedText.value = decodedText;
          }
        } catch (e) {
          // Не JSON, просто показываем как есть
          extractedText.value = decodedText;
        }
      } else {
        alert(t('steggy.no_hidden_data'));
      }
    } catch (error) {
      console.error(t('steggy.extract_error'), error);
      alert(t('steggy.extract_error_msg'));
    }
  };
};

const handleDecryption = () => {
  if (!password.value) {
    alert("Пожалуйста, введите пароль.");
    return;
  }
  try {
    const decrypted = steggyStore.decryptData(dataToDecrypt.value, password.value);
    extractedText.value = decrypted;
    decryptionModal?.hide();
    password.value = "";
  } catch (error) {
    alert("Ошибка расшифровки. Возможно, неверный пароль.");
    password.value = "";
  }
};

const clearImage = () => {
  selectedImage.value = null;
  extractedText.value = "";
  isEncryptedData.value = false;
  dataToDecrypt.value = "";
  password.value = "";

  if (imageInput.value) {
    imageInput.value.value = "";
  }
};
</script>

<style scoped>
.upload-section {
  margin-bottom: 20px;
}

.image-preview {
  margin-top: 10px;
  min-height: 200px;
  width: 100%;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border: solid 2px #53749c;
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
</style>