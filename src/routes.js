    /* eslint-disable */
    import { lazy } from "react";
    import { DEFAULT_PATHS } from "config.js";

    const dashboard    = lazy(() => import("views/dashboard/Dashboard"));
    //const firebaseBind = lazy(() => import("views/Alert/FirebaseData"));
    // lazy loadind
    const area = {
        list   : lazy(() => import("views/area/area_list/AreaList")),
        detail : lazy(() => import("views/area/create_area/CreateArea")),
    };
    const configure = {
        list   : lazy(() => import("views/configure/add_device/AddDevice")),
        detail : lazy(() => import("views/configure/parameters/Parameters")),
    };
    const alert = {
        list   : lazy(() => import("views/Alert/active_alert/Active_Alert")),
        detail : lazy(() => import("views/Alert/alert_history/AlertHistory")),
    };
    const settings = {
        home : lazy(() => import("views/device_list/DeviceList")),
    };
    const member = {
        list: lazy(() => import("views/member/member_list/Memberlist")),
        detail: lazy(() => import("views/member/create_member/Createmember")),
    };
    const team = {
        list: lazy(() => import("views/team/team_list/Teamlist")),
        detail: lazy(() => import("views/team/create_team/Createteam")),
    };
    const Invoice          = lazy(() => import("views/Invoice/Invoice"));
    const recent_history   = lazy(() => import("views/recent_history/RecentHistory"));
    const shipping         = lazy(() => import("views/device_info/DeviceInfo"));
    const edit_device      = lazy(() => import("views/edit_device/EditPage"));
    const view_map_page    = lazy(() => import("views/view_map_page/ViewMap"));
    const area_device_list = lazy(() => import("views/area_device_list/AreaDeviceList"));
    const real_time_data   = lazy(() => import("views/real_time_data/RealTimeData"));
    const logout           = lazy(() => import("views/logout/LogOut"));

    const team_info   = lazy(() => import("views/team_info/TeamInfo"));
    const member_info = lazy(() => import("views/member_info/MemberInfo"));
    const edit_team   = lazy(() => import("views/edit_team/EditTeam"));
    const edit_member = lazy(() => import("views/edit_member/EditMember"));

    const appRoot = DEFAULT_PATHS.APP.endsWith("/") ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length) : DEFAULT_PATHS.APP;

        const routesAndMenuItems = {
            mainMenuItems : [
            {
                path     : DEFAULT_PATHS.APP,
                exact    : true,
                redirect : true,
                to       : `${appRoot}/dashboard`,
            }, {
                path      : `${appRoot}/dashboard`,
                component : dashboard,
                label     : "Dashboard",
                icon      : "grid-1",
                // icon: "shop",
            }, {
                path     : `${appRoot}/area`,
                exact    : true,
                redirect : true,
                to       : `${appRoot}/area`,
                label    : "Area",
                icon     : "destination",
                subs : [
                    { path : "/create_area", label : "Create Area", component : area.detail },
                    { path : "/area_list",   label : "Area list",   component : area.list },
                ],
            }, {
                path     : `${appRoot}/alert`,
                exact    : true,
                redirect : true,
                to       : `${appRoot}/alert/list`,
                label    : "Alert",
                icon     : "warning-hexagon",
                subs : [
                    { path : "/active-alert",  label : "Active alert",  component : alert.list },
                    { path : "/alert-history", label : "Alert history", component : alert.detail },
                ],
            }, {
                path     : `${appRoot}/device_configure`, // Configure Attachment
                exact    : true,
                redirect : true,
                to       : `${appRoot}/configure/list`,
                label    : "Configure",
                icon     : "grid-2",
                // icon: "spinner",
                subs : [
                    { path : "/add_device", label : "Add device", component : configure.list },
                    { path : "/parameters", label : "Parameters", component : configure.detail },
                ],
            },  
            {
                path     : `${appRoot}/member`,
                exact    : true,
                redirect : true,
                to       : `${appRoot}/member`,
                label    : "Member",
                icon     : "collapse",
                subs : [
                    {
                        path      : "/create_member",
                        label     : "Create member",
                        component : member.detail,
                    },
                    { path : "/member_list", label : "Member list", component : member.list },
                ],
            },
            {
                path     : `${appRoot}/team`,
                exact    : true,
                redirect : true,
                to       : `${appRoot}/team`,
                label    : "Team",
                icon     : "diagram-2",
                subs : [
                    {
                        path      : "/create_team",
                        label     : "Create team",
                        component : team.detail,
                    },
                    { path : "/team_list", label : "Team list", component : team.list },
                ],
            },
            {
                path      : `${appRoot}/edit-team/:id`,
                component : edit_team,
                icon      : "bell",
            },
            {
                path      : `${appRoot}/edit-member/:id`,
                component : edit_member,
                icon      : "bell",
            },
            {
                path      : `${appRoot}/team-information/:id`,
                component : team_info,
            }, {
                path      : `${appRoot}/member-information/:id`,
                component : member_info,
            },
            {
                path      : `${appRoot}/device-list`,
                component : settings.home,
                label     : "Device",
                icon      : "list",
                subs : [
                    { path : "/general", component : settings.general, hideInMenu : true },
                ],
            },  {
                path      : `${appRoot}/real_time_data`,
                component : real_time_data,
                label     : "Real_time_data",
                icon      : "chart-3",
                subs : [
                    { path : "/general", component : settings.general, hideInMenu : true },
                ],
            }, {
                path      : `${appRoot}/recent_history`,
                component : recent_history,
                //label   : "menu.recent_history", 
                icon      : "chart-3",
                subs : [
                    { path : "/general", component : settings.general, hideInMenu : true },
                ],
            }, {
                path      : `${appRoot}/device-information/:id`,
                //label   : "menu.device-information",
                component : shipping,
            }, {
                path      : `${appRoot}/edit-device/:id`,
                component : edit_device,
                icon      : "bell",
            }, {
                path      : `${appRoot}/view_map_page/:id`,
                component : view_map_page,
                // label  : 'menu.view_map_page', view_map_page
                icon      : "bell",
            }, {
                path      : `${appRoot}/area_device_list`,
                component : area_device_list,
                //label   : 'menu.area_device_list',
                icon      : "bell",
            }, {
                path: `${appRoot}/Invoice`,
                component: Invoice,
                label: "Invoice",
                icon: "invoice",
            },  {
                path      : `${appRoot}/Logout`,
                component : logout,
                label     : "Logout",
                icon      : "logout",
            }, 
            // {
            //     path: `${appRoot}/Firebase`,
            //     component: firebaseBind,
            //     label: "menu.firebase",
            //     icon: "logout",
            // },
        ],
        sidebarItems: [],
    };
    export default routesAndMenuItems;
