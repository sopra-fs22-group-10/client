class Stat {
    constructor(data = {}) {
      this.statId = null;
      this.statvalue = null;
      this.statname = null;
      this.stattype = null;
      this.valuestypes = null;
      Object.assign(this, data);
    }
  }
  export default Stat;