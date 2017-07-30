
export const posts = (state: any = [], {type, payload}) => {
  switch (type) {
    case 'ADD_POSTS':
      return payload;
    case 'CREATE_POST':
      return [payload, ...state];
    case 'UPDATE_POST':
      return state.map(item => {
        return item.id === payload.id ? Object.assign({}, item, payload) : item;
      });
    case 'DELETE_POST':
      return state.filter(item => {
        return item !== payload;
      });
    default:
      return state;
  }
};