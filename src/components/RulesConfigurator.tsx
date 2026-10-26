import React, { useState } from 'react';
import { APH_CONFIGURABLE_RULES } from '../data/mockData';
import { Sliders, Save, CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export const RulesConfigurator: React.FC = () => {
  const [rules, setRules] = useState(APH_CONFIGURABLE_RULES);
  const [savedAlert, setSavedAlert] = useState(false);

  const handleUpdate = (code: string, val: any) => {
    setRules(prev => prev.map(r => r.code === code ? { ...r, currentThreshold: val } : r));
  };

  const handleSave = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                  Statutory Rule Configuration Engine
                </Badge>
                <span className="text-xs font-mono text-slate-500">
                  AICTE Approval Process Handbook (2024–2027 Gazette)
                </span>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                Configurable Regulatory Validation Norms
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                AI checks are fully configurable to match revised AICTE circulars without redeploying code, ensuring regulatory transparency.
              </CardDescription>
            </div>

            <Button
              size="sm"
              onClick={handleSave}
              className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs gap-1.5 shadow-2xs"
            >
              <Save className="w-4 h-4" /> Save & Broadcast Revised Rule Matrix
            </Button>
          </div>
        </CardHeader>
      </Card>

      {savedAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Configurable thresholds updated across active AICTE Scrutiny and Computer Vision evaluation pipelines.</span>
        </div>
      )}

      {/* Rules Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <Card key={rule.code} className="border-slate-200 bg-white shadow-xs hover:border-slate-300 transition">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{rule.code}</span>
                  <CardTitle className="text-xs font-bold text-slate-900 mt-0.5">{rule.name}</CardTitle>
                </div>
                <Badge variant="outline" className="font-mono text-[10px] bg-slate-50 text-slate-700 border-slate-300">
                  {rule.aphClause}
                </Badge>
              </div>
              <CardDescription className="text-xs mt-1">{rule.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Active Threshold:</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={String(rule.currentThreshold)}
                  onChange={(e) => handleUpdate(rule.code, e.target.value)}
                  className="w-24 text-xs font-mono font-bold text-center bg-slate-50 border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-amber-500 outline-hidden"
                />
                <span className="text-[11px] font-mono text-slate-500">{rule.unit}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
