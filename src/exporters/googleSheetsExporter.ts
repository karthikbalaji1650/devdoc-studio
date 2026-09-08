import { saveAs } from 'file-saver';
import type { DocumentModel, DocSection } from '../types/document';

type SheetRow = [string, string, string, string];

export function exportToGoogleSheets(docModel: DocumentModel): void {
  const rows: SheetRow[] = [
    ['Section', 'Type', 'Field', 'Value'],
    ['Document', 'metadata', 'Title', docModel.metadata.title],
    ['Document', 'metadata', 'Subtitle', docModel.metadata.subtitle || ''],
    ['Document', 'metadata', 'Document Number', docModel.metadata.docNumber],
    ['Document', 'metadata', 'Author', docModel.metadata.author],
    ['Document', 'metadata', 'Department', docModel.metadata.department || ''],
    ['Document', 'metadata', 'Date', docModel.metadata.date],
    ['Document', 'metadata', 'Version', docModel.metadata.version],
    ['Document', 'metadata', 'Classification', docModel.metadata.classification],
    ['Document', 'metadata', 'Status', docModel.metadata.status],
  ];

  docModel.sections.forEach((section, index) => {
    appendSectionRows(rows, section, index + 1);
  });

  const csv = rows.map(row => row.map(escapeCsvValue).join(',')).join('\r\n');
  const filename = `${slugify(docModel.metadata.title) || 'document'}-google-sheets.csv`;
  saveAs(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }), filename);
}

function appendSectionRows(rows: SheetRow[], section: DocSection, sectionNumber: number): void {
  const sectionName = `${sectionNumber}. ${section.title}`;
  rows.push([sectionName, section.type, 'Description', section.description || '']);

  if (section.content) {
    rows.push([sectionName, section.type, 'Content', section.content]);
  }

  section.keyValues?.forEach(pair => {
    rows.push([sectionName, section.type, pair.key, pair.value]);
  });

  section.tableData?.rows.forEach((row, rowIndex) => {
    section.tableData?.headers.forEach((header, columnIndex) => {
      rows.push([sectionName, section.type, `${header} (row ${rowIndex + 1})`, row[columnIndex] || '']);
    });
  });

  if (section.codeSnippet) {
    rows.push([sectionName, section.type, 'Filename', section.codeSnippet.filename]);
    rows.push([sectionName, section.type, 'Language', section.codeSnippet.language]);
    rows.push([sectionName, section.type, 'Description', section.codeSnippet.description || '']);
    rows.push([sectionName, section.type, 'Code', section.codeSnippet.code || '']);
    rows.push([sectionName, section.type, 'Original Code', section.codeSnippet.oldCode || '']);
    rows.push([sectionName, section.type, 'Fixed Code', section.codeSnippet.newCode || '']);
  }

  section.testCases?.forEach(testCase => {
    rows.push([sectionName, section.type, `${testCase.id} - ${testCase.title}`, testCase.status]);
    rows.push([sectionName, section.type, `${testCase.id} Objective`, testCase.objective]);
    rows.push([sectionName, section.type, `${testCase.id} Steps`, testCase.steps.join('\n')]);
    rows.push([sectionName, section.type, `${testCase.id} Expected Result`, testCase.expectedResult]);
    rows.push([sectionName, section.type, `${testCase.id} Actual Result`, testCase.actualResult || '']);
  });

  section.verificationMatrix?.forEach(item => {
    rows.push([sectionName, section.type, `${item.id} Root Cause`, item.rootCause]);
    rows.push([sectionName, section.type, `${item.id} Fix Location`, item.fixLocation]);
    rows.push([sectionName, section.type, `${item.id} Resolution`, item.resolution]);
    rows.push([sectionName, section.type, `${item.id} Status`, item.status]);
  });

  if (section.callout) {
    rows.push([sectionName, section.type, 'Callout Type', section.callout.type]);
    rows.push([sectionName, section.type, 'Callout Title', section.callout.title || '']);
    rows.push([sectionName, section.type, 'Callout Text', section.callout.text]);
  }
}

function escapeCsvValue(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}