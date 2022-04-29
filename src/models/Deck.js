class Deck {
    constructor(data = {}) {
      this.deckId = data.deckId;
      this.deckname = data.deckname;
      this.creator = data.creator;
    }

    setCardname(newDeckname){
      this.deckname = newDeckname;
    }
  }
  export default Deck;