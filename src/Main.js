import React, { Component } from "react";
import ChatRoom from './Chat/ChatRoom';
import Map from './Map/Map';
 
class Main extends Component {
  render() {
    return (
      <div>
        <div className="header">
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
 
export default Main;