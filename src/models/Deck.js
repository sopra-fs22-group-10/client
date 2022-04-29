class Deck {
    constructor(data = {}) {
      this.deckId = data.deckId;
      this.deckname = data.deckname;
      this.deckstatus = data.deckstatus;
      this.deckacesscode = data.deckacesscode;
      this.template = data.template;
      this.creator = data.creator;
      Object.assign(this, data);
    }

    setCardname(newDeckname){
      this.deckname = newDeckname;
    }
  }
  export default Deck;