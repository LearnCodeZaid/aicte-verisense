import React, { useState } from 'react';
import { InstitutionalApplication, VerificationStatus } from '../types';
import { QrCode, ShieldCheck, CheckCircle2, XCircle, Clock, AlertTriangle, FileWarning, HelpCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface IssuingAuthorityHubProps {
  application: InstitutionalApplication;
}

export const IssuingAuthorityHub: React.FC<IssuingAuthorityHubProps> = ({ application }) => {
  const [testingEndpoint, setTestingEndpoint] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ status: VerificationStatus; message: string; timestamp: string } | null>(null);

  const simulateExternalVerification = (sourceName: string) => {
    setTestingEndpoint(sourceName);
    setTestResult(null);

    setTimeout(() => {
      setTestingEndpoint(null);
      setTestResult({
        status: 'VERIFIED',
        message: `Cryptographic Handshake Successful with ${sourceName} API Gateway (Digital Signature Hash: 0x9f4a...28b1 validated).`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200">
              National Document Repository & API Gateway
            </Badge>
            <span className="text-xs font-mono text-slate-500">
              Mandatory 6-State Verification Protocol (AICTE SIH 26261)
            </span>
          </div>
          <CardTitle className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Issuing Authority Direct Verification Gateway
          </CardTitle>
          <CardDescription className="text-xs mt-1">
            Cryptographic confirmation through original issuing-authority portals, state digital repositories, DigiLocker/NAD, and QR code digital signatures.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Mandatory 6-State Taxonomy Reference Banner */}
      <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xs">
        <span className="text-xs font-bold text-orange-400 uppercase tracking-wider font-mono">
          Mandatory Status Taxonomy Specified in AICTE Problem Statement
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-3 text-xs">
          <div className="bg-emerald-950/80 border border-emerald-500/40 p-2.5 rounded-lg">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</span>
            <p className="text-[10px] text-slate-300 mt-1">Cryptographic & registry match confirmed</p>
          </div>
          <div className="bg-rose-950/80 border border-rose-500/40 p-2.5 rounded-lg">
            <span className="font-bold text-rose-400 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" /> Mismatch</span>
            <p className="text-[10px] text-slate-300 mt-1">Record contradicts issuing database</p>
          </div>
          <div className="bg-amber-950/80 border border-amber-500/40 p-2.5 rounded-lg">
            <span className="font-bold text-amber-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Expired</span>
            <p className="text-[10px] text-slate-300 mt-1">Validity period lapsed prior to review</p>
          </div>
          <div className="bg-blue-950/80 border border-blue-500/40 p-2.5 rounded-lg">
            <span className="font-bold text-blue-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Pending</span>
            <p className="text-[10px] text-slate-300 mt-1">External repository query queued</p>
          </div>
          <div className="bg-slate-800 border border-slate-600 p-2.5 rounded-lg">
            <span className="font-bold text-slate-300 flex items-center gap-1.5"><FileWarning className="w-3.5 h-3.5" /> Unavailable</span>
            <p className="text-[10px] text-slate-400 mt-1">State server offline or non-API source</p>
          </div>
          <div className="bg-purple-950/80 border border-purple-500/40 p-2.5 rounded-lg">
            <span className="font-bold text-purple-400 flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5" /> Manual Review</span>
            <p className="text-[10px] text-slate-300 mt-1">Routed to regional scrutiny officer</p>
          </div>
        </div>
      </div>

      {/* Authority Handshake Status for Current Application */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900">
            Source Verification Matrix for {application.instituteName}
          </CardTitle>
          <CardDescription className="text-xs">
            Application PID: <span className="font-mono font-bold text-slate-800">{application.permanentId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
            {application.documents.map((doc) => (
              <div key={doc.id} className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50 transition">
                <div className="space-y-1">
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <span>{doc.name}</span>
                    <span className="font-mono text-[11px] text-slate-500 font-normal">({doc.fileName})</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Issuing Authority: <strong className="text-slate-800">{doc.issuingAuthority}</strong> • Ref No: <span className="font-mono font-semibold text-slate-700">{doc.issuingReferenceNumber}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    {doc.statusDetails}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="font-mono font-bold text-[11px] py-1">
                    {doc.verificationStatus}
                  </Badge>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => simulateExternalVerification(doc.issuingAuthority)}
                    disabled={testingEndpoint === doc.issuingAuthority}
                    className="text-xs text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50 gap-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingEndpoint === doc.issuingAuthority ? 'animate-spin' : ''}`} />
                    Query API
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Simulated Query Feedback Box */}
          {testResult && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs space-y-1 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Live Authority Verification Confirmed
                </span>
                <span className="font-mono text-[11px] text-emerald-700">{testResult.timestamp}</span>
              </div>
              <p className="text-emerald-800">{testResult.message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Code Cryptographic Scanner Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <QrCode className="w-4 h-4 text-indigo-600" />
              Cryptographic QR Code Validation Simulator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-slate-600">
              Test parsing digitally signed QR payloads from state municipal certificates, university degrees, and e-Notary papers.
            </p>
            <div className="p-3 bg-slate-100 rounded-lg font-mono text-[11px] text-slate-700 break-all border border-slate-200">
              PAYLOAD: AICTE-VERIFY|MH-PMC-2025-9482|10-OCT-2026|SIG:9F4A2B81C3D4|PUBKEY:GOV-IN-ROOT-CA
            </div>
            <Button
              size="sm"
              onClick={() => simulateExternalVerification('National e-Notary & Municipal QR Service')}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 text-xs"
            >
              Verify Cryptographic Signature on QR Payload
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              DigiLocker / National Academic Depository (NAD) Gateway
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-slate-600">
              Direct API integration endpoint configured for Ministry of Electronics and IT (MeitY) DigiLocker federated credential pull.
            </p>
            <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>DigiLocker OAuth 2.0 Gateway: CONNECTED & READY</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateExternalVerification('DigiLocker / NAD API Gateway')}
              className="w-full border-slate-300 text-slate-800 hover:bg-slate-50 text-xs"
            >
              Run Batch Credential Sync against DigiLocker
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
