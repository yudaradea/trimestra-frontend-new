<template>
  <div class="flex flex-col items-center">
    <div id="reader" class="w-full max-w-sm"></div>
    <button
      @click="stopScanner"
      v-if="scanning"
      class="px-4 py-2 mt-4 text-white bg-red-500 rounded"
    >
      Stop Scan
    </button>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

const emit = defineEmits(['scanned']);

const scanner = ref(null);
const scanning = ref(false);

function onScanSuccess(decodedText) {
  console.log('Kode terbaca:', decodedText);
  emit('scanned', decodedText); // kirim ke parent
  stopScanner();
}

function startScanner() {
  scanning.value = true;
  scanner.value = new Html5Qrcode('reader');
  scanner.value.start(
    { facingMode: 'environment' },
    { fps: 10, qrbox: 250 },
    onScanSuccess
  );
}

function stopScanner() {
  if (scanner.value) {
    scanner.value.stop().then(() => {
      scanner.value.clear();
      scanning.value = false;
    });
  }
}

onMounted(() => {
  startScanner();
});

onBeforeUnmount(() => {
  stopScanner();
});
</script>
