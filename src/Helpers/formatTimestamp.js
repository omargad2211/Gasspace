import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function formatTimestamp(timestamp) {
  const now = dayjs();
  const time = dayjs(timestamp);

  const diffMinutes = now.diff(time, "minute");
  const diffHours = now.diff(time, "hour");
  const diffDays = now.diff(time, "day");

  if (diffMinutes < 1) {
    return "Just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} mins ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else {
    return time.format("D MMM, h:mm A"); // Example: "12 Feb, 4:30 PM"
  }
}
