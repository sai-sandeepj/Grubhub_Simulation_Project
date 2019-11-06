import React, { Component } from 'react';
import Navbar from '../Navbar/navbar'
import swal from 'sweetalert';
import rootUrl from '../config/settings';
import axios from 'axios'
import CartCard from './cartCard'
import './cartCardcss.css'
import { Redirect } from 'react-router';
// import cookie from 'react-cookies';
import { connect } from 'react-redux';
import { removeFromCart, placeOrder } from '../../redux/actions/customerActions'

class Cart extends Component {
    constructor() {
        super()
        this.state = {
            cartItems: "",
            cartTotal: ""
        }
    }
    componentDidMount = () => {
        let data = {
            userEmail: localStorage.getItem("userEmail")
        }
        axios.post(rootUrl + '/showcart', data, {
            headers: { "Authorization": localStorage.getItem("authToken") }
        })
            .then(response => {
                console.log("response", response)
                console.log("response data", response.data);
                console.log("--------------");

                if (response.status === 200) {
                    console.log(typeof response.data);
                    console.log("response.data", response.data);
                    console.log("data received", response.data);

                    let itemsInCart = JSON.stringify(response.data)
                    console.log("itemsincart", itemsInCart)
                    this.setState({
                        cartItems: itemsInCart
                    })
                    console.log("state", this.state)
                }
                else {
                    console.log("Didn't fetch items data")
                }
            })
    }

    placeOrder = () => {
        let data = {
            userEmail: localStorage.getItem("userEmail")
        }
        axios.post(rootUrl + '/orderItems', data, {
            headers: { "Authorization": localStorage.getItem("authToken") }
        })
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    setTimeout(() => {
                        // window.location.reload();
                    }, 2000);
                    swal("Success", "Your order has been placed", "success")
                    this.props.placeOrder()
                    this.props.history.push('/upcomingorders')
                    // this.props.history.push('/searchresults')
                }
                else {
                    console.log("Didn't fetch items data")
                }
            })
    }
    deleteFromCart = (itemId, itemQuantity) => {
        console.log(itemId);
        const data = {
            itemId: itemId,
            itemQuantity: itemQuantity,
            userEmail: localStorage.getItem("userEmail")
        }
        let newCartItems = JSON.parse(this.state.cartItems);
        console.log('before deleting', newCartItems);
        axios.post(rootUrl + '/deleteCartItem', data, {
            headers: { "Authorization": localStorage.getItem("authToken") }
        })
            .then(response => {
                console.log(response)
                if (response.status === 200) {

                    swal("Success", "Item Deleted from Cart", "success")

                    for (let k = 0; k < newCartItems.length; k++) {
                        if (newCartItems[k]._id == data.itemId && newCartItems[k].itemQuantity == data.itemQuantity) {
                            newCartItems.splice(k, 1)
                        }
                    }
                    this.props.removeFromCart(newCartItems)
                    this.setState({
                        cartItems: JSON.stringify(newCartItems)
                    })
                }
                else {
                    console.log("Didn't fetch items data")
                }
            })
        console.log(newCartItems);


    }
    render() {
        let redirectVar;
        if (localStorage.getItem("accountType") !== '1') {
            redirectVar = <Redirect to="/login" />
        }
        if (!localStorage.getItem('token')) {
            redirectVar = <Redirect to="/login" />
        }
        let cart = "";
        let route = '';
        console.log("new state", this.state)
        if (this.state.cartItems) {
            route = JSON.parse(this.state.cartItems)
            console.log("route", route)
        }
        let cartTotal = 0;
        if (route) {
            cart = route.map((cartItem, index) => {
                cartTotal += cartItem.itemTotal;
                return (
                    <CartCard
                        key={cartItem.itemId}
                        itemIndividual={cartItem}
                        deleteFromCart={this.deleteFromCart.bind(this)}
                    />
                )

            })
            let message = ""
            if (cartTotal === 0) {
                message = "Your Cart is empty. Please add food to cart to place order."
            }
            return (

                <div>
                    {redirectVar}
                    <Navbar />
                    <div>
                        {cart}
                        {message}
                        <span id="placeorder">
                            <p id="carttotal">Your cart total : ${cartTotal}</p>
                            <button onClick={this.placeOrder} className="btn btn-success" >Place Order</button>
                        </span>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div>
                    <h5>Your cart is Emply. Add items to cart to purchase...</h5>
                </div>
            )
        }
    }
}

// export default Cart;
const mapStateToProps = (state) => ({
    cartStateStore: state.cart
})

const mapDispatchToProps = (dispatch) => {
    return {
        removeFromCart: (data) => dispatch(removeFromCart(data)),
        placeOrder: (data) => dispatch(placeOrder(data))
    };
}

const UpdatedCart = connect(mapStateToProps, mapDispatchToProps)(Cart)
export default UpdatedCart;