export default {
  DINGTALK: {
    name: '钉钉',
    color: '#1877f2',
    icon: '/platforms/dingtalk.png',
    qrcode: true,
    go: (app, state, qrcode) => {
      if (navigator.userAgent.includes('DingTalk')) {
        window.location.href = 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=dingoaprellztzihaw4y82&response_type=code&scope=snsapi_auth&redirect_uri=https%3A%2F%2Fauth.njsc.ltd%2Freenter.html&state=DINGTALK$$' + app + '$$' + state
      } else {
        window.location.href = qrcode
          ? 'https://oapi.dingtalk.com/connect/qrconnect?appid=dingoaprellztzihaw4y82&response_type=code&scope=snsapi_login&redirect_uri=https%3A%2F%2Fauth.njsc.ltd%2Freenter.html&state=DINGTALK$$' + app + '$$' + state
          : 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=dingoaprellztzihaw4y82&response_type=code&scope=snsapi_login&redirect_uri=https%3A%2F%2Fauth.njsc.ltd%2Freenter.html&state=DINGTALK$$' + app + '$$' + state
      }
    }
  },
  QQ: {
    name: 'QQ',
    color: '#B71C1C',
    icon: '/platforms/qq.png',
    go: (app, state) => {
      window.location.href = 'https://graph.qq.com/oauth2.0/authorize?client_id=101907335&response_type=code&redirect_uri=https%3A%2F%2Fauth.njsc.ltd%2Freenter.html&state=QQ$$' + app + '$$' + state
    }
  },
  GITHUB: {
    name: 'Github',
    color: 'black',
    icon: '/platforms/github.png',
    go: (app, state) => {
      window.location.href = 'https://github.com/login/oauth/authorize?client_id=be701ef88116790b5964&state=GITHUB$$' + app + '$$' + state
    }
  },
  CHAOXING: {
    name: '超星',
    color: '#B71C1C',
    icon: '/platforms/chaoxing.png',
    go: (app, state) => {
      window.location.href = 'http://v1.chaoxing.com/loginInter/checkLogin?fid=117002&appId=0d156941306d4a508cae1aeeab0df0c5&refer=https%3A%2F%2Fauth.njsc.ltd%2Freenter.html%3Fstate%3DCHAOXING$$' + app + '$$' + state
    }
  },
  PHONE: {
    name: '手机号',
    color: 'black',
    icon: '/platforms/phone.svg',
    go: (app, state) => {
      window.location.href = './#/phone?state=PHONE$$' + app + '$$' + state
    }
  }
}
