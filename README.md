# Aauth

Auth with Anything

## Overview

Aauth is a universal authentication system. It supports multiple platforms, two ways of navigation, and two types of login flow.

**Supported Platforms:**

- `GITHUB`: (often fails due to network)
- `DINGTALK`
- `QQ`
- `CHAOXING` (only allow yzzx account)
- `PHONE` (only support Chinese number)

## Navigation

To start Aauth login flow, navigate user to the launch url:
```
https://cn.aauth.link/#/launch/APPID[?state=STATE&platforms=PT1,PT2]
```

where
- `APPID` is your app id
- `STATE` is optional state
- Parameter `platforms` is a front-end restriction, it is not checked by the back end, and it cannot override app settings.

Aauth has two ways of navigation.

### Redirect

By redirect user to the url above, Aauth will guide the user through the login flow and return the result by **redirecting to the `url` specified in the app settings**, with parameters `?code=CODE[&state=STATE]` or `?token=TOKEN[&state=STATE]`, depending on your login flow type.

> if `url` contains multiple url (comma-separated), then the first one is applied.

### Popup

When using `window.open()` method to open the launch url above in a new window, Aauth will return the result by `window.postMessage`, and the popup Aauth window will close automatically. 

> You must set the original window `url` in app settings to receive this message. It can be set as comma-separated multiple urls.

To receive the message, the original window can use the event listener 
```js
window.onmessage = e => {
  // check origin for security
  if (e.origin !== 'https://cn.aauth.link') return
  console.log(e.data)
  // { code, state } or { token, state }
}
```

## Login Flow

There are two types of login flow

### `Code` Login

#### Step 1: Launch

Navigate user to the launch url, as discussed above.

#### Step 2: User Login

User will choose a platform and login through it. Platforms can be set by app settings as well as the frontend url parameter.

#### Step 3: Return

After authentication, Aauth will return to the `url` in the app settings with `code` information. (See Navigation for details)

#### Step 4: Backend `code` Confirmation

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

### `Token` Login

#### Step 1: Setting & Launch

To use the `token` login, set the `token` in app settings to a comma-separated string like `key1,key2,key3`. The user's infomation specified with these keys will be signed into a token.

Navigate user to the launch url, as discussed in the Navigation section.

#### Step 2: User Login

User will choose a platform and login through it. Platforms can be set by app settings as well as the frontend url parameter.

#### Step 3: Return

After authentication, Aauth will return to the `url` in the app settings with `token` information. (See Navigation for details)

#### Step 4: Verify `token`

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

Here is an SDK for token verification [./aauth.js](./aauth.js).

```js
const aauth = require('./aauth.js')

// verify token with your appid and expire time(ms)
const v = await aauth('jwt signed by aauth', 'appid', 86400e3)

// if failed, v = false
// if success, v = [JWT Payload Object]
```
