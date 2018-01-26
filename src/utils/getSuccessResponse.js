export default (response) => {
  if (Object.prototype.hasOwnProperty.call(response, 'success')) {
    return { success: true };
  }
  return { success: false };
};
