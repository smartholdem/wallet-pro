<template>
  <div>
  <ul class="breadcrumb">
    <li class="breadcrumb-item"><a href="/">WALLET</a></li>
    <li class="breadcrumb-item active">ADDRESSES</li>
  </ul>


    <card>
      <card-header class="card-header fw-bold small">Your Addresses <small> please select, import or get new</small></card-header>
      <ul class="nav nav-tabs pt-3 ps-4 pe-4">
        <li class="nav-item me-1"><a href="#addressList" class="nav-link active" data-bs-toggle="tab">Accounts</a></li>
        <li class="nav-item me-1"><a href="#addressNew" class="nav-link" data-bs-toggle="tab">New</a></li>
        <li class="nav-item me-1"><a href="#addressImport" class="nav-link" data-bs-toggle="tab">Import</a></li>
      </ul>
      <div class="tab-content p-4">
        <div class="tab-pane fade show active" id="addressList">
          <h6 class="card-subtitle mb-3 text-inverse text-opacity-75">Select address</h6>
        </div>
        <div class="tab-pane fade" id="addressNew">
          <h6 class="card-subtitle mb-3 text-inverse text-opacity-75">Get new address</h6>
        </div>
        <div class="tab-pane fade" id="addressImport">
          <h6 class="card-subtitle mb-3 text-inverse text-opacity-75">Import address</h6>
        </div>
      </div>
    </card>
  </div>
</template>

<script>
export default {
  name: "index"
};
</script>

<style scoped>

</style>
