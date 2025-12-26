import Property from '../models/Property.js';
import xlsx from 'xlsx';

// @desc    Create new property
// @route   POST /api/properties
export const createProperty = async (req, res, next) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties
// @route   GET /api/properties
export const getProperties = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Property.countDocuments();
    const properties = await Property.find().skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      count: properties.length,
      pagination: { total, page, pages: Math.ceil(total / limit) },
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk Upload from Excel
// @route   POST /api/properties/bulk-upload
export const bulkUploadProperties = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload an Excel file');
    }

    // Read the Excel file
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    
    // Convert to JSON with raw parsing to handle dates better manually if needed
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { 
      defval: "" // Default empty cells to empty string
    });

    // Helper: Safely parse dates
    const parseDate = (dateVal) => {
      if (!dateVal) return undefined;
      const date = new Date(dateVal);
      return isNaN(date.getTime()) ? undefined : date;
    };

    const formattedData = rawData.map(row => {
      return {
        registrationNumber: row.registrationNumber,
        projectId: row.projectId,
        projectName: row.projectName,
        promoterName: row.promoterName,
        promoterType: row.promoterType,
        projectAddressLine1: row.projectAddressLine1,
        projectAddressLine2: row.projectAddressLine2,
        projectDistrict: row.projectDistrict,
        projectState: row.projectState,
        projectPincode: row.projectPincode, // Ensure this is string in Excel or convert
        registeringAuthority: row.registeringAuthority,
        
        // Date conversions
        registrationIssueDate: parseDate(row.registrationIssueDate),
        registrationValidUpto: parseDate(row.registrationValidUpto),
        registrationExtendedUpto: parseDate(row.registrationExtendedUpto),
        projectCompletionDate: parseDate(row.projectCompletionDate),
        
        approvalDetails: row.approvalDetails,
        projectDetails: row.projectDetails,
        projectStatus: row.projectStatus,
        projectWebsite: row.projectWebsite,
        
        latitude: row.latitude,
        longitude: row.longitude,
        
        // GeoJSON Mapping
        location: {
          type: 'Point',
          coordinates: [
            parseFloat(row.longitude) || 0, 
            parseFloat(row.latitude) || 0
          ]
        },

        viewCertificate: row.viewCertificate,
        viewQuarterlyProgress: row.viewQuarterlyProgress,
        monitoringOrders: row.monitoringOrders,
        occupancyCertificate: row.occupancyCertificate,
        remarks: row.remarks,
        sourceFile: req.file.originalname,
      };
    });

    // Bulk Write: Upsert (Update if exists, Insert if new) based on Registration Number
    const bulkOps = formattedData.map(doc => ({
      updateOne: {
        filter: { registrationNumber: doc.registrationNumber },
        update: { $set: doc },
        upsert: true
      }
    }));

    let result = { matchedCount: 0, modifiedCount: 0, upsertedCount: 0 };
    if (bulkOps.length > 0) {
      result = await Property.bulkWrite(bulkOps);
    }

    res.status(200).json({
      success: true,
      message: `Processed ${rawData.length} records.`,
      details: {
        inserted: result.upsertedCount,
        updated: result.modifiedCount
      }
    });

  } catch (error) {
    next(error);
  }
};