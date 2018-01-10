
const isNumeric = value => typeof value === 'string' && !Number.isNaN(Number(value));

export default (data) => {
  if (!data) return {};

  return Object.keys(data).reduce((_result, key) => {
    const result = _result;
    const value = data[key];

    if (isNumeric(value)) {
      result[key] = +value;
      return result;
    }
    result[key] = value;
    return result;
  }, {});
};
