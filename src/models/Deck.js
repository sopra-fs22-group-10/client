class Deck {
    constructor(data = {}) {
      this.deckId = data.deckId;
      this.deckname = data.deckname;
      this.deckstatus = data.deckstatus;
      this.deckacesscode = data.deckacesscode;
      this.template = data.template;
      this.deckImage = data.deckImage;
      this.creator = data.creator;
      Object.assign(this, data);
    }
  
    setDeckname(newDeckname){
      this.deckname = newDeckname;
    }

    setStatus(newStatus){
      this.deckstatus = newStatus;
    }

    setDeckImage(newImage){
      this.deckImage = newImage;
    }
  }
  export default Deck;