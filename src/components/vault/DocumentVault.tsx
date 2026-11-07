import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VaultDocument } from '../../types/scholarship';
import { 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Eye, 
  Calendar, 
  ShieldCheck, 
  Plus, 
  X, 
  FileCheck
} from 'lucide-react';
import { formatDatePretty } from '../../utils/formatters';
import { sanitizeInput, validateUploadedFile } from '../../utils/security';

const DOC_CATEGORIES = [
  'Aadhaar Card',
  'Income Certificate',
  'Caste Certificate',
  'Academic Marksheets',
  'College Bonafide Certificate',
  'Bank Passbook Copy',
  'Passport',
  'Statement of Purpose (SOP)',
  'Letter of Recommendation (LOR)',
  'Other Supporting Document'
];

export const DocumentVault: React.FC = () => {
  const { 
    vaultDocuments, 
    addVaultDocument, 
    deleteVaultDocument, 
    trackedApplications, 
    getScholarshipById,
    checkScholarshipMissingDocs 
  } = useApp();

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(DOC_CATEGORIES[0]);
  const [fileName, setFileName] = useState('');
  const [expiryDate, setExpiryDate] = useState('2027-03-31');
  const [notes, setNotes] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null);

  // Missing document detector across all tracked applications in Interested or Preparing status
  const targetScholarships = trackedApplications
    .filter(t => ['Interested', 'Preparing'].includes(t.status))
    .map(t => getScholarshipById(t.scholarshipId))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  // Collect all missing documents required across these targets
  const missingAggregated: { docName: string; scholarshipsRequiring: string[] }[] = [];
  targetScholarships.forEach(sch => {
    const check = checkScholarshipMissingDocs(sch);
    check.missingDocs.forEach(m => {
      const existing = missingAggregated.find(item => item.docName.toLowerCase() === m.name.toLowerCase());
      if (existing) {
        if (!existing.scholarshipsRequiring.includes(sch.name)) {
          existing.scholarshipsRequiring.push(sch.name);
        }
      } else {
        missingAggregated.push({ docName: m.name, scholarshipsRequiring: [sch.name] });
      }
    });
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');

    const cleanInputName = sanitizeInput(fileName);
    const finalName = cleanInputName || `${selectedType.replace(/\s+/g, '_')}_Official.pdf`;
    const simulatedSizeBytes = (Math.random() * 1.5 + 0.5) * 1024 * 1024;

    // Security validation for extension and file size
    const validation = validateUploadedFile(finalName, simulatedSizeBytes, 10);
    if (!validation.isValid) {
      setUploadError(validation.error || 'Security check failed for this document.');
      return;
    }

    addVaultDocument({
      docType: selectedType,
      fileName: finalName,
      fileSize: `${(simulatedSizeBytes / (1024 * 1024)).toFixed(1)} MB`,
      expiryDate: selectedType === 'Income Certificate' || selectedType === 'Caste Certificate' ? expiryDate : undefined,
      status: 'Verified',
      notes: sanitizeInput(notes) || 'Student verified document.'
    });

    setUploadModalOpen(false);
    setFileName('');
    setNotes('');
    setUploadError('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Student Document Vault</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Document Vault & Expiry Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Store, categorize, and track expiration of identity, academic, and income certificates.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Certificate</span>
        </button>
      </div>

      {/* Differentiating Feature: Missing Document Radar Alert Box */}
      {missingAggregated.length > 0 ? (
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Missing Document Detector: Action Required</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            GRANTLY detected missing documents required by your target scholarships in your tracker. Upload them to complete your application readiness:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {missingAggregated.map((m, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-amber-200/80 text-xs shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{m.docName}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                    Missing
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 truncate">
                  Needed for: {m.scholarshipsRequiring.join(', ')}
                </p>
                <button
                  onClick={() => {
                    setSelectedType(
                      DOC_CATEGORIES.find(c => c.toLowerCase().includes(m.docName.toLowerCase())) || DOC_CATEGORIES[0]
                    );
                    setUploadModalOpen(true);
                  }}
                  className="mt-2 text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Upload this document now</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span><strong>Document Vault 100% Ready:</strong> All required documents for your active applications are uploaded and verified!</span>
        </div>
      )}

      {/* Vault Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vaultDocuments.map(doc => {
          return (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-emerald-700 flex items-center justify-center font-bold">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{doc.docType}</span>
                      <span className="text-[10px] text-slate-400">{doc.fileSize} • Uploaded {formatDatePretty(doc.uploadedAt)}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {doc.status}
                  </span>
                </div>

                <div className="mt-3.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-mono font-semibold text-slate-700 truncate">
                    {doc.fileName}
                  </p>
                  {doc.notes && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {doc.notes}
                    </p>
                  )}
                </div>

                {/* Expiry Tracking */}
                {doc.expiryDate && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Expires: <strong>{formatDatePretty(doc.expiryDate)}</strong></span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => deleteVaultDocument(doc.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  title="Delete Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" />
                Upload Certificate to Vault
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Category</label>
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {DOC_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">File Name (Optional)</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  placeholder={`e.g. ${selectedType.replace(/\s+/g, '_')}_2026.pdf`}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {(selectedType.includes('Income') || selectedType.includes('Caste')) && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Certificate Validity Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    State income certificates typically expire on March 31st each financial year.
                  </p>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Issuing Authority</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Issued by Tehsildar Pune / Digilocker Verified"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-slate-600 text-[11px]">
                <strong className="text-emerald-800">Simulated Upload: </strong>
                Accepts PDF, JPG, PNG formats up to 5 MB. Documents are stored in client workspace.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Upload & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{previewDoc.docType}</h3>
                <p className="text-xs text-slate-400 font-mono">{previewDoc.fileName}</p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated certificate preview */}
            <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-center space-y-2">
              <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">{previewDoc.docType} Preview</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {previewDoc.notes}
              </p>
              <div className="pt-2 text-[11px] text-slate-400">
                Digital Signature Verified • Size: {previewDoc.fileSize}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
