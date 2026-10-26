import React from 'react';
import { InstitutionalApplication } from '../types';
import { FileText, Download, Printer, ShieldCheck, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface AuditReportViewProps {
  application: InstitutionalApplication;
}

export const AuditReportView: React.FC<AuditReportViewProps> = ({ application }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar with Export Button */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-slate-100 text-slate-800 border-slate-300">
                Official Regulatory Records
              </Badge>
              <span className="text-xs font-mono text-slate-500">
                AICTE Regulation Bureau • Statutory Scrutiny Report
              </span>
            </div>
            <CardTitle className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Audit Trail & Formal Deficiency Document
            </CardTitle>
          </div>

          <Button
            size="sm"
            onClick={handlePrint}
            className="bg-slate-900 text-white hover:bg-slate-800 text-xs gap-1.5 shadow-2xs"
          >
            <Printer className="w-4 h-4" /> Print / Export Official PDF
          </Button>
        </CardHeader>
      </Card>

      {/* Official AICTE Deficiency Document (Styled for Printing / Presentation) */}
      <Card className="border-2 border-slate-300 bg-white shadow-md p-6 font-serif text-slate-900">
        <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
          <div className="text-xs font-sans font-bold tracking-widest text-slate-600 uppercase">
            Government of India • Ministry of Education
          </div>
          <h2 className="text-lg font-bold uppercase tracking-wide">
            All India Council for Technical Education
          </h2>
          <div className="text-xs font-sans text-slate-700">
            Nelson Mandela Marg, Vasant Kunj, New Delhi-110070 | Regulation Bureau
          </div>
          <div className="mt-2 inline-block bg-slate-100 border border-slate-400 font-sans font-bold text-xs px-3 py-1 uppercase tracking-wider">
            PRELIMINARY REGULATORY DEFICIENCY REPORT (ACADEMIC YEAR {application.academicYear})
          </div>
        </div>

        {/* Institution Details Grid */}
        <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 font-sans text-xs">
          <div>
            <div><strong>Institute Name:</strong> {application.instituteName}</div>
            <div><strong>Permanent ID (PID):</strong> <span className="font-mono">{application.permanentId}</span></div>
            <div><strong>Application Number:</strong> <span className="font-mono">{application.applicationNumber}</span></div>
          </div>
          <div>
            <div><strong>Region / State:</strong> {application.region} / {application.state}</div>
            <div><strong>Application Category:</strong> {application.category.replace(/_/g, ' ')}</div>
            <div><strong>Scrutiny Date:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
        </div>

        {/* Deficiency Table */}
        <div className="py-4 font-sans">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
            Detailed Deficiencies / Anomalies Identified During Preliminary Scrutiny
          </h3>

          {application.deficiencies.length === 0 ? (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-800 font-medium">
              ✓ Nil Deficiencies Recorded. The institution satisfies prescribed norms of the AICTE Approval Process Handbook (2024–2027) for the applied category.
            </div>
          ) : (
            <table className="w-full text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold border-b border-slate-300 text-slate-800">
                <tr>
                  <th className="border-r border-slate-300 p-2 text-left">Sr.</th>
                  <th className="border-r border-slate-300 p-2 text-left">Deficiency Title</th>
                  <th className="border-r border-slate-300 p-2 text-left">APH Clause Citation</th>
                  <th className="border-r border-slate-300 p-2 text-left">Nature of Discrepancy</th>
                  <th className="p-2 text-left">Prescribed Remedial Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {application.deficiencies.map((def, idx) => (
                  <tr key={def.id}>
                    <td className="border-r border-slate-300 p-2 font-mono text-center">{idx + 1}</td>
                    <td className="border-r border-slate-300 p-2 font-bold text-slate-900">{def.title}</td>
                    <td className="border-r border-slate-300 p-2 font-mono text-orange-800 font-semibold">{def.aphClause}</td>
                    <td className="border-r border-slate-300 p-2 text-slate-700">{def.description}</td>
                    <td className="p-2 text-slate-800 italic">{def.remedyAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Statutory Decision-Support Disclaimer */}
        <div className="mt-4 pt-3 border-t border-slate-300 text-[10px] font-sans text-slate-500 italic space-y-1">
          <p>
            <strong>Note on Statutory Validity:</strong> The findings above are decision-support outputs generated via the AICTE VeriSense automated platform. Statutory scrutiny, inspection committee visits, and final regulatory approval or rejection remain solely within the jurisdiction of the competent authorities of AICTE.
          </p>
        </div>
      </Card>

      {/* Chronological Immutable Audit Trail */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-700" />
            Immutable Audit Trail & System Event Logs
          </CardTitle>
          <CardDescription className="text-xs">
            Chronological audit log recording rules evaluated, operator actions, and external API responses.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="divide-y divide-slate-100 font-mono text-xs">
            {application.auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 font-medium shrink-0">{log.timestamp}</span>
                  <div>
                    <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold mr-2">
                      {log.action}
                    </span>
                    <span className="text-slate-800 font-sans font-medium">{log.targetDocumentOrField}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 sm:text-right">
                  <span className="text-slate-500 font-sans mr-2">By: {log.operatorId}</span>
                  <span className="font-semibold text-slate-900">{log.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
