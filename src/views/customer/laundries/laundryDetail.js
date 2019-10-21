import React, { Component } from 'react';

import '../laundries/laundryDetail.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../loading';
import { Rating } from 'semantic-ui-react';
import moment from 'moment';
class LaundryDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            laundry: [],
            owner: [],
            services: [],
            ratings: [],
            rater: [],
            type:'',
            average_ratings: 0,
            totalSlots: 0,
            isLaundryLoaded: false
        };
        console.log(props.match.params.id)
    }

    handleOnChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleRatings = (e) => {

    }


    componentWillMount() {
        this.setState({
            isLaundryLoaded: true,
            isServicesLoaded: true
        })
        axios.get(`https://stockwatch.site/public/api/services/laundry/${this.props.match.params.id}/${sessionStorage.getItem('user_id')}`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                if (result.status == 200) {
                    console.log(result.data)
                    this.setState({
                        laundry: result.data.laundry,
                        services: result.data.services,
                        owner: result.data.laundry.user,
                        ratings: result.data.ratings,
                        rater: result.data.ratings.user,
                        average_ratings: result.data.average_ratings,
                        replies: result.data.replies,
                        isTransact: result.data.checkTransaction,
                        isLaundryLoaded: false
                    })
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        const services = this.state.services;
        const laundry = this.state.laundry;
        const total = this.state.laundry.slotWash + this.state.laundry.slotDry;
        const laundry_id = this.props.match.params.id;
        const ratings = this.state.ratings;
        const totalSlots = this.state.totalSlots;

        if (this.state.isLaundryLoaded) {
            return (
                <Loading />
            );
        }

        const CreateRatings = (stars) => {
            let ratings = []
            let children = []
            //Inner loop to create children
            for (let j = 0; j < parseInt(stars.stars, 10); j++) {
                children.push(<i className="fa fa-star" key={j}></i>)
            }
            //Create the parent and add the children
            ratings.push(children)

            return ratings
        }

        const CommentAndReplies = () => {
            return (
                ratings.map((rating, i) => (
                    <div className="comment-content" key={i}>
                        <div className="comment">
                            <div className="avatar">
                                <img src={!rating.user.image ? "https://react.semantic-ui.com/images/avatar/small/elliot.jpg" : `https://stockwatch.site/public/storage/laundries/${rating.user.image}`} />
                            </div>
                            <div className="content">
                                <a className="author">{`${rating.user.firstName} ${rating.user.lastName}`}</a>
                                <div className="metadata"><div>{moment(rating.created_at).fromNow()}</div></div>
                                <div className="color-star mb-1">
                                    <CreateRatings stars={rating.stars} />
                                </div>
                                <div className="text"><p>{rating.message}</p></div>
                                {/* <div className="actions"><a className="">Reply</a></div> */}
                            </div>
                            {/* <Replies/> */}
                        </div>
                    </div>
                ))

            )
        }

        const Replies = () => {
            return (
                <div className="ui comments">
                    <div className="comment">
                        <div className="avatar">
                            <img src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg" />
                        </div>
                        <div className="content">
                            <a className="author">Jenny Hess</a>
                            <div className="metadata"><div>Just now</div></div>
                            <div className="text">Elliot you are always so right :)</div>
                            {/* <div className="actions"><a className="">Reply</a></div> */}
                        </div>
                    </div>
                </div>
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
                        <span className="badge badge-pill badge-primary pull-right badge-align">{`P ${this.state.laundry.washPrice}`}</span>
                            </span>
                        </div>
                        <div className="list-group">
                            <span className="list-group-item list-group-item-action">
                                Dry
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
                    <h4>Kilos</h4>
                    <div className="WD">
                        <div className="list-group">
                            <span className="list-group-item list-group-item-action">
                                Wash
                                <span className="badge badge-pill badge-primary pull-right badge-align">{`P ${this.state.laundry.price} per Kilo`}</span>
                            </span>
                        </div>
                        <div className="list-group">
                            <span className="list-group-item list-group-item-action">
                                Dry
                                <span className="badge badge-pill badge-primary pull-right badge-align">{`P ${this.state.laundry.price} per Kilo`}</span>
                            </span>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="content col mt-5">
                        <div className="row">
                            <div className="col">
                                <div className="mb-3">
                                    <img className="btn-md img-size" src={require('../laundries/dummy.png')} alt="" />
                                </div>
                            </div>
                            <div className="col">
                                <p className="card-title">{laundry.shopName}</p>
                                <div className="color-star mb-1">
                                    <CreateRatings stars={this.state.average_ratings} />
                                </div>
                                <Link className="btn btn-primary btn-block" to={`/book/laundry/${laundry_id}`}>Book Now </Link>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="mb-1">
                                    <span className="font-weight-bold">Schedule</span>
                                    <p>{laundry.openDay}</p>
                                    <span className="font-weight-bold">Opening - Closing</span>
                                    <p>{moment(laundry.opening, 'h:mm A').format('h:mm A')} - {moment(laundry.closing, 'h:mm A').format('h:mm A')}</p>
                                </div>
                            </div>
                            <div className="col">
                                <p><span>{`Number of Wash: ${laundry.slotWash}`}</span></p>
                                <p><span>{`Number of Dry: ${laundry.slotDry}`}</span></p>
                            </div>
                        </div>
                        <div className="shop-info mb-5">
                            <div className="row">
                                <div className="col">
                                    <h3 className="mb-3">Shop Info</h3>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-5">
                                    <p><strong>Owners Name:</strong></p>
                                    <p><strong>Email:</strong></p>
                                    <p><strong>Contact No.</strong></p>
                                    <p><strong>Address:</strong></p>
                                </div>
                                <div className="col-7">
                                    <p>{`${this.state.owner.firstName} ${this.state.owner.lastName}`}</p>
                                    <p>{`${this.state.owner.email}`}</p>
                                    <p>{`${this.state.owner.mobileNumber}`}</p>
                                    <p>{`${laundry.barangay}, ${laundry.city}`}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 mb-5">

                            {this.state.laundry.type == 'loads' ? (
                                <WashAndDry />
                            ) : (<Kilos />)}
                        </div>
                        <div className="services mb-5">
                            <div className="list-group">
                                <h3 className="mb-3">Services</h3>
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
                        <div className="reviews mb-5">
                            <div className="ui comments">
                                <h3 className="ui dividing header">Reviews and Comments</h3>
                                <CommentAndReplies />

                                {/* check if has book complete */}
                                {this.state.isTransact.length > 0 ? (
                                    <div className="rating-section mb-5">
                                        <form className="ui reply form" onSubmit={this.handleRatings}>
                                            <div className="field">
                                                <label htmlFor="">Ratings:</label>
                                                <Rating icon='star' defaultRating={0} maxRating={5} />
                                            </div>
                                            <div className="field">
                                                <label htmlFor="">Message:</label>
                                                <textarea rows="3" onChange={this.handleOnChange}></textarea>
                                            </div>
                                            <div className="field mb-3 text-right">
                                                <button className="ui inverted primary button">Add Comment</button>
                                            </div>
                                        </form>
                                    </div>
                                ) : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LaundryDetail;
