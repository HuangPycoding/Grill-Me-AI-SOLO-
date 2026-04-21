
<div align="center">

# Grill-Me AI

**企业级毒舌面试模拟器 · 简历水分刺客**


<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-B73BA5?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/OpenAI-API_Compatible-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI Compatible" />
</p>

<div align="center">
  
  <img width="1352" height="627" alt="image" src="https://github.com/user-attachments/assets/99b3715f-255d-4703-8354-55bc07ec58db" />


</div>


---

## 📌 摘要

在这个“逢简历必写精通，逢项目必写高并发”的内卷时代，我用 **TRAE SOLO** 在几个小时内徒手撸出了一个专治“吹牛逼”的 AI 面试模拟器。

只要你敢把简历贴进去，它就能通过大模型瞬间扒掉你的包装，生成极其残酷的**六维雷达对比图**（你以为的水平 vs 大厂的真实要求），并开启毫无同情心的连环追问。最痛的是，它在你回答结巴之后，还会给你一份高分参考答案，简直杀人诛心又让人直呼学到了。

一个对我冲击最大的发现：在 SOLO 出现之前，一个人想摸鱼搞一个“集成了大模型 API、有着复杂动画流转、还带各种前端表单数据处理”的全栈项目，至少要熬半个月；而现在，只要把脑子里那个“毒舌面试官”的构想完整地描述出来，从想法到部署，仅仅是一个晚上的事。

---

## 🎯 真实场景与需求（为什么做这件事）

**目标人群**：想要冲刺一线互联网大厂的应届生、对自身技术深度没有明显感知的 IT 从业人员。

**具体痛点**：

1. **盲目自信**：很多人靠背八股文度量自己的技术深度，一到真正涉及底层逻辑或者场景串联的连环追问，立刻大脑空白。

2. **模拟成本高/不真实**：找朋友 Mock Interview（模拟面试）拉不下脸，互相吹捧；市面上的 AI 面试官又太像“客服”，声音温柔、问题按部就班，**完全无法还原大厂那种压迫感极强的面试场景**。

3. **缺少反馈**：即使在真实面试中挂了，HR 也不会告诉你为什么挂，你不知道自己刚才的回答在逻辑上到底输在哪里。

---

## 🧩 作品介绍：Grill-Me AI 是什么

**Grill-Me AI** 不是一个温和的陪聊助手，它是你技术栈的**压力测试台**。

**核心功能拆解**：

- 🔪 **水分刺客评估系统**：不再是一句“你好”，而是直接用红绿色醒目对比的“六维雷达图”砸在你脸上，伴随一行行刺眼的 AI 毒舌短评（Brutal Truth）。

- 🥊 **无尽深渊拷问**：针对你简历的软肋，或者上一轮回答逻辑里的漏洞，开启高压连环追问。

- 🚑 **高情商复盘**：当你回答不上来被迫投降时，它会刻薄地打分，同时丢给你一段逻辑严密、结构清晰的参考回答。

---

## 🛠️ 用 SOLO 实现的过程

整个项目从**全黑极简风格的设计**到**状态跳转逻辑**再到**复杂的 Prompt 组装**，全程通过 TRAE SOLO 结对完成。

**我和 SOLO 的关键共创过程：**

1. **确立冷酷的美学基调**：

我没有让它用传统的 UI 库。我对 SOLO 的原话是：*“我需要一个黑客马拉松风格的，全黑背景、带有绿色/红色警告色调的页面，没有任何多余的按钮，要给人一种压迫感。”* SOLO 立刻给了我基于 Tailwind 的暗黑主题骨架。
<img width="1360" height="673" alt="image" src="https://github.com/user-attachments/assets/be246a8f-7b6e-4213-b3c9-5fbe26bee2af" />


2. **拆解并死磕大模型 JSON 约束**：

如何让大模型一次性返回雷达图数据、毒舌评论和下一条问题？

我和 SOLO 一起在 `aiService.ts` 里打磨出了极其硬核的 Prompt，并通过正则屏蔽了各种模型爱加的 ```json 标签，确保前端组件能百分百将数据灌入图表节点。

3. **那些极致的像素级调整**：

我想在底部放几个赞助商（百炼、TRAE等）的跑马灯，但原带的 SVG 甚至存在镂空坐标算反的 bug。我让 SOLO 直接在底下帮我从数学层面重新计算了 SVG 坐标，重构了字母的几何逻辑，然后加入了无限滚动。这种细节调整，AI 现在做比我手写不知强多少倍。
<img width="1361" height="661" alt="image" src="https://github.com/user-attachments/assets/bb533e10-b84a-4662-8a91-26ffa8749614" />


**踩过的坑：**

- **全屏路由的混乱**：最开始把各种状态（输入、等待、评估、聊天）杂揉在一起。后来让 SOLO 拆分出了清晰的 `Stage` 机制，甚至后来为了体验，我们一句话就让 SOLO 给全站补上了无缝过渡的“返回上一页”按钮。

- **配置的保存**：最开始每次刷新都要重新填 Key。后来和 SOLO 更新了逻辑，利用 LocalStorage 将数据锁在用户本地，也顺带完美解决了开源项目上云的安全泄露顾虑。

---

## 🚀 极速启动

无需复杂的后端配置，克隆项目后即可在本地运行你的专属面试官。

### 前置要求
 Node.js (v18+ 推荐)
 一个兼容 OpenAI 格式的大模型 API Key（推荐使用阿里云百炼 `qwen-max/flash` 或 `deepseek-chat`）

### 安装与运行

```bash
# 1. 克隆仓库
git clone https://github.com/your-username/grill-me-ai.git
cd grill-me-ai

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

启动后，打开浏览器访问 `http://localhost:3000`（或终端提示的端口）。

---

## ⚙️ 模型配置指南

打开页面并在“准备好被拷问了吗？”一栏输入配置时：

 **Base URL**：
    阿里云百炼：`https://dashscope.aliyuncs.com/compatible-mode/v1`
    DeepSeek：`https://api.deepseek.com/v1`
    硅基流动：`https://api.siliconflow.cn/v1`


 **Model Name**：
    如果用阿里云：填 `qwen-flash`（又快又便宜） 或 `qwen-max`（逻辑无敌）
    如果用DeepSeek：填 `deepseek-chat`


 **API Key**：填入你从各大云服务商控制台获取的密钥。


*(密钥一旦填入，后续刷新将自动读取本地缓存，并在 Header 提供一键清理功能)*

---

## 🛠️ 技术栈

 **框架**: React 18
 **构建工具**: Vite
 **样式**: Tailwind CSS
 **动画**: Motion (Framer Motion)
 **图表**: Recharts
 **图标库**: Lucide React



---

## 💡 效果与反思

**从用户的反应说起：**

我丢给我舍友试玩，他们纷纷表示有种被扒光的感觉，这比在牛客网上干刷题带派太多了。

**对我自己而言**：

SOLO 真正让我体会到了什么是**“想法即产品”**。
之前想到一个点子，等到我配完 webpack、搭完 React 脚手架、调通跨域，可能已经是几天后了，热情早就消失殆尽了。

而现在，有了 SOLO，我只需要负责“尖锐的想法”，脏活累活和繁琐的 CSS 排版，丢给它就好。我不再是代码的搬运工，我是产品的主理人。

---

## 🌱 下一步规划

在这个赛道上，我希望把这个项目做成一个开源的“企业级面试题库生成器网络”。

 **音频接入体验**：下一步准备接通 TTS 通信。想象一下，面试官不只是发文字，而是发出真切的、带着不耐烦叹息的语音来质问你。

 **社区脱水库分享**：允许用户一键导出自己的“处刑记录报告”，可以生成分享图卡。

---

## 想和大家聊聊

最后抛出几个问题，欢迎大家在评论区探讨：

你当年面试时，遇到过让你瞬间**冷汗直冒**的一个连环追问是什么？可以发出来，我看看大模型能不能复现这种绝望。

 对于 AI 模拟面试，你是更倾向于“温柔鼓励型”还是我这种“极限施压型”？



欢迎在评论区交流，遇到好玩的问题我会直接丢进我的应用里去，随时加新功能！👇

---

## 🤝 参与贡献

欢迎提交 PR 或 Issue。我们欢迎任何能让这个面试官变得更“毒舌”、更“专业”的创意！

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

---

## 📄 开源协议

本项目采用 **MIT License** 协议开源。欢迎自由向社区传播，祝你在真实的面试中，能够面对所有问题都游刃有余！
