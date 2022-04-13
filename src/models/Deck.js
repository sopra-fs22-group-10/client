class Deck {
    constructor(data = {}) {
      this.id = data.id;
      this.deckname = data.deckname;
      this.creator = data.creator;
    }
  
    setCardname(newDeckname){
      this.deckname = newDeckname;
    }
  }
  export default Deck;