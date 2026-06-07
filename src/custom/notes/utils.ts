import {
  formatDatetimeLocalTokyo,
  toStorageIsoFromTokyoInput,
} from "@/custom/misc/appDateTime";

export const getCurrentDate = () => formatDatetimeLocalTokyo();

export const formatNoteDate = (dateString: string) =>
  toStorageIsoFromTokyoInput(dateString);

export const serializeNoteDate = (value?: string) =>
  toStorageIsoFromTokyoInput(value || getCurrentDate());
