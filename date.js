exports.getDate = function () {
  const today = new Date();

  const day = today.toLocaleDateString("en-US", { weekday: "long" });
  const month = today.toLocaleDateString("en-US", { month: "short" });
  const date = today.toLocaleDateString("en-US", { day: "2-digit" });
  const year = today.toLocaleDateString("en-US", { year: "numeric" });

  return `${day}, ${month} ${date}, ${year}`;
};
