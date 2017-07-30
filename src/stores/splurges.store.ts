
export const splurges = (state: any = [], {type, payload}) => {
  switch (type) {
    case 'ADD_SPLURGES':
      return payload;
    case 'CREATE_SPLURGE':
      return [...state, payload];
    case 'UPDATE_SPLURGE':
      console.log('updating!');
      return state.map(item => {
        return item.id === payload.id ? Object.assign({}, item, payload) : item;
      });
    case 'DELETE_ITEM':
      return state.filter(item => {
        return item !== payload;
      });
    default:
      return state;
  }
};