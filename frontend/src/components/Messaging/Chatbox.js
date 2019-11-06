
import React from 'react';
import axios from 'axios'
import rootUrl from '../config/settings';
import Messages from './Messages';
import ChatInput from './ChatInput';
require('./ChatBox.css');


class ChatBox extends React.Component {
    // socket = {};
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            orderId: this.props.orderId
        };
        this.sendHandler = this.sendHandler.bind(this);
    }


    componentWillMount = () => {
        const data = {
            userEmail: localStorage.getItem('userEmail'),
            orderId: this.state.orderId
        }
        axios.post(rootUrl + '/getmessages', data, {
            headers: { "Authorization": localStorage.getItem("authToken") }
        })
            .then(response => {
                console.log("messages response", response.data[0].messages)
                if (response.status === 200) {
                    console.log(typeof response.data[0]);
                    this.setState({
                        messages: response.data[0].messages
                    })
                }
                else {
                    console.log("Didn't fetch previous data")
                }
            })

        // this.setState({
        //     messages: messages
        // })
    }
    sendHandler(message) {
        const data = {
            userEmail: localStorage.getItem("userEmail"),
            orderId: this.state.orderId,
            message: message
        };
        axios.post(rootUrl + '/setmessages', data, {
            headers: { "Authorization": localStorage.getItem("authToken") }
        })
            .then(response => {
                console.log("messages response", response.data.messages)
                if (response.status === 200) {
                    axios.post(rootUrl + '/getmessages', data, {
                        headers: { "Authorization": localStorage.getItem("authToken") }
                    })
                        .then(response => {
                            console.log("messages response", response.data[0].messages)
                            if (response.status === 200) {
                                console.log(typeof response.data[0]);
                                this.setState({
                                    messages: response.data[0].messages
                                })
                            }
                            else {
                                console.log("Didn't fetch previous data")
                            }
                        })
                }
                else {
                    console.log("Didn't fetch previous data")
                }
            })

        // Emit the message to the server
        // this.socket.emit('client:message', messageObject);

        // this.addMessage(data);
    }

    // addMessage(message) {
    //     console.log(message);

    //     // Append the message to the component state
    //     const messages = this.state.messages;
    //     messages.push(message);
    //     this.setState({ messages });
    // }

    render() {
        console.log(this.state.messages);

        return (
            <div className="container">
                {/* <h3>React Chat App</h3> */}
                <Messages messages={this.state.messages} OwnerLogin={this.props.OwnerLogin} />
                <ChatInput onSend={this.sendHandler} />
            </div>
        );
    }

}
ChatBox.defaultProps = {
    username: 'Anonymous'
};

export default ChatBox;