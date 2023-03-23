// TODO: implement RNLocalize to get localizaton info to format properly
export const getDateFormat = (withTime = true) => {
  const dateWithout = 'MM/DD/YYYY';
  if (withTime) {
    return `${dateWithout} hh:mm`;
  }
  return dateWithout;
};
