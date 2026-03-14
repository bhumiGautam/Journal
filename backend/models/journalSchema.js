import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
      },

      ambience: {
        type: String,
        required: true,
      },

      text: {
        type: String,
        required: true,
      },

      emotion: {
        type : String
      },

      keywords:{
        type : [String]
      },

      summary: {
        type: String
      },

      isAnalyzed: {
        type: Boolean,
        default: false,
      },
    },{ timestamps: true });

const journaModel = mongoose.model("Journal" , journalSchema)

export default journaModel