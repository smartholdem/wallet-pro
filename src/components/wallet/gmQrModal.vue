<template>
  <div class="modal fade" id="gmQrModal" tabindex="-1" ref="gmQrModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">QR Code</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body text-center">
          <qrcode-vue :value="code" :size="300" level="H" />
          <p class="mt-2 text-break small">{{ code }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue';

export default {
  name: "gmQrModal",
  components: {
    QrcodeVue
  },
  props: {
    code: {
      type: String,
      required: true
    }
  }
}
</script>