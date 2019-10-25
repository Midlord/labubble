import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';

import ReactLoading from 'react-loading';

const loading = () =>  <div className="d-flex justify-content-center center-block"><ReactLoading type="spokes" color="#187da0" height={100} width={100} /></div>
{/* <div className="animated fadeIn pt-3 text-center">Loading...</div>; */}

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const ForgotPassword = React.lazy(() => import('./views/customer/password/ForgotPassword'));
const AdminLogin = React.lazy(() => import('./views/Pages/Login/AdminLogin'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));

class App extends Component {

  render() {
    return (
      <HashRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/forgot-password" name="Forgot Password" render={props => <ForgotPassword {...props}/>} />
              <Route exact path="/admin/login" name="Login Page" render={props => <AdminLogin {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route path="/" name="Home" render={props => <DefaultLayout {...props}/>} />
            </Switch>
          </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
