import React, { Component } from 'react'
import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import "styles/views/ViewCard.scss";

const ViewCard = () => {
    const history = useHistory();

    const [stats, setStats] = useState([]);
    const [name, setName] = useState(undefined);
    const [pic, setPic] = useState(undefined);

    const url = window.location.href;
    const urlSplit = url.split('/');
    const deckId = urlSplit[urlSplit.length-2];
    const cardId = urlSplit[urlSplit.length-1];

    function back(){
        history.push(`/menu/viewDeck/${deckId}`);
    }

    function getCurrentCard(cardList){
        for(var i=0;i<cardList.length;i++){
            if(cardList[i].cardId == cardId){
                setStats(cardList[i].cardstats);
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
            var stars = "";
            for(var i=0;i<stat.statvalue;i++){
                stars = stars+"⭐";
            }
            return(
                <p>{stars}</p>
            );
        }else if(stat.stattype == "VALUE"){
            return(
                <p className="viewCard-stat value">
                    {stat.statvalue}&ensp;{stat.valuestypes}
                </p>
            );
        }else{
            return(
                <p className="viewCard-stat value">
                    {stat.statvalue}
                </p>
            );
        }
    } 

    function statBlock(stat){
        return(
        <div className="viewCard-stat container">
            <p className="viewCard-stat title">
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
                    <img className= "viewCard image"
                        src={pic}
                    ></img>
                );
            }else{
                return(
                    <div className= "viewCard image"></div> 
                );
            }
        }
    }

    let CardView = (
        <div className="viewCard container">
            <p className="viewCard title">
                {name}
            </p>
            {imageBlock()}
            <ul className="viewCard stats-list">
                {stats.map(stat => statBlock(stat))}
            </ul>
            <div className="viewCard button-wraper">
                <div className="viewCard button-container">
                    <Button
                        width="100%"
                        onClick={() => back()}
                    >
                        Back to Deck View
                    </Button>
                </div>
            </div>
        </div>
    );

    return(
        <div className="viewCard wraper">{CardView}</div>
    );
}

export default ViewCard;