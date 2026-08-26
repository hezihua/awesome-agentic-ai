# Next.js 接入 Supabase Auth + Stripe Checkout 实践

> 基于本仓库（Agent Atlas）落地经验。目标：登录门禁 + 可选付费解锁，支付链路可随时开关。  
> **本文不展示任何密钥原文**；只说明变量名、用途，以及在后台「去哪里复制」。

## 1. 总体架构

```
浏览器
  ├─ 登录页 /[locale]/login
  │     └─ @supabase/ssr（浏览器客户端）
  │           ├─ 密码 / 魔法链接 / GitHub OAuth
  │           └─ redirectTo → /auth/callback
  ├─ Middleware
  │     ├─ 刷新 Session（cookies）
  │     ├─ 未登录 → /login?next=...
  │     └─ （可选）未付费 → /pricing?next=...
  ├─ /auth/callback
  │     └─ exchangeCodeForSession（PKCE）
  └─ /api/stripe/*
        ├─ POST /checkout  → Stripe Checkout Session
        └─ POST /webhook   → checkout.session.completed
                              └─ Supabase Admin 写 app_metadata.paid
```

关键依赖：

- `@supabase/supabase-js` + `@supabase/ssr`
- `stripe`（服务端 SDK）

## 2. 环境变量（名称与用途）

本地写在 `.env.local`（gitignore），线上在 **Vercel → 项目 → Settings → Environment Variables**。改完后必须 **Redeploy**。  
变量值一律从各后台复制，**不要写进文档、截图或聊天**。

| 变量名 | 用途 | 可否进前端 |
|--------|------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目地址 | 可（`NEXT_PUBLIC_`） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 浏览器 / 服务端匿名访问 | 可；**不要**用 service_role |
| `SUPABASE_SERVICE_ROLE_KEY` | Webhook 里改用户 `app_metadata` | **仅服务端** |
| `NEXT_PUBLIC_SITE_URL` | 生产站点根 URL（OAuth / Checkout 回跳） | 可 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe 可发布密钥 | 可 |
| `STRIPE_SECRET_KEY` | Stripe 私钥 | **仅服务端** |
| `STRIPE_PRICE_ID` | Checkout 使用的价格 ID | 服务端即可 |
| `STRIPE_WEBHOOK_SECRET` | 校验 Webhook 签名 | **仅服务端** |
| `PAYMENT_REQUIRED` | 设为 `true` 开启付费墙 | 服务端 |

本地模板见 `.env.local.example`（仅占位符，无真实密钥）。

### 2.1 密钥去哪里找（只指路，不贴值）

**Supabase**

1. 打开 [Supabase Dashboard](https://supabase.com/dashboard) → 选中项目。  
2. **Project URL / anon key**  
   - 项目首页的 Project URL，或  
   - 左下角 **Project Settings（齿轮）→ API**（或 **API Keys**）  
   - 复制 **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`  
   - 复制 **anon / public**（或 Legacy anon）→ `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
3. **service_role**  
   - 同一 API / API Keys 页  
   - 复制 **service_role**（常需 Reveal）→ `SUPABASE_SERVICE_ROLE_KEY`  
   - 权限极大，只放服务器与 Vercel 私密环境变量。

**站点域名**

- `NEXT_PUBLIC_SITE_URL`：填你的生产根地址（含 `https://`，不要末尾多余路径）。本地开发可不设，代码会回退到 `window.location.origin`。

**Stripe**

1. 打开 [Stripe Dashboard](https://dashboard.stripe.com)，确认右上角是 **测试模式** 还是 **正式模式**（Key 与 Price 必须同一模式）。  
2. **可发布密钥 / 私钥**  
   - **开发者**（或设置 → 开发人员 / 右上角 `</>`）→ **API 密钥**  
   - 复制「可发布密钥」→ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`  
   - 复制「私钥」（Reveal）→ `STRIPE_SECRET_KEY`  
3. **Price ID**  
   - **产品目录** → 点开商品 → **点价格那一行进入详情**（编辑弹窗里往往不显示 ID）  
   - 在价格详情页复制 **Price ID / API ID** → `STRIPE_PRICE_ID`  
   - 注意：要的是价格 ID，不是产品 ID；且 **大小写必须一致**。  
4. **Webhook 签名密钥**  
   - **开发者 → Webhooks**（或 Workbench → Webhooks）→ 创建/打开端点  
   - 端点 URL 指向：`https://你的域名/api/stripe/webhook`  
   - 事件勾选：`checkout.session.completed`  
   - 在端点详情里 **Reveal / 复制签名密钥** → `STRIPE_WEBHOOK_SECRET`  
   - 本地调试也可用 Stripe CLI 的 `listen`，终端里会出现签名密钥，同样只写入本地环境变量。

**GitHub OAuth（给 Supabase 用，不是 Next 的 env）**

1. [GitHub → Settings → Developer settings → OAuth Apps](https://github.com/settings/developers) → New OAuth App。  
2. Authorization callback URL 填 Supabase 提供的 Callback（在 Supabase → Authentication → Providers → GitHub 里可 Copy）。  
3. 创建后复制 **Client ID**；生成 **Client Secret**（只显示一次，自行保管）。  
4. 粘贴到 **Supabase → Authentication → Sign In / Providers → GitHub**，启用并保存。  
5. Client Secret **不要**放进 Next 的 `.env`，只存在 Supabase。

## 3. Supabase Auth（App Router）

### 3.1 客户端拆分

| 文件 | 场景 |
|------|------|
| `src/lib/supabase/client.ts` | 浏览器（登录表单、顶栏） |
| `src/lib/supabase/server.ts` | Server Component / Route Handler |
| `src/lib/supabase/middleware.ts` | Middleware 刷新 session |
| `src/lib/supabase/admin.ts` | service_role，仅 Webhook |

未配置 URL/Key 时 Middleware 直接放行，避免本地未配密钥整站不可用。

### 3.2 登录方式

`LoginForm` 支持：邮箱密码、魔法链接、GitHub OAuth。  
回调路径：`/auth/callback?next=...`（由 `NEXT_PUBLIC_SITE_URL` 或当前 origin 拼出）。  
`src/app/auth/callback/route.ts` 使用 `exchangeCodeForSession` 写 cookie 后再跳转。

### 3.3 Dashboard URL 配置（非密钥）

**Authentication → URL Configuration**

| 项 | 怎么填 |
|----|--------|
| Site URL | 生产站点根 URL（不要长期停在 localhost，否则生产 OAuth 会跳回本机） |
| Redirect URLs | 加入 `https://你的域名/auth/callback`、可选通配 `https://你的域名/**`，以及本地 `http://localhost:3000/auth/callback` |

用户列表：**Authentication → Users**（`auth.users`）。业务表需自建。

### 3.4 路由门禁

- 公开：首页、登录页等  
- 需登录：文档等其余路径  
- 需付费（可选）：`PAYMENT_REQUIRED=true` 且 Stripe 已配置时，未付费跳转 `/pricing`  

若 OAuth 的 `code` 误落到首页，Middleware 会转到 `/auth/callback`。

## 4. Stripe Checkout

### 4.1 产品与价格

1. **产品目录** → 创建一次性商品。  
2. 价格需满足该币种最低限额（例如港币过低会创建 Session 失败）。  
3. 在**价格详情页**复制 Price ID（见 §2.1）。  
4. 已有交易的价格通常不能删除，只能 **归档**；新结账改环境变量中的 Price ID。  
5. 测试模式与正式模式的密钥、价格不要混用。

### 4.2 Checkout API

`POST /api/stripe/checkout`（需已登录）：创建 Checkout Session，前端跳转返回的支付页 URL。  
成功/取消回跳优先使用 `NEXT_PUBLIC_SITE_URL`。

### 4.3 Webhook

`POST /api/stripe/webhook`：校验签名 → 处理 `checkout.session.completed` → 用 Admin 客户端把对应用户的 `app_metadata.paid` 设为 `true`。  
端点与签名密钥的获取见 §2.1。

### 4.4 付费墙开关

```ts
export function isPaymentRequired() {
  return process.env.PAYMENT_REQUIRED === "true";
}
```

| 配置 | 行为 |
|------|------|
| 不设 | 仅登录即可读文档（当前默认） |
| `PAYMENT_REQUIRED=true` | 未付费跳转定价页 |

支付相关代码保留，用环境变量开关即可。

## 5. 部署到 Vercel

1. 在 Vercel 配置 §2 中的变量（密钥类勾选敏感 / 不对前端暴露）。  
2. **改变量后必须 Redeploy**。  
3. 自定义域名、Supabase Site URL、Stripe Webhook URL、`NEXT_PUBLIC_SITE_URL` 保持一致。  
4. 名称里带 `SERVICE_ROLE`、Stripe「私钥」、Webhook「签名密钥」的项，**不要**加 `NEXT_PUBLIC_` 前缀。

## 6. 推荐目录结构

```text
src/
  lib/supabase/   # client / server / middleware / admin
  lib/stripe.ts
  middleware.ts
  app/auth/callback/route.ts
  app/api/stripe/checkout/route.ts
  app/api/stripe/webhook/route.ts
  app/[locale]/login/page.tsx
  app/[locale]/pricing/page.tsx
  components/LoginForm.tsx
  components/AuthButton.tsx
  components/PricingCard.tsx
```

## 7. 联调清单

- [ ] 已按 §2.1 配置 URL / anon；Users 中能看到登录用户  
- [ ] GitHub Provider 已启用；Callback 使用 Supabase 控制台给出的地址  
- [ ] 生产 Site URL、Redirect URLs 指向生产域名  
- [ ] Stripe 密钥与 Price 同属测试或正式模式；价格详情页复制的 ID 已写入环境变量  
- [ ] Webhook 端点已创建，签名密钥已配置，投递成功  
- [ ] 需要收费时再设 `PAYMENT_REQUIRED=true` 并 Redeploy  

## 8. 常见错误（不含密钥原文）

| 现象 | 处理方向 |
|------|----------|
| 提示缺少 URL / API key | 检查 `.env.local` 是否已按 §2.1 填写并重启 `pnpm dev` |
| Unsupported provider | Supabase 里启用对应 Provider，并填入 GitHub 后台的 Client 信息 |
| 生产登录跳到 localhost | 把 Site URL、Redirect URLs 改成生产域名 |
| 首页带 `code` 却未登录 | 检查 Redirect 白名单；依赖 Middleware 转到 `/auth/callback` |
| No such price | 核对模式（测试/正式）、在价格详情页重新复制 ID（注意大小写） |
| 金额低于币种最低限额 | 在产品下新增足够金额的价格，更新环境变量中的 Price ID |
| 无法删除旧价格 | 归档即可；结账改用新 Price ID |
| 改了 Vercel 变量仍旧行为 | Redeploy 当前生产部署 |
| Checkout 报未登录 | 先完成登录回调；确认请求带上同源 Session Cookie |

## 9. 安全约定

- 文档、Issue、聊天、截图中**不要出现**任何密钥全文。  
- 只教「后台路径 + 复制到环境变量」；泄露后到对应后台轮换。  
- Webhook 必须验签；付费标记写在 `app_metadata`（服务端可写），勿信任前端可改的字段。

---

实现以仓库代码为准；密钥只存在于本机 `.env.local` 与 Vercel 环境变量中。
