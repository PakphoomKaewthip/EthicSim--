<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

interface RadarData {
  label: string;
  value: number;
}

const props = defineProps<{
  data: RadarData[];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

const drawRadar = () => {
  const c = canvasRef.value;
  if (!c) return;
  const ctx = c.getContext('2d');
  if (!ctx) return;

  const cx = c.width / 2;
  const cy = c.height / 2;
  const R = 110;
  const n = props.data.length;

  if (n === 0) return;

  // กำหนด Return Type เป็น [number, number] เพื่อป้องกัน TypeScript มองว่าอาจเป็น undefined
  const pt = (i: number, r: number): [number, number] => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };

  ctx.clearRect(0, 0, c.width, c.height);
  ctx.strokeStyle = "#2b3550";
  ctx.lineWidth = 1;

  // วาดเส้น Grid
  [0.25, 0.5, 0.75, 1].forEach(f => {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const [x, y] = pt(i, R * f);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  });

  // วาดเส้นแกน
  for (let i = 0; i < n; i++) {
    const [x, y] = pt(i, R);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  // วาดพื้นที่ข้อมูล
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const item = props.data[i];
    const val = item?.value ?? 0;
    const [x, y] = pt(i, (R * val) / 100);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = "rgba(198,242,78,0.28)";
  ctx.fill();
  ctx.strokeStyle = "#c6f24e";
  ctx.lineWidth = 2;
  ctx.stroke();

  // วาดข้อความ Label
  ctx.fillStyle = "#8b96b0";
  ctx.font = '11px "IBM Plex Mono", monospace';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < n; i++) {
    const item = props.data[i];
    const label = item?.label ?? '';
    const [x, y] = pt(i, R + 22);
    ctx.fillText(label, x, y);
  }
};

onMounted(drawRadar);
watch(() => props.data, drawRadar, { deep: true });
</script>

<template>
  <canvas ref="canvasRef" width="360" height="320"></canvas>
</template>