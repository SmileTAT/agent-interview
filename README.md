# AI Agent 工程面试题库

面向 AI Agent 岗位求职者的工程化面试题库项目（VitePress 静态站 + Git 内容仓库）。

## 本地开发

```bash
npm install
npm run dev      # 本地预览 http://localhost:5173/agent-interview/
npm run build    # 构建静态站到 .vitepress/dist
```

## 部署（GitHub Pages）

已配置 `.github/workflows/deploy.yml`，push 到 `main` 分支自动构建部署。生效前提：

1. 仓库为 **public**（私有仓库的 Pages 需要 GitHub Pro/Team 付费版）；
2. 仓库 Settings → Pages → Source 选择 **GitHub Actions**。

部署后访问地址：`https://smiletat.github.io/agent-interview/`

## 如何贡献题目

见 [docs/question-template.md](docs/question-template.md)：在 `questions/<主题目录>/` 下按模板新建 Markdown 文件，提交 PR，审校通过后自动发布。

## 文档索引

| 文档 | 说明 |
|------|------|
| [docs/prd-ai-agent-question-bank-v2.0.md](docs/prd-ai-agent-question-bank-v2.0.md) | **当前版本 PRD（v2.0）**：重定位为 AI Agent 方向的 MVP 产品需求文档 |
| [docs/prd-review-v1.1.md](docs/prd-review-v1.1.md) | 初版 PRD（v1.1）审核报告：问题清单与重定位依据 |
| [docs/archive/prd-v1.1.md](docs/archive/prd-v1.1.md) | v1.1 原文归档（模型厂商题库版本，已废弃） |

## v2.0 核心差异点

1. **追问链**：每道核心题附 3~5 层面试官递进追问，还原真实面试深度
2. **系统设计题 + 评分维度（rubric）**：教用户"答到什么程度算好"
3. **真实面经溯源**：题目标注脱敏来源（公司 · 岗位 · 时间）
4. **内容保鲜机制**：题级 `last_reviewed_at` + 月度巡检，跟进 MCP/A2A/框架演进
