# Aauth

Auth with Anything

## Overview

Aauth is a universal authentication system. It support login flow with both `code` and `token`

## `Code` Login

### Step 1: Frontend Entry

Redirect user to the following url:
```
https://cn.aauth.link/#/launch/:APPID[?state=STATE&platforms=PT1,PT2]

Example: https://cn.aauth.link/#/launch/testid?state=yourstate&platforms=QQ,DINGTALK
```
> Parameter `platforms` is a front-end restriction, it is not checked by the back end, and it cannot override app settings.

**or**

Using `window.open()` method to open the url above in a new window

### Step 2: User Login

Platforms can be set by url parameter `platforms` as well as app settings. Users could select an allowed platform.

Platforms supported:
- Dingtalk (`DINGTALK`)
- QQ (`QQ`)
- GITHUB (`GITHUB`, may fail due to network)
- Chaoxing (`CHAOXING`, only support yzzx account)
- Phone Number (`PHONE`, only support Chinese phone number)

### Step 3: Redirect

After authentication, users will be redirected to the `url` specified in the app settings, with parameters `?code=CODE[&state=STATE]`

If you have used `window.open()` in Step 1, the original window will receive related message sent by `window.postMessage()`. And the Aauth window will close automatically. To receive the message, the original window can use the event listener 
```js
window.onmessage = e => {
  // check origin for security
  if (e.origin !== 'https://cn.aauth.link') return
  console.log(e.data) // { code, state }
}
```

### Step 4: Backend `code` Confirmation

POST `https://cn.api.aauth.link/auth/` with following body parameters:
```js
{
  code: String, // code from Step 3
  app: String, // app id
  secret: String // app secret
}
```

with the Response:
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

## `Token` Login

### Step 1: App Setting

Set the `token` property of the app to a comma-separated string like `key1,key2,key3`. The user's infomation specified with these keys will be signed into a token.

Follow the same entry Step 1 as `code` Login

### Step 2: User Login

Same as `code` login Step 2

### Step 3: Redirect

After authentication, users will be redirected to the `url` specified in the app settings, with parameters `?token=TOKEN[&state=STATE]`

If you have used `window.open()` in Step 1, the original window will receive related message sent by `window.postMessage()`. And the Aauth window will close automatically. To receive the message, the original window can use the event listener 
```js
window.onmessage = e => {
  // check origin for security
  if (e.origin !== 'https://cn.aauth.link') return
  console.log(e.data) // { token, state }
}
```

### Step 4: Verify `token`

The `token` is a JSON Web Token (JWT), signed with `PS256` algorithm with Aauth Private Key. You can verify the `token` with the **Aauth Public Keys**:

GET `https://cn.api.aauth.link/auth/`

with the Response:
```js
{
  'kid1': String, // key 1
  'kid2': String, // key 2
  'kid3': String  // key 3
}
```

> To improve security, Aauth rotates the RSA key pairs every 20 days. A new key pair would be generated and the oldest one will be removed from this list. **Aauth always sign token with the middle key.**

The `token` is always a JWT with the following structure:

```js
Head { // JWT Head
  alg: "PS256", // always PS256
  typ: "JWT", // always JWT
  kid: "kid1" // specify which public key to verify
}

Payload { // JWT Payload
  iat: Date.now(),
  iss: 'aauth',
  aud: 'appid', // your app id
  // other fields specified in app.token
  // For example, if token: 'id,name',
  id: 'userid',
  name: 'name'
}
```


### Token SDK

[./aauth.js](./aauth.js).

```js
const aauth = require('./aauth.js')

// verify token with your appid and expire time(ms)
const v = await aauth('jwt signed by aauth', 'appid', 86400e3)

// if failed, v = false
// if success, v = [JWT Payload Object]
```
