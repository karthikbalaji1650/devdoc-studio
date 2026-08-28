import type { DocumentModel, TemplateType } from '../types/document';
import { sampleTechnicalAnalysisDoc, blankTechnicalAnalysisDoc } from './technicalAnalysisTemplate';
import { sampleTestReportDoc, blankTestReportDoc } from './testReportTemplate';
import { sampleADRDoc, sampleRCADoc } from './adrTemplate';

export interface TemplateOption {
  id: string;
  name: string;
  category: TemplateType;
  description: string;
  iconName: string;
  badge: string;
  getSampleDoc: () => DocumentModel;
  getBlankDoc: () => DocumentModel;
}

export const TEMPLATE_REGISTRY: TemplateOption[] = [
  {
    id: 'technical-analysis',
    name: 'Technical Analysis Document',
    category: 'technical-analysis',
    description: 'Deep-dive investigation, root cause analysis, code diffs, architectural comparisons, and verification matrices.',
    iconName: 'FileCode2',
    badge: 'Popular for Devs',
    getSampleDoc: () => JSON.parse(JSON.stringify(sampleTechnicalAnalysisDoc)),
    getBlankDoc: () => JSON.parse(JSON.stringify(blankTechnicalAnalysisDoc))
  },
  {
    id: 'test-report',
    name: 'Test Execution & QA Validation Report',
    category: 'test-report',
    description: 'Test plans, environment configs, pass/fail test case matrices, defect logs, and sign-off certification.',
    iconName: 'CheckCircle2',
    badge: 'QA & Release',
    getSampleDoc: () => JSON.parse(JSON.stringify(sampleTestReportDoc)),
    getBlankDoc: () => JSON.parse(JSON.stringify(blankTestReportDoc))
  },
  {
    id: 'adr',
    name: 'Architecture Decision Record (ADR)',
    category: 'adr',
    description: 'Document architectural decisions, context, trade-offs, evaluated alternatives, and consequences.',
    iconName: 'Layers',
    badge: 'System Design',
    getSampleDoc: () => JSON.parse(JSON.stringify(sampleADRDoc)),
    getBlankDoc: () => {
      const doc = JSON.parse(JSON.stringify(sampleADRDoc));
      doc.metadata.docNumber = 'ADR-001';
      doc.metadata.title = 'New Architecture Decision';
      doc.sections.forEach((s: any) => {
        if (s.content) s.content = '';
      });
      return doc;
    }
  },
  {
    id: 'rca',
    name: 'Incident Post-Mortem & RCA',
    category: 'rca',
    description: '5 Whys root cause analysis, timeline, immediate mitigation, and preventative action tracker.',
    iconName: 'AlertTriangle',
    badge: 'SRE & DevOps',
    getSampleDoc: () => JSON.parse(JSON.stringify(sampleRCADoc)),
    getBlankDoc: () => {
      const doc = JSON.parse(JSON.stringify(sampleRCADoc));
      doc.metadata.docNumber = 'RCA-001';
      doc.metadata.title = 'New Incident Post-Mortem';
      return doc;
    }
  }
];

export const getDefaultDocument = (): DocumentModel => {
  return JSON.parse(JSON.stringify(sampleTechnicalAnalysisDoc));
};
