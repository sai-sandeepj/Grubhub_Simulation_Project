import React, { Component } from 'react';
import './cartCardcss.css'

var images = require.context('../../images', true);

class cartCard extends Component {

    render() {
        console.log("this.props.itemIndividual", this.props.itemIndividual)
        let { _id, itemName, itemPrice, itemQuantity, itemTotal } = this.props.itemIndividual


        return (
            <div >
                <div id="indCard">
                    <div className="card w-75" >
                        <div className="card-body">
                            <h5 className="card-title">{itemName}</h5>
                            <span>
                                <p className="card-text" id="item-price">${itemPrice}</p>
                                <p className="card-text" id="item-quantity">Quantity : {itemQuantity}</p>
                                <p className="card-text" id="item-quantity">total : ${itemTotal}</p>
                                <button href="#" onClick={() => this.props.deleteFromCart(_id, itemQuantity)} className="btn btn-danger" id="item-delete">Delete</button>
                            </span>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default cartCard;