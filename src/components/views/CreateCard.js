import React, { Component } from 'react'
import Select from 'react-select'
import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import "styles/views/EditCard.scss";
import Stat from 'models/Stat';
import Card from 'models/Card';

const stars_options = [
    { value: 1, label: '1 star' },
    { value: 2, label: '2 stars' },
    { value: 3, label: '3 stars' },
    { value: 4, label: '4 stars' },
    { value: 5, label: '5 stars' }
  ]

const CreateCard = () => {
    const history = useHistory();

    const [stats, setStats] = useState([]);
    const [name, setName] = useState(undefined);
    const [pic, setPic] = useState('sth');
    const [newCards, setNewCards] = useState([]);
    const [oldName, setOldName] = useState(undefined);
    const [value1, setValue1] = useState(undefined);
    const [value2, setValue2] = useState(undefined);
    const [value3, setValue3] = useState(undefined);
    const [value4, setValue4] = useState(undefined);
    const [value5, setValue5] = useState(undefined);

    const valueDic = {1:[value1, setValue1],2:[value2, setValue2],3:[value3, setValue3],
        4:[value4, setValue4],5:[value5, setValue5]}

    const searchImage = () => {
        history.push(`/menu/searchImage`);
    }

    const confirm = async() => {
        const newCard = getCard();
        if(!localStorage.getItem('newStats')){
            const deckId = localStorage.getItem('deckId');
            var card = new Card(newCard);
            card.setCardId(null);
            console.log(card);
            const requestBody_createCard = JSON.stringify(card);
            const response_createCard = await api.post(`/decks/${deckId}/cards`, requestBody_createCard,{
                headers:{
                    'Authentication':localStorage.getItem("Authentication")
                }
            });
            localStorage.removeItem("selected pic");
            history.push(`/menu/deckOverview/`+deckId);
        }else{
            if(localStorage.getItem("editCard")){
                newCards.splice(getCardIndex(),1);
            }
            newCards.push(newCard);
            newCards.sort(function(a, b){return a.cardId - b.cardId}); 
    
            localStorage.setItem("newCards",JSON.stringify(newCards));
            localStorage.removeItem("selected pic");
            localStorage.removeItem('editCard');
            history.push(`/menu/createDeck`);
        }
    }

    function getCardIndex(){
        var editCard = JSON.parse(localStorage.getItem("editCard"));
        for(var i=0; i<newCards.length; i++){
            if(editCard.cardId == newCards[i].cardId){
                return i;
            }
        }
    }

    function cancel(){
        if(!localStorage.getItem('newStats')){
            const deckId = localStorage.getItem('deckId');
            history.push(`/menu/deckOverview/`+deckId);
        }else{
            localStorage.removeItem('editCard');
            history.push(`/menu/createDeck`);
        }
        localStorage.removeItem("selected pic");
    }

    function getStatIndex(stat){
        for(var i=0;i<5;i++){
            if(stats[i].statname==stat.statname){
                return i+1;
            }
        }
    }

    function getCard(){
        var cardname = name;
        var statCount = stats.length;
        var image = pic;
        var cardstats = [];
        var editCard = JSON.parse(localStorage.getItem('editCard'));
        if(editCard){
            var cardId = editCard.cardId;
        }else{
            var cardId = newCards.length+1;
        }
        for(var i=0; i<statCount; i++){
            var stat = stats[i];
            var statname = stat.statname;
            var stattype = stat.stattype;
            var valuestypes = stat.valuestypes;
            if(stattype=='STARS'){
                var statvalue = valueDic[getStatIndex(stat)][0].value;
            }else{
                var statvalue = valueDic[getStatIndex(stat)][0];
            }
            const newStat = new Stat({statname, stattype, valuestypes,statvalue});
            cardstats.push(newStat);
        }
        const newCard = new Card({cardId,cardname,image,cardstats});
        return newCard;
    }

    function getDefaultStar(stat){
        for(var i=0;i<5;i++){
            if(stars_options[i].value == stat.statvalue){
                return stars_options[i];
            }
        }
    }

    function disableConfirm(){
        var statCount = stats.length;
        var disabled = !name;
        for(var i=0; i<statCount; i++){
            var stat = stats[i];
            var content = valueDic[getStatIndex(stat)][0];
            disabled = disabled | !content;
        }
        return disabled;
    }

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
          try {
            var card =  JSON.parse(localStorage.getItem("editCard"));
            if(card){
                var statsList = card.cardstats;
                setOldName(card.cardname);
                setName(card.cardname);
                setPic(card.image);

                for(var i=0;i<statsList.length;i++){
                    if(statsList[i].stattype == 'STARS'){
                        var oldValue = getDefaultStar(statsList[i]);
                        valueDic[i+1][1](oldValue);
                    }else{
                        valueDic[i+1][1](statsList[i].statvalue);
                    }
                }
            }else{
                var statsList = JSON.parse(localStorage.getItem("newStats"));
                if(!statsList){
                    var deckId = localStorage.getItem('deckId');
                    let response = await api.get('/decks/'+deckId,{
                        headers:{
                          'Authentication':localStorage.getItem("Authentication")
                        }
                      });
                    var statsList = response.data.template.templatestats;
                }
            }
            setStats(statsList);

            var newCards =  JSON.parse(localStorage.getItem("newCards"));
            if(newCards){
                setNewCards(newCards);
            }

            var picture = localStorage.getItem("selected pic");
            if(picture){
                setPic(picture);
            }
    
            } catch (error) {
            console.error(`Something went wrong: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong! See the console for details.");
          }
        }
    
        fetchData();
      }, []);

    function blockContent(stat){
        if(stat.stattype == "STARS"){
            return(
                <Select 
                    defaultValue={getDefaultStar(stat)}
                    className="editCard-stat select"
                    options={stars_options} 
                    onChange={valueDic[getStatIndex(stat)][1]}
                />
            );
        }else if(stat.stattype == "VALUE"){
            return(
                <div className="editCard-stat unit-stat-wraper">
                    <input
                        className="editCard-stat input"
                        placeholder={stat.statvalue}
                        value= {valueDic[getStatIndex(stat)][0]}
                        onChange={e => valueDic[getStatIndex(stat)][1](e.target.value)}
                    />
                    <p className="editCard-stat unit">
                        {stat.valuestypes}
                    </p>
                </div>
            );
        }else{
            return(
                <input
                    className="editCard-stat input"
                    placeholder={stat.statvalue}
                    value= {valueDic[getStatIndex(stat)][0]}
                    onChange={e => valueDic[getStatIndex(stat)][1](e.target.value)}
                />
            );
        }
    } 

    function statBlock(stat){
        return(
        <div className="editCard-stat container">
            <p className="editCard-stat title">
                {stat.statname}
            </p>
            {blockContent(stat)}
        </div>
        );
    }   

    function imageBlock(){
        if(pic){
            if(pic.includes('http')){
                return(
                    <img className= "editCard image"
                        src={pic}
                        onClick = {() => searchImage()}
                    ></img>
                );
            }else{
                return(
                    <Button 
                        className="editCard search-image-button"
                        onClick={() => searchImage()}
                    >
                        <h2 className="editCard search-image-text">
                            + Add Image
                        </h2>
                    </Button> 
                );
            }
        }
    }

    let editCardView = (
        <div className="editCard container">
            <div className="editCard title-container">
                <p className="editCard title">
                    Card Name
                </p>
                <input
                    className="editCard title-input"
                    placeholder={oldName}
                    value= {name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            {imageBlock()}
            <ul className="editCard stats-list">
                {stats.map(stat => statBlock(stat))}
            </ul>
            <div className="editCard button-wraper">
                <div className="editCard button-container">
                    <Button
                        width="100%"
                        onClick={() => cancel()}
                    >
                        Cancel
                    </Button>
                </div>
                <div className="editCard button-container">
                    <Button
                        width="100%"
                        onClick={() => confirm()}
                        disabled={disableConfirm()}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );

    return(
        <div className="editCard wraper">{editCardView}</div>
    );
}

export default CreateCard;
