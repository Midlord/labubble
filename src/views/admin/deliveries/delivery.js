import React, { Component, lazy, Suspense } from 'react';
import axios from 'axios';
import moment from 'moment';
import Loading from '../../customer/loading';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '20%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        padding: '0',
        width: '20%',
        transform: 'translate(-50%, -50%)'
    }
};

class Sales extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            dropdownOpen: false,
            radioSelected: 2,
            isLoggedIn: false,
            modalIsOpen: false,
            sales: [],
            user: [],
            total: ''
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
        });
    }

    openModal = () => {
        this.setState({
            modalIsOpen: true
        });
      }
    
      closeModal = () => {
        this.setState({
            modalIsOpen: false
        });
      }

      handleRemit = (e) => {
        e.preventDefault();
        e.stopPropagation();
    
        toast.configure();
        axios.get(`https://labubbles.online/api/admin/delivery/${this.props.match.params.id}/remit`, {
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
    
    componentWillMount() {
        this.setState({
            isloaded: true
        });
        axios.get(`https://labubbles.online/api/admin/delivery/${this.props.match.params.id}/sales`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                console.log(result)
                if (result.status === 200) {
                    this.setState({
                        user: result.data.user,
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




    render() {
        const Sum = (num1, num2) => console.log(num1 + num2);
        const user = this.state.user;

        if (this.state.isloaded) {
            return (
                <Loading />
            )
        }
        return (
            <div className="animated fadeIn">
                <div className="card mt-5">
                    <div className="card-body">
                        <div className="latest-books">
                            <div className="row mb-2">
                                <div className="col-6">
                                    <h3>{`Daily Sales of ${user.firstName} ${user.lastName}`}</h3>
                                </div>
                                <div className="col-6 text-right">
                                    <button className="btn btn-primary" onClick={this.openModal}>Remit</button>
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
                                        <td><strong>Total:</strong></td>
                                        <td><strong className="text-danger">P{this.state.total}</strong></td>
                                    </tr>
                                </tfoot>
                            </table>
                            <Modal
                                isOpen={this.state.modalIsOpen}
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
        );
    }
}

export default Sales;
