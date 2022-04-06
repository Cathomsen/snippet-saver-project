import { mongoose } from "mongoose";

const { Schema } = mongoose;

const snippetSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "Please write more. Too short"],
    },
    language: {
      type: String,
      required: true,
      minLength: [3, "Please write more. Too short"],
    },
    description: {
      type: String,
      required: true,
      minLength: [3, "Please write more. Too short"],
    },
    snippet: {
      type: String,
      required: true,
      minLength: [3, "Please write more. Too short"],
    },
    favorite: {
      type: Boolean,
      required: false,
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
  }
  /* {
    timestamps: true,
  } */
);

export const models = [
  {
    name: "Snippet",
    schema: snippetSchema,
    collection: "snippets",
  },
];
