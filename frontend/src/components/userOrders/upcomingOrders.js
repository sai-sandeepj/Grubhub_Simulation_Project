import React, { Component } from 'react';
import axios from 'axios'
import rootUrl from '../config/settings';
import Navbar from '../Navbar/navbar';
import UniqueOrders from './uniqueOrders';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

class UpcomingOrders extends Component {
    constructor() {
        super()
        this.state = {
            userOrders: null
        }
    }

    componentDidMount = () => {
        let data = {
            userEmail: localStorage.getItem("userEmail")
        }
        axios.post(rootUrl + '/upcomingOrders', data, {
            headers: { "Authorization": localStorage.getItem("authToken") }
        })
            .then(response => {
                console.log(response.data)
                if (response.status === 200) {
                    console.log(typeof response.data);
                    this.setState({
                        userOrders: JSON.stringify(response.data),
                    })
                }
                else {
                    console.log("Didn't fetch previous data")
                }
            })
    }
    render() {
        let redirectVar;
        if (localStorage.getItem("accountType") !== '1') {
            redirectVar = <Redirect to="/login" />
        }
        // if (!cookie.load('cookie')) {
        //     redirectVar = <Redirect to="/login" />
        // }
        let route = null
        let UniqueOdrer = ""
        let i = -1;
        if (this.state.userOrders) {
            console.log("in ");

            route = JSON.parse(this.state.userOrders)
        }
        console.log("route : ", route);

        if (route) {
            UniqueOdrer = route.map((order, index) => {
                // let quant = JSON.parse(this.state.itemQuantity)
                console.log("order in mapping: ", order);
                // let neworder = JSON.stringify(order)
                i = i + 1
                return (
                    <UniqueOrders
                        key={i}
                        orderType="upcoming"
                        orderIndividual={order}
                    />
                )
            })
            return (
                <div>
                    {redirectVar}
                    <Navbar />
                    {UniqueOdrer}
                </div>
            );
        }
        else {
            return (
                <div>
                    {redirectVar}
                    <Navbar />
                    <h6>You do not have any Upcoming orders</h6>
                </div>
            )
        }
    }
}

export default UpcomingOrders;