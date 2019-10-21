import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../views/customer/loading';

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import adminNavigation from '../../sidenavs/admin/adminNavs';
import ownerNavigation from '../../sidenavs/owner/ownerNavs';
import customerNavigation from '../../sidenavs/customer/customerNavs';

// routes config
import routes from '../../routes';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false
    };
  }

  loading = () => <Loading />

  goBack = (e) => {
    this.props.history.goBack()
  }

  signOut(e) {
    e.preventDefault();
    e.stopPropagation();

    toast.configure();


    sessionStorage.removeItem('token')
    sessionStorage.removeItem('firstName')
    sessionStorage.removeItem('lastName')
    sessionStorage.removeItem('fullName')
    sessionStorage.removeItem('user_id')
    sessionStorage.removeItem('email')
    sessionStorage.removeItem('role')
    sessionStorage.removeItem('created_at')
    sessionStorage.removeItem('image')
    sessionStorage.removeItem('mobileNumber')
    sessionStorage.removeItem('loginTime')
    sessionStorage.removeItem('isActive')
    sessionStorage.removeItem('isHasShop')

    toast.success('Successfully Logout!', {
      position: toast.POSITION.BOTTOM_RIGHT
    });

    if (sessionStorage.getItem('role') !== 'admin') {
      sessionStorage.removeItem('role')
      this.props.history.push(`/login`);
    }
    else {
      sessionStorage.removeItem('role')
      this.props.history.push(`/admin/login`);
    }

  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense>
            <DefaultHeader onLogout={e => this.signOut(e)} onBackHistory={e => this.goBack(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <div className="sidebar-header">
              <img src={`https://stockwatch.site/public/storage/avatar/${sessionStorage.getItem('image')}`} className="img-avatar custom-image" alt="Avatar" />
              <div>
                <strong>{sessionStorage.getItem('fullName')}</strong>
              </div>
              <div className="text-muted">
                <small>{sessionStorage.getItem('role')}</small>
              </div>
              {/* <div class="btn-group" role="group" aria-label="Button group with nested dropdown"
              ><button type="button" class="btn btn-link"><i class="icon-settings"></i></button>
                <button type="button" class="btn btn-link"><i class="icon-speech"></i></button>
                <button type="button" class="btn btn-link"><i class="icon-user"></i></button>
              </div> */}
            </div>
            <Suspense>
              <AppSidebarNav navConfig={sessionStorage.getItem('role') === 'customer' ? customerNavigation : sessionStorage.getItem('role') === 'owner' ? ownerNavigation : adminNavigation} {...this.props} router={router} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            {sessionStorage.getItem('role') && sessionStorage.getItem('role') !== 'customer' ? <AppBreadcrumb appRoutes={routes} router={router} /> : ''}
            <div className={`${sessionStorage.getItem('role') === 'admin' ? 'container-fluid' : 'container'}`}>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          sessionStorage.getItem('token') ?
                            <route.component {...props} /> :
                            <Redirect to="/login" />
                        )}
                      />
                    ) : (null);
                  })}
                  <Redirect from="/" to={`${sessionStorage.getItem('role') == 'customer' ? '/customer/dashboard' : 
                                            sessionStorage.getItem('role') == 'owner' ? '/owner/dashboard' : 
                                            sessionStorage.getItem('role') == 'admin' ? 'admin/dashboard' : 
                                            sessionStorage.getItem('role') == 'delivery' ? 'delivery/dashboard' :'/login'}`} />
                </Switch>
              </Suspense>
            </div>
          </main>
          <AppAside fixed>
            <Suspense>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
