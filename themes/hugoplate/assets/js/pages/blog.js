

(
  function () {
    const category = document.querySelector('details.category'); // 目录
    if (category) {
      const summary = category.querySelector('summary'); // 目录标题
      const nav = category.querySelector('nav'); // 目录中的导航栏
      const header = document.querySelector('body header'); // 顶部导航栏
      const gap = 10; // 目录距离顶部导航栏的距离
      let topDistance = distanceUtils.getTop(header, gap); // 顶部导航栏的高度

      // 移除背景颜色
      function removeBackgroundColor() {
        summary.style.removeProperty('background-color');
      }

      // 添加背景颜色
      function addBackgroundColor() {
        cssUtils.addStyle(summary, 'background-color: hsl(0 0% 33% / 50%)')
      }

      // 更新目录菜单的高度
      function updateNavHeight() {
        cssUtils.addStyle(nav, `height: ${distanceUtils.getScreenHeight() / 2 - distanceUtils.getTop(header, gap)}px`)
      }

      // 更新top属性
      function uploadTop() {
        cssUtils.addStyle(category, `top: ${topDistance}px`)
      }

      const topPositionEventTrigger = new eventUtils.TopPositionEventTrigger(summary, {
        always: () => {
          uploadTop(); // 更新top属性
          updateNavHeight(); // 更新目录菜单高度
        },
        above: () => {
          removeBackgroundColor(); // 删除背景颜色
        },
        below: () => {
          addBackgroundColor(); // 添加背景颜色
        }
      });

      // 初始化目录的样式
      function initCategory() {
        // 目录
        cssUtils.addStyle(category, ['position: sticky', `top: ${topDistance}px`, 'z-index: 40', 'user-select: none'])
        // 初始化目录中的菜单样式
        cssUtils.addStyle(nav, ['overflow-y: auto', 'border-radius: 0.25rem', 'user-select: none'])
        topPositionEventTrigger.position(topDistance) // 变更背景颜色
      }

      // 更新目录定位，事件触发的回调函数
      function updateCategoryPosition() {
        topDistance = distanceUtils.getTop(header, gap);
        topPositionEventTrigger.position(topDistance);
      }

      // 事件配置
      const categoryEventConfig = {
        load: { listener: updateCategoryPosition, options: { once: true } },
        resize: { listener: updateCategoryPosition },
        scroll: { listener: updateCategoryPosition },
      }

      initCategory();
      eventUtils.dispatchEvent(categoryEventConfig); // 分发事件
    }
  }
)();
