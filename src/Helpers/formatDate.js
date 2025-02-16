export const formatMonthYear = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

