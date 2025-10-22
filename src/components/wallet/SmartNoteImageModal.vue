<template>
  <div class="modal fade" id="smartNoteImageModal" tabindex="-1" ref="smartNoteImageModal">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content w-100">
        <div class="modal-header">
          <h5 class="modal-title">Smart Note <span class="small text-warning">{{this.code}}</span></h5>
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
import {formatNumber} from "chart.js/helpers";
const isElectron = navigator.userAgent.toLowerCase().includes("electron");

export default {
  name: "SmartNoteImageModal",
  props: {
    code: {
      type: String,
      required: true
    },
    creationDate: {
      type: [String, Number],
      default: null
    },
    amount: {
      type: [String, Number],
      default: null
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

      const pathPrefix = isElectron ? '' : '/';
      this.canvas.setBackgroundImage(pathPrefix + 'images/smartnote.png', () => {
        this.canvas.renderAll(); // Render background first

        // Wait for custom fonts to be loaded
        document.fonts.ready.then(() => {
          // QR Code
          const qr = new QRious({
            value: this.code,
            size: 100,
            background: '#292638',
            foreground: '#f3d66e',
            level: 'H'
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


            //code array text
            if (this.code[0] === 'S' && this.code[1] === 'T' && this.code[2] === 'H') {
              const codeArray = this.code.split('-');
              const key1 = codeArray[1];
              const key2 = codeArray[2];

              const key1Text = new fabric.Text(key1, {
                top: this.canvas.height - 133,
                left: 120,
                originX: 'center',
                fontSize: 24,
                //fontWeight: 'bold',
                fill: 'rgba(0,0,0,0.6)',
                fontFamily: 'ChakraPetchregular',
                shadow: new fabric.Shadow({
                  color: 'rgba(255,255,255,0.3)',
                  offsetX: 1,
                  offsetY: 1,
                  blur: 1
                })
              });
              this.canvas.add(key1Text);


              const key2Text = new fabric.Text(key2, {
                top: this.canvas.height - 85,
                left: this.canvas.width - 290,
                originX: 'center',
                fontSize: 20,
                //fontWeight: 'bold',
                fill: 'rgba(107,249,253,0.9)',
                fontFamily: 'ChakraPetchregular',
                shadow: new fabric.Shadow({
                  color: 'rgba(0,0,0,0.3)',
                  offsetX: 1,
                  offsetY: 1,
                  blur: 1
                })
              });
              this.canvas.add(key2Text);


            }


            // Creation Date Text
            if (this.creationDate) {
              const date = new Date(this.creationDate * 1000); // Assuming timestamp in seconds
              const formattedDate = date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              });
              const dateText = new fabric.Text(formattedDate, {
                top: 58,
                left: this.canvas.width - 90,
                originX: 'right',
                fontSize: 24,
                fill: 'rgba(0,0,0,0.6)',
                fontFamily: 'ChakraPetchregular',
                shadow: new fabric.Shadow({
                  color: 'rgba(255,255,255,0.3)',
                  offsetX: 1,
                  offsetY: 1,
                  blur: 1
                })
              });
              this.canvas.add(dateText);
            }

            // Amount Text
            if (this.amount) {
              console.log('Adding amount:', formatNumber(this.amount, 'ru-Ru'));
              const amount = new fabric.Text(formatNumber(this.amount, 'ru-Ru'), {
                top: 45,
                left: 150,
                originX: 'center',
                fontSize: 48,
                fontWeight: 'bold',
                fill: 'rgba(182,110,38,0.7)',
                fontFamily: 'ChakraPetchregular',
                shadow: new fabric.Shadow({
                  color: 'rgba(255,255,255,0.3)',
                  offsetX: 1,
                  offsetY: 1,
                  blur: 1
                })
              });
              this.canvas.add(amount);
            }

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
