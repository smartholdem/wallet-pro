<template>
  <div>
    <div v-if="account">
      <base-button
        v-show="showBtn"
        @click="saveImage"
        :title="$t('PRINT.save')"
        type="info"
        icon
        round
        simple
        size="sm"
        class="ml-2"
        ><i class="tim-icons icon-cloud-download-93"></i>
      </base-button>
      <base-button
        v-show="showBtn"
        @click="walletPrint"
        :title="$t('PRINT.print')"
        type="info"
        icon
        round
        simple
        size="sm"
        class="ml-2"
        ><i class="tim-icons icon-paper"></i>
      </base-button>

      <div style="display: none">
        <canvas id="canvas-note" ref="can" width="2480" height="3508"></canvas>
        <VueQrcode
          v-if="account.address"
          id="qrPublic"
          :options="{
            size: 340,
            backgroundAlpha: 0.0,
            foreground: '#000',
            level: 'H',
          }"
          :value="account.address"
          class="qr-note"
        />
        <VueQrcode
          v-if="account.secret"
          id="qrPrivate"
          :options="{
            size: 400,
            backgroundAlpha: 0.0,
            foreground: '#000',
            level: 'H',
          }"
          :value="account.secret"
          class="qr-note"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import VueQrcode from "@/util/QrCodeImg";
//const bip38 = require('bip38');
//const wif = require('wif');
import printJS from "print-js";
//import eventBus from '@/plugins/event-bus';
let canvas = null;

export default {
  name: "PaperWallet",
  components: {
    VueQrcode,
  },
  data() {
    return {
      showBtn: false,
      theme: 0,
      themes: [],
      account: null,
      generatedImg: null,
      coins: {
        title: "SmartHoldem",
        logo: "imag/icons/android-chrome-maskable-512x512.png",
        downloadWallet: "https://smartholdem.io/wallets",
        explorer: "https://blockexplorer.smartholdem.io",
      },
      jsonData: null,
    };
  },

  async created() {
    for (let i = 0; i < 38; i++) {
      this.themes.push(i);
    }
    const _self = this;
    //await this.getNewAccounts()
    /*
    setTimeout(async () => {
      await _self.generate();
      canvas.renderAll.bind(canvas);
      canvas.renderAll();
    }, 2000);
     */

    this.$eventBus.on("wallet:print", async (data) => {
      //console.log(data)
      this.showBtn = false;
      this.account = data;
      await this.generate();
      canvas.renderAll.bind(canvas);
      canvas.renderAll();
    });
  },
  mounted() {
    const _self = this;
    window.onload = async function () {
      await _self.generate();
    };
  },
  methods: {
    async walletPrint() {
      this.generatedImg = canvas.toDataURL({
        format: "png",
        left: 0,
        top: 0,
        width: canvas.width,
        height: canvas.height,
      });
      printJS(this.generatedImg, "image");
    },
    async themeSelect() {
      await canvas.setBackgroundImage(
        "/images/paperwallet.png",
        canvas.renderAll.bind(canvas),
        {
          top: 0,
          left: 0,
          originX: "left",
          originY: "top",
          scaleX: 1,
          scaleY: 1,
        }
      );
      //canvas.renderAll.bind(canvas);
      //canvas.renderAll();
    },
    async getNewAccounts() {
      this.account = (
        await this.generateAddress(this.$route.params["id"], 1)
      )[0];
      //let myWifString = this.account.wif;
      //let decoded = wif.decode(myWifString)
      //this.account.encrypted = bip38.encrypt(decoded.secret, decoded.compressed, 'TestingOneTwoThree')
      await this.generate();
    },
    loadCanvas(json) {
      // parse the data into the canvas
      canvas.loadFromJSON(json);
      // re-render the canvas
      canvas.renderAll();
      // optional
      canvas.calculateOffset();
    },
    async saveCanvasJson() {
      // convert canvas to a json string
      this.jsonData = JSON.stringify(canvas.toJSON());

      const blob = new Blob([this.jsonData], { type: "text/plain" });
      const e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = "test.json";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    },
    async saveImage() {
      await this.generateImage();
      /*
      await canvas.setZoom(1);
      canvas.setWidth(1387 * canvas.getZoom());
      canvas.setHeight(589 * canvas.getZoom());
      canvas.renderAll.bind(canvas);
      canvas.renderAll();
       */
      this.generatedImg = canvas.toDataURL({
        format: "png",
        left: 0,
        top: 0,
        width: canvas.width,
        height: canvas.height,
      });

      const link = document.createElement("a");
      link.download = "STH-" + this.account.address + ".png";
      link.href = this.generatedImg;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      //this.generatedImg.print();

      //await canvas.setZoom(0.86);
    },
    async generateImage() {
      this.generatedImg = canvas.toDataURL({
        format: "png",
        left: 0,
        top: 0,
        width: canvas.width,
        height: canvas.height,
      });
    },
    async generate() {
      const ref = this.$refs.can;
      canvas = new fabric.Canvas(ref);
      canvas.width = 2480;
      canvas.height = 3508; //3400;

      await canvas.setBackgroundImage(
        "/images/paperwallet.png",
        canvas.renderAll.bind(canvas),
        {
          top: 0,
          left: 0,
          originX: "left",
          originY: "top",
          scaleX: 1,
          scaleY: 1,
        }
      );

      // form
      fabric.Image.fromURL("/images/form.png", async function (oImg) {
        oImg.left = 0;
        oImg.top = 0;
        canvas.add(oImg);
        canvas.sendToBack(oImg);
      });

      const imgElementPrivate = document.getElementById("qrPrivate");
      if (imgElementPrivate) {
        fabric.Image.fromURL(imgElementPrivate.src, async function (oImg) {
          oImg.left = 480;
          oImg.top = 1880;
          await canvas.add(oImg);
        });
      }

      const imgElementPublic = document.getElementById("qrPublic");
      fabric.Image.fromURL(imgElementPublic.src, function (oImg) {
        oImg.left = 480;
        oImg.top = 160;
        canvas.add(oImg);
      });

      const address = new fabric.Textbox(this.account.address, {
        fontFamily: "Arial",
        width: 2000,
        left: 480,
        top: 580,
        fontSize: 56,
        fill: "#000",
        opacity: 1,
        textAlign: "left",
        lockRotation: true,
        fixedWidth: 2000,
        fontWeight: "bold",
      });
      if (address.width > address.fixedWidth) {
        address.fontSize *= address.fixedWidth / (address.width + 1);
        address.width = address.fixedWidth;
      }
      //address.setText(await this.sanitizeText(this.account.address));
      await canvas.add(address);

      const textPub = new fabric.Textbox(
        this.$i18n.t("PRINT.paper_public", { ticker: this.coins.title }),
        {
          fontFamily: "Courier",
          width: 1000,
          left: 930,
          top: 170,
          fontSize: 54,
          fill: "#000",
          opacity: 0.9,
          textAlign: "left",
          lockRotation: true,
          fixedWidth: 800,
        }
      );
      await canvas.add(textPub);

      fabric.Image.fromURL("/images/sth.png", function (img) {
        img.set({
          id: "coin_logo",
          top: 1060,
          left: 320,
        });
        canvas.add(img).renderAll();
      });

      let titleLine = "";
      for (let i = 0; i < 10; i++) {
        titleLine = titleLine + this.coins.title + " ";
      }

      const title = new fabric.Text(titleLine, {
        fontFamily: "Courier",
        width: 2400,
        left: 30,
        top: 880,
        fontSize: 72,
        fill: "#000",
        //opacity: 0.7,
        textAlign: "left",
        lockRotation: true,
        //fontWeight: 'bold',
      });
      await canvas.add(title);

      const textPriv = new fabric.Textbox(this.$i18n.t("PRINT.paper_private"), {
        fontFamily: "Courier",
        width: 1500,
        fixedWidth: 1500,
        left: 900,
        top: 1910,
        fontSize: 50,
        fill: "#000",
        opacity: 0.9,
        textAlign: "left",
        lockRotation: true,
      });
      await canvas.add(textPriv);

      const key = new fabric.Textbox(this.account.secret, {
        fontFamily: "Arial",
        width: 1400,
        fixedWidth: 1400,
        left: 900,
        top: 2080,
        fontSize: 54,
        fill: "#000",
        //opacity: 0.9,
        textAlign: "left",
        lockRotation: true,
        fontWeight: "bold",
      });
      if (key.width > key.fixedWidth) {
        key.fontSize *= key.fixedWidth / (key.width + 1);
        key.width = key.fixedWidth;
      }
      await canvas.add(key);

      if (this.account.secondSecret) {
        const key2 = new fabric.Textbox("Secret 2:" + this.account.secret, {
          fontFamily: "Arial",
          width: 1800,
          fixedWidth: 1800,
          left: 500,
          top: 2290,
          fontSize: 54,
          fill: "#000",
          //opacity: 0.9,
          textAlign: "left",
          lockRotation: true,
          fontWeight: "bold",
        });
        if (key2.width > key2.fixedWidth) {
          key2.fontSize *= key2.fixedWidth / (key2.width + 1);
          key2.width = key2.fixedWidth;
        }
        await canvas.add(key2);
      }

      const textInfo = new fabric.Textbox(
        this.$i18n.t("PRINT.info1") +
          " " +
          this.account.address +
          "\r\n" +
          this.$i18n.t("PRINT.info2", { explorer: this.coins.explorer }) +
          "\r\n" +
          this.$i18n.t("PRINT.info3", { wallet: this.coins.downloadWallet }) +
          "\r\n\r\n" +
          this.$i18n.t("PRINT.info4") +
          "\r\n\r\n" +
          this.$i18n.t("PRINT.info5"),
        {
          fontFamily: "Courier",
          width: 2100,
          left: 180,
          top: 2780,
          fontSize: 40,
          fill: "#000",
          //opacity: 0.9,
          textAlign: "left",
          lockRotation: true,
          fixedWidth: 2100,
        }
      );
      await canvas.add(textInfo);

      //await canvas.setZoom(0.5);

      canvas.renderAll.bind(canvas);
      canvas.renderAll();

      this.showBtn = true;
    },
  },
};
</script>

<style>
.qr-note {
  opacity: 0;
  width: 1px;
  height: 1px;
  display: none;
}

#canvas-note {
  margin: 0 auto;
  /*
  width: 100%;
  height: 100vh;
  */
  zoom: 0.1;
  /* display:none;*/
}

#canvas-note:hover {
  cursor: zoom-in;
}

.canvas-container {
  max-width: 1000px !important;
  max-height: 1360px !important;
}
</style>
