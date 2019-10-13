import React, { Component } from 'react';
import iconsData from './IconsData'
const request = require('request-promise')
const moment = require('moment')
const ApiKey = 'sRf6W9AUW0u6DFJQ2zVkLhQb3g78OHaS'

class ForecastResult extends Component {
    constructor(props) {
        super(props)
        this.state = {
            forecastData : []
        }
    }

    getForecastData = async (cityKey) => {
        let response = await request.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=${ApiKey}`)
            response = JSON.parse(response)
            await this.setState({ forecastData: response.DailyForecasts })
    }
    render() {
        let cityKey = this.props.data.cityKey
        this.getForecastData(cityKey)
        return (

                
            <div class="ForcastColumn">
                {this.state.forecastData.map(x =>
                    <div class="eachColumn">
                        <div class="fullDate"> {moment(x.Date).format('dddd')} - {moment(x.Date).format('MMM Do')}</div>
                        
                        <div class="DayAndNight">
                            <div class="dayPhrase"> {x.Day.IconPhrase} </div>
                            <div class="dayPic"><img src={`${ iconsData[x.Day.IconPhrase]}`} /> </div>
                            <div class="nightPhrase"> {x.Night.IconPhrase} </div>
                            <div class="nightPic"><img src={`${ iconsData[x.Night.IconPhrase]} `} /> </div>
                        </div>
                        {this.props.DegOption ? 
                            <div class="temperature"> {x.Temperature.Minimum.Value} / {x.Temperature.Maximum.Value} </div>
                         :
                            <div class="temperature" > {Math.floor((parseInt(x.Temperature.Minimum.Value)-32)/1.8)} / {Math.floor((parseInt(x.Temperature.Maximum.Value)-32)/1.8)} </div>
                        }

                    </div>)}
            </div>
        )
    }
}

export default ForecastResult;