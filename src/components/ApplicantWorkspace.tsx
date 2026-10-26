import React, { useState } from 'react';
import { ApplicationCategory } from '../types';
import { UploadCloud, CheckCircle2, AlertTriangle, FileText, Sparkles, Building2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export const ApplicantWorkspace: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ApplicationCategory>('EXTENSION_OF_APPROVAL');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: boolean }>({
    'Fire Safety NOC': true,
    'Land Title Deed': true,
    'Faculty Cadre List': true
  });
  const [isSimulatingOcr, setIsSimulatingOcr] = useState(false);
  const [simulatedDocName, setSimulatedDocName] = useState<string | null>(null);

  const getCategoryChecklists = (category: ApplicationCategory) => {
    switch (category) {
      case 'EXTENSION_OF_APPROVAL':
        return [
          { name: 'Fire Safety Certificate (NOC)', mandatory: true, desc: 'Current NOC issued by competent municipal fire authority' },
          { name: 'Land Title & Encumbrance Certificate', mandatory: true, desc: 'Clear title in the name of the Trust / Society' },
          { name: 'Faculty Master Roster & Salary Bank Advice', mandatory: true, desc: 'Proof of AICTE pay scale & bank disbursement' },
          { name: 'Occupancy / Completion Certificate', mandatory: true, desc: 'Certified by municipal town planning authority' },
          { name: 'TER Fee Payment Receipt', mandatory: true, desc: 'Transaction acknowledgement receipt from AICTE portal' }
        ];
      case 'NEW_INSTITUTION':
        return [
          { name: 'Registered Trust / Society Deed', mandatory: true, desc: 'Registration certificate under Societies/Trust Act' },
          { name: 'Contiguous Land Registration Document', mandatory: true, desc: 'Min 2.5 Acres (Urban) or 7.5 Acres (Rural)' },
          { name: 'Approved Building Floor Plans (Blueprints)', mandatory: true, desc: 'Signed by Chartered Architect & Municipal Planner' },
          { name: 'State Government NOC / Permission Letter', mandatory: true, desc: 'Issued by State Higher & Technical Education Dept' },
          { name: 'University Affiliation Letter', mandatory: true, desc: 'Consent of affiliation from designated affiliating university' }
        ];
      case 'INCREASE_IN_INTAKE':
        return [
          { name: 'NBA Accreditation Certificate', mandatory: true, desc: 'Minimum 50% eligible courses must be NBA accredited' },
          { name: 'Expanded Laboratory & Computer Setup Photos', mandatory: true, desc: 'Geo-tagged evidence of additional facilities' },
          { name: 'Recruitment Sanction & Cadre Balance Plan', mandatory: true, desc: 'Approved by Governing Body for expanded intake' },
          { name: 'Financial Audit Report (Last 3 Years)', mandatory: true, desc: 'Audited balance sheets certified by Chartered Accountant' }
        ];
      default:
        return [
          { name: 'Mandatory AICTE Affidavit 1', mandatory: true, desc: 'Standard notarized format from Approval Process Handbook' },
          { name: 'No-Objection Certificate (NOC)', mandatory: true, desc: 'Issued by State Govt & Affiliating University' }
        ];
    }
  };

  const handleSimulateUpload = (docName: string) => {
    setIsSimulatingOcr(true);
    setSimulatedDocName(docName);
    setTimeout(() => {
      setIsSimulatingOcr(false);
      setUploadProgress(prev => ({ ...prev, [docName]: true }));
    }, 1500);
  };

  const currentChecklist = getCategoryChecklists(selectedCategory);
  const completedCount = currentChecklist.filter(item => uploadProgress[item.name]).length;
  const completionPercentage = Math.round((completedCount / currentChecklist.length) * 100);

  return (
    <div className="space-y-6">
      {/* Category Selection Header */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-orange-50 text-orange-700 border-orange-200">
                  Institutional Filing Portal
                </Badge>
                <span className="text-xs font-mono text-slate-500">
                  Approval Process Handbook (APH 2024–2027)
                </span>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                Institutional Application & Evidence Ingestion
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Select your application category to automatically generate the prescribed regulatory checklist and upload supporting documents.
              </CardDescription>
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Application Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ApplicationCategory)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-md px-3 py-2 font-medium text-slate-900 shadow-xs focus:ring-2 focus:ring-orange-500 outline-hidden"
              >
                <option value="EXTENSION_OF_APPROVAL">Extension of Approval (EoA)</option>
                <option value="NEW_INSTITUTION">Setting Up New Technical Campus</option>
                <option value="INCREASE_IN_INTAKE">Increase in Intake / Additional Course</option>
                <option value="SUPERNUMERARY_SEATS">Supernumerary Seats (TFW / EWS)</option>
                <option value="CLOSURE_CHANGE_SITE">Change of Site / Closure of Institute</option>
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress & Checklist Ingestion Bar */}
      <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-orange-400 font-bold uppercase tracking-wider font-mono">
            Preliminary Completeness Scrutiny
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">
            {completedCount} of {currentChecklist.length} Mandatory Requirements Uploaded ({completionPercentage}%)
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            AI validation runs in real-time on upload to alert you to expired dates or missing fields before submission.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-32 bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <span className="font-mono text-sm font-bold text-emerald-400">{completionPercentage}%</span>
        </div>
      </div>

      {/* Dynamic Document Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentChecklist.map((item, index) => {
          const isUploaded = uploadProgress[item.name];
          return (
            <Card key={index} className={`border transition-all ${isUploaded ? 'border-emerald-200 bg-emerald-50/20 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-xs text-slate-900">{item.name}</span>
                    <Badge variant={isUploaded ? "default" : "outline"} className={isUploaded ? "bg-emerald-600 text-white text-[10px]" : "text-amber-700 border-amber-300 bg-amber-50 text-[10px]"}>
                      {isUploaded ? "Uploaded & OCR Checked" : "Upload Pending"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">PDF / Max 10MB</span>
                  {isUploaded ? (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Ready for AI Scrutiny
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleSimulateUpload(item.name)}
                      disabled={isSimulatingOcr && simulatedDocName === item.name}
                      className="text-xs bg-orange-600 text-white hover:bg-orange-700 gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      {isSimulatingOcr && simulatedDocName === item.name ? "Running OCR..." : "Upload & Parse"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
