<template>
  <div class="row">
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
        style="width: 320px; height: 320px; border: dashed 1px #ccc; margin-left: auto; margin-right: auto;"
      ></div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// Реактивные переменные
const imageInput = ref<HTMLInputElement | null>(null);
const selectedImage = ref<string | null>(null);
const resultImage = ref<string | null>(null);
const embedText = ref("");
const resultFilename = ref("steggy_result.png");
const imageWidth = ref<number | null>(null);
const imageHeight = ref<number | null>(null);

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
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImage.value = e.target?.result as string;
      resultImage.value = null;
      embedText.value = "";

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

const embedData = () => {
  if (!selectedImage.value || !embedText.value) return;

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

      const textBytes = new TextEncoder().encode(embedText.value);
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

  if (imageInput.value) {
    imageInput.value.value = "";
  }
};

const downloadImage = () => {
  if (!resultImage.value) return;

  if (resultImage.value.startsWith("blob:")) {
    const link = document.createElement("a");
    link.href = resultImage.value;
    link.download = resultFilename.value;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    if (resultImage.value.length > 1000000) {
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
      const mimeType = resultFilename.value.endsWith(".png") ? "image/png" : "image/jpeg";
      const blob = new Blob(byteArrays, { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = resultFilename.value;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } else {
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