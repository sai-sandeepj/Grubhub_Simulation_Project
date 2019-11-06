import React, { Component } from 'react';


class OdrerItems extends Component {
    state = {}
    render() {
        let item = this.props.itemsInOrder
        console.log("item in itemorders file:", item);
        let {  itemName, itemQuantity, itemPrice, itemTotal } = item;
        return (
            <div>
                <div>
                    <span>
                        <h5 className="item-name text-left" id="item-name">{itemName}</h5><br/>
                        <p className="item-price  text-left" id="item-price" >Cost: ${itemPrice}</p>
                        <p className="item-quantity  text-left" id="item-quantity" >Quantity: {itemQuantity}</p>
                        <p className="item-total  text-left" id="item-total"> Total: ${itemTotal}</p>
                    </span>
                </div>
            </div>
        );
    }
}

export default OdrerItems;