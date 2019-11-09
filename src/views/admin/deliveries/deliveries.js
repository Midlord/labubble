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
import './css/deliveries.css';
import ReactTable from "react-table";
import "react-table/react-table.css";

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

const createDelivery = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        padding: '0',
        width: '50%',
        transform: 'translate(-50%, -50%)',
    }
};


class Personnels extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_id: '',
            firstName: '',
            lastName: '',
            email: '',
            mobileNumber: '',
            password: '',
            isloaded: false,
            users: [],
            usersBanned: [],
            modalDeliveryIsOpen: false,
            modalIsOpen: false,
            modalRemit: false,
            selectedOptions: [],
        };

        this.handleBanned = this.handleBanned.bind(this);
        this.handleUnbanned = this.handleUnbanned.bind(this);
        this.openModalBanned = this.openModalBanned.bind(this);
        this.openModalUnbanned = this.openModalUnbanned.bind(this);
        this.openModalDelivery = this.openModalDelivery.bind(this);
        this.closeModalDelivery = this.closeModalDelivery.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }

    handleBarangayChange = (e) => {
        let target = e.target

        let name = target.name
        //here
        let value = Array.from(target.selectedOptions, option => option.value);
        this.setState({
            [name]: value
        });

        console.log(this.state.selectedOptions)

    }

    openModalDelivery = (e) => {
        console.log(e)
        this.setState({
            modalDeliveryIsOpen: true
        });
    }

    closeModalDelivery = (e) => {
        console.log(e)
        this.setState({
            modalDeliveryIsOpen: false
        });
    }

    componentWillMount() {
        this.setState({
            isloaded: true
        });
        axios.get(`https://labubbles.online/api/admin/deliveries`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                console.log(result)
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
    handleOnChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
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

    openModalRemit = (id) => {
        this.setState({
            modalRemit: true,
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
            modalRemit: false
        });
    }

    handleBanned = (e) => {
        e.preventDefault();
        e.stopPropagation();

        toast.configure();
        axios.delete(`https://labubbles.online/api/admin/deliveries/${this.state.user_id}/banned`, {
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

    handleDelivery = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    handleRemit = (e) => {
        e.preventDefault();
        e.stopPropagation();
    
        toast.configure();
        axios.get(`https://labubbles.online/api/admin/delivery/${this.state.user_id}/remit`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        })
            .then(result => {
                if (result.status === 200) {
                    this.setState({
                        isloaded: false,
                        modalIsOpen: false,
                    })
    
                    toast.success(result.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });

                    this.props.history.push(`/admin/dashboard`);
                }
            })
            .catch(error => {
                this.setState({
                    isloaded: false
                });
    
                console.log(error)
            });
    }

    handleUnbanned = (e) => {
        e.preventDefault();
        e.stopPropagation();

        toast.configure();
        axios.get(`https://labubbles.online/api/admin/unbanned/delivery/${this.state.user_id}`, {
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

    handleSaveDelivery = (e) => {
        e.preventDefault();
        this.setState({ isLoaded: true });
        toast.configure();
        axios.post('https://labubbles.online/api/admin/delivery/store', {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
            mobileNumber: this.state.mobileNumber,
            barangays: this.state.selectedOptions,
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(result => {
                if (result.status == 200) {
                    toast.success(result.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });

                    this.setState({
                        isLoaded: false,
                        users: result.data.users
                    });
                }
            })
            .catch(error => {
                console.log(error.response.data)
                this.setState({
                    isLoaded: false,
                    modalIsOpen: false,
                    // firstName: error.response.data.request.firstName,
                    // lastName: error.response.data.request.lastName,
                    // email: error.response.data.request.email,
                    // password: error.response.data.request.password,
                    // mobileNumber: error.response.data.request.mobileNumber,
                    // barangays: error.response.data.request.barangays,
                });
                error.response.data.errors.map((error) => {
                    toast.error(error, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                })
            });
    }



    render() {
        const users = this.state.users;
        const usersBanned = this.state.usersBanned;
        const UserTable = () => (
            users.map((user, i) => (
                <tr key={i}>
                    <td><Link to={`/admin/delivery/${user.id}`}><img src={`https://labubbles.online/storage/avatar/${user.image}`} /></Link></td>
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
                    <td><Link to={`/admin/delivery/${user.id}`}><img src={`https://labubbles.online/storage/avatar/${user.image}`} /></Link></td>
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
                                <i className="fa fa-align-justify"></i> Personnels
                                <button className="btn btn-primary float-right" onClick={this.openModalDelivery}>Add Delivery</button>
                            </div>
                            <div className="card-body">
                                <ReactTable
                                    data={this.state.users.sort((a, b) => parseFloat(b.totalSales) - parseFloat(a.totalSales))}
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
                                                    Header: 'Total Sales',
                                                    headerClassName: 'text-left',
                                                    Cell: row => (
                                                        <span>P{row.original.totalSales === 0 ? 0 : parseFloat(row.original.totalSales).toFixed(2)}</span>
                                                    )
                                                },
                                                {
                                                    Header: 'Status',
                                                    Cell: row => (
                                                        <div className="row">
                                                            <div className="col-12 text-center">
                                                                <button onClick={() => this.openModalBanned(row.original.id)} className="btn btn-success mr-2">Active</button>
                                                                <Link to={`delivery/${row.original.id}`} className="btn btn-primary mr-2">View</Link>
                                                                <button onClick={() => this.openModalRemit(row.original.id)} className="btn btn-primary mr-2">Remit</button>
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
                                        <p>Are you sure you want to Banned this delivery?</p>
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
                                <i className="fa fa-align-justify"></i>Banned Personnels</div>
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
                                                    Header: 'Status',
                                                    Cell: row => (
                                                        <div className="row">
                                                            <div className="col-12 text-center">
                                                                <button onClick={() => this.openModalUnbanned(row.original.id)} className="btn btn-danger">Banned</button>
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
                                        <p>Are you sure you want to Unbanned this delivery?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={this.closeModal}>Close</button>
                                        <button type="button" onClick={this.handleUnbanned} className="btn btn-primary">Yes</button>
                                    </div>
                                </Modal>
                                <Modal
                                    isOpen={this.state.modalDeliveryIsOpen}
                                    onRequestClose={this.closeModalDelivery}
                                    ariaHideApp={false}
                                    style={createDelivery}
                                    contentLabel="Create Delivery"
                                >
                                    <div className="modal-header">
                                        <span>Add Delivery</span>
                                        <button type="button" onClick={this.closeModalDelivery} className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <form onSubmit={this.handleSaveDelivery}>
                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="firstName">First Name</label>
                                                        <input type="text" className="form-control" id="firstName" name="firstName" onChange={this.handleOnChange} />
                                                    </div>

                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="lastName">Last Name</label>
                                                        <input type="text" className="form-control" id="lastName" name="lastName" onChange={this.handleOnChange} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="email">Email Address</label>
                                                        <input type="email" className="form-control" id="email" name="email" onChange={this.handleOnChange} />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="mobileNumber">Mobile Number</label>
                                                        <input type="number" className="form-control" id="mobileNumber" name="mobileNumber" onChange={this.handleOnChange} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="password">Password</label>
                                                        <input type="password" className="form-control" id="password" name="password" onChange={this.handleOnChange} />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="barangay">Barangays</label>
                                                        <select name="selectedOptions" className="form-control" id="barangay" onChange={this.handleBarangayChange} multiple>
                                                            <option value="">Select Barangays</option>
                                                            {barangays.map((item) => (
                                                                <option key={item}>{item}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={this.closeModalDelivery}>Close</button>
                                            <button type="submit" className="btn btn-primary">Save</button>
                                        </div>
                                    </form>
                                </Modal>
                                <Modal
                                    isOpen={this.state.modalRemit}
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
                                        <p>Are you sure you want to Remit this order?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={this.closeModal}>Close</button>
                                        <button type="button" onClick={this.handleRemit} className="btn btn-primary">Yes</button>
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

export default Personnels;
