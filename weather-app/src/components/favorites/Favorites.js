import React, { Component } from 'react';
import PopUp from './PopUp'
import iconsData from '../main/IconsData'
const request = require('request-promise')
const ApiKey = 'sRf6W9AUW0u6DFJQ2zVkLhQb3g78OHaS'

class Favorites extends Component {
    constructor() {
        super()
        this.showFullForecast = this.showFullForecast.bind(this);
        this.removeFromFavorites = this.removeFromFavorites.bind(this);
        this.state = {
            FavoritesData: [],
            popUp : false,
            cityKey : null,
            DegOption : true,
            classC : 'C',
            classF : 'F'
        }
    }
    componentDidMount = () => {
        this.checkForLocalStorage()
    }
    checkForLocalStorage = () => {
        let FavoritesArray
        if (localStorage.getItem('favorites')) {
            FavoritesArray = JSON.parse(localStorage.getItem('favorites'))
        } else {
            FavoritesArray = []
        }
        console.log(FavoritesArray)
        this.checkForDuplicates(FavoritesArray)
    }
    checkForDuplicates = (array) => {
        for(let i = 0 ; i < array.length ; i ++){

            for(let j = i+1 ; j < array.length ; j ++ ){
                if(array[i].cityKey == array[j].cityKey){
                   array.splice(j,1)
                }
            }
        }
        let favorites=JSON.stringify(array)
        localStorage.setItem('favorites', favorites)
        this.getFavoritesData(array)
    }
    getFavoritesData = async (array) => {

        let response, FavoritesData = []
        for (let pair of array) {
            response = await request.get(`http://dataservice.accuweather.com/currentconditions/v1/${pair.cityKey}?apikey=${ApiKey}`)
            response = JSON.parse(response)[0]
            FavoritesData.push({cityName : pair.cityName, cityKey : pair.cityKey, res : response})
        }

        this.setState({ FavoritesData: FavoritesData })
    }
    showFullForecast = (key) => {
        if(!this.state.popUp){
        this.setState( { cityKey : key, popUp : true } )
        }
    }
    closePopUp = () => {
        this.setState( { cityKey : null, popUp : false } )
    }
    removeFromFavorites =async (key)=>{
        let favorites = JSON.parse(localStorage.getItem('favorites'))
        for(let i=0; i<favorites.length;i++){
            let fav=favorites[i]
            if(fav.cityKey == key){
                favorites.splice(i, 1)
            }
        }
        this.getFavoritesData(favorites)
        favorites=JSON.stringify(favorites)
        localStorage.setItem('favorites', favorites)
    }
    handleTemperture = (e) => {
        let value = e.target.value;
        if (value === 'C') {
            this.setState({ DegOption: false })
        }
        else {
            this.setState({ DegOption: true })
        }
    }
    render() {
        return (
            <div>
                <div class="degrees">
                    {this.state.DegOption ? 
                        <div><button class="C" value="C" onClick={this.handleTemperture}>C</button> / <button class="putAnUnderline" value="F" onClick={this.handleTemperture}>F</button> </div>:
                    <div><button class="putAnUnderline" value="C" onClick={this.handleTemperture}>C</button> / <button class="F" value="F" onClick={this.handleTemperture}>F</button> </div> }                    

                </div>
                {this.state.FavoritesData ? 
                <div class="FavoritesContainer">
                {this.state.FavoritesData.map(d =>
                    <div>
                    <div  class="FavoritesData" onClick={() => this.showFullForecast(d.cityKey)} >
                        <div class="FavCity"> {d.cityName} </div>
                        <img class="FavPic" src={`${ iconsData[d.res.WeatherText]}`} />
                        <div class="FavPhrase"> {d.res.WeatherText} </div>
                        {this.state.DegOption ? 
                            <div class="FavTemp">
                                {d.res.Temperature.Imperial.Value}
                            </div> :                         
                            <div class="FavTemp" >
                                {Math.floor((parseInt(d.res.Temperature.Imperial.Value)-32)/1.8)} 
                            </div> } 
                </div>
                        <div><button class="FavRemove" onClick={() => this.removeFromFavorites(d.cityKey)}><i class="fa fa-trash"></i> </button> </div>
                   </div> 
                )
                } </div>
                :null}
            
                {this.state.popUp ? <div> <PopUp cityKey={this.state.cityKey} closePopUp={this.closePopUp} /> </div> : null }
            </div>

        )
    }
}

export default Favorites;