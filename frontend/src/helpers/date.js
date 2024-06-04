import { useI18n } from "vue-i18n";
import { DateTime, Settings } from "luxon";

export const formatDate = (dateString, format) => {
  const { d } = useI18n()
  if (!dateString) {
    return "";
  }
  if (!format) {
    format = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  }
  const date = new Date(dateString);
  return d(date, format);
};

// Currently the used timezone is hardcoded to Europe/Berlin. This can be changed by setting the defaultZone
// property of the Settings class. This has to be changed when the time system gets an overhaul.
// It is very likely to cause errors at some point and needs a timezone independent solution.
Settings.defaultZone = "Europe/Berlin";

const commonFormats = [
  "yyyy-MM-ddTHH:mm:ss.sssZ",
  "yyyy-MM-ddTHH:mm:ssZ",
  "yyyy-MM-ddTHH:mm:ss.sss",
  "yyyy-MM-ddTHH:mm:ss",
  "yyyy-MM-dd HH:mm:ss",
  "yyyy-MM-dd",
  "yyyy/MM/dd",
  "yyyy.MM.dd",
  "MM/dd/yyyy",
  "MM/dd/yyyy HH:mm:ss",
  "dd/MM/yyyy",
  "dd/MM/yyyy HH:mm:ss",
];

// tryStringToDate is a function that tries to parse a date string into another formatted date string.
export const tryStringToFormat = (dateString, format) => {
  for (let commonFormat of commonFormats) {
    const parsedDate = DateTime.fromFormat(dateString, commonFormat);
    if (parsedDate.isValid) {
      return parsedDate.toFormat(format)
    }
  }

  return dateString;
}
