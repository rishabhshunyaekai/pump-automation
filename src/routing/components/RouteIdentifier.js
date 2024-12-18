import React, { memo, Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { DEFAULT_PATHS } from "config.js";
import RouteItem from "./RouteItem";

const RouteIdentifier = ({
  routes,
  fallback = <div className="loading" />,
  Login = DEFAULT_PATHS.LOGIN,
}) => (
  <Suspense fallback={fallback}>
    <Switch>
      {routes.map((route, rIndex) => (
        <RouteItem key={`r.${rIndex}`} {...route} />
      ))}
      <Redirect to={Login} />
    </Switch>
  </Suspense>
);

export default memo(RouteIdentifier);
