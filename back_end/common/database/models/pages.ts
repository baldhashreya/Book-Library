import { Document, model, Schema } from "mongoose";

interface translationsInterface {
  name: string;
  language_code: string;
}

export interface PagesModel extends Document {
  name: string;
  code: string;
  url?: string;
  image: string;
  display_order: number;
  active: boolean;
  created_by?: string;
  modified_by?: string;
  shows_in_menu: boolean;
  translations: translationsInterface[];
  action: {
    name: string;
    code: string;
    active: boolean;
    translations: translationsInterface[];
  }[];
}

const PagesSchema = new Schema<PagesModel>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  url: { type: String, required: false },
  image: { type: String, required: true },
  display_order: { type: Number, required: true },
  active: { type: Boolean, required: true },
  created_by: { type: String, required: false },
  modified_by: { type: String, required: false },
  shows_in_menu: { type: Boolean, required: true },
  translations: [
    {
      name: { type: String, required: true },
      language_code: { type: String, required: true },
    },
  ],
  action: [
    {
      name: { type: String, required: true },
      code: { type: String, required: true },
      translations: [
        {
          name: { type: String, required: true },
          language_code: { type: String, required: true },
        },
      ],
      active: { type: Boolean, required: true },
    },
  ],
});

export const Pages = model<PagesModel>("pages", PagesSchema);
