const celsiusToFarenheit = (celsius: number): number => {
  return Number(((celsius * 9) / 5 + 32).toFixed(2));
};

export default celsiusToFarenheit;
