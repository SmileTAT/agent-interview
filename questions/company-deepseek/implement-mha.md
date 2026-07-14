---
title: 手写 Multi-Head Attention，并扩展讨论 GQA/MLA 的实现差异
topic: DeepSeek 面经专题
question_type: 编码实现
difficulty: 中级
tags: [Multi-Head Attention, 手写代码, GQA, 编程面]
frameworks: []
source:
  company: DeepSeek
  role: 大模型算法岗
  round: 公开面经整理（编程面，"代码即正义"风格）
  date: 2025-2026
last_reviewed_at: "2026-07-14"
status: reviewed
---

# 手写 Multi-Head Attention，并扩展讨论 GQA/MLA 的实现差异

<QuestionMeta />

## 题目

面经多次报告的编程面题型：现场手写一个 Multi-Head Attention（含因果掩码），随后按实现细节持续追问，并扩展到 GQA 的改法。

::: details 参考答案

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model: int, n_heads: int, dropout: float = 0.0):
        super().__init__()
        assert d_model % n_heads == 0
        self.n_heads = n_heads
        self.d_head = d_model // n_heads
        self.q_proj = nn.Linear(d_model, d_model)
        self.k_proj = nn.Linear(d_model, d_model)
        self.v_proj = nn.Linear(d_model, d_model)
        self.o_proj = nn.Linear(d_model, d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, attn_mask=None):
        B, T, C = x.shape
        # (B, T, C) -> (B, n_heads, T, d_head)
        q = self.q_proj(x).view(B, T, self.n_heads, self.d_head).transpose(1, 2)
        k = self.k_proj(x).view(B, T, self.n_heads, self.d_head).transpose(1, 2)
        v = self.v_proj(x).view(B, T, self.n_heads, self.d_head).transpose(1, 2)

        # 缩放点积注意力
        scores = q @ k.transpose(-2, -1) / (self.d_head ** 0.5)   # (B, h, T, T)

        # 因果掩码：不允许看未来
        causal = torch.triu(torch.ones(T, T, dtype=torch.bool, device=x.device), diagonal=1)
        scores = scores.masked_fill(causal, float("-inf"))
        if attn_mask is not None:                                  # padding 掩码
            scores = scores.masked_fill(attn_mask == 0, float("-inf"))

        attn = F.softmax(scores, dim=-1)
        attn = self.dropout(attn)
        out = attn @ v                                             # (B, h, T, d_head)
        out = out.transpose(1, 2).contiguous().view(B, T, C)       # 合并头
        return self.o_proj(out)
```

**写的时候边写边说的要点**（编程面拿分的是讲解，不只是代码）：

- 缩放因子 `1/√d_head` 防止点积随维度增大使 softmax 饱和、梯度消失；
- 因果掩码在 softmax **之前**填 `-inf`（softmax 后置零是错的——分布未归一化）；
- `view→transpose` 的形状变换与 `contiguous` 的必要性；
- 生产实现会用融合核（FlashAttention 类）：分块计算避免显式生成 T×T 矩阵，省显存带宽。

**扩展到 GQA 的改法**：K/V 的投影输出维度改为 `n_kv_heads * d_head`（n_kv_heads < n_heads），计算时用 `repeat_interleave` 把 KV 头广播到各查询组共享——KV Cache 直接缩小 `n_heads / n_kv_heads` 倍。MQA 是 n_kv_heads=1 的极端情形。

**MLA 的实现差异（概念层）**：K/V 不再各自投影，而是先压到低维潜向量（缓存对象），再上投影还原；推理时上投影被吸收进 Q/输出投影，另有解耦的 RoPE 键通道（详见 MLA 专题题）。

:::

## 追问链

::: details 追问 1（面经真实追问方向）：推理时的 KV Cache 在这段代码里怎么加？

增量解码时每步只进 1 个新 token：新 token 的 K/V 计算后 **append 到缓存**，q 只有当前位置一行，`scores` 形状变为 (B, h, 1, T_cached)。改造点：forward 增加 `past_kv` 入参与返回、位置编码按绝对位置偏移、因果掩码退化（当前位置本来就只能看见缓存内的历史）。能顺手说出"解码阶段瓶颈从计算变成搬运缓存的访存"更佳——这正是 MQA/GQA/MLA 存在的原因。

:::

::: details 追问 2：softmax 数值稳定性有什么坑？`-inf` 掩码会出 NaN 吗？

标准 softmax 实现内部会减去行最大值防上溢，PyTorch 已处理。真正的坑：**整行全被掩掉**（如 padding 行）时 softmax 输入全 `-inf`，输出 NaN——工程上要保证因果掩码下对角线自身可见，padding 行的输出后续被忽略或掩码值用极大负数而非 `-inf`。另外半精度训练下 scores 的动态范围更紧，融合核内部用 fp32 累加。这类"边界会不会 NaN"的问题是"代码即正义"风格面试的典型追问点。

:::

::: details 追问 3：为什么要多头？把 8 个头合成 1 个大头（同样总维度）损失了什么？

多头等价于把注意力约束成**块对角的低秩结构**：每个头在自己 d_head 维的子空间里独立计算相似度，可以同时关注不同的关系模式（句法/位置/语义）。单个大头只有一种相似度度量，表达的是"一个注意力分布"，多样性消失；实证上同参数量的单头显著劣于多头。反向追问也可能出现：头是不是越多越好？——d_head 太小（如 <32）时单头容量不足，质量反降，头数与头维是权衡。

:::
