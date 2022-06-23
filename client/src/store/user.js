import { createAsyncThunk, createReducer } from '@reduxjs/toolkit'
import axios from 'axios'

export const userRegister = createAsyncThunk("USER_REGISTER", (data) => {
    return axios.post("", data)// agregar ruta para crear usuarios
        .then(user => user.data)
});

const userReducer = createReducer({}, {
    [userRegister.fulfilled]: (state, action) => action.payload
});

export default userReducer;