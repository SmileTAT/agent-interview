<script setup lang="ts">
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'
import { data as questions } from '../../../questions.data'

const ALL = '全部'
const topic = ref(ALL)
const type = ref(ALL)
const difficulty = ref(ALL)

const topics = computed(() => [ALL, ...new Set(questions.map((q) => q.topic))])
const types = computed(() => [ALL, ...new Set(questions.map((q) => q.type))])
const difficulties = [ALL, '初级', '中级', '高级']

const filtered = computed(() =>
  questions.filter(
    (q) =>
      (topic.value === ALL || q.topic === topic.value) &&
      (type.value === ALL || q.type === type.value) &&
      (difficulty.value === ALL || q.difficulty === difficulty.value),
  ),
)
</script>

<template>
  <div class="q-filters">
    <label>主题 <select v-model="topic"><option v-for="t in topics" :key="t">{{ t }}</option></select></label>
    <label>题型 <select v-model="type"><option v-for="t in types" :key="t">{{ t }}</option></select></label>
    <label>难度 <select v-model="difficulty"><option v-for="d in difficulties" :key="d">{{ d }}</option></select></label>
    <span class="q-count">共 {{ filtered.length }} 题</span>
  </div>

  <div v-for="q in filtered" :key="q.url" class="q-card">
    <a :href="withBase(q.url)" class="q-title">{{ q.title }}</a>
    <div class="q-meta">
      <span class="q-badge q-topic">{{ q.topic }}</span>
      <span class="q-badge">{{ q.type }}</span>
      <span class="q-badge" :class="'q-' + q.difficulty">{{ q.difficulty }}</span>
      <span v-for="tag in q.tags" :key="tag" class="q-tag">{{ tag }}</span>
      <span class="q-source">来源：{{ q.source }}</span>
    </div>
  </div>
  <p v-if="filtered.length === 0">没有符合筛选条件的题目。</p>
</template>

<style scoped>
.q-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin: 16px 0 24px;
}
.q-filters select {
  margin-left: 4px;
  padding: 4px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.q-count { color: var(--vp-c-text-2); font-size: 13px; }
.q-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 12px;
}
.q-title { font-weight: 600; font-size: 16px; }
.q-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
  align-items: center;
}
.q-badge {
  font-size: 12px;
  padding: 1px 8px;
  border-radius: 10px;
  background: var(--vp-c-default-soft);
}
.q-topic { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); }
.q-初级 { background: var(--vp-c-green-soft); color: var(--vp-c-green-1); }
.q-中级 { background: var(--vp-c-yellow-soft); color: var(--vp-c-yellow-1); }
.q-高级 { background: var(--vp-c-red-soft); color: var(--vp-c-red-1); }
.q-tag { font-size: 12px; color: var(--vp-c-text-2); }
.q-source { font-size: 12px; color: var(--vp-c-text-3); margin-left: auto; }
</style>
