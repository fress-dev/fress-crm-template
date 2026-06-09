/** 本アプリの業務上のタイムゾーン（日本） */
export const APP_TIME_ZONE = "Asia/Tokyo";

type DateParts = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
};

const getZonedParts = (date: Date, timeZone = APP_TIME_ZONE): DateParts => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  ) as DateParts;

  return parts;
};

/** datetime-local 入力用（日本時間） */
export const formatDatetimeLocalTokyo = (date = new Date()): string => {
  const { year, month, day, hour, minute } = getZonedParts(date);
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

/**
 * フォームの日時文字列を DB 保存用 ISO（UTC）へ。
 * datetime-local の値は日本時間として解釈する。
 */
export const toStorageIsoFromTokyoInput = (value: string): string => {
  if (!value) {
    return new Date().toISOString();
  }

  if (value.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(value)) {
    return new Date(value).toISOString();
  }

  const normalized = value.length === 16 ? `${value}:00` : value;
  return new Date(`${normalized}+09:00`).toISOString();
};

export const differenceInCalendarDaysTokyo = (
  left: Date,
  right: Date,
): number => {
  const a = getZonedParts(left);
  const b = getZonedParts(right);
  const dayA = Date.UTC(Number(a.year), Number(a.month) - 1, Number(a.day));
  const dayB = Date.UTC(Number(b.year), Number(b.month) - 1, Number(b.day));
  return Math.round((dayB - dayA) / 86_400_000);
};

export const formatTimeTokyo = (date: Date) =>
  new Intl.DateTimeFormat("ja-JP", {
    timeZone: APP_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

export const formatDateTokyo = (date: Date) =>
  new Intl.DateTimeFormat("ja-JP", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

/** 登録日時など（日本時間・時分秒まで） */
export const formatDateTimeTokyo = (date: Date) =>
  new Intl.DateTimeFormat("ja-JP", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

export const nowInTokyo = () => new Date();
