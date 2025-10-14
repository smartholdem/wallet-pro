<template>
  <div class="container-fluid">
    <card>
      <div class="card-header">
        <h4 class="mb-0 font-lighter">Smart Notes {{address}}</h4>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-7">
            <button type="button" @click="$router.push('/address/' + address)" class="btn btn-outline-warning btn-lg">
              <i class="fas fa-lg fa-fw me-2 fa-angle-double-left"></i>
            </button>&nbsp;
            <button type="button" class="btn btn-warning btn-lg">
              <i class="far fa-lg fa-fw me-2 fa-check-square"></i>Подключить адрес к SmartNote
            </button>
            <div v-if="address" class="btn-group mb-3 w-100">

            </div>

            <img class="w-100" src="/images/smartnote.png" alt="smartnotes sth">
          </div>
          <div class="col-lg-5">
            <card>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-12">
                    <h5>GM Smartnote - Анонимный актив на блокчейне SmartHoldem.</h5>
                    <p>
                      GM SmartNote - это умные крипто деньги для всего цифрового мира. GM - это быстро, приватно и безопасно. Вы можете спокойно тратить GM SmartNote, зная, что другие не могут видеть ваши балансы или отслеживать вашу деятельность.
                    </p>
                    <p>
                      GM Smartnote – не отслеживаемая цифровая валюта нового поколения на основе криптографии, обеспечивающая защиту личных данных и полную конфиденциальность.
                    </p>
                    <p>
                      Криптографическая функция с нулевым разглашением (Zero-Knowledge Proof) GM Smartnote позволяет выпустить и подтвердить GM транзакцию без раскрытия данных об адресе отправителя, получателе или сумме транзакции:
                    </p>
                    <p>Не отслеживаемость. Для каждой входящей транзакции все отправители равновероятны.</p>
                    <p>Несвязанность. Для двух любых исходящих транзакций невозможно доказать, что они отправлены одним и тем же лицом.</p>
                    <p>
                      Держатель GM SmartNote может представить другому пользователю информацию о GM-коде для активации, проверки или отправки. Изображение выпущенных Smartnote могут распространяться публично без ограничений.
                    </p>
                    <p>
                      Вы можете выпустить, распечатать и оправить GM-купюру по почте или вручить лично, также SmartNote можно хранить в сейфе, подарить на День Рождения или отправить изображение SmartNote по электронной почте, через мессенджер, аккаунт в социальной сети или любым другим способом.
                    </p>
                    <p>
                      GM Smartnote — это умная электронная наличность, предоставляющая анонимность и приватность своему владельцу.
                    </p>
                  </div>
                </div>
              </div>
            </card>

          </div>
        </div>
      </div>
    </card>



  </div>
</template>

<script>
import {useStoreWallet} from "@/stores/wallet";
import {useGMStore} from "@/stores/gm";

const storeWallet = useStoreWallet();
const gmStore = useGMStore();

export default {
  data() {
    return {
      address: this.$route.params.address || '',
    }
  },
  computed: {
    currentAddress() {
      const address = this.$route.params.address;
      if (!address) return {};
      return storeWallet.attributes[address] || {};
    },
  },
  async mounted() {
    const address = this.$route.params.address;
    if (!address) {
      console.error("No address provided in route.");
      return;
    }

    try {
      await gmStore.checkLinkAccount(address);
    } catch (error) {
      console.error("Ошибка при привязке аккаунта:", error);
      // TODO: Обработать эту ошибку в UI
    }
  }
}
</script>



<style scoped>

</style>