const cssUtils = {
  /** 为元素添加style */
  addStyle(element, styleConfig) {
    if (typeof styleConfig === 'string') {
      const config = styleConfig.split(':');
      const [value, priority] = config[config.length - 1].split('!');
      this.addStyle(element, { propertyName: config[0], value, priority });
    }
    if (Array.isArray(styleConfig)) styleConfig.forEach(config => this.addStyle(element, config))
    const { propertyName, value = '', priority = '' } = styleConfig
    element.style.setProperty(propertyName, value, priority);
  }
}