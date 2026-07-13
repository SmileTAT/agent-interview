import { defineConfig } from 'vitepress'

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
      '/questions/': [
        {
          text: 'Agent 基础与推理模式',
          items: [
            { text: 'ReAct 范式是什么？', link: '/questions/agent-basics/what-is-react' },
          ],
        },
        {
          text: '工具调用与 MCP',
          items: [
            { text: 'MCP 与 Function Calling 的关系', link: '/questions/tool-use-mcp/mcp-vs-function-calling' },
            { text: '排查：工具调用死循环', link: '/questions/tool-use-mcp/tool-call-loop-debug' },
          ],
        },
        {
          text: 'Agentic RAG',
          items: [
            { text: '传统 RAG vs Agentic RAG', link: '/questions/agentic-rag/rag-vs-agentic-rag' },
          ],
        },
        {
          text: '评测与可观测',
          items: [
            { text: '为什么要做轨迹级评测？', link: '/questions/evals/trajectory-evals' },
          ],
        },
        {
          text: '系统设计真题专区',
          items: [
            { text: '设计企业级智能客服 Agent', link: '/questions/system-design/customer-service-agent' },
          ],
        },
      ],
    },
    search: { provider: 'local' },
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一题', next: '下一题' },
    lastUpdated: { text: '最后更新' },
  },
})
