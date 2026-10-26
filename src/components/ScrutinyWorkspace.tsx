import React, { useState } from 'react';
import { InstitutionalApplication, DocumentItem, VerificationStatus } from '../types';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Clock, XCircle, FileWarning, 
  HelpCircle, Eye, FileText, Search, ExternalLink, Download, Layers, CheckSquare
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface ScrutinyWorkspaceProps {
  application: InstitutionalApplication;
}

export const ScrutinyWorkspace: React.FC<ScrutinyWorkspaceProps> = ({ application }) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem>(application.documents[0]);
  const [showElaView, setShowElaView] = useState(false);
  const [officerDecision, setOfficerDecision] = useState<string | null>(null);

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 gap-1"><CheckCircle2 className="w-3 h-3" /> Verified</Badge>;
      case 'MISMATCH_DETECTED':
        return <Badge className="bg-rose-100 text-rose-800 border-rose-300 gap-1"><XCircle className="w-3 h-3" /> Mismatch Detected</Badge>;
      case 'EXPIRED':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300 gap-1"><Clock className="w-3 h-3" /> Expired</Badge>;
      case 'VERIFICATION_PENDING':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300 gap-1"><Clock className="w-3 h-3" /> Verification Pending</Badge>;
      case 'SOURCE_UNAVAILABLE':
        return <Badge className="bg-slate-100 text-slate-800 border-slate-300 gap-1"><FileWarning className="w-3 h-3" /> Source Unavailable</Badge>;
      case 'MANUAL_REVIEW_REQUIRED':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300 gap-1"><HelpCircle className="w-3 h-3" /> Manual Review Required</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Application Overview Banner */}
      <Card className="border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-xs">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  PID: {application.permanentId}
                </span>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  App No: {application.applicationNumber}
                </span>
                <Badge variant={application.riskLevel === 'CRITICAL' ? 'destructive' : application.riskLevel === 'MEDIUM' ? 'outline' : 'secondary'} className={application.riskLevel === 'MEDIUM' ? 'border-amber-400 text-amber-800 bg-amber-50' : application.riskLevel === 'LOW' ? 'bg-emerald-100 text-emerald-800' : ''}>
                  {application.riskLevel === 'CRITICAL' ? 'CRITICAL RISK / FRAUD ALERT' : application.riskLevel === 'MEDIUM' ? 'MODERATE DEFICIENCIES' : 'COMPLIANT PASS'}
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                {application.instituteName}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {application.city}, {application.state} • {application.region} REGION • Category: {application.category.replace(/_/g, ' ')}
              </p>
            </div>

            {/* Score Meters */}
            <div className="flex items-center gap-4">
              <div className="text-center px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">Compliance Score</span>
                <div className={`text-2xl font-black ${application.overallComplianceScore >= 90 ? 'text-emerald-600' : application.overallComplianceScore >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                  {application.overallComplianceScore}%
                </div>
              </div>
              <div className="text-center px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">FSR (Student:Faculty)</span>
                <div className="text-lg font-bold text-slate-800 font-mono">
                  {application.fsrRatio}
                </div>
                <span className="text-[10px] text-slate-400">Norm: 1:20</span>
              </div>
              <div className="text-center px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">TER Processing Fee</span>
                <div className="text-sm font-bold text-emerald-700 flex items-center justify-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PAID
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{application.terTransactionId.slice(0, 14)}...</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Two-Column Scrutiny Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Uploaded Documents List */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  Submitted Statutory Documents ({application.documents.length})
                </CardTitle>
                <span className="text-[11px] text-slate-400">AICTE APH 2024-27</span>
              </div>
              <CardDescription className="text-xs">
                Click a document to inspect OCR extractions, issuing authority handshake, and forgery scans.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 space-y-1.5">
              {application.documents.map((doc) => {
                const isSelected = selectedDoc.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => { setSelectedDoc(doc); setShowElaView(false); }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="font-semibold text-xs text-slate-900 leading-snug">
                        {doc.name}
                      </div>
                      {getStatusBadge(doc.verificationStatus)}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 font-mono">
                      <span>{doc.fileName}</span>
                      <span>•</span>
                      <span>{doc.fileSize}</span>
                    </div>

                    {/* Tampering Alert Warning Pill */}
                    {doc.hasTamperingAlert && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1 rounded">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Tampering / ELA Inconsistency Detected ({((doc.tamperingConfidence || 0) * 100).toFixed(1)}%)</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Deficiency Summary Card */}
          {application.deficiencies.length > 0 && (
            <Card className="border-red-200 bg-red-50/40 shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-red-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Identified Non-Compliances & Deficiencies ({application.deficiencies.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {application.deficiencies.map((def) => (
                  <div key={def.id} className="p-2.5 bg-white rounded border border-red-200">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900">{def.title}</span>
                      <span className="text-[10px] font-mono text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-bold">
                        {def.severity}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 text-[11px]">{def.description}</p>
                    <div className="mt-1.5 text-[10px] font-mono font-semibold text-orange-700">
                      Citation: {def.aphClause}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Deep Inspection Panel */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  {selectedDoc.name}
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Authority: {selectedDoc.issuingAuthority} • Ref: <span className="font-mono text-slate-700">{selectedDoc.issuingReferenceNumber}</span>
                </CardDescription>
              </div>

              {selectedDoc.hasTamperingAlert && (
                <Button
                  size="sm"
                  variant={showElaView ? "default" : "outline"}
                  onClick={() => setShowElaView(!showElaView)}
                  className={`text-xs gap-1.5 ${showElaView ? 'bg-rose-600 text-white hover:bg-rose-700' : 'text-rose-700 border-rose-300 hover:bg-rose-50'}`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  {showElaView ? "View Original Extraction" : "Toggle ELA Tamper Heatmap"}
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* ELA Forensic Mode View */}
              {showElaView && selectedDoc.hasTamperingAlert ? (
                <div className="p-4 bg-slate-950 text-white rounded-lg border border-rose-500/50 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-rose-400 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      ERROR LEVEL ANALYSIS (ELA) FORENSIC VIEW
                    </span>
                    <span className="text-[11px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800">
                      Tamper Probability: {((selectedDoc.tamperingConfidence || 0) * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="relative rounded-md overflow-hidden border border-slate-800 bg-black aspect-video flex items-center justify-center">
                    <img
                      src={selectedDoc.elaHeatmapUrl}
                      alt="ELA Heatmap"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-3">
                      <span className="text-xs font-mono text-rose-400 font-bold">
                        [!] Splicing Artifacts Detected in Title Plot Identifier & Seal Layer
                      </span>
                      <span className="text-[11px] text-slate-300">
                        Notice the bright compression variance indicating text edited in third-party raster software after primary certificate generation.
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-800">
                    <div>EXIF Tool Sign: <span className="text-rose-400">Adobe Photoshop 24.1</span></div>
                    <div>Compression Ghost: <span className="text-rose-400">Double JPEG Layer Detected</span></div>
                  </div>
                </div>
              ) : (
                /* Standard Document OCR & Field Analysis View */
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-600">Verification Finding:</span>
                      <p className="text-xs text-slate-800 font-medium mt-0.5">{selectedDoc.statusDetails}</p>
                    </div>
                    {getStatusBadge(selectedDoc.verificationStatus)}
                  </div>

                  {/* Extracted Fields Table */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Search className="w-3.5 h-3.5 text-orange-600" />
                      Extracted Fields (PaddleOCR / Vision Parser)
                    </h4>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-2 px-3 text-left">Document Field</th>
                            <th className="py-2 px-3 text-left">Extracted Value</th>
                            <th className="py-2 px-3 text-left">Validation Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
                          {Object.entries(selectedDoc.extractedFields).map(([key, val]) => (
                            <tr key={key} className="hover:bg-slate-50/50">
                              <td className="py-2 px-3 font-sans font-medium text-slate-600">{key}</td>
                              <td className="py-2 px-3 font-semibold text-slate-900">{String(val)}</td>
                              <td className="py-2 px-3">
                                <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                                  Field Parsed
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Handbook Citation Reference */}
                  {selectedDoc.aphClauseReference && (
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs">
                      <span className="font-bold text-amber-900">AICTE Handbook Rule Mapping:</span>
                      <p className="text-amber-800 mt-0.5">{selectedDoc.aphClauseReference}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Official AICTE Scrutiny Action Bar */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Official Decision-Support Action (AICTE Regulation Bureau)
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setOfficerDecision('RECTIFICATION')}
                    className="text-xs border-amber-300 text-amber-800 hover:bg-amber-50"
                  >
                    Issue Rectification Notice (15-Day Cure)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setOfficerDecision('INSPECTION')}
                    className="text-xs border-purple-300 text-purple-800 hover:bg-purple-50"
                  >
                    Order Physical Expert Visit (SAC Committee)
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setOfficerDecision('ENDORSE')}
                    className="text-xs bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Endorse for Extension of Approval (EoA)
                  </Button>
                </div>

                {officerDecision && (
                  <div className="p-2.5 bg-slate-900 text-white rounded text-xs mt-2 font-mono flex justify-between items-center">
                    <span>Action Recorded: <strong>{officerDecision}</strong></span>
                    <span className="text-[10px] text-slate-400">Logged to Immutable Audit Trail</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
