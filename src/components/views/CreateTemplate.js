import React, { memo } from 'react'
import Select from 'react-select'
import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import "styles/views/EditTemplate.scss";
import Stat from 'models/Stat';

const type_options = [
    { value: 'STARS', label: '1-5 Stars' },
    { value: 'NUMBER', label: 'Number' },
    { value: 'VALUE', label: 'Value' }
  ]

function CreateTemplate(){
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

    const newStatsList = JSON.parse(localStorage.getItem('newStats'));

    const confirm = async() => {
        const newStats = getStats();
        localStorage.setItem("newStats",JSON.stringify(newStats));
        history.push(`/menu/createDeck`);
    }

    const cancel = () => {
        history.push(`/menu/createDeck`);
    }

    function getDefaultType(stat){
        if(stat){
            for(var i=0;i<3;i++){
                if(type_options[i].value == stat.stattype){
                    return type_options[i];
                }
            }
        }
    }

    function displayValueInput(index){
        if(valueDic[index][0]==undefined){
            return false;
        }else if(valueDic[index][0].value=="VALUE"){
            return true;
        }
        return false;
    }

    function statname(stat){
        if(stat){
            return(stat.statname);
        }
        return "";
    }

    function valueinput(stat){
        if(stat){
            return(stat.valuestypes);
        }
        return "";
    }

    function getStats(){
        const newStats = [];
        for(var key=1;key<6;key++){
            if(statNameDic[key][0]!=undefined & valueDic[key][0]!=undefined){
                var statname = statNameDic[key][0];
                var stattype = valueDic[key][0].value;
                var valuestypes = null;
                if(stattype == 'VALUE'){
                    valuestypes = statNameDic[key+5][0];
                }
                const newStat = new Stat({statname, stattype, valuestypes});
                newStats.push(newStat);
            }
        }
        return newStats;
    }

    useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                var newStats = localStorage.getItem('newStats');
                if(newStats){
                    var templatestats = JSON.parse(newStats);
                    for(var i=0;i<templatestats.length;i++){
                        statNameDic[i+1][1](templatestats[i].statname);
                        valueDic[i+1][1](getDefaultType(templatestats[i]));
                        if(templatestats[i].stattype == 'VALUE'){
                            statNameDic[i+6][1](templatestats[i].valuestypes);
                        }else if(templatestats[i].stattype == 'STARS'){
                            statNameDic[i+6][1](getDefaultType(stats[i]));
                        }
                    }
                }

                } catch (error) {
                console.error(`Something went wrong: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong! See the console for details.");
            }
        }

        fetchData();
    }, []);

    function statBlock(index){
        var stat = null
        if(newStatsList){
            var stat = newStatsList[index-1];
        }
        const name_select = (
            <div className="edit-template-stat container">
                <div className="edit-template-stat name">
                    <input
                        placeholder={statname(stat)}
                        className="edit-template-stat input"
                        value= {statNameDic[index][0]}
                        onChange={e => statNameDic[index][1](e.target.value)}
                    />
                </div>
                <div className="edit-template-stat value">
                    <Select 
                        defaultValue={getDefaultType(stat)}
                        className="edit-template-stat select"
                        options={type_options} 
                        onChange={valueDic[index][1]}
                    />
                </div>
            </div>
        );
        const valueInput = (
            <input
                placeholder={valueinput(stat)}
                className="edit-template-stat value-input"
                value= {statNameDic[index+5][0]}
                onChange={e => statNameDic[index+5][1](e.target.value)}
            />
        );

        if(displayValueInput(index)){
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
                Stats
            </div>
            <ul className="editTemplate stats-list">
                {statBlock(1)}
                {statBlock(2)}
                {statBlock(3)}
                {statBlock(4)}
                {statBlock(5)}
            </ul>
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
                        disabled={getStats().length==0}
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

export default memo(CreateTemplate);