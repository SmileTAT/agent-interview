---
title: 多 Agent 的编排模式：supervisor、层级、swarm 怎么选？
topic: 多智能体系统
question_type: 概念题
difficulty: 中级
tags: [编排模式, Supervisor, Swarm, 多智能体]
frameworks: [LangGraph]
source: original
last_reviewed_at: "2026-07-13"
status: reviewed
---

# 多 Agent 的编排模式：supervisor、层级、swarm 怎么选？

<QuestionMeta />

## 题目

对比主流的多 Agent 编排模式（supervisor、层级化、swarm/handoff），说明各自的控制流特征与适用场景。

::: details 参考答案

**1. Supervisor（中心编排）**
一个协调者 Agent 负责全部决策：拆解任务 → 分派给专职 worker → 汇总结果 → 决定下一步。worker 之间不直接通信。

- ✅ 控制流集中，可观测、可调试、易加全局护栏（预算、权限）；
- ❌ supervisor 是瓶颈与单点——所有信息都要经它中转（token 集中消耗），它的决策质量决定全局上限；
- 适用：绝大多数生产场景的默认选择，任务有清晰的分解-汇总结构时尤其合适。

**2. 层级化（supervisor 的递归扩展）**
顶层协调者管领域协调者，领域协调者管 worker。本质是 supervisor 的分形，用于任务规模大到单个协调者管不过来（上下文/工具数量爆炸）时。层级越深，信息逐层转述的损耗越大，两层通常是实用上限。

**3. Swarm / Handoff（去中心接力）**
没有固定中心，Agent 之间通过 handoff 直接把控制权（连同对话）移交给更合适的同伴——客服 Agent 发现是技术问题，直接把会话交给技术 Agent。

- ✅ 移交自然、无中转损耗（对话上下文整体交接），适合"会话在不同专家间流转"的形态；
- ❌ 控制流去中心化后难以全局观测，可能出现移交循环（A→B→A），需要移交次数上限与环路检测；
- 适用：客服路由、多领域会话这类"同一时刻只有一个 Agent 活跃"的接力场景。

**选型要点**：先问控制流该集中还是流转——**并行分工用 supervisor，串行接力用 handoff**，规模撑爆了再层级化。三者可混合（顶层 supervisor，客服子域内部 handoff）。

**答题关键**：以"控制流在哪里"为主线对比 + supervisor 默认 + swarm 的环路风险。

:::

## 追问链

::: details 追问 1：supervisor 模式里，worker 的结果都要过 supervisor 中转，上下文成本很高，怎么优化？

几个手段：worker 返回**结构化摘要**而不是全过程（约定输出 schema：结论/证据/置信度）；大产物走**旁路**——worker 把完整结果写入共享存储（文件/DB），只给 supervisor 一个引用，最终消费方直接取；supervisor 的历史滚动压缩（它是最容易上下文爆炸的角色）。原则：supervisor 只需要"足以决策的信息"，不需要"全部信息"。

:::

::: details 追问 2：handoff 模式怎么防止"踢皮球"（Agent 互相移交没人处理）？

工程护栏：移交次数上限（超过 N 次强制升级人工或兜底 Agent）；移交环路检测（A→B→A 模式直接拦截）；移交必须附带**结构化理由与已尝试内容**，接收方能看到"前任做过什么"，避免重复劳动和再次踢回；设一个"无人认领"的默认兜底 Agent。踢皮球的根因通常是各 Agent 的职责描述有缝隙或重叠——修描述比加护栏更治本。

:::

::: details 追问 3：编排模式和框架的对应关系？LangGraph 在这里的定位是什么？

LangGraph 把编排显式建模为**状态图**：节点是 Agent/步骤，边是控制流转移，supervisor、层级、handoff 都能表达（handoff 有专门的原语/库支持），加上 checkpoint 持久化和 human-in-the-loop 中断点，适合需要精确控制流的生产系统。轻量框架（如各家 Agents SDK）通常内置 handoff 和 agent-as-tool 两种原语，够用且简单。选型上：控制流复杂、要持久化恢复 → 状态图类框架；简单接力/分工 → SDK 原语即可。

:::
