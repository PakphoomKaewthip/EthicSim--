<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'hero' | 'coach' | 'compact' | 'result' | 'empty'
  messages?: string[]
  showSpeech?: boolean
}>(), {
  variant: 'hero',
  messages: () => ["Hi, I'm EthicSim!", 'Ready to make a thoughtful choice?', 'I believe in your next move.'],
  showSpeech: true,
})

const line = ref(0)
const excited = ref(false)
const lookX = ref(0)
const lookY = ref(0)
let messageTimer: number | undefined
let reactionTimer: number | undefined

const currentMessage = computed(() => props.messages[line.value % props.messages.length] || '')
const mascotStyle = computed(() => ({
  '--look-x': `${lookX.value}px`,
  '--look-y': `${lookY.value}px`,
  '--tilt': `${lookX.value * 0.35}deg`,
}))

onMounted(() => {
  if (props.messages.length > 1) {
    messageTimer = window.setInterval(() => { line.value += 1 }, 4200)
  }
})

onUnmounted(() => {
  clearInterval(messageTimer)
  clearTimeout(reactionTimer)
})

function follow(event: PointerEvent) {
  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect()
  lookX.value = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12
  lookY.value = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8
}

function relax() {
  lookX.value = 0
  lookY.value = 0
}

function react() {
  excited.value = false
  window.requestAnimationFrame(() => {
    excited.value = true
    line.value += 1
    clearTimeout(reactionTimer)
    reactionTimer = window.setTimeout(() => { excited.value = false }, 900)
  })
}
</script>

<template>
  <button
    type="button"
    class="living-mascot"
    :class="[`mascot-${variant}`, { excited }]"
    :style="mascotStyle"
    aria-label="Say hello to EthicSim"
    @pointermove="follow"
    @pointerleave="relax"
    @click="react"
  >
    <span class="life-aura" aria-hidden="true"></span>
    <span v-if="showSpeech" class="speech-bubble living-speech"><b>ETHICSIM</b>{{ currentMessage }}</span>
    <span class="mascot-rig">
      <img class="base-frame" src="/images/ethicsim-mascot.png" alt="" draggable="false" />
      <img class="cheek-frame cheek-frame-left" src="/images/ethicsim-mascot.png" alt="" draggable="false" aria-hidden="true" />
      <img class="cheek-frame cheek-frame-right" src="/images/ethicsim-mascot.png" alt="" draggable="false" aria-hidden="true" />
      <img class="shine-frame" src="/images/ethicsim-mascot.png" alt="" draggable="false" aria-hidden="true" />
      <img class="blink-frame" src="/images/ethicsim-mascot-blink.png" alt="" draggable="false" aria-hidden="true" />
    </span>
    <span class="mascot-ground" aria-hidden="true"></span>
    <span class="life-spark spark-one" aria-hidden="true">✦</span>
    <span class="life-spark spark-two" aria-hidden="true">+</span>
    <span class="life-spark spark-three" aria-hidden="true">●</span>
    <span class="heart heart-one" aria-hidden="true">♥</span>
    <span class="heart heart-two" aria-hidden="true">♥</span>
    <span class="heart heart-three" aria-hidden="true">♥</span>
  </button>
</template>

<style scoped>
.living-mascot{position:relative;display:block;aspect-ratio:1;border:0;padding:0;background:transparent;color:inherit;cursor:pointer;isolation:isolate;outline:none;-webkit-tap-highlight-color:transparent}
.living-mascot:focus-visible{outline:3px solid #63d8ff;outline-offset:7px;border-radius:50%}
.mascot-rig{position:absolute;inset:0;z-index:3;display:block;transform:translate(var(--look-x),var(--look-y)) rotate(var(--tilt));transform-origin:52% 62%;transition:transform .22s ease-out;animation:breathe 2.8s ease-in-out infinite}
.mascot-rig img{display:block;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 28px 24px #0008);user-select:none}
.life-aura{position:absolute;z-index:1;inset:14%;border-radius:50%;background:#ff6b6b;box-shadow:20px 20px 0 #c9f65a;animation:aura-morph 7s ease-in-out infinite}
.mascot-ground{position:absolute;z-index:0;left:24%;right:20%;bottom:10%;height:7%;border-radius:50%;background:#0009;filter:blur(12px);animation:ground-pulse 3.3s ease-in-out infinite}
.mascot-rig .cheek-frame,.mascot-rig .shine-frame,.mascot-rig .blink-frame{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;margin:0!important;object-fit:contain;pointer-events:none}
.mascot-rig .cheek-frame{z-index:4;opacity:0;filter:brightness(1.35) saturate(1.55) drop-shadow(0 0 7px #ff5f69);animation:pixel-cheek 2.4s ease-in-out infinite}.cheek-frame-left{clip-path:circle(3.4% at 30.2% 34.1%)}.cheek-frame-right{clip-path:circle(3.6% at 61.5% 42.9%);animation-delay:-1.2s}
.mascot-rig .shine-frame{z-index:4;opacity:0;filter:brightness(2.25) saturate(1.18) drop-shadow(0 0 6px #bdfbff);mix-blend-mode:screen;animation:pixel-shine 4.2s -1.2s ease-in-out infinite}
.mascot-rig .blink-frame{z-index:5;opacity:0;filter:none;clip-path:polygon(25.2% 13.7%,52% 14.5%,69.8% 18.3%,72.2% 34%,69.4% 44.7%,60% 49%,41% 45.6%,27.8% 40.2%,24.8% 29%);animation:frame-blink 4.6s steps(1,end) infinite}
.living-speech{top:7%;left:-7%;z-index:8;width:190px;text-align:left;pointer-events:none;transition:transform .25s}.living-speech b{display:block;margin-bottom:4px;color:#11151f;font-family:var(--font-mono);font-size:.48rem;letter-spacing:.14em}
.life-spark{position:absolute;z-index:6;font-style:normal;font-family:var(--font-display);font-weight:900;pointer-events:none}.spark-one{right:4%;top:20%;font-size:2.1rem;color:#c9f65a;animation:spark-orbit 5s linear infinite}.spark-two{left:7%;bottom:28%;font-size:1.8rem;color:#63d8ff;animation:spark-orbit 7s linear infinite reverse}.spark-three{right:14%;bottom:22%;color:#ff6b6b;animation:spark-pop 1.8s ease-in-out infinite}
.heart{position:absolute;z-index:9;left:52%;top:48%;color:#ff6b6b;font-size:1.5rem;opacity:0;pointer-events:none}.excited .heart-one{animation:heart-one .9s ease-out}.excited .heart-two{animation:heart-two .9s .08s ease-out}.excited .heart-three{animation:heart-three .9s .14s ease-out}.excited .mascot-rig{animation:celebrate .9s cubic-bezier(.2,.9,.3,1)}.excited .living-speech{transform:scale(1.08) rotate(2deg)}
.mascot-coach{width:118px}.mascot-coach .life-aura,.mascot-coach .living-speech{display:none}.mascot-coach .life-spark{font-size:.8rem}.mascot-compact{width:min(360px,90%)}.mascot-result{width:245px}.mascot-empty{width:min(420px,100%)}
@keyframes breathe{0%,100%{scale:1 1}50%{scale:1.018 .985;translate:0 -4px}}@keyframes aura-morph{0%,100%{border-radius:48% 52% 55% 45%;rotate:-2deg}50%{border-radius:57% 43% 44% 56%;rotate:5deg;scale:1.035}}@keyframes ground-pulse{0%,100%{scale:1;opacity:.62}50%{scale:.78;opacity:.34}}@keyframes blink-live{0%,42%,46%,100%{opacity:0;scale:1 .2}43%,45%{opacity:1;scale:1 1}}@keyframes cheek-pulse{50%{opacity:.85;scale:1.22}}@keyframes shine-pass{0%,60%{left:-40%}82%,100%{left:130%}}@keyframes spark-orbit{to{rotate:360deg}}@keyframes spark-pop{50%{scale:1.6;opacity:.35}}@keyframes celebrate{0%,100%{transform:translate(var(--look-x),var(--look-y)) rotate(var(--tilt))}25%{transform:translate(0,-13%) rotate(-7deg) scale(1.04,.96)}50%{transform:translate(0,-22%) rotate(7deg) scale(.97,1.05)}75%{transform:translate(0,-7%) rotate(-3deg)}}@keyframes heart-one{0%{opacity:0;transform:translate(0,0) scale(.3)}30%{opacity:1}100%{opacity:0;transform:translate(-90px,-110px) rotate(-18deg) scale(1.3)}}@keyframes heart-two{0%{opacity:0;transform:translate(0,0) scale(.3)}30%{opacity:1}100%{opacity:0;transform:translate(20px,-140px) rotate(14deg) scale(.9)}}@keyframes heart-three{0%{opacity:0;transform:translate(0,0) scale(.3)}30%{opacity:1}100%{opacity:0;transform:translate(105px,-90px) rotate(24deg) scale(1.15)}}
@keyframes frame-blink{0%,42%,46%,100%{opacity:0}43%,45%{opacity:1}}@keyframes pixel-cheek{0%,100%{opacity:0}50%{opacity:.82}}@keyframes pixel-shine{0%,48%{opacity:0;clip-path:polygon(26.5% 16.5%,29% 17%,38% 39%,35% 39%)}56%{opacity:.82}72%{opacity:.72;clip-path:polygon(43% 18%,46% 18.5%,56% 43%,52.5% 42%)}86%,100%{opacity:0;clip-path:polygon(62% 20%,65% 20.5%,68% 39%,65.5% 41%)}}
@media(prefers-reduced-motion:reduce){.mascot-rig,.life-aura,.mascot-ground,.cheek-frame,.shine-frame,.blink-frame,.life-spark{animation:none}.mascot-rig{transform:none}.excited .mascot-rig{animation:none}}
</style>

<style>
.principle-mascot>.living-mascot{position:relative;z-index:2;width:min(360px,90%);filter:drop-shadow(0 25px 25px #7b1e2940)}
.game-coach>.living-mascot{width:118px;margin:0 0 -10px auto}
.score-stage>.living-mascot{position:absolute;z-index:3;width:245px;right:-3%;bottom:-5%;filter:drop-shadow(0 18px 20px #0006);transform:rotate(8deg);animation:result-mascot .8s .25s both}
.empty-profile>.living-mascot{width:min(420px,100%);filter:drop-shadow(0 25px 25px #0008)}
.principle-mascot .living-mascot .base-frame,.game-coach .living-mascot .base-frame,.score-stage .living-mascot .base-frame,.empty-profile .living-mascot .base-frame{position:static;width:100%;height:100%;margin:0;right:auto;bottom:auto;transform:none;animation:none}
@media(max-width:900px){.game-coach>.living-mascot{width:90px}.score-stage>.living-mascot{right:10%}}
@media(max-width:680px){.principle-mascot>.living-mascot{width:260px}.game-coach>.living-mascot{width:70px;margin:-7px 0 0}.score-stage>.living-mascot{width:170px;right:-2%}.empty-profile>.living-mascot{width:260px;margin:auto}}
</style>
