import React, { Component, lazy, Suspense } from 'react';
import axios from 'axios';
import moment from 'moment';


class Sales extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            dropdownOpen: false,
            radioSelected: 2,
            isLoggedIn: false,
            sales: [],
            total: ''
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
        });
    }

    componentWillMount() {
        this.setState({
            isloaded: true
        });
        axios.get(`https://labubbles.online/api/delivery/sales`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                console.log(result)
                if (result.status === 200) {
                    this.setState({
                        sales: result.data.sales,
                        total: result.data.sum,
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
        const Sum = (num1, num2) => console.log(num1 + num2);
        return (
            <div className="animated fadeIn">
                <div className="card mt-5">
                    <div className="card-body">
                        <div className="latest-books">
                            <div className="row mb-2">
                                <div className="col-6">
                                    <h3>Daily Sales</h3>

                                </div>
                            </div>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.sales.map((sale, i) => (
                                        <tr key={i}>
                                            <td>{moment(sale.created_at).format('YYYY-MM-DD')}</td>
                                            <td>{sale.status}</td>
                                            <td>{`P${parseFloat(sale.amount).toFixed(2)}`}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td><strong>Total:</strong> </td>
                                        <td><strong className="text-danger">P{this.state.total}</strong></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sales;
