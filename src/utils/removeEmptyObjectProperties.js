export default function removeEmptyObjectProperties(_obj) {
  const obj = _obj;
  Object.entries(obj).forEach(([key, val]) => {
    if (val && typeof val === 'object') {
      removeEmptyObjectProperties(val);
    } else if (val == null) {
      delete obj[key];
    }
  });

  return obj;
}
