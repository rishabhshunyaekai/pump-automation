    import { createSlice } from '@reduxjs/toolkit';
    import { DEFAULT_USER, IS_DEMO } from 'config.js';

    const initialState = {
        isLogin     : IS_DEMO,
        currentUser : IS_DEMO ? DEFAULT_USER : {},
        message     : ""
    };
    const authSlice = createSlice({
        name : 'auth',
        initialState,
        reducers : {
            setCurrentUser(state, action) {
                console.log('Isey', action.payload.currentUser) 
                if( action.payload.currentUser.id !=null || action.payload.currentUser.id != undefined ){
                    sessionStorage.setItem('user_id', action.payload.currentUser.id)
                    sessionStorage.setItem("isLogin", action.payload.isLogin);
                    state.currentUser = action.payload.currentUser;
                    state.isLogin     = action.payload.isLogin;
                    state.message     = action.payload.message
                }
            },
        },
    });
    export const { setCurrentUser } = authSlice.actions;
    const authReducer               = authSlice.reducer;

    export default authReducer;
