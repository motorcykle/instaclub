import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userInfo: null,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    removeUserInfo: (state) => {
      state.userInfo = null;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUserInfo, removeUserInfo } = appSlice.actions

export const selectUserInfo = (state) => state.app.userInfo;

export default appSlice.reducer