import React, { useState } from 'react';
import { SAMPLE_APPLICATIONS } from './data/mockData';
import { Header } from './components/Header';
import { ScrutinyWorkspace } from './components/ScrutinyWorkspace';
import { ApplicantWorkspace } from './components/ApplicantWorkspace';
import { InfrastructureCVWorkspace } from './components/InfrastructureCVWorkspace';
import { IssuingAuthorityHub } from './components/IssuingAuthorityHub';
import { RulesConfigurator } from './components/RulesConfigurator';
import { AuditReportView } from './components/AuditReportView';

export default function App() {
  const [applications] = useState(SAMPLE_APPLICATIONS);
  const [selectedAppId, setSelectedAppId] = useState<string>('APP-2026-AICTE-001');
  const [activeTab, setActiveTab] = useState<string>('scrutiny');

  const currentApplication = applications.find(a => a.id === selectedAppId) || applications[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Inter',sans-serif] text-slate-900">
      {/* Official Government Header */}
      <Header
        applications={applications}
        selectedAppId={selectedAppId}
        onSelectApp={setSelectedAppId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'scrutiny' && (
          <ScrutinyWorkspace application={currentApplication} />
        )}

        {activeTab === 'applicant' && (
          <ApplicantWorkspace />
        )}

        {activeTab === 'cv-inspection' && (
          <InfrastructureCVWorkspace application={currentApplication} />
        )}

        {activeTab === 'issuing-authority' && (
          <IssuingAuthorityHub application={currentApplication} />
        )}

        {activeTab === 'rules' && (
          <RulesConfigurator />
        )}

        {activeTab === 'audit' && (
          <AuditReportView application={currentApplication} />
        )}
      </main>

      {/* Official Gov Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <div className="text-white font-semibold flex items-center gap-2 justify-center sm:justify-start">
              <span>AICTE VeriSense (अखिल भारतीय तकनीकी शिक्षा परिषद)</span>
              <span className="text-[10px] bg-orange-600 text-white font-bold px-1.5 py-0.5 rounded">SIH 2026</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Developed for Smart India Hackathon 2026 | Problem Statement 26261 | Regulation Bureau
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a 
              href="https://github.com/LearnCodeZaid/aicte-verisense" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 font-mono transition"
            >
              GitHub: LearnCodeZaid/aicte-verisense
            </a>
            <span>•</span>
            <span>Approval Process Handbook 2024–2027</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
