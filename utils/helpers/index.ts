import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ColorHash from "color-hash";

// convert a file into base64 string
export const convertToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      resolve(reader.result as string);
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};

// format date and time relative to current time
dayjs.extend(relativeTime);
export const formatRelativeTime = (date: string | Date): string => {
  const dateTime = dayjs(date);
  const now = dayjs();

  if (now.diff(dateTime, "minute") < 1) {
    return "just now";
  }

  return dateTime.fromNow();
};

// format time in minutes and seconds
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

// generate a random color based on given string
export const getColorHash = (str: string): string => {
  const colorHash = new ColorHash({ lightness: [0.35, 0.5, 0.65] });
  return colorHash.hex(str);
};
