<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { loadResults } from '../data/topics'
import MascotCharacter from '../components/MascotCharacter.vue'

const score = ref<number>()
const heroMessages = ["Hi, I'm EthicSim!", 'Tap me! I have feelings too.', 'Big choices start with one calm breath.', 'Ready to protect some humans?']

onMounted(() => {
  score.value = loadResults()['bug-bounty']
})

</script>

<template>
  <main class="home-page">
    <section class="wow-hero">
      <div class="hero-noise" aria-hidden="true"></div>
      <div class="orbit orbit-one" aria-hidden="true">ETHICS</div>
      <div class="orbit orbit-two" aria-hidden="true">RESPONSE</div>

      <div class="hero-copy">
        <div class="eyebrow"><span></span> Interactive ethical simulator</div>
        <h1>Bug, bounty<br><em>&amp; liability.</em></h1>
        <p class="hero-lede">You are on incident duty. Every choice moves the clock, affects real users, and reveals the responder you become under pressure.</p>
        <div class="hero-actions">
          <RouterLink to="/play/bug-bounty" class="play-button"><span class="play-icon" aria-hidden="true">▶</span>{{ score === undefined ? 'Enter the incident' : 'Replay the incident' }}</RouterLink>
          <RouterLink v-if="score !== undefined" to="/results" class="score-link">Last response <strong>{{ score }}/100</strong></RouterLink>
        </div>
        <div class="hero-stats" aria-label="Campaign details">
          <span><strong>03</strong> live stages</span><span><strong>08</strong> minutes</span><span><strong>∞</strong> consequences</span>
        </div>
      </div>

      <div class="mascot-stage" aria-label="EthicSim mascot">
        <MascotCharacter class="hero-mascot" :messages="heroMessages" />
        <div class="signal-pill"><i></i> Co-pilot online</div>
      </div>

      <a class="scroll-cue" href="#mission" aria-label="Explore the mission"><span>Scroll to explore</span><b>↓</b></a>
    </section>

    <div class="news-ticker" aria-hidden="true"><div>IDENTIFY <b>✦</b> INVESTIGATE <b>✦</b> RESPOND <b>✦</b> REFLECT <b>✦</b> IDENTIFY <b>✦</b> INVESTIGATE <b>✦</b> RESPOND <b>✦</b> REFLECT <b>✦</b></div></div>

    <section id="mission" class="mission-section">
      <header class="section-heading">
        <div><p class="eyebrow dark"><span></span> Your first shift</p><h2>One incident.<br>Three tense stages.</h2></div>
        <p>Northstar Bank has shipped a transaction update. Something slipped through. Find it before trust, money, and time run out.</p>
      </header>
      <div class="mission-track">
        <article class="mission-step lime-step"><div class="step-top"><span>01 / INTAKE</span><b>⌁</b></div><h3>Catch the bugs</h3><p>Grab defects as they fly in and decide what deserves immediate attention.</p><div class="mini-game" aria-hidden="true"><i>BUG</i><i>?</i><i>FIX</i></div></article>
        <article class="mission-step coral-step"><div class="step-top"><span>02 / TRACE</span><b>⌕</b></div><h3>Follow the evidence</h3><p>Read the signals, challenge assumptions, and uncover the root cause.</p><div class="trace-lines" aria-hidden="true"><i></i><i></i><i></i><b></b></div></article>
        <article class="mission-step blue-step"><div class="step-top"><span>03 / RESPOND</span><b>↯</b></div><h3>Control the damage</h3><p>Act while losses climb. Fast is useful, but thoughtful is powerful.</p><div class="damage-meter" aria-hidden="true"><span></span><strong>$ · · ·</strong></div></article>
      </div>
    </section>

    <section class="principle-section">
      <div class="principle-mascot"><MascotCharacter variant="compact" :show-speech="false" /><span>Think before you tap!</span></div>
      <div class="principle-copy"><p class="eyebrow"><span></span> The core idea</p><h2>The bug starts the story.<br><em>Your response</em> determines the liability.</h2><RouterLink to="/play/bug-bounty" class="text-arrow">Take the first shift <span>→</span></RouterLink></div>
    </section>
  </main>
</template>
