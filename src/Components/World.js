import React, { Component } from 'react';
import ChatRoom from '../Chat/ChatRoom';
import Map from '../Map/Map';

class WorldPage extends Component {
  render() {
    return (
        <div>
          <div className="App-header">
            <h1>anybody there</h1>
          </div>
          <div className="container">
            <Map/>
            <ChatRoom/>
          </div>
        </div>
    );
  }
}

export default WorldPage;