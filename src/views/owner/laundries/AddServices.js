import React, { Component } from 'react';

import '../../owner/laundries/css/addLaundry.css';
import axios from 'axios';
import {
    AppHeader,
} from '@coreui/react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../customer/loading';
import "react-datepicker/dist/react-datepicker.css";
class AddServices extends Component {
    constructor(props) {
        super(props);

        this.state = {
            laundry: [],
            services: [],
            isLaundryLoaded: false
        };
        console.log(props.match.params.id)
    }

    handleOnChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
        console.log(e.target.value)
    }

    handleSubmit = (e) => {
        e.persist();
        e.stopPropagation();

        toast.configure();
        this.setState({
            isLaundryLoaded: true
        });

        axios.post(`https://labubbles.online/api/owner/laundry/${this.props.match.params.id}/service/store`, {
            title: this.state.title,
            price: this.state.price,
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        })
            .then(result => {
                toast.success(result.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
                this.setState({
                    services: result.data.services,
                    isLaundryLoaded: false
                });
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    isLaundryLoaded: false
                });
                error.response.data.errors.map((error) => {
                    toast.error(error, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                })
            });
    }


    componentWillMount() {

        axios.get(`https://labubbles.online/api/owner/laundry/${this.props.match.params.id}/services`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                if (result.status == 200) {
                    this.setState({
                        services: result.data.services,
                    })
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        const services = this.state.services;
        if (this.state.isLaundryLoaded) {
            return (
                <Loading />
            );
        }

        return (
            <div className="animated fadeIn">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <div className="card card-add mt-3">
                                    <div className="card-header">
                                        <h3 className="text-center">Add Services / Detergent</h3>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={this.handleSubmit}>
                                            <div className="form-group">
                                                <label htmlFor="inputTitle">Service Name</label>
                                                <input type="text" name="title" onChange={this.handleOnChange} className="form-control" id="inputTitle" placeholder="Enter Service Name" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputPrice">Price</label>
                                                <input type="number" name="price" onChange={this.handleOnChange} className="form-control" id="inputPrice" />
                                            </div>

                                            <div className="form-group text-right">
                                                <button type="cancel" className="btn btn-danger mr-2">Cancel</button>
                                                <button type="submit" className="btn btn-primary">Submit</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="services mb-5">
                                    <div className="list-group">
                                        <h3 className="mb-3">Services / Detergent</h3>
                                        {services.length > 0 ?
                                            services.map((service, i) => (
                                                <span className="list-group-item list-group-item-action" key={i}>{service.title} <span className="badge badge-pill badge-primary pull-right">{`P ${service.price}`}</span></span>
                                            )) : (
                                                <div className="text-center mt-2">
                                                    <h1>No Services</h1>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddServices;
