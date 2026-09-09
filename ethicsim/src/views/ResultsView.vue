<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { topics, loadResults, archetype } from '../data/topics';
import RadarChart from '../components/RadarChart.vue';

const results = ref<Record<string, number>>({});

onMounted(() => {
  results.value = loadResults();
});

const played = computed(() => topics.filter(t => results.value[t.id] !== undefined));
const profile = computed(() => archetype(results.value));
const radarData = computed(() => topics.map(t => ({ label: t.short, value: results.value[t.id] ?? 0 })));
</script>

<template>
  <div class="mx-auto max-w-4xl px-6 py-14">
    <p class="label-mono">Ethics radar · {{ played.length }}/{{ topics.length }} modules</p>
    <h1 class="mt-4 text-3xl font-bold sm:text-4xl">
      {{ played.length === 0 ? "No decisions recorded yet" : profile.name }}
    </h1>
    <p class="mt-4 max-w-xl text-sm leading-relaxed text-muted">
      {{ played.length === 0 ? "Play a module and your decisions will build a profile across the four ethics domains." : profile.blurb }}
    </p>

    <div class="panel mt-10 grid gap-8 p-8 md:grid-cols-[1.1fr_1fr]">
      <div class="flex items-center justify-center">
        <RadarChart :data="radarData" />
      </div>
      <div class="space-y-4">
        <div v-for="t in topics" :key="t.id" class="border-b border-border pb-3">
          <div class="flex items-baseline justify-between">
            <span class="text-sm font-medium">{{ t.axis }}</span>
            <span class="font-mono text-sm text-lime">
              {{ results[t.id] === undefined ? "—" : results[t.id] + "/100" }}
            </span>
          </div>
          <div class="mt-2 h-1 bg-[#212b42]">
            <div class="h-full bg-lime" :style="{ width: `${results[t.id] ?? 0}%` }"></div>
          </div>
          <RouterLink :to="`/play/${t.id}`" class="label-mono mt-2 inline-block hover:text-lime">
            {{ results[t.id] === undefined ? "Play module" : "Replay" }}
          </RouterLink>
        </div>
      </div>
    </div>

    <RouterLink to="/" class="btn-ghost mt-10">Back to modules</RouterLink>
  </div>
</template>