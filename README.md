# Agent Atlas（awesome-agentic-ai）

基于 [awesome-agentic-ai-zh](https://github.com/WenyuChiou/awesome-agentic-ai-zh)（MIT）的学习路线图站点，支持**简体中文 / 繁體中文 / English**。技术栈对齐 [ai-tutorial](../projects/ai-tutorial)：

- Next.js App Router + React + TypeScript
- Tailwind CSS
- Markdown（gray-matter + react-markdown + remark-gfm）
- pnpm

对照参考 UI：[agent.codepost.site](https://agent.codepost.site/#tracks)。本站**不包含**闲鱼正版验证或盗版提示弹窗，仅做开源内容的可读镜像与导航。

## 本地开发

```bash
pnpm install
pnpm dev
```

打开 <http://localhost:3000>（自动跳转到 `/zh-Hans`）。

| 语言 | 首页 |
|------|------|
| 简体中文 | <http://localhost:3000/zh-Hans> |
| 繁體中文 | <http://localhost:3000/zh-TW> |
| English | <http://localhost:3000/en> |

顶栏可切换语言；文档路径形如 `/[locale]/docs/...`。

## Supabase 登录

1. 在 [Supabase](https://supabase.com) 创建项目，开启 Email / GitHub 登录
2. Authentication → URL Configuration：Site URL 填本地 `http://localhost:3000`，Redirect URLs 加 `http://localhost:3000/auth/callback`（生产域名同理）
3. 复制 `.env.local.example` 为 `.env.local`，填入 `NEXT_PUBLIC_SUPABASE_URL` 与 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. `pnpm dev`，打开 `/zh-Hans/login`

支持：邮箱密码、魔法链接、GitHub OAuth。未配置环境变量时顶栏不显示登录入口。

当前：**登录即可阅读全部内容**。Stripe 结账与 `/pricing` 仍保留；以后若要重新收费，在环境变量设置 `PAYMENT_REQUIRED=true` 并 Redeploy。

## 内容来源

`content/` 下为上游仓库多语言 Markdown 快照：

- `*.zh-Hans.md` — 简体
- `*.md`（无后缀）— 繁體
- `*.en.md` — English

文档内相对链接会在构建时改写到对应 locale 的 `/[locale]/docs/...`。

## 许可

上游内容遵循 MIT，见 `content/LICENSE`。Maintained upstream by [@WenyuChiou](https://github.com/WenyuChiou)。
