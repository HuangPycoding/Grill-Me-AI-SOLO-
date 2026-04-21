<div align="center">

# 🥩 Grill-Me AI
**企业级毒舌面试模拟器 · 简历水分刺客**

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-B73BA5?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/OpenAI-API_Compatible-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI Compatible" />
</p>

> 直面最残酷的拷问，撕碎简历里的每一滴水分。
> 训练你抗压与临场反应能力的终极求职辅助工具。

</div>

---

## 💡 什么是 Grill-Me AI？

在写满“精通”、“底层原理”、“高并发”的简历背后，你真的准备好面对一线大厂技术专家的追问了吗？

**Grill-Me AI** 是一个基于 React + 无服务器前端架构打造的 Web 应用。通过接入 OpenAI 兼容格式的大语言模型（如阿里云百炼 qwen-flash、DeepSeek 等），为你提供**零伪装、极高压**的实战面试模拟。它不仅能一眼看穿你简历里的包装，还能顺着你的软肋层层逼问，直到你暴露出真实水平。

<div align="center">
  <!-- 建议在这里贴入您的首页或能力雷达图截图 -->
  <img src="https://picsum.photos/seed/grill/800/400?blur=2" alt="Demo Screenshot Placeholder" width="800" />
  <p><i>（*发布至 Github 后，请替换上方链接为您自己录制的真实操作 GIF 或截图）</i></p>
</div>

---

## ✨ 核心亮点

- 🎯 **脱水级简历刺客**：导入简历，AI 自动生成对标大厂要求的六维雷达图（你以为的自己 vs 实际的期望），并附赠一针见血的“毒舌短评”。
- 🥊 **地狱难度回合制拷问**：针对你简历和上一轮回答中最弱的一环，AI 会化身黑脸 HR Director 进行连环追问，真实还原面试高压场景。
- 🚑 **高情商复盘与抢救**：每一次艰难回答后，系统都会给出得分（0-100分）、刻薄的逻辑指正，以及一份堪称完美的**高分回答示范**。
- 🔒 **绝对安全的纯本地架构**：API Key 与对话数据**仅保存在浏览器 LocalStorage**。无后端数据库，绝不收集、泄露您的隐私和个人配置。支持一键清理密钥。

---

## 🚀 极速启动

无需复杂的后端配置，克隆项目后即可在本地运行你的专属面试官。

### 前置要求
- Node.js (v18+ 推荐)
- 一个兼容 OpenAI 格式的大模型 API Key（推荐使用阿里云百炼 `qwen-max/flash` 或 `deepseek-chat`）

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

1. **Base URL**：
   - 阿里云百炼：`https://dashscope.aliyuncs.com/compatible-mode/v1`
   - DeepSeek：`https://api.deepseek.com/v1`
   - 硅基流动：`https://api.siliconflow.cn/v1`
2. **Model Name**：
   - 如果用阿里云：填 `qwen-flash`（又快又便宜） 或 `qwen-max`（逻辑无敌）
   - 如果用DeepSeek：填 `deepseek-chat`
3. **API Key**：填入你从各大云服务商控制台获取的密钥。

*(密钥一旦填入，后续刷新将自动读取本地缓存，并在 Header 提供一键清理功能)*

---

## 🛠️ 技术栈

* **框架**: React 18
* **构建工具**: Vite
* **样式**: Tailwind CSS
* **动画**: Motion (Framer Motion)
* **图表**: Recharts
* **图标库**: Lucide React

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
