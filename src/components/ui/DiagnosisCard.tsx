import React from "react";
import { Card } from "./Card";

export interface DiagnosisCondition {
  name: string;
  features: string[];
}

export interface DiagnosisCardProps {
  title: string;
  condition1: DiagnosisCondition;
  condition2: DiagnosisCondition;
  onCompare?: () => void;
  className?: string;
}

export function DiagnosisCard({
  title,
  condition1,
  condition2,
  onCompare,
  className = "",
}: DiagnosisCardProps) {
  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-slate-900 font-bold text-base mb-6">{title}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Condition 1 */}
        <div className="space-y-3">
          <div className="inline-block px-2.5 py-1 bg-med-50 border border-med-200 rounded-md">
            <h4 className="text-med-800 font-semibold text-sm">
              {condition1.name}
            </h4>
          </div>
          <ul className="space-y-2">
            {condition1.features.map((feature, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-slate-700 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-med-600 mt-1.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Condition 2 */}
        <div className="space-y-3">
          <div className="inline-block px-2.5 py-1 bg-clinical-teal-light border border-clinical-teal-border rounded-md">
            <h4 className="text-clinical-teal font-semibold text-sm">
              {condition2.name}
            </h4>
          </div>
          <ul className="space-y-2">
            {condition2.features.map((feature, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-slate-700 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-clinical-teal mt-1.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200 flex gap-3">
        <button
          onClick={onCompare}
          className="flex-1 bg-med-600 hover:bg-med-700 text-white font-bold py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer text-center"
        >
          Compare in Detail
        </button>
      </div>
    </Card>
  );
}

export default DiagnosisCard;
