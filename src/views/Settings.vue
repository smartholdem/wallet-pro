<template>
	<!-- BEGIN row -->
	<div class="row justify-content-center">

		<!-- BEGIN col-10 -->
		<div class="col-xl-10">
			<!-- BEGIN row -->
			<div class="row">
				<!-- BEGIN col-9 -->
				<div class="col-xl-8">
					<!-- BEGIN #general -->
					<div id="general" class="mb-5">
						<h4><i class="far fa-user fa-fw text-theme"></i> General</h4>
						<p>View and update your general account information and settings.</p>
						<card>
							<div class="list-group list-group-flush">
								<div class="list-group-item d-flex align-items-center">
									<div class="flex-1 text-break">
										<div>Dark mode</div>
										<!--<div class="text-inverse text-opacity-50">Dark mode</div>-->
									</div>
									<div class="w-100px">
                    <div class="form-check form-switch">
                      <input type="checkbox" :checked="darkmode" v-model="settings.darkMode" class="form-check-input" id="themeStyle" v-on:change="changeStyle">
                    </div>
									</div>
								</div>
								<div class="list-group-item d-flex align-items-center">
									<div class="flex-1 text-break">
										<div>Language</div>
									</div>
									<div>
                    <select class="form-select">
                      <option>English</option>
                    </select>
									</div>
								</div>
                <div class="list-group-item d-flex align-items-center">
                  <div class="flex-1 text-break">
                    <div>Currency</div>
                  </div>
                  <div>
                    <select class="form-select">
                      <option>USD</option>
                      <option>RUB</option>
                    </select>
                  </div>
                </div>
                <div class="list-group-item d-flex align-items-center">
                  <div class="flex-1 text-break">
                    <div>Time lock</div>
                    <div class="text-inverse text-opacity-50">0 - disable lock</div>
                  </div>
                  <div>
                    <input type="text" class="form-control" placeholder="time lock in sec" value="600">
                  </div>
                </div>

							</div>
						</card>
					</div>
					<!-- END #general -->



					<!-- BEGIN #resetSettings -->
					<div id="resetSettings" class="mb-5">
						<h4><i class="fa fa-redo fa-fw text-theme"></i> Reset settings</h4>
						<p>Reset all app setting to factory default setting.</p>
						<card>
							<div class="list-group list-group-flush">
								<div class="list-group-item d-flex align-items-center">
									<div class="flex-1 text-break">
										<div>Reset Settings</div>
										<div class="text-inverse text-opacity-50">
											This action will clear and reset all the current app setting.
										</div>
									</div>
									<div>
										<a href="#" class="btn btn-outline-default w-100px">Reset</a>
									</div>
								</div>
							</div>
							</card>
					</div>
					<!-- END #resetSettings -->
				</div>
				<!-- END col-9-->

			</div>
			<!-- END row -->
		</div>
		<!-- END col-10 -->
	</div>
	<!-- END row -->

	<!-- BEGIN #modalEdit -->
	<div class="modal fade" id="modalEdit">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Edit name</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
				</div>
				<div class="modal-body">
					<div class="mb-3">
						<label class="form-label">Name</label>
						<div class="row row-space-10">
							<div class="col-4">
								<input class="form-control" placeholder="First" value="Sean" />
							</div>
							<div class="col-4">
								<input class="form-control" placeholder="Middle" value="" />
							</div>
							<div class="col-4">
								<input class="form-control" placeholder="Last" value="Ngu" />
							</div>
						</div>
					</div>
					<div class="alert bg-inverse bg-opacity-10 border-0">
						<b>Please note:</b>
						If you change your name, you can't change it again for 60 days.
						Don't add any unusual capitalization, punctuation, characters or random words.
						<a href="#" class="alert-link">Learn more.</a>
					</div>
					<div class="mb-3">
						<label class="form-label">Other Names</label>
						<div>
							<a href="#" class="btn btn-outline-default"><i class="fa fa-plus fa-fw"></i> Add other names</a>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-outline-default" data-bs-dismiss="modal">Close</button>
					<button type="button" class="btn btn-outline-theme">Save changes</button>
				</div>
			</div>
		</div>
	</div>
	<!-- END #modalEdit -->
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useStoreSettings } from '@/stores/app-settings.ts';
const store = useStoreSettings()
const { settings } = storeToRefs(store)
const darkmode = computed(() => settings.value.darkMode)

const changeStyle = () => {
  store.updateSettings(settings.value)
  console.log(settings.value)
}

</script>
