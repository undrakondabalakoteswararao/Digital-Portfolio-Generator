const mongoose = require('mongoose');
const { Schema } = mongoose;

const isUrl = (v) => !v || /^https?:\/\/[^\s]+\.[^\s]+$/i.test(v);
const urlField = {
  type: String,
  trim: true,
  maxlength: 300,
  validate: { validator: isUrl, message: 'Enter a valid URL starting with http:// or https://' },
};
const str = (max = 200) => ({ type: String, trim: true, maxlength: max });

const SKILL_CATEGORIES = ['Programming Languages', 'Web Technologies', 'Databases', 'Frameworks', 'Tools', 'Other Skills'];

const educationSchema = new Schema({
  collegeName: { ...str(150), required: [true, 'College name is required'] },
  degree: { ...str(100), required: [true, 'Degree is required'] },
  branch: str(100),
  startYear: str(4),
  graduationYear: str(4),
  grade: str(30),
});

const skillSchema = new Schema({
  name: { ...str(50), required: [true, 'Skill name is required'] },
  category: { type: String, enum: SKILL_CATEGORIES, default: 'Other Skills' },
  level: { type: Number, min: 0, max: 100 }, // optional - only set when the user provides it
});

const projectSchema = new Schema({
  name: { ...str(120), required: [true, 'Project name is required'] },
  description: str(1500),
  technologies: [{ type: String, trim: true, maxlength: 40 }],
  githubUrl: urlField,
  liveUrl: urlField,
  image: str(300),
});

const experienceSchema = new Schema({
  organization: { ...str(150), required: [true, 'Organization is required'] },
  role: { ...str(100), required: [true, 'Role is required'] },
  startDate: str(10),
  endDate: str(10),
  description: str(1500),
});

const certificationSchema = new Schema({
  name: { ...str(150), required: [true, 'Certification name is required'] },
  issuer: str(150),
  issueDate: str(10),
  credentialUrl: urlField,
});

const achievementSchema = new Schema({
  title: { ...str(150), required: [true, 'Achievement title is required'] },
  description: str(1000),
  date: str(10),
});

const profileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    profileImage: str(300),
    professionalTitle: str(100),
    careerObjective: str(500),
    about: str(2000),
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate: { validator: (v) => !v || /^\S+@\S+\.\S+$/.test(v), message: 'Enter a valid contact email' },
    },
    phone: {
      type: String,
      trim: true,
      validate: { validator: (v) => !v || /^[+\d][\d\s()-]{6,19}$/.test(v), message: 'Enter a valid phone number' },
    },
    city: str(80),
    country: str(80),
    socialLinks: {
      linkedin: urlField,
      github: urlField,
      website: urlField,
      others: [{ label: str(40), url: urlField, _id: false }],
    },
    education: [educationSchema],
    skills: [skillSchema],
    projects: [projectSchema],
    experience: [experienceSchema],
    certifications: [certificationSchema],
    achievements: [achievementSchema],
    languages: [{ type: String, trim: true, maxlength: 40 }],
    interests: [{ type: String, trim: true, maxlength: 60 }],
    hobbies: [{ type: String, trim: true, maxlength: 60 }],
    activity: [{ message: String, at: { type: Date, default: Date.now }, _id: false }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
module.exports.SKILL_CATEGORIES = SKILL_CATEGORIES;
