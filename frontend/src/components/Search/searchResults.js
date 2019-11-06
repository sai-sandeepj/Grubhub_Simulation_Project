import React, { Component } from 'react';
import Navbar from '../Navbar/navbar';
import RestCard from './restCards';
import LeftPanel from './leftPanel';
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import rootUrl from '../config/settings';
import './cardstyles.css';


import { connect } from "react-redux";


class searchResults extends Component {
    constructor() {
        super()
        this.state = {
            restSearchResults: "",
            restCuisineResults: "",
            uniquecuisines: "",
            restaurantsByPages: "",
            restCuisinePages: "",
            pageNumber: 0,
            visitCuisineSelect: '',
            newrestcuisines: ''
        }
    }

    componentDidMount() {
        if (localStorage.getItem("restaurantResults")) {
            let restResultsBySearch = localStorage.getItem("restaurantResults")
            let restDetails = JSON.parse(restResultsBySearch);
            let restByPages = restDetails
            console.log(restByPages.length);

            let totalRest = restByPages.length
            let pages = (totalRest % 3) == 0 ? totalRest / 3 : Math.floor(totalRest / 3) + 1

            let pagerest = new Array(pages)

            for (let i = 0; i < pagerest.length; i++) {
                pagerest[i] = new Array(3);
            }

            let h = 0
            for (let i = 0; i < (pages); i++) {
                for (let j = 0; j < 3; j++) {
                    pagerest[i][j] = restByPages[h++];
                }
                console.log(pagerest[i]);

            }


            console.log(restDetails)

            let cuisineDetails = JSON.parse(localStorage.getItem("restaurantResults"));
            let lookup = {};
            let items = cuisineDetails;
            let result = [];
            let restaurants = cuisineDetails;

            for (let x = 0; x < restaurants.length; x++) {
                console.log(restaurants[x].restaurant.items);
                let items = restaurants[x].restaurant.items
                for (let item, i = 0; item = items[i++];) {
                    let itemtype = item.cuisineName;

                    if (!(itemtype in lookup)) {
                        lookup[itemtype] = 1;
                        result.push(itemtype);
                    }
                }
            }
            console.log(result)
            result.sort()
            this.setState({
                uniquecuisines: result,
                restSearchResults: restDetails,
                restaurantsByPages: pagerest
            })
            if (localStorage.getItem("restCuisineDetails")) {
                let restResultsBySearch = localStorage.getItem("restCuisineDetails")
                let restDetails = JSON.parse(restResultsBySearch);
                let restByPages = restDetails
                console.log(restByPages);

                let totalRest = restByPages.length
                console.log(totalRest);
                let pages = (totalRest % 3) == 0 ? totalRest / 3 : Math.floor(totalRest / 3) + 1

                let pagerest = new Array(pages)
                for (let i = 0; i < pagerest.length; i++) {
                    pagerest[i] = new Array(3);
                }

                let h = 0
                for (let i = 0; i < pages; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (restByPages[h]) {
                            pagerest[i][j] = restByPages[h++];
                            console.log(h);

                        }
                    }
                    console.log(pagerest[i]);

                }

                this.setState({
                    restCuisinePages: pagerest,
                    restCuisineResults: restDetails
                })
            }
        }
    }

    visitRestaurant = (restId) => {
        console.log("in VisitRestaurant method");
        console.log(restId)
        const data = {
            restId: restId,
            userEmail: localStorage.getItem('userEmail')
        }
        axios.post(rootUrl + '/itemsByRestaurant', data, {
            headers: { "Authorization": localStorage.getItem("authToken") }
        })
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    let itemDetails = JSON.stringify(response.data)
                    console.log(response.data);

                    localStorage.setItem('itemsByRestaurant', itemDetails)
                    console.log("itemDetails:" + typeof itemDetails)
                    this.props.history.push('/resthome')
                }
                else {
                    console.log("Didn't fetch items data")
                }
            })
    }
    visitCuisine = (cuisineName) => {
        //e.preventDefault()
        console.log("in VisitCuisine method");
        console.log(cuisineName);

        //console.log(copyResults[id])
        let itemName = localStorage.getItem("itemName")
        const data = {
            cuisineName: cuisineName,
            itemName: itemName,
            userEmail: localStorage.getItem('userEmail')
        }
        let allrest = JSON.parse(localStorage.getItem('restaurantResults'))
        // allrest = JSON.parse(allrest)
        console.log(allrest);
        let RestByCuisine = []
        let ids = {}
        for (let p = 0; p < allrest.length; p++) {
            let current_rest = allrest[p]
            // console.log('current_rest',current_rest.restaurant._id)

            for (let q = 0; q < current_rest.restaurant.items.length; q++) {
                // console.log(current_rest.restaurant.items[q])
                if (current_rest.restaurant.items[q].cuisineName == cuisineName) {

                    console.log(ids);

                    if (!(current_rest.restaurant._id in ids)) {
                        console.log(current_rest.restaurant._id);
                        let restaurantId = current_rest.restaurant._id
                        RestByCuisine.push(current_rest)
                        ids[restaurantId] = 1;
                    }
                }
            }
        }
        console.log(RestByCuisine);
        localStorage.setItem('restCuisineDetails', JSON.stringify(RestByCuisine))
        if (localStorage.getItem("restCuisineDetails")) {
            let restResultsBySearch = localStorage.getItem("restCuisineDetails")
            let restDetails = JSON.parse(restResultsBySearch);
            let restByPages = restDetails
            console.log(restByPages);

            let totalRest = restByPages.length
            console.log(totalRest);
            let pages = (totalRest % 3) == 0 ? totalRest / 3 : Math.floor(totalRest / 3) + 1

            let pagerest = new Array(pages)
            for (let i = 0; i < pagerest.length; i++) {
                pagerest[i] = new Array(3);
            }

            let h = 0
            for (let i = 0; i < pages; i++) {
                for (let j = 0; j < 3; j++) {
                    if (restByPages[h]) {
                        pagerest[i][j] = restByPages[h++];
                        console.log(h);

                    }
                }
                console.log(pagerest[i]);

            }

            this.setState({
                restCuisinePages: pagerest,
                restCuisineResults: restDetails,
                pageNumber: 0
            })
        }
    }
    makeRequestWithPage = (number) => {
        console.log("in requests with page", number);
        this.setState({
            pageNumber: number
        })

    }

    render() {
        let pageNumbers = []
        let temp = this.state.newrestcuisines
        let redirectVar = null;
        if (localStorage.getItem("accountType") !== '1') {
            redirectVar = <Redirect to="/login" />
        }
        if (!localStorage.getItem('token')) {
            redirectVar = <Redirect to="/login" />
        }
        let route = null
        if (this.state.restCuisinePages) {
            console.log("in restcuisinedetails true")
            route = this.state.restCuisinePages;
            let k = this.state.restCuisinePages.length
            let i = 0;
            while (k > 0) {
                pageNumbers.push(i)
                i++;
                k--;
            }
            console.log(pageNumbers);
            localStorage.removeItem("restCuisineDetails")
        }
        else if (this.state.restaurantsByPages) {
            route = this.state.restaurantsByPages;
            let k = this.state.restaurantsByPages.length
            let i = 0;
            while (k > 0) {
                pageNumbers.push(i)
                i++;
                k--;
            }
        }
        if (route) {
            let restCards = route[this.state.pageNumber].map((restaurant, index) => {
                // console.log("restaurant",restaurant.restaurant._id)
                if (restaurant) {
                    return (
                        <RestCard
                            key={restaurant.restaurant._id}
                            restIndividual={restaurant}
                            index={index}
                            visitRest={this.visitRestaurant.bind(this)}
                        />
                    )
                }
            })

            let cuisinePanel = this.state.uniquecuisines.map((cuisine, ind) => {
                return (
                    <LeftPanel
                        key={cuisine}
                        cuisineIndividual={cuisine}
                        visitCuisine={this.visitCuisine.bind(this)}
                    />
                )
            })
            let renderPageNumbers = ""
            if (pageNumbers.length > 1) {
                renderPageNumbers = pageNumbers.map(number => {
                    let classes = this.state.pageNumber === number ? 'active' : '';

                    return (
                        <span key={number} className={classes} onClick={() => this.makeRequestWithPage(number)}>{number + 1}</span>
                    );
                });
            }
            return (
                <div>
                    {redirectVar}
                    <Navbar />
                    <div>
                        <div className="restLeft" id="left">
                            <div className="list-group">
                                {cuisinePanel}
                            </div>
                        </div>
                        <div id="right">
                            <div id="search-results-text"><p>Your Search Results....</p></div>
                            <div className="card-group" >
                                {restCards}
                            </div>
                            <div className='pagination'>
                                {renderPageNumbers}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        // let restCards = this.state.people.map(person => {
        //     return (
        //         <RestCard key={person.id} removePerson={this.removePerson.bind(this)} person={person} />
        //     )
        // })
        else {
            return (
                <div>
                    <Navbar />
                    {redirectVar}
                    <h3>No Items found. </h3>
                </div>
            );
        }
    }
}

// export default searchResults;
const mapStateToProps = (state) => ({
    customerStateStore: state.customer
})
const updatedSearchResults = connect(mapStateToProps)(searchResults)
export default updatedSearchResults;