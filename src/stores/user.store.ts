export const user = (state: any = {}, {type, payload}) => {
  switch (type) {
    case 'ADD_USER':
      return payload;
    default:
      return state;
  }
};
