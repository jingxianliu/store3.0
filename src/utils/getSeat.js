const initData = [
  ['T', null, null, 'A1'],
  ['T', null, 'A0', 'A2'],
  ['T', 'A3', 'A1', 'A4'],
  ['A2', null, 'A1', 'A5']
]

let centerData = [
  ['T', 'C1', null, null],
  ['C0', 'C2', null, 'A0'],
  ['C1', 'C3', null, 'A0'],
  ['C2', null, null, null]
]

let tabData = []
let seatData = []
let helpData = []
let appData = []
let favoriteData = []
let retainData = [
  [
    [null, 'C1', null, 'B1'],
    [null, 'C1', 'B0', 'B2'],
    [null, 'C1', 'B1', 'B3'],
    [null, 'C1', 'B2', null]
  ],
  [
    ['B0', null, null, 'C1'],
    ['B0', null, 'C0', null]
  ]
]
// 栏目初始化
export function tabInit(num) {
  for (let i = 0; i < num; i++) {
    tabData.push([null, 'A0', i === 0 ? 'S1' : `T${i - 1}`, i === num - 1 ? null : `T${i + 1}`])
  }
}

// 推荐初始化
export function initSeat(tabIndex, seat, data) {
  console.log('--------初始化坐标-------', tabIndex, seat)
  tabIndex = parseInt(tabIndex)
  seatData = [].concat(initData)
  if (seat > 4) {
    for (let i = 4; i < seat; i++) {
      if ((i - 4) % 2) { // 下
        seatData.push([`A${i - 1}`, null, `A${i - 2}`, `A${i + 2}`])
      } else {
        seatData.push(['T', `A${i + 1}`, `A${i - 2}`, `A${i + 2}`])
      }
    }
    // 改变边线
    seatData[seat - 1][3] = `T${tabIndex + 1}`
    seatData[0][2] = tabIndex === 0 ? null : `T${tabIndex - 1}`
    if (seat % 2) {
      seatData[seat - 2][3] = `A${seat - 1}`
      seatData[seat - 1][1] = null
    } else {
      seatData[seat - 2][3] = `T${tabIndex + 1}`
    }
  }
}
// 我的收藏初始化
export function favoritesInit(num) {
  console.log('wode')
  favoriteData = []
  if (num === 0) {
    return false
  }
  for (let i = 0; i < num; i++) {
    favoriteData.push([i % 3 ? `A${i - 1}` : 'T', i === num - 1 ? null : `A${i + 1}`, i <= 2 ? 'TQ' : `A${i - 3}`, i >= num - 3 ? 'TN' : `A${i + 3}`])
  }
  if (num >= 3) {
    if (num % 3 === 1) {
      favoriteData[num - 2][3] = `A${num - 1}`
      favoriteData[num - 3][3] = `A${num - 1}`
    } else if (num % 3 === 2) {
      favoriteData[num - 3][3] = `A${num - 2}`
    }
  }
}
// 帮助反馈初始化
export function helpInit(num) {
  console.log('帮助页面初始化', num)
  if (num === 0) {
    helpData = ['C0', 'C2', null, null]
    centerData[1][3] = null
    return false
  }
  helpData = []
  centerData[1][3] = 'A0'
  for (let i = 0; i < num; i++) {
    helpData.push([i === 0 ? null : `A${i - 1}`, i === num - 1 ? null : `A${i + 1}`, 'C1', null])
  }
}
// 我的应用初始化
export function appInit(updataNum, num) {
  appData = []
  // 无应用时 num === 0
  if (num === 0) {
    return false
  }
  if (updataNum) {
    // 有更新
    appData.push([null, 'A1', 'C2', null])
    for (let i = 1; i < num + 1; i++) {
      appData.push([i < 2 ? 'A0' : `A${i - 2}`, `A${i + 2}`, i % 2 ? 'C2' : `A${i - 1}`, i % 2 ? `A${i + 1}` : null])
    }
    if (num % 2) {
      appData[num][3] = null
    }
    appData[num][1] = null
    if (num >= 2) {
      appData[num - 1][1] = null
    }
  } else {
    // 无更新
    for (let i = 0; i < num; i++) {
      appData.push([i < 2 ? null : `A${i - 2}`, `A${i + 2}`, i % 2 ? `A${i - 1}` : 'C2', i % 2 ? null : `A${i + 1}`])
    }
    if (num % 2) {
      appData[num - 1][3] = null
    }
    appData[num - 1][1] = null
    if (num >= 2) {
      appData[num - 2][1] = null
    }
  }
  console.log('我的应用：', JSON.stringify(appData))
}
/* 获取推荐位下一个焦点 */
function getNextSeat(pageIndex, now, index) {
  // pageIndex: 当前tab index
  // now：当前focusCode
  // index 0上 1下 2左 3右
  console.log('----getNextSeat-----', pageIndex, now, index)
  const isTAB = now.includes('T') // true为tab
  const focusIndex = parseInt(now.slice(1))
  pageIndex = parseInt(pageIndex)
  let nextCode = null
  if (isTAB) {
    // tab 切换聚焦
    nextCode = tabData[focusIndex][index]
  } else {
    // seat切换
    console.log('seat切换', seatData)
    let getCode = seatData[focusIndex][index]
    if (getCode && getCode.includes('T')) {
      nextCode = getCode === 'T' ? `T${pageIndex}` : getCode
    } else {
      nextCode = getCode
    }
  }
  // 最后一格判断
  console.log('----首页下一个foucsCode-----', nextCode)
  return nextCode
}
/* 我的收藏焦点 */
export function getFavoriteSeat(now, index) {
  return favoriteData[now.slice(1)][index]
}
/* 个人中心焦点 */
export function getCenterSeat(now, index, tab, appNum) {
  console.log(now, index, tab, appNum)

  const isTAB = now.includes('C')
  const tabIndex = parseInt(now.slice(1))
  centerData[2][3] = appNum === 0 ? null : 'A0'
  let nextCode = null
  if (isTAB) {
    console.log('dx:center tab ', centerData)
    nextCode = centerData[tabIndex][index]
  } else {
    if (now.includes('T')) {
      // T => C
      nextCode = 'C0'
    } else {
      // A => A
      if (tab === 'Help') {

        nextCode = helpData[tabIndex][index]
      } else if (tab === 'App') {
        // 我的应用
        nextCode = appData[tabIndex][index]
      } else {
        nextCode = null
      }
    }
  }
  return nextCode
}

export function getRetainSeat(now, index) {
  console.log('retainData:', now, '--------', index, retainData)
  let nextCode = null
  let column = now.includes('B') ? 0 : 1
  let nowIndex = now.slice(1)
  nextCode = retainData[column][nowIndex][index]
  console.log(column, 'retian--------', nowIndex, '-12123', nextCode)
  return nextCode
}
export default getNextSeat
