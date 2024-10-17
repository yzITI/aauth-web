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
https://auth.njsc.ltd/#/launch/APPID[?state=STATE&platforms=PT1,PT2]
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
  if (e.origin !== 'https://auth.njsc.ltd') return
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

#### Step 4: Backend `code` Verification

> Aauth backend provides services through SRPC protocol described [here](https://github.com/yzITI/srpc).

Verify code from step 3 by calling
```js
// appid, app secret, and code from step 3
const user = await srpc.auth.code(appid, secret, code)
// false: failure
// User: success

// User object
User {
  id: String, // unique user id
  name: String, // username or nickname
  app: true, // app login as a virtual user
  platform: String, // login platform
  ... // other user properties, like email
}
```

Or, via raw http protocol, send request to `https://a.njsc.ltd/aauth` via `POST` method with header `Content-Type: application/json` and the following body parameters:
```js
{
  N: ['auth', 'code'],
  A: [appid, secret, code] // appid, app secret, and code from step 3
}
```

with the response:
```js
{ // success
  R: User{} // User object
}

{ // failure
  R: false
}
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

The `token` is a JSON Web Token (JWT), signed with `PS256` algorithm with Aauth Private Key. You can verify the `token` with the **Aauth Public Keys**.

> Aauth backend provides services through SRPC protocol described [here](https://github.com/yzITI/srpc).

Get Aauth Public keys:
```js
const pks = await srpc.auth.pk()

// Pks object
Pks {
  'kid1': JWK{}, // key 1 (in JWK format)
  'kid2': JWK{}, // key 2 (in JWK format)
  'kid3': JWK{}  // key 3 (in JWK format)
}
```

Or, via raw http protocol, send request to `https://a.njsc.ltd/aauth` via `POST` method with header `Content-Type: application/json` and the following body parameters:
```js
{
  N: ['auth', 'pk'],
  A: []
}
```

with the response:
```js
{
  R: Pks{} // Pks object
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
  app: true, // app login as a virtual user
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

const jwt = 'jwt signed by aauth'
const appid = 'your appid' // empty for ALL app
const expire = 86400e3 // expiration length
const allowApp = true // allow app login as virtual user

const v = await aauth(jwt, appid, expire, allowApp)
// if failed, v = false
// if success, v = { JWT Payload Object }
```
