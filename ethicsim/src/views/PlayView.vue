<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { topics, saveResult } from '../data/topics';
import type { ChoiceOption } from '../types/ethics';

const route = useRoute();
const router = useRouter();

const topicId = computed(() => route.params.id as string);
const topic = computed(() => topics.find(t => t.id === topicId.value));

const step = ref(-1);
const scores = ref<number[]>([]);
const sliderValue = ref(50);
const answered = ref<{
  i?: number;
  score: number;
  principle: string;
  feedback: string;
} | null>(null);

const pad = (n: number) => String(n).padStart(2, "0");

watch(topicId, () => {
  step.value = -1;
  scores.value = [];
  sliderValue.value = 50;
  answered.value = null;
}, { immediate: true });

const currentScenario = computed(() => {
  if (!topic.value || step.value < 0 || step.value >= topic.value.scenarios.length) return null;
  return topic.value.scenarios[step.value];
});

const finalScore = computed(() => {
  if (!scores.value.length) return 0;
  return Math.round(scores.value.reduce((a, b) => a + b, 0) / scores.value.length);
});

const nextTopic = computed(() => {
  if (!topic.value) return null;
  return topics[topic.value.index] || null;
});

const handleChoice = (opt: ChoiceOption, index: number) => {
  if (answered.value) return;
  answered.value = {
    i: index,
    score: opt.score,
    principle: opt.principle,
    feedback: opt.feedback
  };
  scores.value.push(opt.score);
};

const handleLockInSlider = () => {
  if (!currentScenario.value || currentScenario.value.kind !== 'slider') return;
  const sc = currentScenario.value;
  const score = Math.max(0, Math.round(100 - Math.abs(sliderValue.value - sc.ideal) * 1.6));
  answered.value = {
    score,
    principle: sc.principle,
    feedback: sc.feedback
  };
  scores.value.push(score);
};

const nextStep = () => {
  step.value += 1;
  answered.value = null;
  sliderValue.value = 50;
  if (topic.value && step.value >= topic.value.scenarios.length) {
    saveResult(topic.value.id, finalScore.value);
  }
};
</script>

<template>
  <div v-if="!topic" class="p-10 text-center">
    <p>Topic not found.</p>
    <RouterLink to="/" class="btn-ghost mt-4">Back to modules</RouterLink>
  </div>

  <div v-else>
    <!-- Intro State -->
    <div v-if="step === -1" class="mx-auto max-w-3xl px-6 py-16">
      <p class="label-mono">Module {{ pad(topic.index) }} · {{ topic.axis }}</p>
      <h1 class="mt-4 text-3xl font-bold sm:text-4xl">{{ topic.title }}</h1>
      <p v-for="(p, idx) in topic.intro" :key="idx" class="mt-5 text-sm leading-relaxed text-muted">
        {{ p }}
      </p>
      <button @click="step = 0" class="btn-solid mt-10">Begin scenario</button>
      <div class="mt-6">
        <RouterLink to="/" class="label-mono hover:text-lime">Back to modules</RouterLink>
      </div>
    </div>

    <!-- Completed State -->
    <div v-else-if="step >= topic.scenarios.length" class="mx-auto max-w-3xl px-6 py-16">
      <p class="label-mono">Module {{ pad(topic.index) }} complete</p>
      <h1 class="mt-4 text-3xl font-bold sm:text-4xl">
        {{ topic.axis }} score: <span class="text-lime">{{ finalScore }}/100</span>
      </h1>
      <p class="mt-5 text-sm leading-relaxed text-muted">
        Your answers are saved in this browser and feed the ethics radar profile.
      </p>
      <div class="mt-10 flex flex-wrap gap-4">
        <RouterLink v-if="nextTopic" :to="`/play/${nextTopic.id}`" class="btn-solid">
          Next module: {{ nextTopic.title }}
        </RouterLink>
        <RouterLink to="/results" class="btn-ghost">See ethics radar</RouterLink>
      </div>
      <div class="mt-6">
        <RouterLink to="/" class="label-mono hover:text-lime">Back to modules</RouterLink>
      </div>
    </div>

    <!-- Scenario Flow -->
    <div v-else-if="currentScenario" class="mx-auto max-w-3xl px-6 py-14">
      <div class="flex items-baseline justify-between">
        <p class="label-mono">{{ topic.title }}</p>
        <p class="label-mono">Scenario {{ step + 1 }}/{{ topic.scenarios.length }}</p>
      </div>
      <div class="mt-3 h-1 bg-[#212b42]">
        <div class="h-full bg-lime transition-all" :style="{ width: `${(step / topic.scenarios.length) * 100}%` }"></div>
      </div>

      <h1 class="mt-8 text-2xl font-bold sm:text-3xl">{{ currentScenario.prompt }}</h1>
      <p class="mt-4 text-sm leading-relaxed text-muted">{{ currentScenario.context }}</p>

      <!-- Choice Option -->
      <div v-if="currentScenario.kind === 'choice'" class="mt-8 space-y-3">
        <button
          v-for="(opt, i) in currentScenario.options"
          :key="i"
          @click="handleChoice(opt, i)"
          class="w-full border border-border bg-card p-4 text-left text-sm transition-colors hover:border-lime"
          :class="{ 'border-lime': answered && answered.i === i }"
        >
          {{ opt.label }}
        </button>
      </div>

      <!-- Slider Option -->
      <div v-else-if="currentScenario.kind === 'slider'" class="mt-8">
        <input
          v-model.number="sliderValue"
          type="range"
          min="0"
          max="100"
          class="w-full"
          :disabled="!!answered"
        />
        <div class="mt-2 flex justify-between">
          <span class="label-mono">{{ currentScenario.minLabel }}</span>
          <span class="label-mono">{{ currentScenario.maxLabel }}</span>
        </div>
        <button v-if="!answered" @click="handleLockInSlider" class="btn-solid mt-6">Lock in</button>
      </div>

      <!-- Feedback Panel -->
      <div v-if="answered" class="panel mt-8 p-6">
        <p class="label-mono">Principle · {{ answered.principle }}</p>
        <p class="mt-3 text-sm leading-relaxed">{{ answered.feedback }}</p>
        <p class="mt-4 font-mono text-sm text-lime">This decision scored {{ answered.score }}/100</p>
        <button @click="nextStep" class="btn-ghost mt-6">
          {{ step + 1 >= topic.scenarios.length ? "Finish module" : "Next scenario" }}
        </button>
      </div>

      <div class="mt-8">
        <RouterLink to="/" class="label-mono hover:text-lime">Exit module</RouterLink>
      </div>
    </div>
  </div>
</template>