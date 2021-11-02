export default {
  DINGTALK: {
    name: '钉钉',
    color: '#1877f2',
    icon: '/platforms/dingtalk.png',
    go: (app, state) => {
      if (navigator.userAgent.includes('DingTalk')) {
        window.location.href = 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=dingoaprellztzihaw4y82&response_type=code&scope=snsapi_auth&redirect_uri=https%3A%2F%2Fcn.aauth.link%2Freenter.html&state=DINGTALK$$' + app + '$$' + state
      } else {
        window.location.href = window.innerWidth < 800
          ? 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=dingoaprellztzihaw4y82&response_type=code&scope=snsapi_login&redirect_uri=https%3A%2F%2Fcn.aauth.link%2Freenter.html&state=' + state
          : 'https://oapi.dingtalk.com/connect/qrconnect?appid=dingoaprellztzihaw4y82&response_type=code&scope=snsapi_login&redirect_uri=https%3A%2F%2Fcn.aauth.link%2Freenter.html&state=DINGTALK$$' + app + '$$' + state
      }
    }
  },
  QQ: {
    name: 'QQ',
    color: '#B71C1C',
    icon: '/platforms/qq.png',
    go: (app, state) => {
      window.location.href = 'https://graph.qq.com/oauth2.0/authorize?client_id=101907335&response_type=code&redirect_uri=https%3A%2F%2Fcn.aauth.link%2Freenter.html&state=QQ$$' + app + '$$' + state
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
  XYZSAS: {
    name: '学生事务系统',
    color: 'black',
    icon: '/platforms/XYZSAS.svg',
    go: (app, state) => {
      window.location.href = 'https://sas.yzzx.org/#/login?c=AAUTH&state=XYZSAS$$' + app + '$$' + state
    }
  }
}
