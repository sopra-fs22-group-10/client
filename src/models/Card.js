/**
 * Card model
 */
 class Card {
    constructor(data = {}) {
      this.id = data.id;
      this.cardname = data.cardname;
    }
  
    setCardname(newCardname){
      this.cardname = newCardname;
    }
  }
  export default Card;
  