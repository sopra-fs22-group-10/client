import Hand from "./Hand";

var deck1 ={id:1,deckname:"Heartstone",creator:"Andreas"};
var deck2 ={id:2,deckname:"Witcher 3: Gwent",creator:"Lloyd"};
var deck3 ={id:3,deckname:"Star Trek",creator:"Mattia"};
var deck4 ={id:4,deckname:"Vampire: the Masquerade",creator:"Tim"};
var deck5 ={id:5,deckname:"Onmyoji: Shikigami",creator:"Yoli"};

export const deckList = [deck1,deck2,deck3,deck4,deck5];

var card1 ={id:1,cardname:"LAFERRARI"};
var card2 ={id:2,cardname:"BAC MONO"};
var card3 ={id:3,cardname:"PAGANI HUYRA"};

export const cardsList = [card1,card2,card3];

export const card ={id:1,cardname:"PAGANI HUYRA"};

export const deck ={id:1,deckname:"Onmyoji: Shikigami",creator:"Yoli",visability:"Private",fairness:"off",statsNum:4};

var stat1 = {id:1,statname:"Style",type:"stars",value:2};
var stat2 = {id:2,statname:"Innovation",type:"stars",value:5};
var stat3 = {id:3,statname:"Cylinder",type:"number",value:2.3};
var stat4 = {id:4,statname:"Speed",type:"unit",value:170,unit:"km/h"};

export const statsList = [stat1,stat2,stat3,stat4];

var user1 = {id:1, username:"Mattia", authentication:"ABCD"};
var user2 = {id:2, username:"Yoli", authentication:"EFGH"};
var user3 = {id:3, username:"Andy", authentication:"IJKL"};
export const userList = [user1, user2, user3];

var hand1 = new Hand(user1);
var hand2 = new Hand(user2);
var hand3 = new Hand(user3);
for (const card of cardsList) {
    hand1.addCard(card);
    hand1.addCard(card);
    hand2.addCard(card);
    hand2.addCard(card);
    hand2.addCard(card);
    hand3.addCard(card);
}
export const handList = [hand1, hand2, hand3, hand1];