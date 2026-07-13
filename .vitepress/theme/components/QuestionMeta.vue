<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

const source = computed(() => {
  const s = frontmatter.value.source
  if (!s || s === 'original') return '原创题'
  return [s.company, s.role, s.round, s.date].filter(Boolean).join(' · ')
})
</script>

<template>
  <div class="qm">
    <span class="qm-item">主题：{{ frontmatter.topic }}</span>
    <span class="qm-item">题型：{{ frontmatter.question_type }}</span>
    <span class="qm-item">难度：{{ frontmatter.difficulty }}</span>
    <span class="qm-item">来源：{{ source }}</span>
    <span class="qm-item" v-if="frontmatter.last_reviewed_at">最近复核：{{ frontmatter.last_reviewed_at }}</span>
  </div>
</template>

<style scoped>
.qm {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  padding: 10px 14px;
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
