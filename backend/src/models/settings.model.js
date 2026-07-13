const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'global',
    unique: true
  },
  institute: {
    name: { type: String, default: 'Droneco' },
    logo: { type: String, default: '' },
    address: { type: String, default: 'B-120 Sector 88 Noida UP IN 201305' },
    contact: { type: String, default: '+91 931 900 7542' },
    email: { type: String, default: 'info@godroneco.com' },
    website: { type: String, default: 'https://godroneco.com' },
    timezone: { type: String, default: 'UTC (GMT+0)' },
    currency: { type: String, default: 'INR' }
  },
  about: {
    developer: { type: String, default: 'Droneco' },
    supportEmail: { type: String, default: 'info@godroneco.com' },
    version: { type: String, default: '1.0.0' },
    build: { type: String, default: '20260703' },
    license: { type: String, default: 'Commercial - Single Institute' }
  },
  fee: {
    defaultDueDate: { type: String, default: '5th of every month' },
    gracePeriodDays: { type: Number, default: 5 },
    lateFeeAmount: { type: Number, default: 20 },
    lateFeeType: { type: String, default: 'Per Day' },
    allowPartialPayments: { type: Boolean, default: true },
    allowInstallments: { type: Boolean, default: true },
    taxPercentage: { type: Number, default: 0 }
  },
  receipt: {
    header: { type: String, default: 'Tech Academy Official Receipt' },
    footerMessage: { type: String, default: 'Thank you for your payment. Fees once paid are non-refundable.' },
    prefix: { type: String, default: 'REC-2026-' },
    autoNumbering: { type: Boolean, default: true },
    showLogo: { type: Boolean, default: true }
  },
  formConfig: {
    guardian: { visible: { type: Boolean, default: true }, required: { type: Boolean, default: true } },
    address: { visible: { type: Boolean, default: true }, required: { type: Boolean, default: true } },
    media: { visible: { type: Boolean, default: true }, required: { type: Boolean, default: true } },
    category: { visible: { type: Boolean, default: true }, required: { type: Boolean, default: true } },
    blood_group: { visible: { type: Boolean, default: true }, required: { type: Boolean, default: false } },
    religion: { visible: { type: Boolean, default: true }, required: { type: Boolean, default: false } },
    marital_status: { visible: { type: Boolean, default: true }, required: { type: Boolean, default: false } },
    identification_marks: { visible: { type: Boolean, default: true }, required: { type: Boolean, default: false } },
    disability: { visible: { type: Boolean, default: true }, required: { type: Boolean, default: false } },
    qualification: { visible: { type: Boolean, default: true }, required: { type: Boolean, default: false } },
    customFields: [{
      id: { type: String },
      label: { type: String },
      type: { type: String }, // 'text', 'dropdown', 'number', 'date'
      options: [{ type: String }],
      required: { type: Boolean },
      step: { type: String } // Which step to show it on (e.g. 'Personal', 'Academic', 'Course', 'Additional')
    }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', SettingsSchema);
