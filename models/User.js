import mongoose from 'mongoose';
import { type } from 'os';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone : {
    type : String
  },
  password: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: ''
  },
  provider: {
  type: String,
  default: "credentials",
 },
  education: {
   type : String,
  },
  workExperience: {
   type : String,
  },
  projects: {type : String},
  skills: {type : String},
  additionalInfo: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);