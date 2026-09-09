<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { topics, loadResults } from '../data/topics';

const results = ref<Record<string, number>>({});
const completedCount = ref(0);

const pad = (n: number) => String(n).padStart(2, "0");

onMounted(() => {
  results.value = loadResults();
  completedCount.value = topics.filter(t => results.value[t.id] !== undefined).length;
});
</script>

<template>
  <section class="hero-glow border-b border-border">
    <div class="mx-auto max-w-5xl px-6 py-20">
      <p class="label-mono">Prototype · 953420 Ethics &amp; Professionalism</p>
      <h1 class="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-6xl">
        Learn software ethics by facing the consequence.
      </h1>
      <p class="mt-6 max-w-xl text-sm leading-relaxed text-muted">
        Ethical calls in software rarely have a clean right answer. EthicSim drops you into three-minute scenarios — privacy leaks, disclosure clocks, biased models, licence shortcuts — then explains the reasoning behind whatever you chose.
      </p>
      <div class="mt-10 flex flex-wrap items-center gap-4">
        <!-- แก้จุด ts(2532) ด้วย Optional Chaining -->
        <RouterLink :to="`/play/${topics[0]?.id ?? ''}`" class="btn-solid">Start module 01</RouterLink>
        <span class="label-mono">{{ completedCount }}/{{ topics.length }} modules completed</span>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-5xl px-6 py-16">
    <h2 class="label-mono">Ethic topics</h2>
    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      <RouterLink 
        v-for="t in topics" 
        :key="t.id" 
        :to="`/play/${t.id}`" 
        class="panel group block p-6 transition-colors hover:border-lime"
      >
        <div class="flex items-baseline justify-between">
          <span class="label-mono">Module {{ pad(t.index) }}</span>
          <span class="label-mono">{{ t.minutes }} min</span>
        </div>
        <h3 class="mt-4 text-xl font-bold group-hover:text-lime">{{ t.title }}</h3>
        <p class="mt-2 text-sm leading-relaxed text-muted">{{ t.tagline }}</p>
        <div class="mt-6 flex items-center justify-between border-t border-border pt-4">
          <span class="label-mono">{{ t.axis }}</span>
          <span class="font-mono text-sm text-lime">
            {{ results[t.id] === undefined ? "not played" : results[t.id] + "/100" }}
          </span>
        </div>
      </RouterLink>
    </div>
  </section>

  <section class="border-t border-border">
    <div class="mx-auto grid max-w-5xl gap-8 px-6 py-16 sm:grid-cols-3">
      <div>
        <span class="font-display text-3xl font-bold text-lime">01</span>
        <h3 class="mt-3 text-base font-bold">Short intro</h3>
        <p class="mt-2 text-sm leading-relaxed text-muted">A brief framing of the dilemma — no lecture, no legal wall of text.</p>
      </div>
      <div>
        <span class="font-display text-3xl font-bold text-lime">02</span>
        <h3 class="mt-3 text-base font-bold">Interactive scenario</h3>
        <p class="mt-2 text-sm leading-relaxed text-muted">Choices and scale-sliders instead of quizzes, with immediate reasoning.</p>
      </div>
      <div>
        <span class="font-display text-3xl font-bold text-lime">03</span>
        <h3 class="mt-3 text-base font-bold">Ethics radar</h3>
        <p class="mt-2 text-sm leading-relaxed text-muted">A profile of your decision style across all four ethics domains.</p>
      </div>
    </div>
  </section>
</template>