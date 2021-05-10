# Aauth

Auth with Anything

## Overview

Aauth is a universal authentication system. One app may use Aauth in the following ways:

1. RSA Key Management
2. Aauth Login with `code`
3. Aauth Login with `token`

## RSA Key Management

By default, App has `id`, `secret`, and a pair of RSA keys (`sk` and `pk`).

**`sk` and `secret` are CREDENTIAL information.**

- Access `pk`: GET `/app/:id`
- Access `sk`: GET `/app/:id` with query parameter `secret`

## Aauth Login

### Step 1: Frontend Entry

```
https://cn.aauth.link/#/launch/:APPID[?state=STATE]
```

### Step 2: User Login

Currently support:
- Dingtalk (`DINGTALK`)
- QQ (`QQ`)
- GITHUB (`GITHUB`, may fail due to network)
- XYZSAS (`XYZSAS`)

### Step 3: Redirect

User is redirected to the `redirect` as in the App settings, with some parameters `?[code=CODE|token=TOKEN][&state=STATE]`

- If `token` template is set, `token` will be generated with `sk` of the App
- Otherwise, one-time `code` will be generated
- `state` from Step 1 will be attached

### Step 4: Backend `code` Confirmation

POST `https://cn.api.aauth.link/auth/` with following body parameters:
```js
{
  code: String, // code from Step 3
  app: String, // app id
  secret: String // app secret
}
```

The response format is following:
```js
// Success
{
  id: String, // unique user id
  name: String, // username or nickname
  platform: String, // login platform
  ... // other user properties, like email
}

// Fail
String // error message
```
