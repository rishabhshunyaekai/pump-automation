    import { LAYOUT, MENU_BEHAVIOUR, NAV_COLOR, MENU_PLACEMENT, RADIUS, THEME_COLOR, } from "constants.js";
    import io from 'socket.io-client';

    // export const SERVICE_URL = "/app";
    export const IS_DEMO              = sessionStorage.getItem("isLogin") === "true" ? true : false;
    export const IS_AUTH_GUARD_ACTIVE = true;
    //export const SERVICE_URL          = "http://localhost:8080/api/v1"; 
    export const SERVICE_URL = "https://env.shunyaekai.com/api/v1";
    export const USE_MULTI_LANGUAGE = false;
    export const SocketIo = io('https://env.shunyaekai.com', {
        reconnection         : true,
        reconnectionDelay    : 1000,
        reconnectionDelayMax : 5000,
        reconnectionAttempts : 99999
    });
    export const REACT_HELMET_PROPS = {
        defaultTitle  : "ENV Plus",
        titleTemplate : "ENV Plus",
    };
    export const DEFAULT_PATHS = {
        APP             : "/",
        LOGIN           : "/login",
        REGISTER        : "/register",
        FORGOT_PASSWORD : "/forgot-password",
        RESET_PASSWORD  : "/reset-password",
        USER_WELCOME    : "/dashboards/default",
        NOTFOUND        : "/page-not-found",
        UNAUTHORIZED    : "/unauthorized",
        INVALID_ACCESS  : "/invalid-access",
    };
    export const DEFAULT_SETTINGS = {
        MENU_PLACEMENT : MENU_PLACEMENT.Vertical,
        MENU_BEHAVIOUR : MENU_BEHAVIOUR.Pinned,
        LAYOUT         : LAYOUT.Boxed,
        RADIUS         : RADIUS.Rounded,
        COLOR          : THEME_COLOR.LightBlue,
        NAV_COLOR      : NAV_COLOR.Light,
        USE_SIDEBAR    : false,
    };
    export const DEFAULT_USER = {
        id : sessionStorage.getItem("user_id")
    };
    export const REDUX_PERSIST_KEY = "ecommerce-platform";
