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

Redirect user to the following url:
```
https://cn.aauth.link/#/launch/:APPID[?state=STATE&platforms=PT1,PT2]

Example: https://cn.aauth.link/#/launch/testid?state=yourstate&platforms=QQ,DINGTALK
```
> Parameter `platforms` is a front-end restriction, it is not checked by the back end, and it cannot override app settings.

**or**

Using `window.open()` method to open above Aauth url in a new window

### Step 2: User Login

Platforms can be set by url parameter `platforms` as well as app settings. Users could select an allowed platform and go to authenticate.

Platforms supported:
- Dingtalk (`DINGTALK`)
- QQ (`QQ`)
- GITHUB (`GITHUB`, may fail due to network)
- XYZSAS (`XYZSAS`)
- Phone Number (`PHONE`, only support Chinese phone number)

### Step 3: Redirect

After authentication, users will be redirected to the `redirect` specified in the app settings, with parameters `?[code=CODE|token=TOKEN][&state=STATE]`

- If `token` is set in app settings, a JWT `token` will be signed with `sk` of the app
- Otherwise, one-time `code` will be generated
- `state` from Step 1 will be attached

> `token` is a Json Web Token (JWT), signed with PS256 and including following fields:
> ```js
> {
>   iat: Date.now(),
>   iss: 'aauth',
>   // other fields like id specified in token
>   // For example, if token: 'id,name',
>   id: 'user id',
>   name: 'user name'
> }


If you have used `window.open()` in Step 1, the original window will receive related message sent by `window.postMessage()`. And the Aauth window will close automatically. To receive the message, the original window can use the event listener 
```js
window.onmessage = e => {
  // check origin for security
  if (e.origin !== 'https://cn.aauth.link') return
  console.log(e.data)
  // { state, token, code } optionally
})
```

### (When using `code`) Step 4: Backend `code` Confirmation

> When using `token`, please ignore this step.

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
