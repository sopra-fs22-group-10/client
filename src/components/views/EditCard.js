import React, { Component } from 'react'
import Select from 'react-select'
import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import "styles/views/EditCard.scss";
import {statsList,card} from'models/TestEntities';

const stars_options = [
    { value: 1, label: '1 star' },
    { value: 2, label: '2 stars' },
    { value: 3, label: '3 stars' },
    { value: 4, label: '4 stars' },
    { value: 5, label: '5 stars' }
  ]

const EditCard = () => {
    const history = useHistory();

    const [stats, setStats] = useState(statsList);
    const [title, setTitle] = useState(undefined);
    const [statName1, setStatName1] = useState(undefined);
    const [statName2, setStatName2] = useState(undefined);
    const [statName3, setStatName3] = useState(undefined);
    const [statName4, setStatName4] = useState(undefined);
    const [statName5, setStatName5] = useState(undefined);
    const [statName6, setStatName6] = useState(undefined);
    const [value1, setValue1] = useState(undefined);
    const [value2, setValue2] = useState(undefined);
    const [value3, setValue3] = useState(undefined);
    const [value4, setValue4] = useState(undefined);
    const [value5, setValue5] = useState(undefined);
    const [value6, setValue6] = useState(undefined);

    const statNameDic = {1:[statName1, setStatName1],2:[statName2, setStatName2],
        3:[statName3, setStatName3],4:[statName4, setStatName4],
        5:[statName5, setStatName5],6:[statName6, setStatName6]}
    const valueDic = {1:[value1, setValue1],2:[value2, setValue2],3:[value3, setValue3],
        4:[value4, setValue4],5:[value5, setValue5],6:[value6, setValue6]}

    function confirm(){
    }

    function cancel(){
        history.push('/menu/deckOverview');
    }

    function addStats(){
    }

    function getDefaultStar(stat){
        for(var i=0;i<5;i++){
            if(stars_options[i].value == stat.value){
                return stars_options[i];
            }
        }
    }

    function blockContent(stat){
        if(stat.type == "stars"){
            return(
                <Select 
                    defaultValue={getDefaultStar(stat)}
                    className="editCard-stat select"
                    options={stars_options} 
                    onChange={valueDic[stat.id][1]}
                />
            );
        }else if(stat.type == "unit"){
            return(
                <div className="editCard-stat unit-stat-wraper">
                    <input
                        className="editCard-stat input"
                        placeholder={stat.value}
                        value= {statNameDic[stat.id][0]}
                        onChange={e => statNameDic[stat.id][1](e.target.value)}
                    />
                    <p className="editCard-stat unit">
                        {stat.unit}
                    </p>
                </div>
            );
        }else{
            return(
                <input
                    className="editCard-stat input"
                    placeholder={stat.value}
                    value= {statNameDic[stat.id][0]}
                    onChange={e => statNameDic[stat.id][1](e.target.value)}
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

    let editCardView = (
        <div className="editCard container">
            <div className="editCard title-container">
                <p className="editCard title">
                    Card Name
                </p>
                <input
                    className="editCard title-input"
                    placeholder={card.cardname}
                    value= {title}
                    onChange={e => setTitle(e.target.value)}
                />
            </div>
            <div className="editCard image-container">
            </div>
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