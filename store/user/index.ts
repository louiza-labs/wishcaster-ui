export const createUserSlice = (set: any) => ({
  isLoggedIn: false,
  setLoggedIn: (loggedInState: boolean) =>
    set(() => ({ isLoggedIn: loggedInState })),
})
