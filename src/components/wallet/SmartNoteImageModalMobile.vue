<template>
  <div class="modal fade" id="smartNoteImageModalMobile" tabindex="-1" ref="smartNoteImageModalMobile">
    <div class="modal-dialog modal-dialog-centered p-0">
      <div class="p-0 me-0">
        <div class="modal-header">
          <div class="modal-title"><span class="small text-warning">{{this.code}}</span></div>
        </div>
        <div class="modal-body text-center p-0">
          <canvas id="noteCanvasMobile"></canvas>
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

const isElectron = navigator.userAgent.toLowerCase().includes("electron");

export default {
  name: "SmartNoteImageModalMobile",
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
    this.$refs.smartNoteImageModalMobile.addEventListener('shown.bs.modal', this.initCanvas);
  },
  beforeUnmount() {
    if (this.$refs.smartNoteImageModalMobile) {
      this.$refs.smartNoteImageModalMobile.removeEventListener('shown.bs.modal', this.initCanvas);
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

      const logicalWidth = 947;
      const logicalHeight = 458;

      this.canvas = new fabric.StaticCanvas('noteCanvasMobile', {
        width: logicalWidth,
        height: logicalHeight,
      });

      const container = this.$refs.smartNoteImageModalMobile.querySelector('.modal-body');
      if (!container) return;
      const scale = container.clientWidth / logicalWidth;
      console.log('Calculated scale for mobile canvas:', scale, 'Container width:', container.clientWidth);

      this.canvas.setZoom(scale);
      this.canvas.setWidth(logicalWidth * scale);
      this.canvas.setHeight(logicalHeight * scale);

      const pathPrefix = isElectron ? '' : '/';
      this.canvas.setBackgroundImage(pathPrefix + 'images/smartnote.png', () => {
        this.canvas.renderAll(); // Render background first

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
              left: (logicalWidth - 292) / 2,
              top: (logicalHeight - 148),
            });
            this.canvas.add(img);

            // Code Text
            const codeText = new fabric.Text(this.code, {
              top: logicalHeight - 18,
              left: logicalWidth / 2,
              originX: 'center',
              fontSize: 14,
              fill: 'rgba(0,0,0,0.7)',
              fontFamily: 'Arial',
              shadow: new fabric.Shadow({
                color: 'rgba(255,255,255,0.3)',
                offsetX: 1,
                offsetY: 1,
                blur: 1
              })
            });
            this.canvas.add(codeText);

            //code array text
            if (this.code && this.code.startsWith('STH-')) {
              const codeArray = this.code.split('-');
              const key1 = codeArray[1];
              const key2 = codeArray[2];

              const key1Text = new fabric.Text(key1, {
                top: logicalHeight - 145,
                left: logicalWidth - 290,
                originX: 'center',
                fontSize: 18,
                fill: 'rgba(107,249,253,0.9)',
                fontFamily: 'Arial',
                shadow: new fabric.Shadow({
                  color: 'rgba(0,0,0,0.3)',
                  offsetX: 1,
                  offsetY: 1,
                  blur: 1
                })
              });
              this.canvas.add(key1Text);

              const key2Text = new fabric.Text(key2, {
                top: logicalHeight - 82,
                left: logicalWidth - 290,
                originX: 'center',
                fontSize: 18,
                fill: 'rgba(107,249,253,0.9)',
                fontFamily: 'Arial',
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
              const date = new Date(this.creationDate * 1000);
              const formattedDate = date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              });
              const dateText = new fabric.Text(formattedDate, {
                top: logicalHeight - 131,
                left: 121,
                originX: 'center',
                fontSize: 20,
                fill: 'rgba(76,45,81,0.8)',
                fontFamily: 'Arial',
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
              const amountStr = this.amount.toString();
              const amount1 = new fabric.Text(amountStr, {
                top: 54,
                left: amountStr.length > 4 ? 150 : 150 - 36,
                originX: 'center',
                fontSize: 42,
                fontWeight: 'bold',
                fill: 'rgba(182,110,38,0.7)',
                fontFamily: 'Arial Black',
                shadow: new fabric.Shadow({
                  color: 'rgba(255,255,255,0.3)',
                  offsetX: 1,
                  offsetY: 1,
                  blur: 1
                })
              });
              this.canvas.add(amount1);

              const amount2 = new fabric.Text(amountStr, {
                top: 54,
                left: logicalWidth - 137,
                originX: 'center',
                fontSize: 42,
                fontWeight: 'bold',
                fill: 'rgba(182,110,38,0.7)',
                fontFamily: 'Arial Black',
                shadow: new fabric.Shadow({
                  color: 'rgba(255,255,255,0.3)',
                  offsetX: 1,
                  offsetY: 1,
                  blur: 1
                })
              });
              this.canvas.add(amount2);
            }

            this.canvas.renderAll();
          });
        });
      }, { originX: 'left', originY: 'top' });
    },
    downloadImage() {
      const multiplier = 1 / this.canvas.getZoom();
      const dataURL = this.canvas.toDataURL({
        format: 'png',
        quality: 1.0,
        multiplier: multiplier
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
#noteCanvasMobile {
  max-width: 100%;
  height: auto;
}
</style>