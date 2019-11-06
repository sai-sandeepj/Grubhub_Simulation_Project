import React, { Component } from "react";
// import NavBar from "../../Navbar/navbar";
import axios from 'axios'
import ItemDetails from "./itemdetails";
import rootUrl from "../../config/settings";
import swal from "sweetalert";

class NewOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orders: []
        }
        this.handleAcceptedOrder = this.handleAcceptedOrder.bind(this)
        this.handleRejectedOrder = this.handleRejectedOrder.bind(this)
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
                    console.log("response all orders:", response.data)
                    this.setState({
                        orders: [response.data]
                    })
                    console.log("this state orders", this.state.orders)
                }
            })
    }

    handleAcceptedOrder(orderId) {
        const data = {
            userEmail: localStorage.getItem("userEmail"),
            orderId: orderId,
            orderStatus: "preparing"
        }
        console.log("data", data)
        axios.post(rootUrl + '/manageOrders', data, {
            headers: { "Authorization": localStorage.getItem("authToken") }
        })
            .then(response => {
                console.log("inside success")
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    setTimeout(() => {
                        // window.location.reload();
                    }, 2000);
                    console.log("response", response.data)
                    // alert("success")
                    swal("Success", "Order accepted", "success");
                    this.props.history.push('/ownerhome')
                    // window.location.reload();
                }
            })
            .catch(error => {
                console.log("In error");
                console.log(error);
                swal("Oops...", "Something went wrong! Please try again later", "error");
                // alert("User credentials not valid. Please try again!");
            })

    }

    handleRejectedOrder(orderId) {
        const data = {
            userEmail: localStorage.getItem("userEmail"),
            orderId: orderId,
            orderStatus: "cancelled"
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
                    swal("Rejected", "You rejected the order", "error");
                    // window.location.reload();
                }
            })
            .catch(error => {
                console.log("In error");
                console.log(error);
                swal("Oops...", "Something went wrong! Please try again later", "error");
                // alert("User credentials not valid. Please try again!");
            })

    }

    render() {
        let newOrderDetails;

        console.log("checking orders state", this.state.orders)
        newOrderDetails = this.state.orders.map((order) => {

            // i=i+1;
            // console.log("order status",order.userOrder[0].orderStatus)

            if (order.orderStatus === "New") {
                return (
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Customer name: {order.userName} || Order Id: #{order._id}</h5>
                            <h6 className="card-subtitle mb-2 text-muted">Customer Address: {order.userAddress}</h6>
                            <ItemDetails
                                itemsInOrder={order} />
                            <p className="card-text font-weight-bold text-muted">Order status: {order.orderStatus}</p>
                            <button className="btn btn-outline-success" onClick={() => this.handleAcceptedOrder(order._id)}>Accept</button>&nbsp;
                        <button className="btn btn-outline-danger" onClick={() => this.handleRejectedOrder(order._id)}>Reject</button>
                        </div>
                    </div>
                )
            }
        })
        return (
            <div>

                {/* {UniqueOdrer} */}
                {newOrderDetails}

            </div>
        )
    }
}

export default NewOrders;