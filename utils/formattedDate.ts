export const formattedDate = (time: Date | number | undefined) => {
  const date = new Date(time as Date);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };
  return date.toLocaleDateString("en-US", options as any);
};
