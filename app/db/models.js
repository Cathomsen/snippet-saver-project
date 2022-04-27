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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  }
  /* {
    timestamps: true,
  } */
);

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minLength: [3, "Please write more. Too short"],
  },
  password: {
    type: String,
    required: true,
    minLength: [3, "Please write more. Too short"],
  },
  snippets: [{ type: Schema.Types.ObjectId, ref: "Snippet" }],
});

export const models = [
  {
    name: "Snippet",
    schema: snippetSchema,
    collection: "snippets",
  },
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  },
];
