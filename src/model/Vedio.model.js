import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const vedioSchema = new Schema(
  {
    vedioFile: {
      type: String, //  cloudinary Url
      required: true,
    },
    ThumbNail: {
      type: String, //  cloudinary Url
      default: true,
      required: true,
    },
    Owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Title: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    Duration: {
      type: Number,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Vediomodel = mongoose.model("Vedio", vedioSchema);
