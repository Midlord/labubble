import React, { Component } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../customer/loading';
import moment from 'moment';
import { _ } from 'core-js';
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import ReactTable from "react-table";
import "react-table/react-table.css";

class Owners extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isloaded: false,
            reports: []
        };

    }

    componentWillMount() {
        this.setState({
            isloaded: true
        });
        axios.get(`https://labubbles.online/api/admin/reports`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                if (result.status === 200) {
                    this.setState({
                        reports: result.data.reports,
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

    render() {
        const reports = this.state.reports;
        if (this.state.isloaded) {
            return (
                <Loading />
            )
        }

        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <i className="fa fa-align-justify"></i> Reports</div>
                            <div className="card-body">
                                <ReactTable
                                    data={reports}
                                    filterable
                                    defaultSortDesc={true}
                                    defaultPageSize={10}
                                    columns={[
                                        {
                                            columns: [
                                                {
                                                    Header: 'Date',
                                                    accessor: 'created_at',
                                                    Cell: row => (
                                                        <span>{moment(row.original.created_at).format('YYYY-MM-DD')}</span>
                                                    ),
                                                    headerClassName: 'text-left'
                                                },
                                                {
                                                    Header: 'Reported By',
                                                    accessor: 'reported_by.firstName',
                                                    Cell: row => (
                                                        <span>{row.original.reported_by.firstName} {row.original.reported_by.lastName}</span>
                                                    ),
                                                    headerClassName: 'text-left'
                                                },
                                                {
                                                    Header: 'Reported To',
                                                    accessor: 'reported_to.firstName',
                                                    Cell: row => (
                                                        <span>{row.original.reported_to.firstName} {row.original.reported_to.lastName}</span>
                                                    ),
                                                    headerClassName: 'text-left'
                                                },
                                                {
                                                    Header: 'Remarks',
                                                    accessor: 'remarks',
                                                    Cell: row => (
                                                        <span>{row.original.remarks}</span>
                                                    ),
                                                    headerClassName: 'text-left'
                                                }
                                            ]
                                        }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Owners;
