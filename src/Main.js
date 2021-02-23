import React, { Component } from "react";
import ChatRoom from './Chat/ChatRoom';
 
class Main extends Component {
  render() {
    return (
      <div>
        <div className="App-header">
          <h1>anybody there</h1>
        </div>
        <ChatRoom/>
      </div>
    );
  }
}
 
export default Main;