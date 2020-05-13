const storage = weex.requireModule('storage')
const myModule = weex.requireModule('myModule')
const stream = weex.requireModule('stream')
export default function (name) {
  return name
}
// const API = 'http://ahappstore.orbbec.me:10091/api/v1'
// const baseImg = 'http://ahappstore.orbbec.me:10091'
// const staticImg = 'http://ahappstore.orbbec.me:10091'
// const coutlyAPI = 'http://gwcountly.orbbec.me:11095'

const API = 'http://appstoretest.orbbec.me:10091/api/v1'
const baseImg = 'http://appstoretest.orbbec.me:10091'
const staticImg = 'http://appstoretest.orbbec.me:10091'
export {
  API,
  baseImg,
  staticImg
}
export function getQueryParams(url) {
  const splitedUrl = (url || '').split('?')
  if (splitedUrl.length < 2) {
    return {}
  }
  let qs = splitedUrl[1]
  qs = qs.split('#')[0]
  if (qs.length === 0) {
    return {}
  }

  const paramPairs = qs.split('&')
  const params = {}
  paramPairs.forEach((e) => {
    if (!e || e.length === 0) {
      return
    }
    const pair = e.split('=')
    if (pair.length < 2) {
      return
    }
    const key = pair[0]
    const value = pair.slice(1, pair.length).join('=')
    if (value.length === 0) {
      return
    }
    params[decodeURIComponent(key)] = decodeURIComponent(value)
  })
  return params
}

export function getUrlParam(key, url) {
  const reg = new RegExp(`[?|&]${key}=([^&]+)`)
  const match = url.match(reg)
  return match && match[1]
}

export function createLink(page, params = {}) {
  const args = []
  Object.keys(params).forEach((key) => {
    if (typeof params[key] === 'string') {
      args.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    }
  })
  if (WXEnvironment.platform === 'Web') { // eslint-disable-line
    const tplPathList = (getUrlParam('_wx_tpl', location.href) || '').split('/')
    tplPathList[tplPathList.length - 2] = page
    args.unshift(`_wx_tpl=${tplPathList.join('/')}`) // eslint-disable-line
    return `${location.origin}${location.pathname}?${args.join('&')}`
  }
  console.log('daixin:', weex.config.bundleUrl)
  const baseURL = 'pages/'
  const bundlePathList = `${baseURL}${page}/entry.js`
  // const bundlePathList = weex.config.bundleUrl.split('/')
  // bundlePathList[bundlePathList.length - 2] = page
  // return `${bundlePathList.join('/')}?${args.join('&')}`
  return `${bundlePathList}?${args.join('&')}`
}

// 网络判断
export function hasNetwork(that) {
  // return true
  if (!myModule.getInternetStatus()) {
    // 无网处理
    that.isNoNetwork = true
    that.isReqError = false
    return false
  } else {
    return true
  }
}

// 存入下载队列
export function setDownload(name) {
  storage.getItem('installApps', e => {
    let arr = []
    if (e.result === 'success') {
      arr = e.data.includes('com') ? JSON.parse(e.data) : []
    } else {
      arr = []
    }
    console.log('set-------------------', name, e.result, arr)
    if (!arr.includes(name)) {
      arr.push(name)
      storage.setItem('installApps', arr, e => {
        console.log('存入下载队列：', arr)
      })
    }
  })
}

// 安装完成 更新本地应用
export function finishedInstall(value) {
  console.log('dx:finishedInstall-', value)
  if (value.includes('packages')) {
    value = JSON.parse(value)
    storage.getItem('localApps', e => {
      if (e.result === 'success') {
        console.log('本地已安装应用：', value.packages[0])
        let data = JSON.parse(e.data)
        let index = data.apps.findIndex(item => item.packageName === value.packages[0].packageName)
        if (index !== -1) {
          data.apps.splice(index, 1)
        }
        data.apps.push(value.packages[0])
        storage.setItem('localApps', data, e => {
          console.log('安装成功写入本地缓存:', data, e)
        })
      }
    })
    storage.getItem('installApps', e => {
      if (e.result === 'success') {
        let data = JSON.parse(e.data)
        data.splice(data.findIndex(item => item === value.packages[0].packageName), 1)
        storage.setItem('installApps', data, e => {
          console.log(e)
        })
      }
    })
  }
}

// 统计上报
export function statistics(type, index, packageName) {
  console.log('dx:统计', type)
  const userInfo = JSON.parse(myModule.getUserInfo())
  const ottUsername = userInfo.MACAddress
  const timestamp = new Date().getTime()
  const hour = new Date().getHours()
  const daw = new Date().getDay()
  let getBody = `/i?app_key=0f030ca6b46be056b81203743ca9974eec7d5c0b&timestamp=${timestamp}&hour=${hour}&dow=${daw}&events=[{"key":"${packageName}","count":1,"timestamp":${timestamp},"hour": ${hour},"dow": ${daw},"segmentation":{"${type}":"count"},"sum":0}]&sdk_version=18.01&sdk_name=java-native-android&device_id=${ottUsername}&checksum=f4c75f11c99a6910e9d6a39015a06915fdeab84a`
  stream.fetch({
    method: 'GET',
    url: `http://gwcountly.orbbec.me:11095${encodeURI(getBody)}`,
    type: 'json'
  },
  res => {
    console.log(res)
  }
  )
  // const plateName = ['recommend', 'education', 'parentchild']
  // const clickName = ['download', 'unload', 'help', 'manager']
  // let sentData = ''
  // if (type === 'plat') {
  //   // 板块
  //   sentData = `"${plateName[index]}":"${packageName}"`
  // } else if (type === 'click') {
  //   sentData = `"${clickName[index]}":"${packageName}"`
  // }
  // let getBody = `?app_key=9efe80412273a1dcd3500ea37349d0ef&ott_username=${ottUsername}&operate={${sentData}}`
  // stream.fetch(
  //   {
  //     method: 'GET',
  //     url: `${coutlyAPI}/operate${getBody}`,
  //     type: 'json'
  //   },
  //   res => {
  //     console.log(res)
  //   }
  // )
}
