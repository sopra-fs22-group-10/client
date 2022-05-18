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
var user4 = {id:4, username:"Tim", authentication:"MNOP"};
var user5 = {id:5, username:"Lloyd", authentication:"QRST"};
export const userList = [user1, user2, user3];

const testCard = {
    "cardId": 51,
    "cardname": "Name",
    "image": "randomimage51",
    "cardstats": [
        {
            "statId": 57,
            "statvalue": "5",
            "statname": "StatName1",
            "stattype": "STARS",
            "valuestypes": null},
        {
            "statId": 58,
            "statvalue": "4",
            "statname": "StatName2",
            "stattype": "STARS",
            "valuestypes": null},
        {
            "statId": 59,
            "statvalue": "90",
            "statname": "StatName3",
            "stattype": "NUMBER",
            "valuestypes": "km/h"},
        {
            "statId": 510,
            "statvalue": "45",
            "statname": "StatName4",
            "stattype": "NUMBER",
            "valuestypes": null},
        {
            "statId": 511,
            "statvalue": "30",
            "statname": "StatName5",
            "stattype": "NUMBER",
            "valuestypes": null}]
}
let testCardVisible = {...testCard, "cardname":"Visible"};

var hand1 = [];
var hand2 = [];
var hand3 = [];
var hand4 = [];
var hand5 = [];

for (let id = 1; id<20; id++) {
    if (id<6){
        hand1.push({...testCard, "cardID":id});
    }
    if (id<4){
        hand2.push({...testCard, "cardID": id});
    }
    if (id<10){
        hand3.push({...testCard, "cardID": id});
    }
    if (id<2){
        hand4.push({...testCard, "cardID":id});
    }
    if (id<20){
        hand5.push({...testCard, "cardID":id});
    }
}

var playedCards1 = [];
var playedCards2 = [testCardVisible, testCardVisible];
var playedCards3 = [testCardVisible, testCardVisible, testCardVisible];
var playedCards4 = [];
var playedCards5 = [testCardVisible, testCardVisible, testCardVisible];

var player1 = {playerId:1, username:"Mattia", playerStatus: "ACTIVE", hand: hand1, playedCards:playedCards1};
var player2 = {playerId:2, username:"Yoli", playerStatus: "ACTIVE", hand: hand2, playedCards:playedCards2};
var player3 = {playerId:3, username:"Andy", playerStatus: "ACTIVE", hand: hand3, playedCards:playedCards3};
var player4 = {playerId:4, username:"Tim", playerStatus: "ACTIVE", hand: hand4, playedCards:playedCards4};
var player5 = {playerId:5, username:"Lloyd", playerStatus: "ACTIVE", hand: hand5, playedCards:playedCards5};
var player6 = {playerId:6, username:"Inactive", playerStatus: "INACTIVE", hand: hand5, playedCards:playedCards5};

const playerList = [player1, player2, player3, player4, player5, player6];
//selected opponent and stat, for win
//export const testSession = {playerList: playerList, currentPlayer: 2, opponentPlayer: 3,
    //currentStatName: "StatName4", roundStatus: "win", winner:null};
    export const testSession = {"currentPlayer":1,"opponentPlayer":null,"playerList":[{"playerId":1,"playerName":"user","playerStatus":"ACTIVE","hand":[{"cardId":13,"cardname":"Cardname53","image":"randomimage53","cardstats":[{"statId":10,"statvalue":"5","statname":"StatName1","stattype":"STARS","valuestypes":null},{"statId":11,"statvalue":"8","statname":"StatName2","stattype":"NUMBER","valuestypes":null},{"statId":12,"statvalue":"20","statname":"StatName3","stattype":"VALUE","valuestypes":"1"}]}],"playedCards":[]},{"playerId":19,"playerName":"user1","playerStatus":"ACTIVE","hand":[{"cardId":5,"cardname":"Cardname51","image":"randomimage51","cardstats":[{"statId":2,"statvalue":"5","statname":"StatName1","stattype":"STARS","valuestypes":null},{"statId":3,"statvalue":"10","statname":"StatName2","stattype":"NUMBER","valuestypes":null},{"statId":4,"statvalue":"100","statname":"StatName3","stattype":"VALUE","valuestypes":"1"}]}],"playedCards":[]}],"winner":null}


//selected opponent and stat, for loss
// export const testSession = {playerList: playerList, currentPlayer: 2, opponentPlayer: 3,
//     currentStatName: "StatName4", roundStatus: "lost", winner:null};
// //selected opponent and stat, for draw
// export const testSession = {playerList: playerList, currentPlayer: 2, opponentPlayer: 3,
//     currentStatName: "StatName4", roundStatus: "draw", winner:null};
// //neither opponent nor stat selected
// export const testSession = {playerList: playerList, currentPlayer: 2, opponentPlayer: null,
//     currentStatName: null, roundStatus: null, winner:null};
//selected opponent but not stat
// export const testSession = {playerList: playerList, currentPlayer: 2, opponentPlayer: 5,
//     currentStatName: null, roundStatus: "win", winner:null};


let testent = {"currentPlayer":1,"opponentPlayer":null,
    "playerList":[
        {"playerId":1,"playerName":"user","playerStatus":"ACTIVE",
            "hand":[{"cardId":13,"cardname":"Cardname53","image":"randomimage53","cardstats":[{"statId":10,"statvalue":"5","statname":"StatName1","stattype":"STARS","valuestypes":null},{"statId":11,"statvalue":"8","statname":"StatName2","stattype":"NUMBER","valuestypes":null},{"statId":12,"statvalue":"20","statname":"StatName3","stattype":"VALUE","valuestypes":"1"}]}],"playedCards":[]},
        {"playerId":19,"playerName":"user1","playerStatus":"ACTIVE",
            "hand":[{"cardId":5,"cardname":"Cardname51","image":"randomimage51","cardstats":[{"statId":2,"statvalue":"5","statname":"StatName1","stattype":"STARS","valuestypes":null},{"statId":3,"statvalue":"10","statname":"StatName2","stattype":"NUMBER","valuestypes":null},{"statId":4,"statvalue":"100","statname":"StatName3","stattype":"VALUE","valuestypes":"1"}]}],"playedCards":[]}
    ],
    "winner":null}