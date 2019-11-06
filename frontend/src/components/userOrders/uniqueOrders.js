import React, { Component } from 'react';
import OrderItems from './orderItems';
import Draggable from 'react-draggable'
import './pastOrders.css'
import MessagePopup from './messagepopup'

class UniqueOrders extends Component {
    render() {
        let order = this.props.orderIndividual.items;
        console.log("this.props.itemindividual", this.props.orderIndividual.items);

        let orderTotal = 0;
        let newstatus = ""
        let orderId = this.props.orderIndividual._id
        let orderitems = ""
        orderitems = order.map((items, index) => {
            orderTotal += items.itemTotal;


            // let status = items.orderStatus
            newstatus = "status: " + this.props.orderIndividual.orderStatus;

            console.log("items in mapping: ", items);
            return (
                <OrderItems
                    key={items.itemId}
                    itemsInOrder={items}
                />
            )

        })
        
        const Messageowner = this.props.orderType === 'upcoming' ?
            <div className=" text-left " id='message-orders-customer'>
                <MessagePopup buttonLabel='Message owner' className='modal-popup' OwnerLogin = 'false' orderId={orderId}/>
            </div> : '';
        orderTotal = orderTotal.toFixed(2)

        return (
            <div>
                 <Draggable>
                <div className="past-orders border-secondary mb-3" id="past-orders">
                    <h5 className="card-header w-75 text-left">orderId: {orderId}   &nbsp;&nbsp;&nbsp;&nbsp;  {newstatus}</h5>
                    <div className="card-body ">
                        {orderitems}
                        <p className="text-danger  text-left" >Total: ${orderTotal}</p>
                    </div>
                </div>
                </Draggable>

                {Messageowner}
            </div>
        );
    }
}

export default UniqueOrders;