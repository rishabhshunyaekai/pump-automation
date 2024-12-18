    import React, { useMemo } from "react";

    import { ToastContainer } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    // import redux for auth guard
    import { useSelector } from "react-redux";

    // import layout
    import Layout from "layout/Layout";
    // import routing modules
    import RouteIdentifier from "routing/components/RouteIdentifier";
    import { getRoutes } from "routing/helper";
    import routesAndMenuItems from "routes.js";
    import Loading from "components/loading/Loading";

    const App = () => {
        const { currentUser, isLogin } = useSelector((state) => state.auth);

        const routes = useMemo(() => getRoutes({ 
            data     : isLogin === true ? routesAndMenuItems : [], 
            isLogin  : isLogin, 
            userRole : currentUser.userRole, 
        }), [isLogin, currentUser])

        if (routes) {
            return (
                <>
                    <ToastContainer />
                    <Layout>
                    <RouteIdentifier routes={routes} fallback={<Loading />} />
                    </Layout>
                </>
            );
        }
        return <></>;
    };
    export default App;
