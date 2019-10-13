import React, { Component } from 'react';
class HeaderResult extends Component {
    constructor(props) {
        super(props)
        this.state={
            addedToFav : false
        }
    }
    addToFavorites = async (key, name) => {
        let obj = {cityName : name , cityKey : key}
        console.log(obj)
        let favorites = localStorage.getItem('favorites') ? JSON.parse(localStorage.getItem('favorites')) : []
        await favorites.push(obj)
        console.log(favorites)
        localStorage.setItem('favorites', JSON.stringify(favorites))
        await this.setState( { addedToFav : true } )
    }
    removeFromFavorites =async (key)=>{
        let favorites = JSON.parse(localStorage.getItem('favorites'))
        for(let i=0; i<favorites.length;i++){
            let fav=favorites[i]
            if(fav.cityKey == key){
                favorites.splice(i, 1)
            }
        }
        favorites=JSON.stringify(favorites)
        localStorage.setItem('favorites', favorites)
        await this.setState( { addedToFav : false } )
    }
    render() {
        let cityName = this.props.cityName
        let cityKey = this.props.cityKey
        return (
            <div class="tableHeaders">
                <div class="locationName"> {cityName} ,{this.props.countryName}</div>
                {!this.state.addedToFav ? 
                <button class="favorite" onClick={() => this.addToFavorites(cityKey,cityName)}> <i class="fa fa-bookmark"></i> </button> :

                <button class="delete" onClick={() => this.removeFromFavorites(cityKey)}><i class="fa fa-trash"></i> </button>
                }
            </div>
        )
    }
}
export default HeaderResult;