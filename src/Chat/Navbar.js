import { Component } from "react";

class Navbar extends Component {

    constructor() {
        super();
    }

    componentDidMount() {
        console.log("KKKKKKKK")
        console.log(this.props)
    }

    currNavClick(buttonState) {
        console.log("KKKKKKKK")
        console.log(this.props)
        this.props.onNavClick(buttonState);
    }

    render() {
        const { renderGlobal } = this.props;
        return (
            <div className="navbar">
                <ul id="nav">
                    <li><button className={renderGlobal ? 'inactive' : 'active'} onClick={() => this.currNavClick(false)}>Private Chats</button></li>
                    <li><button className={renderGlobal ? 'active' : 'inactive'} onClick={() => this.currNavClick(true)}>Global Chat</button></li>
                </ul>
            </div>
        );
    }
}

export default Navbar;