<script setup lang="ts">
import { useDropZone, useFileDialog, useObjectUrl } from '@vueuse/core';

const dropZoneRef = ref<HTMLDivElement>();
interface FileData {
  file: File;
  url: string;
}

const fileData = ref<FileData[]>([]);
const { open, onChange } = useFileDialog({ accept: '.xlsx,.csv' });
const acceptType = ['text/c', 'applic'];
function onDrop(DroppedFiles: File[] | null) {
  DroppedFiles?.forEach(file => {
    if (!acceptType.includes(file.type.slice(0, 6))) {
      toast.error('Chỉ chấp nhận file xlsv,csv !');
      return;
    }
    fileData.value.push({
      file,
      url: useObjectUrl(file).value ?? '',
    });
  },
  );
}

onChange((selectedFiles: any) => {
  if (!selectedFiles)
    return;

  for (const file of selectedFiles) {
    fileData.value.push({
      file,
      url: useObjectUrl(file).value ?? '',
    });
  }
});

useDropZone(dropZoneRef, onDrop);
</script>

<template>
  <div class="flex">
    <div class="w-full h-auto relative">
      <div ref="dropZoneRef" class="cursor-pointer" @click="() => open()">
        <div v-if="fileData.length === 0"
          class="d-flex flex-column justify-center align-center gap-y-2 pa-12 drop-zone rounded">
          <IconBtn variant="tonal" class="rounded-sm">
            <VIcon icon="tabler-upload" />
          </IconBtn>
          <h4 class="text-h4">
            Upload file kết quả
          </h4>
          <VBtn variant="tonal" size="small">
            Không được để trống
          </VBtn>
        </div>

        <div v-else class="d-flex justify-center align-center gap-3 pa-8 drop-zone flex-wrap">
          <VRow class="match-height w-100">
            <template v-for="(item, index) in fileData" :key="index">
              <VCol cols="12" sm="4">
                <VCard :ripple="false" border>
                  <VCardText class="d-flex flex-column" @click.stop>
                    <div class="mt-2">
                      <span class="clamp-text text-wrap">
                        {{ item.file.name }}
                      </span>
                      <span>
                        {{ item.file.size / 1000 }} KB
                      </span>
                    </div>
                  </VCardText>
                  <VCardActions>
                    <VBtn variant="text" block @click.stop="fileData.splice(index, 1)">
                      Xóa file
                    </VBtn>
                  </VCardActions>
                </VCard>
              </VCol>
            </template>
          </VRow>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.drop-zone {
  border: 1px dashed rgba(var(--v-theme-on-surface), var(--v-border-opacity));
}
</style>
