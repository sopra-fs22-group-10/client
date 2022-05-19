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

const EditCard = () => {
    const history = useHistory();

    const [stats, setStats] = useState([]);
    const [name, setName] = useState(undefined);
    const [pic, setPic] = useState(undefined);
    const [oldName, setOldName] = useState(undefined);
    const [value1, setValue1] = useState(undefined);
    const [value2, setValue2] = useState(undefined);
    const [value3, setValue3] = useState(undefined);
    const [value4, setValue4] = useState(undefined);
    const [value5, setValue5] = useState(undefined);

    const valueDic = {1:[value1, setValue1],2:[value2, setValue2],3:[value3, setValue3],
        4:[value4, setValue4],5:[value5, setValue5]}

    const url = window.location.href;
    const urlSplit = url.split('/');
    const deckId = urlSplit[urlSplit.length-2];
    const cardId = urlSplit[urlSplit.length-1];

    const searchImage = () => {
        localStorage.setItem("isEdit",deckId+"/"+cardId);
        history.push(`/menu/searchImage`);
    }

    async function confirm(){
        var newCard = getCard();
        console.log(newCard);
        let response = await api.put('/decks/'+deckId+'/cards/'+cardId,newCard,{
            headers:{
            'Authentication':localStorage.getItem("Authentication")
            }
        });
        localStorage.removeItem("selected pic");
        history.push(`/menu/deckOverview/${deckId}`);
    }

    function cancel(){
        localStorage.removeItem("selected pic");
        history.push(`/menu/deckOverview/${deckId}`);
    }

    function addStats(){
    }

    function getCard(){
        const card = new Card();
        card.setCardId(cardId);
        card.setCardName(name);
        card.setImage(pic);

        var statCount = stats.length;
        var cardstats = [];
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
        card.setCardStats(cardstats);

        return card;
    }

    function getStatIndex(stat){
        for(var i=0;i<5;i++){
            if(stats[i].statname==stat.statname){
                return i+1;
            }
        }
    }

    function getDefaultStar(stat){
        for(var i=0;i<5;i++){
            if(stars_options[i].value == stat.statvalue){
                return stars_options[i];
            }
        }
    }

    function getCurrentCard(cardList){
        for(var i=0;i<cardList.length;i++){
            if(cardList[i].cardId == cardId){
                setStats(cardList[i].cardstats);
                setOldName(cardList[i].cardname);
                setName(cardList[i].cardname);

                var card = cardList[i];
            }
        }   
        return card;  
    }

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
          try {
            let response = await api.get('/decks/'+deckId,{
                headers:{
                  'Authentication':localStorage.getItem("Authentication")
                }
              });
            var cardList = response.data.cardList;
            var currentCard = getCurrentCard(cardList);

            setPic(currentCard.image);

            var cardstats = currentCard.cardstats;
            for(var i=0;i<cardstats.length;i++){
                if(cardstats[i].stattype == 'STARS'){
                    var oldValue = getDefaultStar(cardstats[i]);
                    console.log(oldValue);
                    valueDic[i+1][1](oldValue);
                }else{
                    valueDic[i+1][1](cardstats[i].statvalue);
                }
            }     
    
            var picture = localStorage.getItem("selected pic");
            localStorage.removeItem("isEdit");
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

export default EditCard;
