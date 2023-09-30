<template>
  <div class="row justify-content-center">
    <div class="col-xl-6">
      <card>
        <card-header class="card-header fw-bold small">{{ $route.params.address }}</card-header>
        <card-body>
          <h5 class="card-title">STH 1 000</h5>
          <h6 class="card-subtitle mb-3 text-inverse text-opacity-50">USDT 10 000</h6>
          <p class="card-text mb-3">...</p>
          <div>
            <a href="#" class="card-link">Card link</a>
            <a href="#" class="card-link">Another link</a>
          </div>
        </card-body>
      </card>
    </div>

    <div class="col-xl-6">
      <card>
        <card-header class="card-header fw-bold small">{{ $route.params.address }}</card-header>
        <card-body>
          <h5 class="card-title">SEND</h5>
          <h6 class="card-subtitle mb-3 text-inverse text-opacity-50">Card subtitle</h6>
          <p class="card-text mb-3">...</p>

        </card-body>
      </card>
    </div>

    <div class="col-xl-12 mt-3">
      <card>
        <card-header class="card-header fw-bold small">{{ $route.params.address }}</card-header>
        <card-body>
          <h5 class="card-title">Card title</h5>
          <h6 class="card-subtitle mb-3 text-inverse text-opacity-50">Card subtitle</h6>
          <p class="card-text mb-3">...</p>
          <div>
            <a href="#" class="card-link">Card link</a>
            <a href="#" class="card-link">Another link</a>
          </div>
        </card-body>
      </card>
    </div>

  </div>
</template>

<script>
export default {
  name: "AddressPage"

};
</script>

<style scoped>

</style>
