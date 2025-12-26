import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true, index: true },
  projectId: { type: String },
  projectName: { type: String, required: true },
  promoterName: { type: String },
  promoterType: { type: String },
  projectAddressLine1: { type: String },
  projectAddressLine2: { type: String },
  projectDistrict: { type: String },
  projectState: { type: String },
  projectPincode: { type: String },
  registeringAuthority: { type: String },
  
  // Date fields
  registrationIssueDate: { type: Date },
  registrationValidUpto: { type: Date },
  registrationExtendedUpto: { type: Date },
  projectCompletionDate: { type: Date },
  
  approvalDetails: { type: String },
  projectDetails: { type: String },
  projectStatus: { type: String },
  projectWebsite: { type: String },
  
  // Location stored as GeoJSON for potential map features
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  
  // Raw lat/long from excel (optional, kept for reference)
  latitude: { type: String },
  longitude: { type: String },

  // Document Links
  viewCertificate: { type: String },
  viewQuarterlyProgress: { type: String },
  monitoringOrders: { type: String },
  occupancyCertificate: { type: String },
  
  remarks: { type: String },
  sourceFile: { type: String }
}, {
  timestamps: true
});

// Index for efficient querying
PropertySchema.index({ projectState: 1, projectDistrict: 1 });

export default mongoose.model('Property', PropertySchema);