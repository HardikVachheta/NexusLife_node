const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    default: null,
  },
  location: {
    type: String,
    default: "Ahmedabad",
  },
  type: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
    default: "Full-time",
  },
  experience: {
    type: String,
    default: null, // e.g. "3 to 5 years"
  },
  description: {
    type: String,
    default: null,
  },
  skills: {
    type: [String],
    default: [],
  },
  applyUrl: {
    type: String,
    default: null,
  },
});

const ScrapedJobCacheSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      unique: true, // one cache doc per company
    },
    careerUrl: {
      type: String,
      required: true,
    },
    jobs: [JobSchema],

    // Cache control
    scrapedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  },
  { timestamps: true }
);

// Auto-delete expired documents (TTL index)
ScrapedJobCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("ScrapedJobCache", ScrapedJobCacheSchema);

// // const mongoose = require "mongoose";
// const mongoose = require('mongoose');

// const JobSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   department: {
//     type: String,
//     default: null,
//   },
//   location: {
//     type: String,
//     default: "Ahmedabad",
//   },
//   type: {
//     type: String,
//     enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
//     default: "Full-time",
//   },
//   experience: {
//     type: String,
//     default: null, // e.g. "3 to 5 years"
//   },
//   description: {
//     type: String,
//     default: null,
//   },
//   skills: {
//     type: [String],
//     default: [],
//   },
//   applyUrl: {
//     type: String,
//     default: null,
//   },
// });

// const ScrapedJobCacheSchema = new mongoose.Schema(
//   {
//     company: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Company",
//       required: true,
//       unique: true, // one cache doc per company
//     },
//     careerUrl: {
//       type: String,
//       required: true,
//     },
//     jobs: [JobSchema],

//     // Cache control
//     scrapedAt: {
//       type: Date,
//       default: Date.now,
//     },
//     expiresAt: {
//       type: Date,
//       default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
//     },
//   },
//   { timestamps: true }
// );

// // Auto-delete expired documents (TTL index)
// ScrapedJobCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// export default mongoose.model("ScrapedJobCache", ScrapedJobCacheSchema);