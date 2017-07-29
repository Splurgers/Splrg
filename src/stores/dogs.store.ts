
export const dogs = (state: any = [], {type, payload}) => {
  switch (type) {
    case 'ADD_DOGS':
      return payload.message;
    // case 'CREATE_ITEM':
    //   return [...state, payload];
    // case 'UPDATE_ITEM':
    //   return state.map(item => {
    //     return item.id === payload.id ? Object.assign({}, item, payload) : item;
    //   });
    case 'DELETE_ITEM':
      return state.filter(item => {
        return item !== payload;
      });
    default:
      return state;
  }
};