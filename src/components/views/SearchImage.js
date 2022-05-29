import React, { Component } from 'react'
import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import "styles/views/SearchImage.scss";
import { createApi } from 'unsplash-js';

const SearchImage = () => {
    const history = useHistory();

    const [query, setQuery] = useState();
    const [pics, setPics] = useState([]);
    const [pageNum, setPageNum] = useState(1);

    const serverApi = createApi({
        accessKey: 'cDj0bEALNx0aEDFaPKng5gUi3MsGABs86s2HtZwQ6MU',
    });
    
    const search = async (num) => {
        // e.preventDefault(); // stop the page from reloading whenever the Search button is clicked
        setPageNum(num);
        console.log(pageNum);
        serverApi.search.getPhotos({
            query: query,
            page: pageNum,
            perPage: 15,
        }).then(result => {
            if (result.errors) {
              // handle error here
              console.log('error occurred: ', result.errors[0]);
            } else {
              const feed = result.response;
          
              // extract total and results array from response
              const { total, results } = feed;
          
              // handle success here
              console.log(`received ${results.length} photos out of ${total}`);
              console.log('first photo: ', results[0]);
              console.log(results);
              setPics(results);
            }
        });
        console.log("Submitting")
    };

    function cancel(){
        if(localStorage.getItem("isEdit")){
            var ids = localStorage.getItem("isEdit");
            history.push(`/menu/editCard/`+ids);
        }else if(localStorage.getItem("isEditDeck")){
            var deckId = localStorage.getItem("isEditDeck");
            history.push(`/menu/deckOverview/${deckId}`);
        }else if(localStorage.getItem("isCreateDeck")){
            history.push(`/menu/createDeck`);
        }else{
            history.push(`/menu/createCard`);
        }
    }

    function selectPic(pic){
        localStorage.setItem("selected pic",pic.urls.full);
        if(localStorage.getItem("isEdit")){
            var ids = localStorage.getItem("isEdit");
            history.push(`/menu/editCard/`+ids);
        }else if(localStorage.getItem("isEditDeck")){
            var deckId = localStorage.getItem("isEditDeck");
            history.push(`/menu/deckOverview/${deckId}`);
        }else if(localStorage.getItem("isCreateDeck")){
            history.push(`/menu/createDeck`);
        }else{
            history.push(`/menu/createCard`);
        }
    }

    function picsList(){
        if(JSON.stringify(pics) != "[]"){
            return(
                <ul className="searchImage pics-list">
                    {pics.map((pic) => 
                        <div className="searchImage image">
                            <img
                                src={pic.urls.full}
                                height={300}
                                onClick = {() => selectPic(pic)}
                            ></img>
                        </div>)
                    }
                </ul> 
            );
        }
    }

    return(
        <div className="searchImage container">
            <div className="searchImage search-field-container">
                <label className="searchImage label"> 
                    {" "}
                    🔎
                </label>
                <input
                    className="searchImage input"
                    placeholder="Input keyword..."
                    value= {query}
                    onChange={e => setQuery(e.target.value)}
                />
                <Button
                    className="searchImage search-button"
                    disabled = {!query}
                    onClick={() => search(1)}
                >
                    search
                </Button>
                <Button
                    className="searchImage cancel-button"
                    onClick={() => cancel()}
                >
                    cancel
                </Button>
            </div>
            {picsList()}
            <div className="searchImage buttons-container">
                <Button
                    className="searchImage previous-button"
                    disabled = {!query | JSON.stringify(pics) == "[]" | pageNum == 1}
                    onClick={() => search(pageNum-1)}
                >
                    previous page
                </Button>
                <Button
                    className="searchImage next-button"
                    disabled = {!query | JSON.stringify(pics) == "[]"}
                    onClick={() => search(pageNum+1)}
                >
                    next page
                </Button>  
            </div>
        </div>
    );
}

export default SearchImage;
