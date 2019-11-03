import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../customer/loading';
import moment from 'moment';
import './owners.css';


class OwnerDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isloaded: false,
            user: [],
            laundry:[]
        };


    }


    componentWillMount() {
        this.setState({
            isloaded: true
        });
        axios.get(`https://labubbles.online/api/admin/owner/${this.props.match.params.id}`, {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(result => {
                if (result.status === 200) {
                    console.log(result);
                    this.setState({
                        user: result.data.user,
                        laundry: result.data.user.laundry_shops,
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
    }

    render() {
        return (
            <div className="animated fadeIn">

            </div>
        );
    }
}

export default OwnerDetail;
