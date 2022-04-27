class Template {
    constructor(data = {}) {
      this.templateId = null;
      this.statcount = null;
      this.templatestats = null;
      Object.assign(this, data);
    }
  }
  export default Template;