import { Component } from 'react';
import Navbar from './Navbar';
import { ChatRoom } from './ChatRoom';
import MyChats from './MyChats';

class Chat extends Component {
    state = { renderGlobal: true };
    constructor() {
        super();
    }

    onNavButtonClick = (buttonState) => {
        this.setState({
            renderGlobal: buttonState
        })
    }

    render() {

        // Default world 
        var component = this.state.renderGlobal ? (
            <ChatRoom />
        ) : <MyChats />;

        return (
            <div className="Chat">
                <Navbar onNavClick={this.onNavButtonClick.bind(this)} renderGlobal={this.state.renderGlobal} chat={this} />
                {component}
            </div>
        )
    }
}

export default Chat;