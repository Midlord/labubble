import React, { Component, lazy, Suspense } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {
    Card,
    CardBody,
    Col,
    Row,
} from 'reactstrap';


class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

        this.state = {
            dropdownOpen: false,
            radioSelected: 2,
            isLoggedIn: false,
            books: []
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
        });
    }

    onRadioBtnClick(radioSelected) {
        this.setState({
            radioSelected: radioSelected,
        });
    }

    componentWillMount() {
        this.setState({
            isloaded: true
        });
        axios.get(`https://stockwatch.site/public/api/books/user`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                console.log(result)
                if (result.status === 200) {
                    this.setState({
                        books: result.data.book,
                        isloaded: false,
                    })
                }
            })
            .catch(error => {
                this.setState({
                    isloaded: true
                });

                console.log(error)
            });

        // console.log('services', this.state.services)
    }



    loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

    render() {
        return (
            <div className="animated fadeIn">
                <div className="latest-books mt-5">
                    <h3>Recent Orders</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>LaundryShop</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.books.map((book, i) => (
                                <tr key={i}>
                                    <td><Link to={`/user/book/${book.id}`}>{moment(book.created_at).format('YYYY-MM-DD')}</Link></td>

                                    <td>{book.laundry_shop.shopName}</td>
                                    <td>{book.amount}</td>
                                    <td>{book.status}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Dashboard;
