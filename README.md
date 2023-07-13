# ChatGPT-AzureAPI-Web

一个适用于 Azure API 的 ChatGPT 的 Web 界面（前端部分）。

A ChatGPT Web for Azure OpenAI API (front-end part).

**Tips: Before you start, you need to build backend first.**

Back-end: [ChatGPT-AzureAPI-Backend](https://github.com/Okysu/ChatGPT-AzureAPI-Web-Backend)


**提示：在开始之前，你需要先构建后端。**

## Overview 概览

![image](https://source.yby.zone/azure/1.jpg)

![image](https://source.yby.zone/azure/2.jpg)

![image](https://source.yby.zone/azure/3.jpg)

## Features 特性

- [x] Authorization Key 授权密钥

You can set your own Authorization Key to prevent others from using your API.

你可以设置自己的授权密钥，以防止他人使用你的 API。

- [x] History 历史记录

You can view the history of your conversations. and set the messages to be sent.

你可以查看你的对话历史记录，并设置要发送的消息。

- [x] Prompt 提示

You can set the prompt to facilitate your conversation.

内置中英文双语提示，快捷完成你的对话。

- [ ] i18n 多语言 **(In progress)**

## Usage 使用

### dependencies 依赖

```bash
pnpm install
```

### dev 开发

Before you start, you need to set the `.env.development` file.

```bash
ENV = 'development'
# change to your own backend url
VITE_BASE_URL = 'http://localhost:8080'
```

**Tips: You don't need to add a '/' at the end of the URL.**

**提示：你不需要在 URL 的末尾添加 '/'。**

Then, you can start the dev server.

```bash
pnpm run dev
```

### build 构建

Before you start, you need to set the `.env.production` file.

```bash
ENV = 'production'

# change to your own backend url
VITE_BASE_URL = 'https://aaaa.com'
```

**Tips: You don't need to add a '/' at the end of the URL.**

**提示：你不需要在 URL 的末尾添加 '/'。**

Then, you can start the build.

```bash
pnpm run build
```