
export default data =>
  Object.keys(data).reduce((_result, key) => {
    const result = _result;
    if (typeof data[key] === 'number') {
      result[key] = data[key].toString();
      return result;
    }
    result[key] = data[key];
    return result;
  }, {});

