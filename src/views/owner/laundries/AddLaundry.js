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
import moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import FileBase64 from 'react-file-base64';
class AddLaundry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            laundry: [],
            selectedOptions: [],
            laundry_id: '',
            shopName: '',
            opening: '',
            closing: '',
            openDay: '',
            slotDry: 0,
            slotWash: 0,
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

    handleKilos = (e) => {
        e.preventDefault();
        this.setState({
            isKilos: true,
            isLoads: false,
            kilos: 1,
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

        axios.post(`https://stockwatch.site/public/api/owner/laundry/store`, {
            shopName: this.state.shopName,
            opening: moment(this.state.opening).format('YYYY-MM-DD hh:mm:ss'),
            closing: moment(this.state.closing).format('YYYY-MM-DD hh:mm:ss'),
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
                this.props.history.push(`/owner/laundry/${this.state.laundry_id}/services`);


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


    componentWillMount() {

    }

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
                    minTime={this.state.opening}
                    maxTime={moment(this.state.opening).add(16, 'hours').toDate()}
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
                            <div className="col-12">
                                <div className="card card-add">
                                    <div className="card-header">
                                        <h3 className="text-center">Add LaundryShop</h3>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={this.handleSubmit}>
                                            <div className="form-group">
                                                <label htmlFor="inputShopName">Shop Name</label>
                                                <input type="text" name="shopName" onChange={this.handleOnChange} className="form-control" id="inputShopName" placeholder="Enter Shop Name" />
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
                                                        <input type="number" name="slotDry" onChange={this.handleOnChange} className="form-control" id="inputShopName" />
                                                    </div>
                                                    <div className="col-6">
                                                        <label htmlFor="inputShopName">Slot Dry Machine</label>
                                                        <input type="number" name="slotWash" onChange={this.handleOnChange} className="form-control" id="inputShopName" />
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
                                                            <label htmlFor="inputShopName">Kilo Wash</label>
                                                            <input type="number" name="kiloWash" defaultValue={this.state.kiloWash} className="form-control" readOnly />
                                                        </div>
                                                        <div className="col-6">
                                                            <label htmlFor="inputShopName">Kilo Dry</label>
                                                            <input type="number" name="kiloDry" defaultValue={this.state.kiloDry} className="form-control" readOnly />
                                                        </div>
                                                        <div className="col-12">
                                                            <label htmlFor="inputShopName">Price of Wash and Dry</label>
                                                            <input type="number" name="price" onChange={this.handleOnChange} className="form-control" id="inputShopName" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : ''}
                                            {this.state.isLoads ? (
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <label htmlFor="inputShopName">Price</label>
                                                            <input type="number" name="washPrice" onChange={this.handleOnChange} className="form-control" id="inputShopName" />
                                                        </div>
                                                        <div className="col-6">
                                                            <label htmlFor="inputShopName">Price</label>
                                                            <input type="number" name="dryPrice" onChange={this.handleOnChange} className="form-control" id="inputShopName" />
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddLaundry;
