import React, { Component } from 'react';
import rootUrl from '../config/settings';
import { Redirect } from 'react-router-dom'
import ItemCard from './itemCard'
import Navbar from '../Navbar/navbar'
import axios from 'axios'
import './restHome.css'
import RestCuisines from './restCuisines'
import swal from 'sweetalert';
import rest_image from "../../images/restaurant_defaultimage.jpg"
import './paginationStyle.css'

// var images = require.context('../../../../backend/uploads/', true);
import { connect } from 'react-redux';
import { addToCart } from '../../redux/actions/customerActions'

class RestaurantHome extends Component {
    constructor() {
        super()
        this.state = {
            itemsByRestaurant: "",
            itemsByrestCuisine: "",
            itemUniqueTypes: "",
            itemQuantity: "",
            restItemsByPages: "",
            ItemsByCuisinePages: "",
            pageNumber: 0
        }
    }

    componentDidMount() {
        if (localStorage.getItem("itemsByRestaurant")) {
            let itemsByRestaurant = localStorage.getItem("itemsByRestaurant")
            let sessionItemDetails = JSON.parse(itemsByRestaurant);

            let ItemByPages = sessionItemDetails.items
            console.log(ItemByPages.length);

            let totalItem = ItemByPages.length
            let pages = (totalItem % 3) == 0 ? totalItem / 3 : Math.floor(totalItem / 3) + 1
            console.log(pages);

            let pageItem = new Array(pages)

            for (let i = 0; i < pageItem.length; i++) {
                pageItem[i] = new Array(3);
            }
            let h = 0
            for (let i = 0; i < pages; i++) {
                for (let j = 0; j < 3; j++) {
                    pageItem[i][j] = ItemByPages[h++];
                }
                console.log(pageItem[i]);

            }

            let lookup = {};
            let items = sessionItemDetails.items;
            let result = [];

            for (let item, i = 0; item = items[i++];) {
                let itemtype = item.itemType;

                if (!(itemtype in lookup)) {
                    lookup[itemtype] = 1;
                    result.push(itemtype);
                }
            }
            console.log(sessionItemDetails.length);

            result.sort();
            console.log(result)
            let parseQuantity = '{"Quantity":[]}'
            for (let item, i = 0; item = items[i++];) {
                let itemNameQ = item.itemName;

                parseQuantity = JSON.parse(parseQuantity)
                parseQuantity.Quantity.push({ "itemName": itemNameQ, "itemQuantity": 0 })
                parseQuantity = JSON.stringify(parseQuantity)
            }
            console.log(typeof parseQuantity);
            this.setState({
                itemsByRestaurant: sessionItemDetails,
                itemUniqueTypes: result,
                itemQuantity: parseQuantity,
                restItemsByPages: pageItem
            })
        }
    }

    itemByItemType = (itemType) => {
        //e.preventDefault()
        console.log("in itemByItemType method");
        console.log(this.state.itemsByRestaurant.items)

        let itemsByRest = this.state.itemsByRestaurant.items;
        let itemsType = '{"requiredType":[]}'
        for (let i = 0; i < itemsByRest.length; i++) {
            let itemNameQ = itemsByRest[i];

            itemsType = JSON.parse(itemsType)

            if (itemNameQ.itemType === itemType) {
                itemsType.requiredType.push(itemNameQ)
            }
            itemsType = JSON.stringify(itemsType)
        }
        // itemsType = JSON.parse(itemsType);
        console.log(itemsType);




        itemsType = JSON.parse(itemsType)
        itemsType = itemsType.requiredType

        let ItemByPages = itemsType
        console.log(ItemByPages.length);

        let totalItem = ItemByPages.length
        let pages = (totalItem % 3) == 0 ? totalItem / 3 : Math.floor(totalItem / 3) + 1
        console.log(pages);

        let pageItem = new Array(pages)

        for (let i = 0; i < pageItem.length; i++) {
            pageItem[i] = new Array(3);
        }

        let h = 0
        for (let i = 0; i < pages; i++) {
            for (let j = 0; j < 3; j++) {
                pageItem[i][j] = ItemByPages[h++];
            }
        }

        console.log(pageItem);




        localStorage.setItem('itemSections', itemsType)

        this.setState({
            itemsByrestCuisine: itemsType,
            ItemsByCuisinePages: pageItem,
            pageNumber: 0
        })

    }

    togglePopup = (itemName, itemPrice, itemId, restId, itemQuantity) => {
        console.log("in togglePopup with Id: ");
        console.log(itemQuantity)
        let itemTotal = itemPrice * itemQuantity;
        const data = {
            itemId: itemId,
            itemPrice: itemPrice,
            itemName: itemName,
            restId: restId,
            itemQuantity: itemQuantity,
            itemTotal: itemTotal,
            userEmail: localStorage.getItem("userEmail")
        }
        console.log(data);
        if (itemQuantity > 0) {
            axios.post(rootUrl + '/addToCart', data, {
                headers: { "Authorization": localStorage.getItem("authToken") }
            })
                .then(response => {
                    console.log(response)
                    if (response.status === 200) {

                        swal("Success!", "Item Added to cart!", "success");
                        this.props.addToCart(data)
                    }
                    else {
                        console.log("Didn't fetch items data")
                    }
                }).catch((err) => {
                    if (err) {
                        if (err.response.status === 406) {
                            console.log("Error message", err.response.status);
                            swal(err.response.data)
                        }
                        else if (err.response.status === 412) {
                            console.log("Error messagw", err.response.status);
                            swal('You can add items only from one restaurant')
                        }
                        else {
                            swal("Database connection failed. please try again later")
                        }
                    }

                });
        }
        else {
            // alert("Quantity should me more than 0");
            swal("Oops...", "Quantity should me more than 0", "error");
        }

    }


    handleIncrement = (itemName) => {
        let indItemQuantity = JSON.parse(this.state.itemQuantity)
        for (let i = 0; i < indItemQuantity.Quantity.length; i++) {
            if (indItemQuantity.Quantity[i].itemName == itemName) {
                indItemQuantity.Quantity[i].itemQuantity += 1;

            }
        }
        let stringitemQuant = JSON.stringify(indItemQuantity);
        this.setState({
            itemQuantity: stringitemQuant
        })
        console.log(this.state.itemQuantity)

    }


    handleDecrement = (itemName) => {
        let indItemQuantity = JSON.parse(this.state.itemQuantity)
        for (let i = 0; i < indItemQuantity.Quantity.length; i++) {
            if (indItemQuantity.Quantity[i].itemName == itemName) {
                if (indItemQuantity.Quantity[i].itemQuantity > 0)
                    indItemQuantity.Quantity[i].itemQuantity -= 1;
            }
        }
        let stringitemQuant = JSON.stringify(indItemQuantity);
        this.setState({
            itemQuantity: stringitemQuant
        })
        console.log(this.state.itemQuantity)
    }

    makeRequestWithPage = (number) => {
        console.log("in requests with page", number);
        this.setState({
            pageNumber: number
        })
    }

    render() {
        let redirectVar = null;
        let itemDetails = null;
        let pageNumbers = []


        if (!this.state.itemsByRestaurant) {
            redirectVar = <Redirect to="/searchresults" />
        }
        let i = -1;
        let route = null;
        if (this.state.ItemsByCuisinePages) {
            route = this.state.ItemsByCuisinePages;

            let k = route.length
            let i = 0;
            while (k > 0) {
                pageNumbers.push(i)
                i++;
                k--;
            }
            console.log(pageNumbers);
            localStorage.removeItem('itemSections')
        }
        else if (this.state.restItemsByPages) {
            route = this.state.restItemsByPages
            let k = route.length
            let i = 0;
            while (k > 0) {
                pageNumbers.push(i)
                i++;
                k--;
            }
            console.log(pageNumbers);
        }
        console.log(route);

        if (route) {
            itemDetails = route[this.state.pageNumber].map((item, index) => {

                if (item) {
                    let quant = JSON.parse(this.state.itemQuantity)

                    i = i + 1
                    return (
                        <ItemCard
                            key={item.itemId}
                            itemIndividual={item}
                            quantity={quant}
                            handleDecrement={this.handleDecrement.bind(this)}
                            handleIncrement={this.handleIncrement.bind(this)}
                            togglePopup={this.togglePopup.bind(this)}
                        />
                    )
                }

            })
            let itemPanel = this.state.itemUniqueTypes.map((itemtype, ind) => {
                return (
                    <RestCuisines
                        key={itemtype}
                        itemTypeIndividual={itemtype}
                        itemByItemType={this.itemByItemType.bind(this)}
                    />
                )
            })
            let unknown;
            console.log("itemsbyrestaurant", this.state.itemsByRestaurant)
            let { restName, restImage, restAddress, restPhone } = this.state.itemsByRestaurant;
            if (restImage) {
                unknown =
                    <img src={rootUrl + '/download-file/' + restImage} id="restHomeImage" alt="..." />
            }
            else {
                unknown =
                    <img src={rest_image} id="restHomeImage" alt="..." />
            }
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
                    <div className="container" id="container">
                        {unknown}
                        <div>
                            <div className="rest-home-details" id="rest-home-details" >
                                <h2 className="rest-title" id="rest-title">{restName}</h2>
                                <span>
                                    <p className="text-left" id="text-left">{restAddress}</p>
                                    <p className="text-phone" id="text-left"> Phone:  {restPhone}</p>
                                </span>
                            </div>
                        </div>
                        <div className="item-type-Left" id="left-items">
                            <div className="list-group">
                                {itemPanel}
                            </div>
                        </div>
                        <div id="right-items" className="rest-item-Right">
                            <div className="card-group" >
                                {itemDetails}
                            </div>
                            <div className='pagination'>
                                {renderPageNumbers}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div>
                    <Navbar />
                    <h3>No Items found. </h3>
                </div>
            );
        }

    }
}

// export default RestaurantHome;
const mapStateToProps = (state) => ({
    cartStateStore: state.cart
})

const mapDispatchToProps = (dispatch) => {
    return {
        addToCart: (data) => dispatch(addToCart(data))
    };
}

const UpdatedRestaurantHome = connect(mapStateToProps, mapDispatchToProps)(RestaurantHome)
export default UpdatedRestaurantHome;