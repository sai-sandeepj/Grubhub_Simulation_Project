import React, { Component } from 'react';
import UserMessage from './UserMessage'
import OwnerMessage from './OwnerMessage'

class Messages extends Component {
    constructor(props) {
        super(props)
    }

    componentDidUpdate() {
        // get the messagelist container and set the scrollTop to the height of the container
        const objDiv = document.getElementById('messageList');
        objDiv.scrollTop = objDiv.scrollHeight;
    }
    render() {
        // Loop through all the messages in the state and create a Message component
        console.log(this.props.messages);
        // let ParseMessages = JSON.parse(this.props.messages)
        // console.log("Parsed",ParseMessages)
        let messages = null
        if (this.props.OwnerLogin == 'false') {

            messages = this.props.messages.map((message, i) => {
                return (
                    <UserMessage
                        key={i}
                        message={message.message}
                        isOwner={message.isOwner} />
                );
            });
        }
        else {
            messages = this.props.messages.map((message, i) => {
                return (
                    <OwnerMessage
                        key={i}
                        message={message.message}
                        isOwner={message.isOwner} />
                );
            });
        }
        return (
            <div className='messages' id='messageList'>
                {messages}
            </div>
        );
    }
}

Messages.defaultProps = {
    messages: []
};

export default Messages;