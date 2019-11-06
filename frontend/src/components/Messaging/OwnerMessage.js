import React, { Component } from 'react';


class Message extends Component {
    render() {
        // Was the message sent by the current user. If so, add a css class
        const isOwner = this.props.isOwner ? 'from-me' : '';

        return (
            <div className={`message ${isOwner}`}>
                <div className='message-body'>
                    {this.props.message}

                </div><br />
            </div>
        );
    }
}

Message.defaultProps = {
    message: '',
    // username: '',
    isOwner: false
};

export default Message;