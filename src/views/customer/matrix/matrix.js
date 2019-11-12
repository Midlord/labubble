import React, { Component } from 'react';
import BootstrapTable from 'reactjs-bootstrap-table';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../loading';
import moment from 'moment';


class Matrix extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isloaded: false,
        };
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
    }

    componentDidMount() {
        this.setState({
            isloaded: false
        });
    }


    render() {
        if (this.state.isloaded) {
            return (
                <Loading />
            )
        }
        return (
            <div className="animated fadeIn">
                <div className="card">
                    <div className="card-body">
                        <p>
                            This fare matrix was used in the computation of delivery charges in the pick and drop services. It was based on the fare matrix of the tricycle drivers in Angeles City but it was multiplied by two (2) for the delivery service is a point A to point B then point B to point A process.
                        </p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <strong>Delivery Charge Matrix</strong>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <td width="144">
                                        <p><strong>From</strong></p>
                                    </td>
                                    <td width="144">
                                        <p><strong>To</strong></p>
                                    </td>
                                    <td width="144">
                                        <p><strong>price</strong></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>0</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>1</p>
                                    </td>
                                    <td width="144">
                                        <p>50</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>1.1</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>1.5</p>
                                    </td>
                                    <td width="144">
                                        <p>60</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>1.6</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>2</p>
                                    </td>
                                    <td width="144">
                                        <p>70</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>2.1</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>2.5</p>
                                    </td>
                                    <td width="144">
                                        <p>80</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>2.6</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>3</p>
                                    </td>
                                    <td width="144">
                                        <p>90</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>3.1</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>3.5</p>
                                    </td>
                                    <td width="144">
                                        <p>100</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>3.6</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>4</p>
                                    </td>
                                    <td width="144">
                                        <p>110</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>4.1</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>4.5</p>
                                    </td>
                                    <td width="144">
                                        <p>120</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>4.6</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>5</p>
                                    </td>
                                    <td width="144">
                                        <p>130</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>5.1</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>5.5</p>
                                    </td>
                                    <td width="144">
                                        <p>140</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>5.6</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>6</p>
                                    </td>
                                    <td width="144">
                                        <p>150</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>6.1</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>6.5</p>
                                    </td>
                                    <td width="144">
                                        <p>160</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>6.6</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>7</p>
                                    </td>
                                    <td width="144">
                                        <p>170</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>7.1</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>7.5</p>
                                    </td>
                                    <td width="144">
                                        <p>180</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>7.6</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>8</p>
                                    </td>
                                    <td width="144">
                                        <p>190</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>8.1</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>8.5</p>
                                    </td>
                                    <td width="144">
                                        <p>200</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>8.6</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>9</p>
                                    </td>
                                    <td width="144">
                                        <p>210</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>9.1</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>9.5</p>
                                    </td>
                                    <td width="144">
                                        <p>220</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>9.6</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>10</p>
                                    </td>
                                    <td width="144">
                                        <p>230</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="144">
                                        <p><strong>10.1</strong></p>
                                    </td>
                                    <td width="144">
                                        <p>above</p>
                                    </td>
                                    <td width="144">
                                        <p>250</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Matrix;
