import React, { Component } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import rootUrl from "../config/settings";
import swal from "sweetalert"


class Sections extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sections: []
        }
    }

    componentDidMount() {
        let data = {
            userEmail: localStorage.getItem("userEmail")
        }
        console.log("Inside get profile after component did mount");
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(rootUrl + '/allsections', data, {
            headers: { "Authorization": localStorage.getItem("authToken") }
        })
            .then(response => {
                console.log("inside success")
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("response in sections", response.data)
                    this.setState({
                        sections: response.data
                    });
                    console.log("this.state in sections", this.state)
                }
            })
            .catch(error => {
                console.log("In error");
                console.log(error);
                // alert("User credentials not valid. Please try again!");
            })
    }

    deleteSection(details) {
        const data = {
            itemType: details,
            userEmail: localStorage.getItem("userEmail")
        }
        console.log("data", data)
        axios.post(rootUrl + '/deletesection', data, {
            headers: { "Authorization": localStorage.getItem("authToken") }
        })
            .then(response => {
                console.log("inside success")
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("response", response.data)
                    // alert("success")
                    setTimeout(() => {
                        // window.location.reload();
                    }, 2000);
                    swal("Deleted", "Section deleted succesfully!", "error");
                    this.props.history.push('/menu')
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
        let sectionDetails;
        sectionDetails = this.state.sections.map((section) => {
            console.log("section", section)
            return (
                <div className="col-md-7">
                    <div className="card">
                        <div class="card-body">
                            <span className="text-left font-weight-bold">{section}</span> &nbsp;&nbsp;&nbsp;
                        <Link to={{
                                pathname: `/editsection`,
                                section: section
                            }} className="text-outline-primary">Edit</Link> &nbsp;&nbsp;&nbsp;
                        <a className="inline text-danger" id="btn-edit" href="#edit" onClick={() => this.deleteSection(section)}>Delete</a>
                        </div>
                    </div>
                </div>
            )
        })
        return (
            <div>
                {sectionDetails}
            </div>
        )
    }
}

export default Sections;