import React, { memo } from 'react'
import Select from 'react-select'
import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import "styles/views/EditTemplate.scss";

const type_options = [
    { value: 'STARS', label: '1-5 Stars' },
    { value: 'NUMBER', label: 'Number' },
    { value: 'VALUE', label: 'Value' }
  ]

function EditTemplate(){
    const history = useHistory();

    const [stats, setStats] = useState([]);
    const [statName1, setStatName1] = useState(undefined);
    const [statName2, setStatName2] = useState(undefined);
    const [statName3, setStatName3] = useState(undefined);
    const [statName4, setStatName4] = useState(undefined);
    const [statName5, setStatName5] = useState(undefined);
    const [statName6, setStatName6] = useState(undefined);
    const [statName7, setStatName7] = useState(undefined);
    const [statName8, setStatName8] = useState(undefined);
    const [statName9, setStatName9] = useState(undefined);
    const [statName10, setStatName10] = useState(undefined);
    const [value1, setValue1] = useState(undefined);
    const [value2, setValue2] = useState(undefined);
    const [value3, setValue3] = useState(undefined);
    const [value4, setValue4] = useState(undefined);
    const [value5, setValue5] = useState(undefined);


    const statNameDic = {1:[statName1, setStatName1],2:[statName2, setStatName2],
        3:[statName3, setStatName3],4:[statName4, setStatName4],
        5:[statName5, setStatName5],6:[statName6, setStatName6],
        7:[statName7, setStatName7],8:[statName8, setStatName8],
        9:[statName9, setStatName9],10:[statName10, setStatName10]}
    const valueDic = {1:[value1, setValue1],2:[value2, setValue2],3:[value3, setValue3],
        4:[value4, setValue4],5:[value5, setValue5]}

    // the maximum number of stats allowed is 5

    const url = window.location.href;
    const deckId = url.substring(url.lastIndexOf('/')+1,url.length);

    const confirm = () => {
    }

    const cancel = () => {
        history.push(`/menu/deckOverview/${deckId}`);
    }

    const addStats = () => {
    }

    function getDefaultType(stat){
        for(var i=0;i<3;i++){
            if(type_options[i].value == stat.stattype){
                return type_options[i];
            }
        }
    }

    function getStatIndex(stat){
        for(var i=0;i<5;i++){
            if(stats[i].statname==stat.statname){
                return i+1;
            }
        }
    }

    function displayValueInput(stat){
        if(valueDic[getStatIndex(stat)][0]==undefined){
            if(stat.stattype=="VALUE"){
                return true;
            }
        }else if(valueDic[getStatIndex(stat)][0].value=="VALUE"){
            return true;
        }
        return false;
    }

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
          try {
            let response = response = await api.get('/decks/'+deckId);
    
            // Get the returned users and update the state.
            let templatestats = response.data.template.templatestats;
            setStats(templatestats);
    
            // See here to get more data.
            console.log(response.data);
            } catch (error) {
            console.error(`Something went wrong: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong! See the console for details.");
          }
        }
    
        fetchData();
      }, []);

    function statBlock(stat){
        const name_select = (
            <div className="edit-template-stat container">
                <div className="edit-template-stat name">
                    <input
                        className="edit-template-stat input"
                        placeholder={stat.statname}
                        value= {statNameDic[getStatIndex(stat)][0]}
                        onChange={e => statNameDic[getStatIndex(stat)][1](e.target.value)}
                    />
                </div>
                <div className="edit-template-stat value">
                    <Select 
                        defaultValue={getDefaultType(stat)}
                        className="edit-template-stat select"
                        options={type_options} 
                        onChange={valueDic[getStatIndex(stat)][1]}
                    />
                </div>
            </div>
        );
        const valueInput = (
            <input
                className="edit-template-stat value-input"
                placeholder={stat.valuestypes}
                value= {statNameDic[2*getStatIndex(stat)][0]}
                onChange={e => statNameDic[2*getStatIndex(stat)][1](e.target.value)}
            />
        );

        if(displayValueInput(stat)){
            return(
                <div>
                    {name_select}
                    <div className="edit-template-stat value-input-text">
                        Input unit of value:
                        {valueInput}
                    </div>
                </div>
            );
        }else{
            return(
                <div>{name_select}</div>
            );
        }
    }   

    let editTemplateView = (
        <div className="editTemplate container">
            <div className="editTemplate title-container">
                Themes
            </div>
            <div className="editTemplate themes-container">
                <div className="editTemplate theme"></div>
                <div className="editTemplate theme"></div>
                <div className="editTemplate theme"></div>
            </div>
            <div className="editTemplate title-container">
                Stats
            </div>
            <ul className="editTemplate stats-list">
                {stats.map(stat => statBlock(stat))}
            </ul>
            <div className="editTemplate addStats-button-container">
                <Button
                width="100%"
                onClick={() => addStats()}
                >
                    Add Stats
                </Button>
            </div>
            <div className="editTemplate button-wraper">
                <div className="editTemplate button-container">
                    <Button
                        width="100%"
                        onClick={() => cancel()}
                    >
                        Cancel
                    </Button>
                </div>
                <div className="editTemplate button-container">
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
        <div className="editTemplate wraper">{editTemplateView}</div>
    );
}

export default memo(EditTemplate);