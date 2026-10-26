import React from 'react';
import { InstitutionalApplication } from '../types';
import { ShieldCheck, Building2, Eye, QrCode, Sliders, FileText, AlertTriangle } from 'lucide-react';
import { Badge } from './ui/badge';

interface HeaderProps {
  applications: InstitutionalApplication[];
  selectedAppId: string;
  onSelectApp: (id: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  applications,
  selectedAppId,
  onSelectApp,
  activeTab,
  onTabChange
}) => {
  const currentApp = applications.find(a => a.id === selectedAppId);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      {/* Top Gov Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 text-white px-4 py-1.5 text-xs font-medium flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 px-2 py-0.5 rounded font-mono text-[11px] font-bold tracking-wider">
            GOVT. OF INDIA
          </span>
          <span>Ministry of Education • All India Council for Technical Education (AICTE)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-black/30 px-2 py-0.5 rounded text-[11px] font-mono">
            Regulation Bureau • Smart Automation
          </span>
          <span className="bg-white text-orange-700 font-bold px-2 py-0.5 rounded text-[11px]">
            SIH 2026 | PS 26261
          </span>
        </div>
      </div>

      {/* Main Branding & Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center p-1.5 shadow-xs">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/e/eb/All_India_Council_for_Technical_Education_logo.png"
                alt="AICTE Logo"
                className="w-full h-full object-contain"
                onError={(e)=>{ (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans']">
                  AICTE VeriSense
                </h1>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs py-0">
                  Decision-Support v2.6
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                AI-Powered Application Validation, Document Authentication & Regulatory Scrutiny
              </p>
            </div>
          </div>

          {/* Quick Scenario Switcher */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-600 px-2 flex items-center gap-1">
              <span>Institution Scenario:</span>
            </span>
            <select
              value={selectedAppId}
              onChange={(e) => onSelectApp(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 font-medium text-slate-800 shadow-xs focus:ring-2 focus:ring-orange-500 outline-hidden"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.instituteName} ({app.riskLevel === 'CRITICAL' ? '⚠️ High Risk / Tampered' : app.riskLevel === 'MEDIUM' ? '⚡ Minor Deficiencies' : '✅ 100% Compliant'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 mt-3 pt-2 border-t border-slate-100 overflow-x-auto scrollbar-none">
          <button
            onClick={() => onTabChange('scrutiny')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'scrutiny'
                ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            <span>AICTE Bureau Scrutiny</span>
            {currentApp && currentApp.deficiencies.length > 0 && (
              <span className="bg-red-100 text-red-700 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                {currentApp.deficiencies.length}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('applicant')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'applicant'
                ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4 text-slate-600" />
            <span>Institute Application Portal</span>
          </button>

          <button
            onClick={() => onTabChange('cv-inspection')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'cv-inspection'
                ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>Infrastructure CV (YOLOv8)</span>
          </button>

          <button
            onClick={() => onTabChange('issuing-authority')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'issuing-authority'
                ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <QrCode className="w-4 h-4 text-indigo-600" />
            <span>Issuing Authority Hub (QR / API)</span>
          </button>

          <button
            onClick={() => onTabChange('rules')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'rules'
                ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-600" />
            <span>APH 2024–27 Rule Configurator</span>
          </button>

          <button
            onClick={() => onTabChange('audit')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-700" />
            <span>Deficiency Report & Audit Trail</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
