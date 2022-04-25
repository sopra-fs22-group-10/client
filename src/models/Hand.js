/**
 * Hand model
 */
class Hand {
    constructor(user) {
        this.owner = user;
        this.cardArray = [];
    }

    addCard(card){
        this.cardArray.push(card);
    }

    takeTop(){
        if (this.cardArray.length===0){
            throw new Error("No more cards in hand");
        }
        return this.cardArray.shift();
    }

    cardAmount(){
        return this.cardArray.length;
    }

    [Symbol.iterator]() {
        var pos = 0;
        return {
            next: () => {
                if (this.cardArray.length===pos) return { done: true };
                pos += 1;
                return {
                    done: false,
                    value: {card: this.cardArray[pos-1], pos: pos-1}
                };
            }
        };
    }
}
export default Hand;