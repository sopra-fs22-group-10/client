/**
 * Card model
 */
class Card {
    constructor(data = {}) {
      this.cardId = data.cardId;
      this.cardname = data.cardname;
      this.image = data.image;
      this.cardstats = data.cardstats;
      Object.assign(this, data);
    }

    setCardId(newId){
      this.cardId = newId;
    }

    setCardName(newName){
      this.cardname = newName;
    }

    setCardStats(newStats){
      this.cardstats = newStats;
    }

    setImage(newImage){
      this.image = newImage;
    }
}
export default Card;