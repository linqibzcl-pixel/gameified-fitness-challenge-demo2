# Gameified Fitness Challenge Demo

这是一个在原有训练计数原型基础上，加入得分、完成度、星级和勋章反馈的游戏化动作挑战 demo，用于验证轻量游戏化激励机制在动作训练场景中的表达效果。

## Project Overview

This project extends a workout counter prototype into a gamified challenge demo.  
It adds score, completion rate, star rating, badge-style feedback, and a success modal to make the interaction feel more like a lightweight challenge experience.

## Demo Highlights

- 支持多动作挑战
- 完成后生成得分与完成度
- 提供星级评价与勋章文案
- 达成目标后触发成功弹窗
- 基于 Cursor 小步迭代完成游戏化升级

## Demo Flow

- Select an exercise
- Start a session
- Complete and save
- Get challenge results
- Review feedback/history

## Tech Stack

- React
- Vite
- Tailwind CSS
- Cursor
- Node.js

## How AI Was Used

- **功能演进**：借助 AI 工具实现架构迭代，避免推倒重来
- **数据结构更新**：在现有训练流程中加入 challenge result 数据结构
- **模块化实现**：逐步落地得分、完成率、星级和勋章系统
- **改动管理**：通过 Prompt 辅助评审，控制修改范围，避免过度重构

## Run Locally

`npm install`  
`npm run dev`

运行后访问：`http://localhost:5173`

## Demo Screenshots

### Main Interface

徒手健身挑战演示的主界面，包括动作选择、实时训练面板和训练历史视图。

![Main Interface](fitness_tracker_images/main-interface.png)

### Success Modal

当挑战完全完成后触发成功弹窗，显示得分、完成率、勋章反馈和星级评分。

![Success Modal](fitness_tracker_images/success-modal.png)

## Demo Value

这个 demo 主要用于验证以下问题：

- 动作训练场景是否适合加入轻量游戏化激励机制
- 得分、完成率、星级和勋章反馈是否能增强完成感
- AI 工具是否能帮助更高效地完成原型迭代与功能验证

## Notes

This project focuses on interaction design and prototype validation rather than a full production-ready game system.
