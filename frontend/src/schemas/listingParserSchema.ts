import {z} from 'zod';
import { conditionMap, containerDimensions, containerTypes, listingTypes } from './listingSchema';

export const parserMethods: Record<string, string> = {
  BS_BRINKBOX: "BS Brinkbox",
  BS_CARU: "BS Caru",
};

export const listingParserBaseSchema = z.object({
    company_name: z.string()
        .max(64, {message: "Задовга назва компанії"})
        .trim(),
    method: z.enum(Object.keys(parserMethods)),
    url: z.string()
        .max(2048, { message: 'Задовгий URL' }),
    location: z.string()
        .max(128, { message: "Задовга локація" })
        .trim(),
    condition: z.enum(Object.keys(conditionMap)),
    type: z.enum(Object.keys(listingTypes)),
    currency: z.enum(Intl.supportedValuesOf("currency")),
    container_type: z.enum(Object.keys(containerTypes)),
    dimension: z.enum(Object.keys(containerDimensions))
})
export type listingParserCreate = z.infer<typeof listingParserBaseSchema>
