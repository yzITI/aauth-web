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
or 

Using `window.open()` method to open above Aauth url in a new window

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

If you have used `window.open()` in step1, the original window will receive related message sent by `window.postMessage()`. And the new window will close automatically. To receive the message, the original window can use the event listener `window.addEventListener("message", e => {})`

**jwt**
style 
```javascript
{
  ":": "[{'#':'clubdata','_':'?','!':0,':':{'${id}':1}}]", // data ${v} will be replaced by v in the "?" session
  "?": ["id"], //
  'nbf': timestamp, // (optional) jwt invalid before this timestamp
  'exp': timestamp // (optional) jwt invalid before this timestamp
}
```

Algorithm
Using PS256

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
