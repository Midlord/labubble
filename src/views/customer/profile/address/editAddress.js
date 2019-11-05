import React, { Component } from 'react';

import '../../../owner/laundries/css/addLaundry.css';
import axios from 'axios';
import {
    AppHeader,
} from '@coreui/react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../loading';
import "react-datepicker/dist/react-datepicker.css";

const barangays = [
    "Agapito Del Rosario",
    "Amsic",
    "Anunas",
    "Balibago",
    "Capaya",
    "Claro M. Recto",
    "Cuayan",
    "Cutcut",
    "Cutud",
    "Lourdes North West",
    "Lourdes Sur",
    "Lourdes Sur East",
    "Malabañas",
    "Margot",
    "Marisol",
    "Mining",
    "Pampang",
    "Pandan",
    "Pulungbulu",
    "Pulung Cacutud",
    "Pulung Maragul",
    "Salapungan",
    "San Jose",
    "San Nicolas",
    "Sta. Teresita",
    "Sta. Trinidad",
    "Sto. Cristo",
    "Sto. Domingo",
    "Sto. Rosario",
    "Sapalibutad",
    "Sapangbato",
    "Tabun",
    "Virgen Delos Remedios"
];

class EditAddress extends Component {
    constructor(props) {
        super(props);

        this.state = {
            houseNumber:'',
            street:'',
            barangay:'',
            laundry: [],
            address: [],
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

        axios.post(`https://labubbles.online/api/customer/update/address/${this.props.match.params.id}`, {
            houseNumber: this.state.houseNumber,
            street: this.state.street,
            barangay: this.state.barangay,
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

                this.props.history.push(`/profile`);
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    isLaundryLoaded: false
                });

                toast.error(error.response.data.errors, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });

            });
    }


    componentWillMount() {

        axios.get(`https://labubbles.online/api/customer/edit/address/${this.props.match.params.id}`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                if (result.status == 200) {
                    this.setState({
                        address: result.data.address,
                        houseNumber: result.data.address.houseNumber,
                        street:result.data.address.street,
                        barangay: result.data.address.barangay
                    });
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {
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
                                        <h3 className="text-center">Edit Address</h3>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={this.handleSubmit}>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-6">
                                                        <label htmlFor="houseNumber">House #</label>
                                                        <input type="text" className="form-control" name="houseNumber" id="houseNumber" onChange={this.handleOnChange} placeholder="House #" value={this.state.houseNumber} />
                                                    </div>
                                                    <div className="col-6">
                                                        <label htmlFor="street">Street <span className="text-danger">*</span></label>
                                                        <input type="text" className="form-control" name="street" id="street" onChange={this.handleOnChange} placeholder="Street" value={this.state.street} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="barangay">Barangay <span className="text-danger">*</span></label>
                                                <select name="barangay" className="form-control" onChange={this.handleOnChange} value={this.state.barangay}>
                                                    <option value="">--Select Barangay--</option>
                                                    {barangays.map((item) => (
                                                        <option key={item}>{item}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group text-right">
                                                <button type="submit" className="btn btn-primary">Submit</button>
                                            </div>
                                        </form>
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

export default EditAddress;
