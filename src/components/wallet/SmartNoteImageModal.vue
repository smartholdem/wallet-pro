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

      this.canvas.setBackgroundImage('/images/smartnote.png', this.canvas.renderAll.bind(this.canvas), {
        originX: 'left',
        originY: 'top'
      });

      const qr = new QRious({
        value: this.code,
        size: 100
      });
      const qrCodeImage = qr.toDataURL();

      fabric.Image.fromURL(qrCodeImage, (img) => {
        img.set({
          left: (this.canvas.width - 292) / 2,
          top: (this.canvas.height - 148), // slightly move up
        });
        this.canvas.add(img);
        this.canvas.renderAll();
      });

      const codeText = new fabric.Text(this.code, {
        top: this.canvas.height - 170,
        left: this.canvas.width / 2,
        originX: 'center',
        fontSize: 24,
        fill: '#000000',
        fontFamily: 'ChakraPetchregular',
      });

      this.canvas.add(codeText);
      this.canvas.renderAll();
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
