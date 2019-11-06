import React, { Component } from 'react';
import './homestyle.css';
import { Redirect } from 'react-router-dom'
import NavBar from '../Navbar/navbar'
import Background from '../../images/userhomeimage.jpg';
import axios from 'axios'
import rootUrl from '../config/settings';
import swal from 'sweetalert'
import { connect } from 'react-redux';
import { searchItem } from '../../redux/actions/customerActions'

var sectionStyle = {
    width: "100%",
    height: "650px",
    backgroundImage: `url(${Background})`
};


class Home extends Component {
    constructor() {
        super()
        this.state = {
            itemSearch: "",
            restResults: [

            ],
            cuisineResults: [

            ]
        }
        this.searchHandle = this.searchHandle.bind(this);
        this.submitSearch = this.submitSearch.bind(this);
    }



    searchHandle = e => {
        e.preventDefault();
        this.setState({
            itemSearch: e.target.value
        });
        console.log(this.state.itemSearch.length);
        // if(this.state.itemSearch.length >=2){
        //     document.getElementById("searchButton").disabled = false;
        // }

    }


    submitSearch = async (e) => {
        e.preventDefault()

        const data = {
            itemName: this.state.itemSearch,
            userEmail: localStorage.getItem("userEmail")
        }
        console.log(data.itemName)
        axios.post(rootUrl + '/restaurantsbyItemName', data, {
            headers: { "Authorization": localStorage.getItem("authToken") }
        })
            .then(response => {
                console.log(response.status);
                if (response.status === 200) {
                    let restDetails = JSON.stringify(response.data)
                    console.log(response.data)
                    if (Object.keys(response.data).length > 0) {
                        var resultData = {
                            restDetails: restDetails,
                            itemName: data.itemName
                        }
                        localStorage.setItem("restaurantResults", restDetails)
                        localStorage.setItem("itemName", data.itemName);
                    }
                    console.log("response is 200. data received")
                    this.props.searchItem(resultData)
                    this.props.history.push('/searchresults')
                }

            }).catch((err) => {
                if (err) {
                    if (err === 401) {

                        console.log("Error messagw", err.response.status);
                        swal(err.response.data)
                    }
                    else {
                        swal("Something went wrong! please try again later")
                    }
                }

            });
    }


    render() {

        let redirectVar = null
        if (localStorage.getItem('accountType') !== '1') {
            redirectVar = <Redirect to='/login' />
        }
        return (
            <div >
                {redirectVar}
                <NavBar />
                <div style={sectionStyle} >
                    <div className="centerit">
                        <div className="col-12 col-md-10 col-lg-8">
                            <form className="card card-sm">
                                <div className="card-body row no-gutters align-items-center">
                                    <div >
                                    </div>
                                    <div className="col">
                                        <input onChange={this.searchHandle} name="searchbar" className="form-control form-control-lg form-control-borderless" type="text" placeholder="Search food items" />
                                    </div>
                                    <div >
                                        <button id="searchButton" onClick={this.submitSearch} className="btn btn-lg btn-success"  >Search</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// export default Home;
const mapStateToProps = (state) => ({
    customerStateStore: state.customer
})
const mapDispatchToProps = (dispatch) => {
    return {
        searchItem: (data) => dispatch(searchItem(data))
    }
}

const updatedHome = connect(mapStateToProps, mapDispatchToProps)(Home)
export default updatedHome;
