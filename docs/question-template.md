# 出题模板与内容 SOP

本文定义题目文件的格式规范与审校流程。新增题目 = 在 `questions/<主题目录>/` 下新建一个 Markdown 文件并提交 PR。

## 一、文件位置

| 主题 | 目录 |
|------|------|
| Agent 基础与推理模式 | `questions/agent-basics/` |
| 工具调用与 MCP | `questions/tool-use-mcp/` |
| 上下文工程 | `questions/context-engineering/` |
| 记忆系统 | `questions/memory/` |
| 多智能体系统 | `questions/multi-agent/` |
| Agentic RAG | `questions/agentic-rag/` |
| 评测与可观测 | `questions/evals/` |
| 安全与护栏 | `questions/safety/` |
| 框架与工程实战 | `questions/frameworks/` |
| 交叉基础 | `questions/foundations/` |
| 系统设计真题专区 | `questions/system-design/` |

文件名用英文 slug（如 `mcp-vs-function-calling.md`）。

## 二、frontmatter 规范

```yaml
---
title: 题目标题（完整问句）
topic: 工具调用与 MCP          # 上表主题之一，必填
question_type: 概念题           # 概念题 / 系统设计 / 场景排错题 / 编码实现 / 开放讨论
difficulty: 中级                # 初级 / 中级 / 高级
tags: [MCP, 工具调用]           # 技术标签，用于筛选与搜索
frameworks: [LangGraph]         # 相关框架/协议，可为空数组
source: original                # 原创题写 original；真实面经用下面的对象格式
# source:
#   company: 某大厂             # 必须真实且脱敏，不允许编造
#   role: Agent 平台研发
#   round: 二面
#   date: 2026-04
last_reviewed_at: "2026-07-13"  # 最近事实复核日期，字符串格式
status: reviewed                # draft / reviewed / stale
---
```

**来源红线**：`source` 不允许编造。没有真实面经来源的题一律标 `original`。虚构"某厂真题"会摧毁题库的可信度。

**第三种来源形态——公开面经整理**：题目整理自公开渠道（牛客/知乎/媒体报道）的面经时，`round` 写 `公开面经整理（补充轮次信息）`，`date` 写面经报告的时间范围，且正文或所在专题的导读页必须附**来源链接列表**；只收录多个来源交叉印证的题目，单一来源无法核实的不收。参考答案由编辑撰写（注明依据，如官方技术报告），不得冒充面经原文。

## 三、正文结构

```markdown
# 与 title 相同的标题

<QuestionMeta />

## 题目
（完整题干，系统设计题应包含约束条件）

::: details 参考答案
（核心答案 + 展开解析，结尾给一句"答题关键"）
:::

## 评分维度（rubric）        ← 仅系统设计题必须
| 维度 | 不合格 | 合格 | 优秀 |

## 追问链                    ← 核心题必须，3~5 层
::: details 追问 1：（面试官会接着问的问题）
（应答思路）
:::
```

追问链的要求：**每一层必须是上一层答案自然引出的问题**，模拟真实面试的递进，而不是同主题的并列题。

## 四、审校 SOP

1. 作者提交 PR，`status: draft`；
2. 审校人核查：**事实正确性**（术语归属、论文/协议引用、版本时效）、来源真实性、追问链递进性；
3. 通过后改 `status: reviewed` 合并，站点自动构建发布；
4. **月度保鲜巡检**：每月初检查 `last_reviewed_at` 超过 90 天的协议/框架类题目，复核后更新日期；内容已过时且暂无人修订的改 `status: stale`（站点上应显式提示）。
