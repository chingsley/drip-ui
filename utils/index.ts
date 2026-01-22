export const drawBorder = (width: number, color: string, forced?: boolean) => {
  if (forced) {
    return {
      borderWidth: width,
      borderColor: color,
    };
  }
  return {
    // borderWidth: width,
    // borderColor: color,
  };
};