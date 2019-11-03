import React, { Component } from 'react';
import BootstrapTable from 'reactjs-bootstrap-table';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../customer/loading';


class Transactions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isloaded: false,
      transactions: []
    };

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  componentWillMount() {
    this.setState({
        isloaded: true
    });
    axios.get(`https://labubbles.online/api/transactions/user/${sessionStorage.getItem('user_id')}`, {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
    })
        .then(result => {
            if (result.status === 200) {
                console.log(result)
                this.setState({
                  transactions: result.data.transactions,
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

    // if(this.state.isloaded){
    //     return (
    //       <Loading/>
    //     )
    // }
    return (
      <div className="animated fadeIn">
       
      </div>
    );
  }
}

export default Transactions;
