import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'

const TOPIC_DIRS: [string, string][] = [
  ['agent-basics', 'Agent 基础与推理模式'],
  ['tool-use-mcp', '工具调用与 MCP'],
  ['context-engineering', '上下文工程'],
  ['memory', '记忆系统'],
  ['multi-agent', '多智能体系统'],
  ['agentic-rag', 'Agentic RAG'],
  ['evals', '评测与可观测'],
  ['safety', '安全与护栏'],
  ['frameworks', '框架与工程实战'],
  ['foundations', '交叉基础'],
  ['system-design', '系统设计真题专区'],
]

function questionSidebar() {
  const root = path.resolve(process.cwd(), 'questions')
  return TOPIC_DIRS.filter(([dir]) => fs.existsSync(path.join(root, dir))).map(
    ([dir, text]) => ({
      text,
      collapsed: true,
      items: fs
        .readdirSync(path.join(root, dir))
        .filter((f) => f.endsWith('.md'))
        .sort()
        .map((f) => {
          const src = fs.readFileSync(path.join(root, dir, f), 'utf-8')
          const m = src.match(/^title:\s*(.+)$/m)
          const title = m ? m[1].trim().replace(/^["']|["']$/g, '') : f
          return { text: title, link: `/questions/${dir}/${f.replace(/\.md$/, '')}` }
        }),
    }),
  )
}

export default defineConfig({
  lang: 'zh-CN',
  title: 'AI Agent 面试题库',
  description: '面向 AI Agent 岗位的工程化面试题库：追问链 · 系统设计 rubric · 面经溯源 · 月度保鲜',
  base: '/agent-interview/',
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [
      { text: '题库浏览', link: '/browse' },
      { text: '出题模板', link: '/docs/question-template' },
      { text: 'PRD', link: '/docs/prd-ai-agent-question-bank-v2.0' },
    ],
    sidebar: {
      '/questions/': questionSidebar(),
    },
    search: { provider: 'local' },
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一题', next: '下一题' },
    lastUpdated: { text: '最后更新' },
  },
})
