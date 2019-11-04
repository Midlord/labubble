import React, { Component } from 'react';

import '../../owner/laundries/css/EditLaundry.css';
import axios from 'axios';
import {
    AppHeader,
} from '@coreui/react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../customer/loading';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import FileBase64 from 'react-file-base64';
class EditLaundry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            laundry: [],
            selectedOptions: [],
            services: [],
            laundry_id: '',
            shopName: '',
            opening: '',
            closing: '',
            openDay: '',
            slotDry: '',
            slotWash: '',
            dryPrice: '',
            washPrice: '',
            type: '',
            kiloWash: 1,
            kiloDry: 1,
            price: '',
            files: [],
            image: '',
            imageName: '',
            imageType: '',
            isKilos: false,
            isLoads: false,
            isLaundryLoaded: false,
            isLaundryShop: false,
            isServices: false,
            title: '',
            price: ''
        };
        console.log(props.match.params.id)
    }

    handleOnChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
        console.log(e.target.value)
    }

    isLaundryShop = (boolean) => {
        this.setState({
            isLaundryShop: boolean,
        });
    }



    handleOpeningDays = (e) => {
        let target = e.target

        let name = target.name
        //here
        if (target.value === "Weekends") {
            console.log(target);
        }
        let value = Array.from(target.selectedOptions, option => option.value);
        this.setState({
            [name]: value
        });

        console.log(this.state.selectedOptions)

    }

    goBack = (e) => {
        this.props.history.goBack()
    }


    // Callback~
    getFiles(files) {

        toast.configure();
        if (files.type !== 'image/jpeg' && files.type !== 'image/png') {
            toast.error('You must upload png or jpeg image format.', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            this.setState({
                files: '',
                image: '',
                imageName: '',
                imageType: '',
            });
        } else {
            this.setState({
                files: files,
                image: files.base64,
                imageName: files.name,
                imageType: files.type
            })

        }
    }

    handleServiceSubmit = (e) => {
        e.persist();
        e.stopPropagation();

        toast.configure();
        this.setState({
            isLaundryLoaded: true
        });

        axios.post(`https://labubbles.online/api/owner/laundry/${this.state.laundry.id}/service/store`, {
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
        this.setState({
            isLaundryLoaded: true,
            isServicesLoaded: true
        })
        axios.get(`https://labubbles.online/api/owner/laundry`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                if (result.status == 200) {
                    console.log(result.data)
                    this.setState({
                        laundry: result.data.laundry,
                        owner: result.data.laundry.user,
                        services: result.data.services,
                        average_ratings: result.data.average_ratings,
                        ratings: result.data.ratings,
                        isLaundryLoaded: false,
                        shopName: result.data.laundry.shopName,
                        houseNumber: result.data.laundry.houseNumber,
                        street: result.data.laundry.street,
                        barangay: result.data.laundry.barangay,
                        city: result.data.laundry.city,
                        opening: moment(result.data.laundry.opening).toDate(),
                        closing: moment(result.data.laundry.closing).toDate(),
                        openDay: result.data.laundry.created_at,
                        selectedOptions: result.data.laundry.openDay.split(" "),
                        slotDry: result.data.laundry.slotDry,
                        slotWash: result.data.laundry.slotWash,
                        dryPrice: result.data.laundry.dryPrice,
                        washPrice: result.data.laundry.washPrice,
                        type: result.data.laundry.type,
                        price: result.data.laundry.price,
                        isLaundryShop: true,
                        image: `https://labubbles.online/storage/laundries/${result.data.laundry.image}`,
                    });
                    this.state.type === "kilos" ? this.setState({ isKilos: true, isLoads: false }) : this.setState({ isKilos: false, isLoads: true })


                    let dateNow = this.state.closing.toString();
                    console.log(dateNow.replace(/:/g, ' '))

                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    handleKilos = (e) => {
        e.preventDefault();
        this.setState({
            isKilos: true,
            isLoads: false,
            kiloWash: 1,
            kiloDry: 1,
            type: 'kilos'
        })
    }

    handleLoads = (e) => {
        e.preventDefault();
        this.setState({
            isLoads: true,
            isKilos: false,
            type: 'loads'
        })
    }

    handleSubmit = (e) => {
        e.persist();
        e.stopPropagation();

        toast.configure();
        this.setState({
            isLaundryLoaded: true
        });

        axios.post(`https://labubbles.online/api/owner/laundry/update`, {
            shopName: this.state.shopName,
            opening: moment(this.state.opening).format('YYYY-MM-DD HH:mm:ss'),
            closing: moment(this.state.closing).format('YYYY-MM-DD HH:mm:ss'),
            openDay: this.state.selectedOptions.join(', '),
            slotDry: this.state.slotDry,
            slotWash: this.state.slotWash,
            dryPrice: this.state.dryPrice,
            washPrice: this.state.washPrice,
            type: this.state.type,
            price: this.state.price,
            kiloWash: this.state.kiloWash,
            kiloDry: this.state.kiloDry,
            image: this.state.image,
            imageName: this.state.imageName,
            imageType: this.state.imageType,
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
                sessionStorage.setItem('isHasShop', true)
                this.setState({
                    isLaundryLoaded: false,
                    laundry_id: result.data.laundry.id
                });
                // this.props.history.push(`/owner/laundry/${this.state.laundry_id}/services`);


            })
            .catch(error => {
                console.log(error)
                this.setState({
                    isLaundryLoaded: false,
                });
                error.response.data.errors.map((error) => {
                    toast.error(error, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                })
            });
    }


    handleStartTimeChange = (date) => {
        this.setState({
            opening: date
        });

        console.log(this.state.opening)
    };

    handleEndTimeChange = (date) => {
        this.setState({
            closing: date
        });
    };

    render() {
        if (this.state.isLaundryLoaded) {
            return (
                <Loading />
            );
        }

        const StartTimePicker = () => {
            return (
                <DatePicker
                    className="form-control"
                    onChange={this.handleStartTimeChange}
                    selected={this.state.opening}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                />
            );
        }

        const EndTimePicker = () => {
            return (
                <DatePicker
                    className="form-control"
                    onChange={this.handleEndTimeChange}
                    selected={this.state.closing}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                />
            );
        }
        return (
            <div className="animated fadeIn">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12 mb-3">
                                <div className="row">
                                    <div className="col-6 pr-0">
                                        <button className="btn btn-primary w-100" onClick={() => this.isLaundryShop(true)}>Laundry</button>
                                    </div>
                                    <div className="col-6 pl-0">
                                        <button className="btn btn-primary w-100" onClick={() => this.isLaundryShop(false)}>Services</button>
                                    </div>
                                </div>
                            </div>
                            {this.state.isLaundryShop ? (
                                <div className="col-12">
                                    <div className="card card-add">
                                        <div className="card-header">
                                            <h3 className="text-center">{`Update ${this.state.laundry.shopName}`}</h3>
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={this.handleSubmit}>
                                                <div className="form-group">
                                                    <label htmlFor="inputShopName">Shop Name</label>
                                                    <input type="text" name="shopName" onChange={this.handleOnChange} value={this.state.shopName} className="form-control" id="inputShopName" placeholder="Enter Shop Name" />
                                                </div>
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <label htmlFor="inputShopName">Opening</label>
                                                            <StartTimePicker />
                                                        </div>
                                                        <div className="col-6">
                                                            <label htmlFor="inputShopName">Closing</label>
                                                            <EndTimePicker />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <label htmlFor="inputShopName">Slot Wash Machine</label>
                                                            <input type="number" name="slotDry" onChange={this.handleOnChange} value={this.state.slotDry} className="form-control" id="inputShopName" />
                                                        </div>
                                                        <div className="col-6">
                                                            <label htmlFor="inputShopName">Slot Dry Machine</label>
                                                            <input type="number" name="slotWash" onChange={this.handleOnChange} value={this.state.slotWash} className="form-control" id="inputShopName" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-6 pr-0">
                                                            <button className="btn btn-primary w-100" onClick={this.handleKilos}>Kilos</button>
                                                        </div>
                                                        <div className="col-6 pl-0">
                                                            <button className="btn btn-primary w-100" onClick={this.handleLoads}>Loads</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {this.state.isKilos ? (
                                                    <div className="form-group">
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <label htmlFor="inputShopName">Kilo</label>
                                                                <input type="number" name="kiloWash" defaultValue={this.state.kiloWash} className="form-control" readOnly />
                                                            </div>
                                                            <div className="col-6">
                                                                <label htmlFor="inputShopName">Kilo</label>
                                                                <input type="number" name="kiloDry" defaultValue={this.state.kiloDry} className="form-control" readOnly />
                                                            </div>
                                                            <div className="col-12">
                                                                <label htmlFor="inputShopName">Price</label>
                                                                <input type="number" name="price" onChange={this.handleOnChange} value={this.state.price} className="form-control" id="inputShopName" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : ''}
                                                {this.state.isLoads ? (
                                                    <div className="form-group">
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <label htmlFor="inputShopName">Price</label>
                                                                <input type="number" name="washPrice" onChange={this.handleOnChange} value={this.state.washPrice} className="form-control" id="inputShopName" />
                                                            </div>
                                                            <div className="col-6">
                                                                <label htmlFor="inputShopName">Price</label>
                                                                <input type="number" name="dryPrice" onChange={this.handleOnChange} value={this.state.dryPrice} className="form-control" id="inputShopName" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : ''}
                                                <div className="form-group">
                                                    <label htmlFor="openDayInput">Open Days</label>
                                                    <select name="selectedOptions" onChange={this.handleOpeningDays} value={this.state.selectedOptions} className="form-control" id="openDayInput" multiple>
                                                        <option value="None" disabled>Select Date</option>
                                                        <option value="Weekends">Weekends</option>
                                                        <option value="Weekdays">Weekdays</option>
                                                        <option value="Monday">Monday</option>
                                                        <option value="Tuesday">Tuesday</option>
                                                        <option value="Wednesday">Wednesday</option>
                                                        <option value="Thursday">Thursday</option>
                                                        <option value="Friday">Friday</option>
                                                        <option value="Saturday">Saturday</option>
                                                        <option value="Sunday">Sunday</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="laundryImage">Photo</label>
                                                    <FileBase64
                                                        multiple={false}
                                                        onDone={this.getFiles.bind(this)} />
                                                </div>
                                                <div className="form-group">
                                                    <div className="mb-3 text-center">
                                                        <img src={this.state.image ? this.state.image : require('../../customer/laundries/dummy.png')} width="200" height="200 " />
                                                    </div>
                                                </div>
                                                <div className="form-group text-right">
                                                    <button type="button" onClick={this.goBack} className="btn btn-danger mr-2">Cancel</button>
                                                    <button type="submit" className="btn btn-primary">Submit</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                    <div className="col-12 parent">
                                        <div className="card card-add mt-3">
                                            <div className="card-header">
                                                <h3 className="text-center">Add Services</h3>
                                            </div>
                                            <div className="card-body">
                                                <form onSubmit={this.handleServiceSubmit}>
                                                    <div className="form-group">
                                                        <label htmlFor="inputTitle">Service Name</label>
                                                        <input type="text" name="title" onChange={this.handleOnChange} value={this.state.title} className="form-control" id="inputTitle" placeholder="Enter Service Name" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="inputPrice">Price</label>
                                                        <input type="number" name="price" onChange={this.handleOnChange} className="form-control" id="inputPrice" />
                                                    </div>

                                                    <div className="form-group text-right">
                                                        <button type="button" className="btn btn-danger mr-2">Cancel</button>
                                                        <button type="submit" className="btn btn-primary">Submit</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <div className="services mb-5">
                                            <div className="list-group">
                                                <h3 className="mb-3">Services</h3>
                                                {this.state.services.length > 0 ?
                                                    this.state.services.map((service, i) => (
                                                        <span className="list-group-item list-group-item-action" key={i}>{service.title} <span className="badge badge-pill badge-primary pull-right">{`P ${service.price}`}</span></span>
                                                    )) : (
                                                        <div className="text-center mt-2">
                                                            <h1>No Services</h1>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditLaundry;
