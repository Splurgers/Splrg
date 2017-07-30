
export const splurges = (state: any = [], {type, payload}) => {
  switch (type) {
    case 'ADD_SPLURGES':
      return payload;
    case 'CREATE_SPLURGE':
      return [...state, payload];
    case 'UPDATE_SPLURGE':
      return state.map(item => {
        return item.id === payload.id ? Object.assign({}, item, payload) : item;
      });
    case 'DELETE_SPLURGE':
      return state.filter(item => {
        return item.id !== payload.id;
      });
    default:
      return state;
  }
};