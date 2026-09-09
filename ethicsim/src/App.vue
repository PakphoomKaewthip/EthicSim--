<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between">
    <div>
      <Navbar />
      <main>
        <RouterView />
      </main>
    </div>
    <Footer />
  </div>
</template>