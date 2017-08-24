export const user = (state: any = {}, {type, payload}) => {
  switch (type) {
    case 'ADD_USER':
      return payload;
    case 'REMOVE_USER':
      return {};
    default:
      return state;
  }
};
