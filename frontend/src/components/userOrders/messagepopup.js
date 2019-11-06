import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Chatbox from '../Messaging/Chatbox'


const MessagePopup = (props) => {

    const {
        buttonLabel,
        className,
        OwnerLogin,
        orderId
    } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const closeBtn = <button className="close" onClick={toggle}>&times;</button>;

    return (
        <div>
            <Button color="dark" onClick={toggle}>{buttonLabel}</Button>
            <Modal isOpen={modal} toggle={toggle} className={className} scrollable>
                <ModalHeader toggle={toggle} close={closeBtn}>Chat Here</ModalHeader>
                <ModalBody className="modal-body">
                    <Chatbox OwnerLogin = {OwnerLogin} orderId={orderId}/>
                </ModalBody>
                <ModalFooter>
                    
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default MessagePopup;