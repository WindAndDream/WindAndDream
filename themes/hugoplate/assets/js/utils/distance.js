const distanceUtils = {
  /** 获取距离顶部的距离 */
  getTop(element, distance = 0) {
    return element.offsetHeight + distance;
  },

  /** 获取当前浏览器视口高度 */
  getScreenHeight() {
    return window.innerHeight
  }
}

