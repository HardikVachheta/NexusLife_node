const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    experience: { type: String, trim: true }, // e.g., "0-2 years", "Fresher", "3-5 Years", "6M - 1 Yr"
    qualifications: [{ type: String, trim: true }], // For specific degrees like MCA, B.Tech
    skills: [{ type: String, trim: true }], // Specific technical skills like HTML, CSS, JavaScript, MERN, React, Java
    positionsAvailable: { type: Number }, // Number of openings for this specific role
    type: { type: String, enum: ['Full-Time', 'Internship', 'Trainee', 'Contract', 'Part-Time'], trim: true },
    workArrangement: { type: String, enum: ['Onsite', 'Remote', 'Hybrid', 'Work From Office', '5-days WFO'], trim: true },
});

const companySchema = new mongoose.Schema({
    // Company General Information
    name: { type: String, required: true, unique: true, trim: true },
    hrContactPerson: { type: String, trim: true }, // e.g., Taniya Sharma, Priyanshi Tripathi
    companyType: { type: String, trim: true }, // e.g., "USA based company"
    website: { type: String, trim: true },

    // Contact Information
    email: { type: String, trim: true, lowercase: true }, // Main company email for general inquiries or applications
    phone: { type: String, trim: true }, // Main company phone number

    // Location Information
    location: {
        city: { type: String, trim: true },
        address: { type: String, trim: true }, // Full address if available
        area: { type: String, trim: true }, // More specific area like "Gota", "Nikol", "Shyamal"
        // You could add coordinates if you plan map integration later
        // coordinates: {
        //     type: { type: String, enum: ['Point'], default: 'Point' },
        //     coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
        // }
    },

    // Job Listings (Array of embedded documents or references if jobs are very complex and shared)
    jobOpenings: [jobSchema], // Array of job positions

    // Walk-in Specific Details (if applicable)
    walkinDetails: {
        isWalkin: { type: Boolean, default: false },
        date: { type: Date }, // Specific date for walk-in
        dateRangeStart: { type: Date }, // For date ranges like "16th - 20th June"
        dateRangeEnd: { type: Date },
        time: { type: String, trim: true }, // e.g., "11 AM - 5 PM"
        whatToBring: [{ type: String, trim: true }], // e.g., "Updated CV", "Mindset to learn"
        eligibilityPassoutYears: [{ type: Number }], // For freshers walk-in like 2024, 2025
        reportingTime: { type: String, trim: true }, // e.g., "9:30 AM"
        interviewTime: { type: String, trim: true }, // e.g., "9:30 AM to 12:30 PM"
    },

    // Additional Perks/Benefits
    perks: [{ type: String, trim: true }], // e.g., "5 Days Working", "Friendly Environment"

    // Specific Requirements/Notes
    notes: { type: String, trim: true }, // Any other specific notes like "Ahmedabad Candidates preferred"
    mustHaves: [{ type: String, trim: true }], // Specific non-skill requirements like "Hands-on experience with AI tools"

    // Application related fields
    applicationMethod: { type: String, enum: ['Email', 'Link', 'Walk-in', 'DM'], trim: true },
    applicationEmail: { type: String, trim: true, lowercase: true }, // Specific email for applications
    applicationLink: { type: String, trim: true }, // Link for applying
    applicationPhoneNumber: { type: String, trim: true }, // Phone number for applying/queries

}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;