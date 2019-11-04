import React, { Component } from 'react';

import '../books/book.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Loading from '../loading';
import moment from 'moment';
class Book extends Component {
    constructor(props) {
        super(props);

        this.state = {
            laundry: [],
            owner: [],
            services: [],
            isRadioChecked: false,
            isCheckBoxChecked: false,
            addresses: [],
            isloaded: false,
            startDate: "",
            endDate: "",
            startTime: '',
            endTime: '',
            selectedServices: [],
            checkedItems: {},
            selectedItems: {},
            qty: '',
            wash: '',
            dry: '',
            kiloWash: '',
            kiloDry: '',
            startEstimate: '',
            endEstimate: '',
            remarks: '',
            address_id: '',
        };

        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
        this.onAddressChanged = this.onAddressChanged.bind(this);
        this.onServicesChanged = this.onServicesChanged.bind(this);
        this.onHandleChange = this.onHandleChange.bind(this);
        // this.onHandleRemarksChange = this.onHandleRemarksChange.bind(this);

    }

    componentWillMount() {

        this.setState({
            isloaded: true
        });
        axios.get(`https://labubbles.online/api/services/laundry/${this.props.match.params.id}/${sessionStorage.getItem('user_id')}`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                if (result.status === 200) {
                    console.log(result.data)
                    this.setState({
                        services: result.data.services,
                        addresses: result.data.addresses,
                        laundry: result.data.laundry,
                        isloaded: false
                    })
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    handleStartChange = (date) => {
        console.log(date);
        // let opening = moment(this.state.laundry.opening).format('h');
        // let start = date.setHours(date.getHours() + opening);
        let newTime = moment(date).add(2, 'hours').toDate();
        let pickedTime = moment(date).format('hh:mm:ss');
        let startEstimate = moment(date).add(1, 'hours').format('hh:mm A');

        let estimateInfo = `Estimated time: ${pickedTime} - ${startEstimate}`;
        this.setState({
            startDate: date,
            endDate: newTime,
            startEstimate: estimateInfo
        });
        console.log(this.state.endDate)
    };

    handleEndChange = (date) => {
        let pickedTime = moment(date).format('hh:mm:ss');
        let startEstimate = moment(date).add(1, 'hours').format('hh:mm A');

        let estimateInfo = `Estimated time: ${pickedTime} - ${startEstimate}`;
        this.setState({
            endDate: date,
            endEstimate: estimateInfo
        });
    };


    onHandleChange = (e) => {
        e.target.validity.valid ?
            this.setState({
                [e.target.name]: e.target.value <= 0 ? "" : e.target.value
            })
            :
            e.target.value.replace(/\D/, '')
        // this.setState({
        //     [e.target.name]: e.target.value
        // })

    }

    // onHandleRemarksChange = (e) => {
    //     this.setState({ [e.target.name]: e.target.value });
    // }


    onServicesChanged = (service, e) => {
        let arrayOfServiceId = [];
        let checkedItems = this.state.checkedItems;
        checkedItems[service.id] = e.target.checked;
        this.setState({
            checkedItems,
        })

        Object.keys(this.state.checkedItems).map((i) => {
            if (!this.state.checkedItems[i]) {
                delete this.state.checkedItems[i]
            }
            arrayOfServiceId.push(i);
        })

        // console.log(arrayOfServiceId);
        this.setState({
            selectedServices: arrayOfServiceId,
        })


    }

    onAddressChanged = (e) => {
        console.log(e.target.value)
        this.setState({
            address_id: e.target.value
        })
    }

    goBack = (e) => {
        this.props.history.goBack()
    }

    handleSubmit = (e) => {
        e.preventDefault();

        toast.configure();
        this.setState({
            isloaded: true
        });
        axios.post('https://labubbles.online/api/book/store', {
            user_id: sessionStorage.getItem('user_id'),
            address_id: this.state.address_id,
            laundry_shop_id: this.props.match.params.id,
            services: this.state.selectedServices.toString(),
            pickUpDate: `${moment(this.state.startDate).format('YYYY-MM-DD HH:mm:ss')}`,
            dropOffDate: `${moment(this.state.endDate).format('YYYY-MM-DD HH:mm:ss')}`,
            wash: this.state.wash,
            type: this.state.laundry.type,
            dry: this.state.dry,
            kiloWash: this.state.kiloWash,
            kiloDry: this.state.kiloDry,
            remarks: this.state.remarks
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        })
            .then(result => {
                // toast.success(result.data.message, {
                //     position: toast.POSITION.BOTTOM_RIGHT
                // });

                this.setState({
                    isloaded: false
                });
                this.props.history.push(`/user/laundry/${this.props.match.params.id}/book/${result.data.book.id}`);
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    isloaded: false
                });
                error.response.data.errors.map((error) => {
                    toast.error(error, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                })
            });


    }

    render() {
        const services = this.state.services;
        const addresses = this.state.addresses;
        const now = moment().toDate();

        let minimumTime = moment(this.state.laundry.opening).toDate();
        let maximumTime = moment(this.state.laundry.closing).toDate();
        console.log(minimumTime);
        console.log(maximumTime);
        const StartDatePicker = () => {
            return (
                <DatePicker
                    // value={}
                    minDate={now}
                    minTime={minimumTime}
                    maxTime={maximumTime}
                    showTimeSelect
                    onChange={this.handleStartChange}
                    selected={this.state.startDate}
                    dateFormat="MMMM d, yyyy h:mm aa"
                />
            )
        };

        const EndDatePicker = () => {
            return (
                <DatePicker
                    minDate={this.state.startDate}
                    showTimeSelect
                    onChange={this.handleEndChange}
                    selected={this.state.endDate}
                    dateFormat="MMMM d, yyyy h:mm aa"
                />
            )
        };

        // const StartTimePicker = () => {
        //     return (
        //         <DatePicker
        //             onChange={this.handleStartTimeChange}
        //             selected={this.state.startTime}
        //             showTimeSelect
        //             showTimeSelectOnly
        //             timeIntervals={15}
        //             timeCaption="Time"
        //             dateFormat="h:mm aa"
        //         />
        //     );
        // }

        // const EndTimePicker = () => {
        //     return (
        //         <DatePicker
        //             onChange={this.handleEndTimeChange}
        //             selected={this.state.endTime}
        //             showTimeSelect
        //             showTimeSelectOnly
        //             timeIntervals={15}
        //             timeCaption="Time"
        //             dateFormat="h:mm aa"
        //         />
        //     );
        // }

        const UserAddresses = () => {
            return (
                addresses.map((address, i) => (
                    <div className="form-check" key={i}>
                        <input className="form-check-input"
                            type="radio"
                            name="address_id"
                            value={address.id}
                            checked={this.state.address_id == address.id}
                            onChange={this.onAddressChanged} />
                        <label>{address.houseNumber} {address.street} {address.barangay} {address.city} {address.province} {address.country}</label>
                    </div>
                ))
            )
        }

        const WashAndDry = () => {
            return (
                <div className="parent">
                    <h4>Wash & Dry</h4>
                    <div className="WD">
                        <div className="list-group">
                            <span className="list-group-item list-group-item-action">
                                Wash
                            <span className="pull-right">
                                    <input type="number" className="small-input text-center" name="wash" value={this.state.wash} pattern="[0-9]*" max={this.state.laundry.slotWash} id="wash" placeholder="Wash" onChange={this.onHandleChange} autoComplete="off" />
                                </span>
                                <span className="badge badge-pill badge-primary pull-right badge-align">{`P ${this.state.laundry.washPrice}`}</span>
                            </span>
                        </div>
                        <div className="list-group">
                            <span className="list-group-item list-group-item-action">
                                Dry
                            {this.state.laundry.slotDry > 0 ? (
                                    <span className="pull-right">
                                        <input type="number" className="small-input text-center" name="dry" value={this.state.dry} pattern="[0-9]*" max={this.state.laundry.slotDry} id="dry" placeholder="dry" onChange={this.onHandleChange} autoComplete="off" />
                                    </span>
                                ) : ``}
                                <span className="badge badge-pill badge-primary pull-right badge-align">{this.state.laundry.slotDry > 0 ? `P ${this.state.laundry.dryPrice}` : `Out of Stock`}</span>
                            </span>
                        </div>
                    </div>
                </div>
            )
        }


        const Kilos = () => {
            return (
                <div className="parent">
                    <h4>Services</h4>
                    <div className="WD">
                        <div className="list-group">
                            <span className="list-group-item list-group-item-action">
                                Wash
                                <span className="pull-right">
                                    <input type="number" className="small-input text-center" name="kiloWash" placeholder="per" value={this.state.kiloWash} pattern="[0-9]*" id="kiloWash" onChange={this.onHandleChange} autoComplete="off" />
                                </span>
                                <span className="badge badge-pill badge-primary pull-right badge-align">{`P ${this.state.laundry.price}`}</span>
                            </span>
                            <span className="list-group-item list-group-item-action">
                                Dry
                                <span className="pull-right">
                                    <input type="number" className="small-input text-center" name="kiloDry" placeholder="per" value={this.state.kiloDry} pattern="[0-9]*" id="kiloDry" onChange={this.onHandleChange} autoComplete="off" />
                                </span>
                                <span className="badge badge-pill badge-primary pull-right badge-align">{`P ${this.state.laundry.price}`}</span>
                            </span>
                        </div>
                    </div>
                </div>
            )
        }


        const UserServices = () => {
            return (
                services.map((service, i) => (
                    <div className="form-check" key={i}>
                        <div className="checkbox-container">
                            <input className="form-check-input checkbox-top"
                                type="checkbox"
                                name="service_id"
                                value={service.id}
                                checked={this.state.checkedItems[service.id]}
                                onChange={(e) => this.onServicesChanged(service, e)} />
                        </div>
                        <div className="list-group">
                            <span className="list-group-item list-group-item-action" key={i}>
                                {service.title}
                                {/* <span className="pull-right">
                                    <input type="number" className="small-input text-center" name="qty" value={this.state.qty} pattern="[0-9]*" id="qty" placeholder="qty" onChange={(e) => this.onQtyChange(service, e)} autoComplete="off" />
                                </span> */}
                                {/* .badge-align */}
                                <span className="badge badge-pill badge-primary pull-right">{`P ${service.price}`}</span>
                            </span>
                        </div>
                    </div>
                ))
            )
        }

        const Remarks = () => {
            return (
                <div className="form-group">
                    <label htmlFor="">Special Instructions: </label>
                    <textarea name="remarks" className="form-control" row="5" onChange={this.onHandleChange}></textarea>
                </div>
            )
        }

        if (this.state.isloaded) {
            return (
                <div><Loading /></div>
            );
        }


        return (
            <div className="animated fadeIn">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="content col mt-5 mb-5">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col-12 mb-5">
                                            <h4 className="mb-3">Schedule a Pick-Up</h4>
                                            <div className="row">
                                                <div className="col-12">
                                                    <StartDatePicker />
                                                </div>
                                                <div className="col-12 mt-3">
                                                    <h4>{this.state.startEstimate}</h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <h4 className="mb-2">Schedule a Drop-Off</h4>
                                            <div className="row">
                                                <div className="col-12">
                                                    <EndDatePicker />
                                                </div>
                                                <div className="col-12 mt-3">
                                                    <h4>{this.state.endEstimate}</h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 mt-5">
                                            <h4>Address</h4>
                                            <UserAddresses />
                                        </div>
                                        <div className="col-12 mt-5">
                                            {this.state.laundry.type === 'loads' ? (
                                                <WashAndDry />
                                            ) : (<Kilos />)}
                                        </div>
                                        <hr />
                                        <div className="col-12 mt-5">
                                            <h4>Other Services</h4>
                                            <UserServices />
                                        </div>
                                        <hr />
                                        {/* <div className="col-12 mt-3 text-right">
                                    <p>Total: <strong>P 10000</strong></p>
                                </div> */}
                                        <div className="col-md-12 mt-5">
                                            <Remarks />
                                        </div>
                                        <div className="col-12 mt-5">
                                            <div className="row">
                                                <div className="col-6">
                                                    <button onClick={this.goBack} className="btn btn-default btn-block book_btn">Back</button>
                                                </div>
                                                <div className="col-6">
                                                    <button className="btn-primary btn-block book_btn">Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Book;
