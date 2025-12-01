import { z } from "zod";

export const conditionMap: Record<string, string> = {
    new: "Новий",
    used: "Б/В",
    refurbished: "Відновлений",
};

export const containerTypes: Record<string, string> = {
  standard: "Standard",
  general_purpose: "General purpose",
  high_cube: "High Cube",
  pallet_wide: "Pallet Wide",
  refrigerated: "Refrigerated (Reefer)",
  insulated: "Insulated",
  open_top: "Open Top",
  ventilated: "Ventilated",
  hard_top: "Hard Top",
  platform: "Platform",
  flat_rack: "Flat Rack",
  tank: "Tank",
  bulk: "Bulk",
  special: "Special Purpose",
  double_door: "Double Door",
  side_door: "Side Door",
  other: "Інший",
};

export const containerDimensions: Record<string, string> = {
  ft4: "4ft",
  ft6: "6ft",
  ft8: "8ft",
  ft10: "10ft",
  ft20: "20ft",
  ft40: "40ft",
  ft45: "45ft",
  ft53: "53ft",
  unknown: "Невідомий"
};

export const listingTypes: Record<string, string> = {
  sale: "Продаж",
  rent: "Оренда",
};

export const ralColors: Record<string, string> = {
    RAL1000: "Зеленувато-бежевий",
    RAL1001: "Бежевий",
    RAL1002: "Піщаний жовтий",
    RAL1003: "Сигнальний жовтий",
    RAL1004: "Золотисто-жовтий",
    RAL1005: "Жовтий медовий",
};

const enumFromRecord = <T extends Record<string, string>>(record: T) =>
  z.enum(Object.keys(record) as [keyof T & string, ...(keyof T & string)[]]);

const optionalEnum = <T extends Record<string, string>>(record: T) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    enumFromRecord(record).optional()
  );

const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, { message })
    .optional()
    .or(z.literal(""))
    .nullable();

export const listingCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(1, { message: "Max length is 128 characters" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required" })
    .max(2048, { message: "Max length is 2048 characters" }),
  price: z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) return undefined;
      if (typeof value === "number" && Number.isNaN(value)) return undefined;
      return value;
    },
    z
      .number({
        invalid_type_error: "Price is required",
        required_error: "Price is required",
      })
      .nonnegative({ message: "Price must be zero or positive" })
  ),
  container_type: enumFromRecord(containerTypes),
  condition: enumFromRecord(conditionMap),
  type: enumFromRecord(listingTypes),
  currency: z.enum(Intl.supportedValuesOf("currency") as [string, ...string[]], {
    errorMap: () => ({ message: "Currency is required" }),
  }),
  location: z
    .string()
    .trim()
    .min(1, { message: "Location is required" })
    .max(128, { message: "Max length is 128 characters" }),
  ral_color: enumFromRecord(ralColors),
  dimension: enumFromRecord(containerDimensions),
});
export type ListingCreateFormValues = z.infer<typeof listingCreateSchema>;
