import React, { Component } from "react";
// import NavBar from "../../Navbar/navbar";
import axios from 'axios'
import ItemDetails from "./itemdetails";
import rootUrl from "../../config/settings";
import swal from "sweetalert";
import MessagePopup from "../../userOrders/messagepopup"

class PreparingOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orders: []
        }
        this.handleOrder = this.handleOrder.bind(this)
    }

    componentDidMount() {
        let data = {
            userEmail: localStorage.getItem("userEmail")
        }
        console.log("Inside get order details afer component mount");
        axios.post(rootUrl + "/allorders", data, {
            headers: { "Authorization": localStorage.getItem("authToken") }
        })
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data)
                    this.setState({
                        orders: [response.data]
                    })
                    console.log("this state orders", typeof this.state.orders)
                }
            })
    }

    handleOrder(orderId) {
        const data = {
            userEmail: localStorage.getItem("userEmail"),
            orderId: orderId,
            orderStatus: "ready"
        }
        console.log("data", data)
        axios.post(rootUrl + '/manageOrders', data, {
            headers: { "Authorization": localStorage.getItem("authToken") }
        })
            .then(response => {
                console.log("inside success")
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("response", response.data)
                    // alert("success")
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                    swal("Success", "Order prepared and ready for delivery.", "success");

                    // window.location.reload();
                }
            })
            .catch(error => {
                console.log("In error");
                console.log(error);
                setTimeout(() => {
                    // window.location.reload();
                }, 2000);
                swal("Oops...", "Something went wrong! Please try again later", "error");
                this.props.history.push('/ownerhome')
                // alert("User credentials not valid. Please try again!");
            })

    }

    render() {
        let pastOrderDetails;

        pastOrderDetails = this.state.orders.map((order) => {
            // i=i+1;
            console.log("order status", order.orderStatus)
            let MessageCustomer = order.orderStatus === "preparing" ?
                <div className=" text-left " id='message-orders-owner'>
                    <MessagePopup buttonLabel='Message Customer' className='modal-popup' OwnerLogin='true' orderId={order._id} />
                </div> : '';
            if (order.orderStatus === "preparing") {
                return (
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Customer name: {order.userName} || Order Id: #{order._id}</h5>
                            <h6 className="card-subtitle mb-2 text-muted">Customer Address: {order.userAddress}</h6>
                            <ItemDetails
                                itemsInOrder={order} />
                            <p className="card-text font-weight-bold text-muted">Order status: {order.orderStatus}</p>
                            <p className="card-text font-weight-bold text-muted">Ready for delivery? </p>
                            <button className="btn btn-outline-success" onClick={() => this.handleOrder(order._id)}>Yes</button>
                            {MessageCustomer}
                        </div>
                    </div>
                )
            }

        })
        return (
            <div>

                {/* {UniqueOdrer} */}
                {pastOrderDetails}

            </div>
        )
    }
}

export default PreparingOrders;