const eventUtils = {
  /** 顶部定位事件触发器 */
  TopPositionEventTrigger: class TopPositionEventTrigger {
    #element;
    #always;
    #above;
    #below;
    #timing;

    constructor(element, { always = undefined, above = undefined, below = undefined, timing = 'after' }) {
      // 类在above和below参数中，保底必须要传其中一个
      if (!(above || below)) throw new TypeError(`在 ${this.constructor.name} 中，above和below参数不能同时为空。`);
      this.#element = element; // 需要定位的元素
      this.#always = always; // 总是触发的回调函数
      this.#above = above; // 定位元素低于特定高度时触发的回调
      this.#below = below; // 定位元素大于特定高度时触发的回调
      this.#timing = timing; // 根据值决定“总是触发的回调”和“高度触发回调”的执行顺序
    }

    position(positioningHeight) {
      const taskList = []; // 任务列表，用于排序任务顺序
      console.log(`目录距离顶上的高度：${this.#element.getBoundingClientRect().top}`, `导航栏的高度： ${positioningHeight}`)
      this.#element.getBoundingClientRect().top > positioningHeight ? taskList.push(this.#above) : taskList.push(this.#below);
      this.#timing === 'after' ? taskList.push(this.#always) : taskList.unshift(this.#always);
      taskList.forEach(task => task && task());
    }
  },
  /** 分发事件 */
  dispatchEvent: (eventConfig) => {
    for (const [eventName, { listener, options = undefined }] of Object.entries(eventConfig)) {
      window.addEventListener(eventName, listener, options);
    }
  }
}
