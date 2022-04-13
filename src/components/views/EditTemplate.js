import React, { memo } from 'react'
import Select from 'react-select'
import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import "styles/views/EditTemplate.scss";
import {statsList} from'models/TestEntities';

const type_options = [
    { value: 'stars', label: '1-5 Stars' },
    { value: 'number', label: 'Number' },
    { value: 'unit', label: 'Number & Unit' }
  ]

function EditTemplate(){
    const history = useHistory();

    const [stats, setStats] = useState(statsList);
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

    const confirm = () => {
    }

    const cancel = () => {
        history.push('/game/deckOverview')
    }

    const addStats = () => {
    }

    function getDefaultType(stat){
        for(var i=0;i<3;i++){
            if(type_options[i].value == stat.type){
                return type_options[i];
            }
        }
    }

    function statBlock(stat){
        return(
            <div className="edit-template-stat container">
                <div className="edit-template-stat name">
                    <input
                        className="edit-template-stat input"
                        placeholder={stat.statname}
                        value= {statNameDic[stat.id][0]}
                        onChange={e => statNameDic[stat.id][1](e.target.value)}
                    />
                </div>
                <div className="edit-template-stat value">
                    <Select 
                        defaultValue={getDefaultType(stat)}
                        className="edit-template-stat select"
                        options={type_options} 
                        onChange={valueDic[stat.id][1]}
                    />
                </div>
            </div>
        );
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