/* eslint-disable react-refresh/only-export-components */
import { differenceInDays, formatDistance, formatRelative } from "date-fns";
import { enUS, fr, ja } from "date-fns/locale";
import { useLocaleState } from "ra-core";

import {
  APP_TIME_ZONE,
  differenceInCalendarDaysTokyo,
  formatDateTimeTokyo,
  formatDateTokyo,
  formatTimeTokyo,
} from "./appDateTime";

const getDateFnsLocale = (locale: string) => {
  if (locale.startsWith("fr")) {
    return fr;
  }
  if (locale.startsWith("ja")) {
    return ja;
  }
  return enUS;
};

const resolveIntlLocale = (locale: string) =>
  locale.startsWith("ja") ? "ja-JP" : locale;

const usesJapaneseDates = (locale: string) => !locale.startsWith("en");

/** 「昨日 午後2:30」形式（日本時間基準） */
const formatJapaneseRelativeWithTime = (dateObj: Date, now: Date) => {
  const dayDiff = differenceInCalendarDaysTokyo(now, dateObj);

  if (dayDiff === 0) {
    return `今日 ${formatTimeTokyo(dateObj)}`;
  }
  if (dayDiff === 1) {
    return `昨日 ${formatTimeTokyo(dateObj)}`;
  }
  if (differenceInDays(now, dateObj) > 6) {
    return formatDateTokyo(dateObj);
  }

  return formatRelative(dateObj, now, { locale: ja });
};

export const formatLocalizedDate = (date: string, locale = "ja") => {
  const dateObj = new Date(date);
  if (usesJapaneseDates(locale)) {
    return formatDateTokyo(dateObj);
  }
  return new Intl.DateTimeFormat(resolveIntlLocale(locale), {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
};

export const formatLocalizedDateTime = (date: string, locale = "ja") => {
  const dateObj = new Date(date);
  if (usesJapaneseDates(locale)) {
    return formatDateTimeTokyo(dateObj);
  }
  return new Intl.DateTimeFormat(resolveIntlLocale(locale), {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(dateObj);
};

export const formatRelativeDate = (date: string, locale = "ja") => {
  const dateObj = new Date(date);
  const now = new Date();

  if (usesJapaneseDates(locale)) {
    return formatJapaneseRelativeWithTime(dateObj, now);
  }

  const dateFnsLocale = getDateFnsLocale(locale);

  if (differenceInDays(now, dateObj) > 6) {
    return new Intl.DateTimeFormat(resolveIntlLocale(locale), {
      timeZone: APP_TIME_ZONE,
    }).format(dateObj);
  }

  return formatRelative(dateObj, now, { locale: dateFnsLocale });
};

export const formatTimeAgo = (date: string, locale = "ja") => {
  const dateObj = new Date(date);
  const now = new Date();
  return formatDistance(dateObj, now, {
    addSuffix: true,
    locale: getDateFnsLocale(usesJapaneseDates(locale) ? "ja" : locale),
  });
};

export const useRelativeDate = (date: string) => {
  const [locale = "ja"] = useLocaleState();

  return formatRelativeDate(date, locale);
};

export function RelativeDate({ date }: { date: string }) {
  return useRelativeDate(date);
}
