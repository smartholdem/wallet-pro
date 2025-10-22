<template>
  <div class="modal fade" id="smartNoteImageModal" tabindex="-1" ref="smartNoteImageModal">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content w-100">
        <div class="modal-header">
          <h5 class="modal-title">Smart Note</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body text-center">
          <canvas id="noteCanvas"></canvas>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="downloadImage">Download</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fabric } from 'fabric';
import QRious from 'qrious';

export default {
  name: "SmartNoteImageModal",
  props: {
    code: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      canvas: null
    }
  },
  mounted() {
    this.$refs.smartNoteImageModal.addEventListener('show.bs.modal', this.initCanvas);
  },
  beforeUnmount() {
    if (this.$refs.smartNoteImageModal) {
      this.$refs.smartNoteImageModal.removeEventListener('show.bs.modal', this.initCanvas);
    }
    if (this.canvas) {
      this.canvas.dispose();
    }
  },
  methods: {
    initCanvas() {
      if (this.canvas) {
        this.canvas.dispose();
      }
      this.canvas = new fabric.StaticCanvas('noteCanvas', {
        width: 947,
        height: 458,
      });

      this.canvas.setBackgroundImage('/images/smartnote.png', () => {
        this.canvas.renderAll(); // Render background first

        // Wait for custom fonts to be loaded
        document.fonts.ready.then(() => {
          // QR Code
          const qr = new QRious({
            value: this.code,
            size: 100
          });
          const qrCodeImage = qr.toDataURL();

          fabric.Image.fromURL(qrCodeImage, (img) => {
            img.set({
              left: (this.canvas.width - 292) / 2,
              top: (this.canvas.height - 148),
            });
            this.canvas.add(img);

            // Code Text
            const codeText = new fabric.Text(this.code, {
              top: this.canvas.height - 21,
              left: this.canvas.width / 2,
              originX: 'center',
              fontSize: 20,
              fill: 'rgba(0,0,0,0.7)',
              fontFamily: 'ChakraPetchregular',
              shadow: new fabric.Shadow({
                color: 'rgba(255,255,255,0.3)',
                offsetX: 1,
                offsetY: 1,
                blur: 1
              })
            });
            this.canvas.add(codeText);

            this.canvas.renderAll(); // Final render with all elements
          });
        });
      }, { originX: 'left', originY: 'top' });
    },
    downloadImage() {
      const dataURL = this.canvas.toDataURL({
        format: 'png',
        quality: 1.0
      });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `${this.code}.png`;
      link.click();
    }
  }
}
</script>

<style scoped>
#smartNoteImageModal .modal-content {
  width:980px !important;
}

</style>
