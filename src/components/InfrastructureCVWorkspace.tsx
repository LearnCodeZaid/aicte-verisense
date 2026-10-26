import React, { useState } from 'react';
import { InstitutionalApplication, InfrastructureAssetDetection } from '../types';
import { Eye, CheckCircle2, AlertTriangle, Layers, Maximize2, Shield, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface InfrastructureCVWorkspaceProps {
  application: InstitutionalApplication;
}

export const InfrastructureCVWorkspace: React.FC<InfrastructureCVWorkspaceProps> = ({ application }) => {
  const [selectedAsset, setSelectedAsset] = useState<InfrastructureAssetDetection>(
    application.infrastructureEvidence[0] || null
  );
  const [showBoxes, setShowBoxes] = useState(true);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  YOLOv8 Computer Vision Engine
                </Badge>
                <span className="text-xs font-mono text-slate-500">
                  Model: yolov8l-aicte-infra.pt (Trained on 14,000 Technical Campus Assets)
                </span>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                Infrastructure Evidence & Physical Norms Scrutiny
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Automated detection of computers, laboratory equipment, fire safety devices, and barrier-free PWD ramps against AICTE APH 2024–27 specifications.
              </CardDescription>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowBoxes(!showBoxes)}
              className="text-xs gap-1.5 border-slate-300"
            >
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              {showBoxes ? "Hide Detection Bounding Boxes" : "Show YOLO Bounding Boxes"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Grid: Evidence Cards + Interactive Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Available Evidence Submissions */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Uploaded Facility Photographs ({application.infrastructureEvidence.length})
          </h3>

          {application.infrastructureEvidence.map((asset) => {
            const isSelected = selectedAsset?.id === asset.id;
            return (
              <div
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className={`p-3 rounded-lg border cursor-pointer transition-all bg-white ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/10 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs text-slate-900">
                    {asset.type.replace(/_/g, ' ')}
                  </span>
                  <Badge
                    variant="outline"
                    className={asset.isCompliant ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}
                  >
                    {asset.isCompliant ? 'Norm Met' : 'Shortfall Flagged'}
                  </Badge>
                </div>

                <div className="mt-2 text-xs font-mono text-slate-600 flex justify-between">
                  <span>Detected: <strong>{asset.detectedCount} Units</strong></span>
                  <span>Required: <strong>{asset.requiredCount} Units</strong></span>
                </div>

                <div className="mt-1 text-[11px] text-slate-500 truncate">
                  {asset.requiredMetric}
                </div>
              </div>
            );
          })}

          {/* Quick upload mock */}
          <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg text-center hover:bg-slate-50/50 transition cursor-pointer">
            <Sparkles className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <span className="text-xs font-semibold text-slate-700">Upload Additional Floor / Facility Evidence</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Accepts Geo-tagged JPG/PNG with EXIF coordinates</p>
          </div>
        </div>

        {/* Right: Interactive Image & Bounding Box Viewer */}
        <div className="lg:col-span-8 space-y-4">
          {selectedAsset && (
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-600" />
                    {selectedAsset.type.replace(/_/g, ' ')} — Inspection View
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Citation: <span className="font-mono text-slate-700">{selectedAsset.aphClause}</span>
                  </CardDescription>
                </div>

                <Badge variant="outline" className="font-mono text-xs bg-slate-50">
                  Model Confidence: {(selectedAsset.confidenceScore * 100).toFixed(0)}%
                </Badge>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {/* Image Stage with Interactive Bounding Boxes */}
                <div className="relative rounded-lg overflow-hidden border border-slate-300 bg-slate-950 aspect-video flex items-center justify-center">
                  <img
                    src={selectedAsset.imageUrl}
                    alt={selectedAsset.type}
                    className="w-full h-full object-cover"
                  />

                  {/* SVG Overlay for YOLO Bounding Boxes */}
                  {showBoxes && (
                    <div className="absolute inset-0 pointer-events-none">
                      {selectedAsset.boundingBoxes.map((box, i) => (
                        <div
                          key={i}
                          style={{
                            left: `${(box.x / 800) * 100}%`,
                            top: `${(box.y / 500) * 100}%`,
                            width: `${(box.w / 800) * 100}%`,
                            height: `${(box.h / 500) * 100}%`
                          }}
                          className="absolute border-2 border-emerald-400 bg-emerald-400/10 rounded-2xs flex items-start"
                        >
                          <span className="bg-emerald-600 text-white font-mono text-[9px] px-1 rounded-br font-bold shadow-xs whitespace-nowrap">
                            {box.label} ({Math.round(box.confidence * 100)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="absolute bottom-2 left-2 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] px-3 py-1.5 rounded-md font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>YOLOv8 Object Detection Overlay Active</span>
                  </div>
                </div>

                {/* Norm Verification Comparison Breakdown */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Standard Requirement:</span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedAsset.requiredMetric}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">AI Object Count:</span>
                    <p className="font-bold text-slate-900 font-mono text-sm mt-0.5">
                      {selectedAsset.detectedCount} Units Verified
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Regulatory Status:</span>
                    <div className="mt-0.5">
                      {selectedAsset.isCompliant ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Compliant with APH
                        </span>
                      ) : (
                        <span className="text-rose-700 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" /> Shortfall of {selectedAsset.requiredCount - selectedAsset.detectedCount} Units
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
