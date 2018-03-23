const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  user: state => state.user.info
};
export default getters;
