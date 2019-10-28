import React from 'react';

const Breadcrumbs = React.lazy(() => import('./views/Base/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/Base/Cards'));
const Carousels = React.lazy(() => import('./views/Base/Carousels'));
const Collapses = React.lazy(() => import('./views/Base/Collapses'));
const Dropdowns = React.lazy(() => import('./views/Base/Dropdowns'));
const Forms = React.lazy(() => import('./views/Base/Forms'));
const Jumbotrons = React.lazy(() => import('./views/Base/Jumbotrons'));
const ListGroups = React.lazy(() => import('./views/Base/ListGroups'));
const Navbars = React.lazy(() => import('./views/Base/Navbars'));
const Navs = React.lazy(() => import('./views/Base/Navs'));
const Paginations = React.lazy(() => import('./views/Base/Paginations'));
const Popovers = React.lazy(() => import('./views/Base/Popovers'));
const ProgressBar = React.lazy(() => import('./views/Base/ProgressBar'));
const Switches = React.lazy(() => import('./views/Base/Switches'));
const Tables = React.lazy(() => import('./views/Base/Tables'));
const Tabs = React.lazy(() => import('./views/Base/Tabs'));
const Tooltips = React.lazy(() => import('./views/Base/Tooltips'));
const BrandButtons = React.lazy(() => import('./views/Buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views/Buttons/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views/Buttons/ButtonGroups'));
const Buttons = React.lazy(() => import('./views/Buttons/Buttons'));
const Charts = React.lazy(() => import('./views/Charts'));
const Dashboard = React.lazy(() => import('./views/admin/dashboards/dashboard'));
const CoreUIIcons = React.lazy(() => import('./views/Icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/Icons/Flags'));
const FontAwesome = React.lazy(() => import('./views/Icons/FontAwesome'));
const SimpleLineIcons = React.lazy(() => import('./views/Icons/SimpleLineIcons'));
const Alerts = React.lazy(() => import('./views/Notifications/Alerts'));
const Badges = React.lazy(() => import('./views/Notifications/Badges'));
const Modals = React.lazy(() => import('./views/Notifications/Modals'));
const Colors = React.lazy(() => import('./views/Theme/Colors'));
const Typography = React.lazy(() => import('./views/Theme/Typography'));
const Widgets = React.lazy(() => import('./views/Widgets/Widgets'));
const Users = React.lazy(() => import('./views/Users/Users'));
const User = React.lazy(() => import('./views/Users/User'));
const Home = React.lazy(() => import('./views/customer/home'));
// Laundry Details
const LaundryDetail = React.lazy(() => import('./views/customer/laundries/laundryDetail'));
// Book Laundry
const Book = React.lazy(() => import('./views/customer/books/book'));
const BookDetail = React.lazy(() => import('./views/customer/books/bookDetail'));
const Profile = React.lazy(() => import('./views/customer/profile/profile'));
const Rewards = React.lazy(() => import('./views/customer/rewards/rewards'));
const Transactions = React.lazy(() => import('./views/customer/transactions/transactions'));
const CustomerBooks = React.lazy(() => import('./views/customer/books/customerBooks'));
const CustomerBookDetail = React.lazy(() => import('./views/customer/books/customerBookDetail'));
const CustomerDashboard =  React.lazy(() => import('./views/customer/dashboard'));

const OwnerDashboard =  React.lazy(() => import('./views/owner/dashboard'));
const PendingBooks =  React.lazy(() => import('./views/owner/books/ownerBooks'));

const PendingBookDetail =  React.lazy(() => import('./views/owner/books/ownerBookDetail'));

const OwnerLaundry =  React.lazy(() => import('./views/owner/laundries/laundryDetail'));

const OwnerLaundryServices =  React.lazy(() => import('./views/owner/laundries/AddServices'));


const Orders =  React.lazy(() => import('./views/admin/orders/order'));
const OrderDetail =  React.lazy(() => import('./views/admin/orders/orderDetail'));

const Customers =  React.lazy(() => import('./views/admin/customers/customers'));
const Owners =  React.lazy(() => import('./views/admin/owners/owners'));
const Deliveries =  React.lazy(() => import('./views/admin/deliveries/deliveries'));
const OwnerDetail = React.lazy(() => import('./views/admin/owners/ownerDetail'));

const DeliveryDashboard =  React.lazy(() => import('./views/deliveries/dashboards/dashboard'));

const DeliveryOrders =  React.lazy(() => import('./views/deliveries/orders/orders'));

const AddLaundry = React.lazy(() => import('./views/owner/laundries/AddLaundry'));

const EditLaundry = React.lazy(() => import('./views/owner/laundries/EditLaundry'));

const DeliverySales = React.lazy(() => import('./views/deliveries/sales/sales')); 
// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/customer/dashboard', exact: true, name: 'My Dashboard', component: CustomerDashboard  },
  { path: '/home', exact: true, name: 'Search', component: Home  },
  { path: '/profile', exact: true, name: 'Profile', component: Profile  },
  { path: '/rewards', exact: true, name: 'Rewards', component: Rewards  },
  { path: '/laundry/:id', exact: true, name: 'LaundryDetails', component: LaundryDetail },
  { path: '/book/laundry/:id', exact: true, name: 'Book', component: Book },
  { path: '/user/laundry/:id/book/:id', exact: true, name: 'Checkout Order', component: BookDetail },

  { path: '/user/transactions', exact: true, name: 'Transactions', component: Transactions },
  { path: '/user/books', exact: true, name: 'My Orders', component: CustomerBooks },
  { path: '/user/book/:id', exact: true, name: 'Order Detail', component: CustomerBookDetail },
  
  { path: '/owner/dashboard', exact: true, name: 'Dashboard', component: OwnerDashboard },
  { path: '/owner/pendingBooks', exact: true, name: 'Recent Orders', component: PendingBooks },
  { path: '/owner/pending/book/:id', exact: true, name: 'Pending Book Detail', component: PendingBookDetail },
  { path: '/owner/laundry', exact: true, name: 'My Laundry Shop', component: OwnerLaundry },
  { path: '/owner/laundry/add', exact: true, name: 'Create Laundry Shop', component: AddLaundry },

  { path: '/owner/laundry/edit', exact: true, name: 'Edit Laundry Shop', component: EditLaundry },
  

  { path: '/owner/laundry/:id/services', exact: true, name: 'Add Services', component: OwnerLaundryServices },

  
  { path: '/admin/dashboard', exact: true, name: 'Dashboard', component: Dashboard },

  { path: '/admin/orders', exact: true, name: 'Orders', component: Orders },

  { path: '/admin/order/:id', exact: true, name: 'Order Detail', component: OrderDetail },

  { path: '/admin/customers', exact: true, name: 'Customers', component: Customers },

  { path: '/admin/deliveries', exact: true, name: 'Deliveries', component: Deliveries },

  { path: '/admin/owners', exact: true, name: 'Owners', component: Owners },

  { path: '/admin/owner/:id', exact: true, name: 'Owner Detail', component: OwnerDetail },

  { path: '/delivery/dashboard', exact: true, name: 'Dashboard', component: DeliveryDashboard },

  { path: '/delivery/orders', exact: true, name: 'Delivery Orders', component: DeliveryOrders },

  { path: '/delivery/sales', exact: true, name: 'Daily Sales', component: DeliverySales },

  

  { path: '/admin/theme', exact: true, name: 'Theme', component: Colors },
  { path: '/admin/theme/colors', name: 'Colors', component: Colors },
  { path: '/admin/theme/typography', name: 'Typography', component: Typography },
  { path: '/admin/base', exact: true, name: 'Base', component: Cards },
  { path: '/admin/base/cards', name: 'Cards', component: Cards },
  { path: '/admin/base/forms', name: 'Forms', component: Forms },
  { path: '/admin/base/switches', name: 'Switches', component: Switches },
  { path: '/admin/base/tables', name: 'Tables', component: Tables },
  { path: '/admin/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/admin/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/admin/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/admin/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/admin/base/dropdowns', name: 'Dropdowns', component: Dropdowns },
  { path: '/admin/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/admin/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/admin/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/admin/base/navs', name: 'Navs', component: Navs },
  { path: '/admin/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/admin/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/admin/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/admin/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/admin/buttons', exact: true, name: 'Buttons', component: Buttons },
  { path: '/admin/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/admin/buttons/button-dropdowns', name: 'Button Dropdowns', component: ButtonDropdowns },
  { path: '/admin/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/admin/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/admin/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/admin/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/admin/icons/flags', name: 'Flags', component: Flags },
  { path: '/admin/icons/font-awesome', name: 'Font Awesome', component: FontAwesome },
  { path: '/admin/icons/simple-line-icons', name: 'Simple Line Icons', component: SimpleLineIcons },
  { path: '/admin/notifications', exact: true, name: 'Notifications', component: Alerts },
  { path: '/admin/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/admin/notifications/badges', name: 'Badges', component: Badges },
  { path: '/admin/notifications/modals', name: 'Modals', component: Modals },
  { path: '/admin/widgets', name: 'Widgets', component: Widgets },
  { path: '/admin/charts', name: 'Charts', component: Charts },
  { path: '/admin/users', exact: true,  name: 'Users', component: Users },
  { path: '/admin/users/:id', exact: true, name: 'User Details', component: User },
];

export default routes;
