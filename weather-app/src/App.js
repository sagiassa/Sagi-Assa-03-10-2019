import React from 'react';
import { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import SearchBar from './components/main/SearchBar';
import Favorites from './components/favorites/Favorites';
import './App.css';

class App extends Component {
  constructor() {
    super()
  }
  render() {
    return (
      <Router>
        <div>
          <div class="navbar">
            <Link to='/SearchBar'>
              <div class="navbarOptions">Main</div>
            </Link>
            <Link to = '/Favorites'>
              <div class="navbarOptions">Favorites</div>
            </Link>
          </div>
          <Route path = '/' exact render = { () => <SearchBar /> } />          
          <Route path = '/SearchBar' exact render = { () => <SearchBar /> } />
          <Route path = '/Favorites' exact render = { () => <Favorites /> } />
        </div>

      </Router>
    )
  }
}

export default App;