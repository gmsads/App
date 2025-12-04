export type RootStackParamList = {
  index: undefined;
  login: undefined;
  'admin/admin-login': undefined;
  'admin/admin-dashboard': undefined;
  'admin/shop-management': undefined;
  'admin/add-shop': undefined;
  'admin/edit-shop': { id: string; shop?: any };
  'admin/shop-details': { id: string; shop?: any };
  'admin/product-management': undefined;
  'admin/add-product': undefined;
  'admin/edit-product': { id: string };
  'admin/product-details': { id: string };
  'admin/global-settings': undefined;
  'admin/reports-analytics': undefined;
  'admin/qr-scanner': undefined;
    'admin/product-context': undefined;
    'admin/user-management': undefined; // User Management - NEW ADDITION
'admin/user-details': { user?: string };
'admin/add-user': undefined;
  productlist: undefined;
  productdetail: undefined;
  cart: undefined;
  modal: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}