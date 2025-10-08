<template>
  <div class="flex justify-center min-h-screen overflow-y-auto bg-gray-50">
    <div
      class="flex flex-col items-center justify-center w-full max-w-md p-6 space-y-20 text-center bg-white"
    >
      <!-- Illustration -->
      <div>
        <img src="@/assets/register-success.png" alt="Success" class="w-80" />
      </div>

      <!-- Header -->
      <h1 class="text-2xl font-bold text-teal-600">
        Selamat!
        <br />
        Anda sudah berhasil mendaftar
      </h1>

      <!-- Message -->
      <p class="px-4 text-sm text-gray-600">
        Silakan Lengkapi Profile Anda untuk memulai perjalanan sehat
      </p>

      <!-- Button -->
      <router-link
        to="/profile-setup"
        class="w-full py-3 font-semibold text-white transition bg-teal-500 rounded-full hover:bg-teal-600"
      >
        Lanjutkan
      </router-link>
    </div>
  </div>
</template>

<script setup></script>
