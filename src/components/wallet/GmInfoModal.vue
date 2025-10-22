<template>
  <div class="modal fade" id="gmInfoModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <component :is="SmartNoteInfo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed } from "vue";
const { locale } = useI18n();


import NoteInfo_ru from "@/components/SmartNoteInfo/SmartNoteInfo_ru.vue";
import NoteInfo_es from "@/components/SmartNoteInfo/SmartNoteInfo_es.vue";
import NoteInfo_de from "@/components/SmartNoteInfo/SmartNoteInfo_de.vue";
import NoteInfo_fr from "@/components/SmartNoteInfo/SmartNoteInfo_fr.vue";
import NoteInfo_vi from "@/components/SmartNoteInfo/SmartNoteInfo_vi.vue";
import NoteInfo_id from "@/components/SmartNoteInfo/SmartNoteInfo_id.vue";
import NoteInfo_en from "@/components/SmartNoteInfo/SmartNoteInfo_en.vue";

const SmartNoteInfo = computed(() => {
  switch (locale.value) {
    case "ru":
      return NoteInfo_ru;
    case "es":
      return NoteInfo_es;
    case "de":
      return NoteInfo_de;
    case "fr":
      return NoteInfo_fr;
    case "vi":
      return NoteInfo_vi;
    case "id":
      return NoteInfo_id;
    default:
      return NoteInfo_en;
  }
});

</script>

<style scoped>
</style>
