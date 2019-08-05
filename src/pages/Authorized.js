import React from 'react';
import Redirect from 'umi/redirect';
// import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import Authorized from '@/utils/Authorized';
// import { getAuthority } from '@/utils/authority';
import Exception403 from '@/pages/Exception/403';
//  function AuthComponent({ children, location, routerData }) {
function AuthComponent({ children }) {
  // const auth = getAuthority();
  // const isLogin = auth && auth[0] !== 'guest';  //是否登录看 localstorge是否存在 ticket
  const isLogin = localStorage.getItem('ticket');

  // 前端不做权限处理,后端返回数据就可以

  // const getRouteAuthority = (path, routeData) => {
  //   let authorities;
  //   routeData.forEach(route => {
  //     // match prefix
  //     if (pathToRegexp(`${route.path}(.*)`).test(path)) {
  //       authorities = route.authority || authorities;

  //       // get children authority recursively
  //       if (route.routes) {
  //         authorities = getRouteAuthority(path, route.routes) || authorities;
  //       }
  //     }
  //   });
  //   return authorities;
  // };
  return (
    <Authorized
      // authority={getRouteAuthority(location.pathname, routerData)}
      noMatch={isLogin ? <Exception403 /> : <Redirect to="/user/login" />}
    >
      {children}
    </Authorized>
  );
}
export default connect(({ menu: menuModel }) => ({
  routerData: menuModel.routerData,
}))(AuthComponent);
