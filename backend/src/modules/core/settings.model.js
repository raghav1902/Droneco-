const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'global',
    unique: true
  },
  institute: {
    name: { type: String, default: 'Tech Academy' },
    logo: { type: String, default: '' },
    address: { type: String, default: '123 Education Lane, Tech District' },
    contact: { type: String, default: '+1 234-567-8900' },
    email: { type: String, default: 'contact@institute.edu' },
    website: { type: String, default: 'https://institute.edu' },
    timezone: { type: String, default: 'UTC (GMT+0)' },
    currency: { type: String, default: 'INR' }
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', SettingsSchema);
