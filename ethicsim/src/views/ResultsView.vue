<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { archetype, loadMetricResults, loadResults, type ResponseMetrics } from '../data/topics'
import MascotCharacter from '../components/MascotCharacter.vue'

const score = ref(0)
const metrics = ref<ResponseMetrics>({ triage: 0, investigation: 0, containment: 0, communication: 0, accountability: 0 })
const hasDetailedMetrics = ref(false)
const clamp = (value: number) => Math.max(20, Math.min(100, Math.round(value)))
onMounted(() => {
  score.value = loadResults()['bug-bounty'] || 0
  const saved = loadMetricResults()['bug-bounty']
  if (saved) {
    metrics.value = saved
    hasDetailedMetrics.value = true
    return
  }
  metrics.value = {
    triage: clamp(score.value + 10),
    investigation: clamp(score.value),
    containment: clamp(score.value - 5),
    communication: clamp(score.value),
    accountability: clamp(score.value + 5),
  }
})
const profile = computed(() => archetype({ 'bug-bounty': score.value }))
const insight = computed(() => score.value >= 80
  ? { mode: 'Steady under pressure', focus: 'Keep the standard' }
  : score.value >= 55
    ? { mode: 'Control before clarity', focus: 'Sequence the response' }
    : { mode: 'React after impact', focus: 'Contain harm earlier' })
const radarAxes: { key: keyof ResponseMetrics; label: string; angle: number }[] = [
  { key: 'triage', label: 'TRIAGE', angle: -90 },
  { key: 'investigation', label: 'INVESTIGATE', angle: -18 },
  { key: 'containment', label: 'CONTAIN', angle: 54 },
  { key: 'communication', label: 'COMMUNICATE', angle: 126 },
  { key: 'accountability', label: 'ACCOUNTABILITY', angle: 198 },
]
const polar = (angle: number, amount: number) => {
  const radians = angle * Math.PI / 180
  return { x: 160 + Math.cos(radians) * 102 * amount, y: 158 + Math.sin(radians) * 102 * amount }
}
const points = (values: { angle: number; amount: number }[]) => values.map(({ angle, amount }) => {
  const point = polar(angle, amount)
  return `${point.x},${point.y}`
}).join(' ')
const radarGrid = [0.2, 0.4, 0.6, 0.8, 1].map(amount => points(radarAxes.map(axis => ({ angle: axis.angle, amount }))))
const radarEnds = radarAxes.map(axis => polar(axis.angle, 1))
const radarLabels = radarAxes.map(axis => ({ ...axis, ...polar(axis.angle, 1.22) }))
const radarValuePoints = computed(() => points(radarAxes.map(axis => ({ angle: axis.angle, amount: metrics.value[axis.key] / 100 }))))
const radarDots = computed(() => radarAxes.map(axis => ({ ...axis, ...polar(axis.angle, metrics.value[axis.key] / 100), value: metrics.value[axis.key] })))
</script>

<template>
  <main class="profile-page profile-world">
    <section v-if="score" class="profile-hero">
      <div class="profile-copy">
        <p class="eyebrow"><span></span> Your response profile</p>
        <div class="profile-badge">Incident complete <i>✓</i></div>
        <h1>{{ profile.name }}</h1>
        <p>{{ profile.blurb }}</p>
        <div class="profile-readout"><span><small>RESPONSE MODE</small><strong>{{ insight.mode }}</strong></span><span><small>NEXT FOCUS</small><strong>{{ insight.focus }}</strong></span></div>
        <div class="profile-actions">
          <RouterLink to="/play/bug-bounty" class="play-button"><span class="play-icon">↻</span>Replay incident</RouterLink>
          <RouterLink to="/" class="profile-home">Back to campaign →</RouterLink>
        </div>
      </div>
      <div class="score-stage">
        <header><span>RESPONSE MATRIX</span><strong>{{ score }} <small>/ 100 TOTAL</small></strong></header>
        <div class="radar-plot"><svg viewBox="0 0 320 330" role="img" aria-label="Five-axis response skill chart"><g class="radar-grid"><polygon v-for="shape in radarGrid" :key="shape" :points="shape"/><line v-for="(end,index) in radarEnds" :key="index" x1="160" y1="158" :x2="end.x" :y2="end.y"/></g><polygon class="radar-area" :points="radarValuePoints"/><circle v-for="dot in radarDots" :key="dot.key" class="radar-dot" :cx="dot.x" :cy="dot.y" r="4"/><g v-for="label in radarLabels" :key="label.key" class="radar-axis-label"><text :x="label.x" :y="label.y" text-anchor="middle">{{ label.label }}</text><text class="radar-axis-value" :x="label.x" :y="label.y + 13" text-anchor="middle">{{ metrics[label.key] }}</text></g></svg></div>
        <MascotCharacter variant="result" :show-speech="false" />
        <div class="radar-note"><b>{{ hasDetailedMetrics ? 'MEASURED FROM 3 GAMES' : 'BASELINE ESTIMATE' }}</b><span>{{ hasDetailedMetrics ? 'Every axis reflects your decisions.' : 'Replay once to unlock detailed tracking.' }}</span></div>
      </div>
    </section>

    <section v-if="score" class="response-notes">
      <header><p class="eyebrow dark"><span></span> Debrief</p><h2>What your shift revealed</h2></header>
      <div class="lesson-grid">
        <article><span>01</span><div class="lesson-icon lime">⌁</div><h3>Triage</h3><p>Separate urgency from appearance and classify from evidence.</p></article>
        <article><span>02</span><div class="lesson-icon coral">⌕</div><h3>Root cause</h3><p>A cosmetic patch does not fix a broken transaction guarantee.</p></article>
        <article><span>03</span><div class="lesson-icon cyan">↯</div><h3>Liability</h3><p>Once harm is known, response time and action order become part of the responsibility.</p></article>
      </div>
    </section>

    <section v-else class="empty-profile">
      <MascotCharacter variant="empty" :show-speech="false" />
      <div><p class="eyebrow"><span></span> Response profile</p><h1>Your story starts with a choice.</h1><p>Complete the Northstar Banking incident and I will turn your decisions into a responsibility profile.</p><RouterLink to="/" class="play-button"><span class="play-icon">▶</span>Start campaign</RouterLink></div>
    </section>
  </main>
</template>
