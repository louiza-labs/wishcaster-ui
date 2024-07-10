export const createUserSlice = (set: any) => ({
  isLoggedIn: false,
  isConnectedToNotion: false,
  isConnectedToLinear: false,
  isConnectedToTwitter: false,
  isConnectedToGithub: false,
  setLoggedIn: (loggedInState: boolean) =>
    set(() => ({ isLoggedIn: loggedInState })),
  setIsConnectedToNotion: (loggedInState: boolean) =>
    set(() => ({ isConnectedToNotion: loggedInState })),
  setIsConnectedToLinear: (loggedInState: boolean) =>
    set(() => ({ isConnectedToLinear: loggedInState })),
  setIsConnectedToTwitter: (loggedInState: boolean) =>
    set(() => ({ isConnectedToTwitter: loggedInState })),
  setIsConnectedToGithub: (loggedInState: boolean) =>
    set(() => ({ isConnectedToGithub: loggedInState })),
})
