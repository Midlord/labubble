import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../customer/loading';
import moment from 'moment';
import { _ } from 'core-js';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import Modal from 'react-modal';
import './css/customer.css';
import ReactTable from "react-table";
import "react-table/react-table.css";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        padding: '0',
        width: '20%',
        transform: 'translate(-50%, -50%)'
    }
};

class Customers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_id: '',
            isloaded: false,
            users: [],
            usersBanned: [],
            modalIsOpen: false
        };

        this.handleBanned = this.handleBanned.bind(this);
        this.handleUnbanned = this.handleUnbanned.bind(this);
        this.openModalBanned = this.openModalBanned.bind(this);
        this.openModalUnbanned = this.openModalUnbanned.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }




    componentWillMount() {
        this.setState({
            isloaded: true
        });
        axios.get(`http://localhost:8000/api/admin/customers`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                if (result.status === 200) {
                    this.setState({
                        users: result.data.users,
                        usersBanned: result.data.usersBanned,
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

    openModalBanned = (id) => {
        console.log(id)
        this.setState({
            BannedmodalIsOpen: true,
            user_id: id
        });
    }

    openModalUnbanned = (id) => {
        console.log(id)
        this.setState({
            UnbannedmodalIsOpen: true,
            user_id: id
        });
    }

    // afterOpenModal() {
    //     // references are now sync'd and can be accessed.
    //     this.subtitle.style.color = '#f00';
    // }

    closeModal() {
        this.setState({
            UnbannedmodalIsOpen: false,
            BannedmodalIsOpen: false,
        });
    }

    handleBanned = (e) => {
        e.preventDefault();
        e.stopPropagation();

        toast.configure();
        axios.delete(`http://localhost:8000/api/admin/customer/${this.state.user_id}/banned`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        })
            .then(result => {
                if (result.status === 200) {
                    console.log(result)
                    this.setState({
                        users: result.data.users,
                        usersBanned: result.data.usersBanned,
                        isloaded: false,
                        UnbannedmodalIsOpen: false,
                        BannedmodalIsOpen: false,
                    })

                    toast.success(result.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                }
            })
            .catch(error => {
                this.setState({
                    isloaded: true
                });

                console.log(error)
            });
    }

    handleUnbanned = (e) => {
        e.preventDefault();
        e.stopPropagation();

        toast.configure();
        axios.get(`http://localhost:8000/api/admin/unbanned/customer/${this.state.user_id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        })
            .then(result => {
                if (result.status === 200) {
                    this.setState({
                        users: result.data.users,
                        usersBanned: result.data.usersBanned,
                        isloaded: false,
                        UnbannedmodalIsOpen: false,
                        BannedmodalIsOpen: false,
                    })

                    toast.success(result.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                }
            })
            .catch(error => {
                this.setState({
                    isloaded: true
                });

                console.log(error)
            });
    }


    render() {
        const users = this.state.users;
        const usersBanned = this.state.usersBanned;
        const UserTable = () => (
            users.map((user, i) => (
                <tr key={i}>
                    <td><Link to={`/admin/customer/${user.id}`}><img src={`http://localhost:8000/storage/avatar/${user.image}`} /></Link></td>
                    <td>{`${user.firstName} ${user.lastName}`}</td>
                    <td>{user.email}</td>
                    <td>{user.mobileNumber}</td>
                    <td>
                        <div className="row">
                            <div className="col-6">
                                <button onClick={() => this.openModalBanned(user.id)} className="btn btn-success">Active</button>
                            </div>
                        </div>
                    </td>
                </tr>
            )
            )
        )

        const UserTableBanned = () => (
            usersBanned.map((user, i) => (
                <tr key={i}>
                    <td><Link to={`/admin/customer/${user.id}`}><img src={`http://localhost:8000/storage/avatar/${user.image}`} /></Link></td>
                    <td>{`${user.firstName} ${user.lastName}`}</td>
                    <td>{user.email}</td>
                    <td>{user.mobileNumber}</td>
                    <td>
                        <div className="row">
                            <div className="col-6">
                                <button onClick={() => this.openModalUnbanned(user.id)} className="btn btn-danger">Unbanned</button>
                            </div>
                        </div>
                    </td>
                </tr>
            )
            )
        )

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
                                <i className="fa fa-align-justify"></i> Customers</div>
                            <div className="card-body">
                                <ReactTable
                                    data={this.state.users}
                                    filterable
                                    defaultSortDesc={true}
                                    defaultPageSize={10}
                                    columns={[
                                        {
                                            columns: [
                                                {
                                                    Header: 'First Name',
                                                    accessor: 'firstName',
                                                    headerClassName: 'text-left'
                                                },
                                                {
                                                    Header: 'Last Name',
                                                    accessor: 'lastName',
                                                    headerClassName: 'text-left'
                                                },
                                                {
                                                    Header: 'Email',
                                                    accessor: 'email',
                                                    headerClassName: 'text-left'
                                                },
                                                {
                                                    Header: 'Mobile Number',
                                                    accessor: 'mobileNumber',
                                                    headerClassName: 'text-left'
                                                },
                                                {
                                                    Header: 'Action',
                                                    Cell: row => (
                                                        <div className="row">
                                                            <div className="col-12 text-center">
                                                                <button onClick={() => this.openModalBanned(row.original.id)} className="btn btn-danger">Ban</button>
                                                            </div>
                                                        </div>
                                                    )
                                                },
                                            ]
                                        }
                                    ]}
                                />

                                <Modal
                                    isOpen={this.state.BannedmodalIsOpen}
                                    onRequestClose={this.closeModal}
                                    ariaHideApp={false}
                                    style={customStyles}
                                    contentLabel="Example Modal"
                                >
                                    <div className="modal-header">
                                        {/* <span>{`${this.state.book.user.firstName} ${this.state.book.user.lastName} `}</span> */}
                                        <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <p>Are you sure you want to Banned this customer?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={this.closeModal}>Close</button>
                                        <button type="button" onClick={this.handleBanned} className="btn btn-primary">Yes</button>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <i className="fa fa-align-justify"></i>Banned Customers</div>
                            <div className="card-body">
                                <ReactTable
                                    data={this.state.usersBanned}
                                    filterable
                                    defaultSortDesc={true}
                                    defaultPageSize={10}
                                    columns={[
                                        {
                                            columns: [
                                                {
                                                    Header: 'First Name',
                                                    accessor: 'firstName',
                                                    headerClassName: 'text-left'
                                                },
                                                {
                                                    Header: 'Last Name',
                                                    accessor: 'lastName',
                                                    headerClassName: 'text-left'
                                                },
                                                {
                                                    Header: 'Email',
                                                    accessor: 'email',
                                                    headerClassName: 'text-left'
                                                },
                                                {
                                                    Header: 'Mobile Number',
                                                    accessor: 'mobileNumber',
                                                    headerClassName: 'text-left'
                                                },
                                                {
                                                    Header: 'Action',
                                                    Cell: row => (
                                                        <div className="row">
                                                            <div className="col-12 text-center">
                                                                <button onClick={() => this.openModalUnbanned(row.original.id)} className="btn btn-success">Unban</button>
                                                            </div>
                                                        </div>
                                                    )
                                                },
                                            ]
                                        }
                                    ]}
                                />
                                <Modal
                                    isOpen={this.state.UnbannedmodalIsOpen}
                                    onRequestClose={this.closeModal}
                                    ariaHideApp={false}
                                    style={customStyles}
                                    contentLabel="Example Modal"
                                >
                                    <div className="modal-header">
                                        {/* <span>{`${this.state.book.user.firstName} ${this.state.book.user.lastName} `}</span> */}
                                        <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <p>Are you sure you want to Unbanned this customer?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={this.closeModal}>Close</button>
                                        <button type="button" onClick={this.handleUnbanned} className="btn btn-primary">Yes</button>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Customers;
