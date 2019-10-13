import React, { Component } from 'react';
import HeaderResult from './HeaderResult';
import ForecastResult from './ForecastResult';
import iconsData from './IconsData'
const request = require('request-promise')
const ApiKey = 'sRf6W9AUW0u6DFJQ2zVkLhQb3g78OHaS'

class SearchBar extends Component {
    constructor() {
        super()
        this.state = {
            cityName: '',
            cityOptions: [],
            selectedCity: null,
            flag: false,
            DegOption: true,
            TelAviv: null
        }
    }
    componentWillMount = () => {
        this.defaultTelAvivCurrentWeather()
    }
    handleChanges = async (e) => {
        let city = e.target.value
        await this.setState({ cityName: city })
    }
    getCityKey = async () => {
        this.setState({ flag: false, cityOptions: [], selectedCity: null })
        let city = this.state.cityName
        console.log(city)
        let response = await request.get(`http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${ApiKey}&q=${city}`)
        response = JSON.parse(response)
        let i = 0
        let len = Math.min(5, response.length)
        while (i < len) {
            this.state.cityOptions.push({
                number: i,
                cityName: response[i].LocalizedName,
                countryName: response[i].Country.LocalizedName,
                cityKey: response[i].Key
            })
            i++
        }
        if (this.state.cityOptions.length === 1) {
            console.log(this.state.cityOptions[0])
            await this.setState({ selectedCity: this.state.cityOptions[0] })
        }
        this.setState({ flag: true })
    }
    citySelected = async (e) => {
        let number = e.target.value
        let selectedCity = this.state.cityOptions[number]
        await this.setState({ selectedCity })
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
    defaultTelAvivCurrentWeather = async () => {
        let response = await request.get(`http://dataservice.accuweather.com/currentconditions/v1/215854?apikey=${ApiKey}`)
        response = await JSON.parse(response)[0]
        this.setState({ TelAviv: response })
    }
    render() {
        return (
            <div>
                <div class="degrees">
                    {this.state.DegOption ?
                        <div><button class="C" value="C" onClick={this.handleTemperture}>C</button> / <button class="putAnUnderline" value="F" onClick={this.handleTemperture}>F</button> </div> :
                        <div><button class="putAnUnderline" value="C" onClick={this.handleTemperture}>C</button> / <button class="F" value="F" onClick={this.handleTemperture}>F</button> </div>}                 </div>
                {this.state.TelAviv ?
                    <div class="telAviv">
                        <div class="Tname">Tel-Aviv</div>
                        <div class="Tphrase"> {this.state.TelAviv.WeatherText} </div>
                        <div class="Ticon"><img src={`${iconsData[this.state.TelAviv.WeatherText]}`} /></div>
                        {this.state.DegOption ?
                            <div class="Tdegrees">{this.state.TelAviv.Temperature.Imperial.Value}</div> :
                            <div class="Tdegrees">{this.state.TelAviv.Temperature.Metric.Value}</div>}

                    </div> : null}

                <div class="searchBar">
                    <input class="searchInput" placeholder="Search by city name" value={this.state.cityName} onChange={this.handleChanges} />
                    <button class="search" onClick={this.getCityKey}><i class="fa fa-search"></i></button>
                </div>

                <div class="ForecastTable">
                    {this.state.flag && !this.state.selectedCity ?
                        <div>
                            {this.state.cityOptions.length > 1 ?
                                <div> {this.state.cityOptions.map(x =>

                                    <li class="options" value={x.number} onClick={this.citySelected}> {x.cityName}, {x.countryName}</li>

                                )}
                                </div>
                                : this.state.cityOptions.length === 0 ?
                                    <div>
                                        {this.setState({ flag: false })}
                                        {alert("Hi, the city you searched for can not be found, Please try again")}</div>
                                    : null}
                        </div> : null}
                </div>
                {this.state.flag && this.state.selectedCity ?
                    <div class="fullResult">
                        <HeaderResult cityName={this.state.selectedCity.cityName} countryName={this.state.selectedCity.countryName} cityKey={this.state.selectedCity.cityKey} />
                        <ForecastResult data={this.state.selectedCity} DegOption={this.state.DegOption} />
                    </div>
                    : null}
            </div>
        )
    }
}

export default SearchBar;