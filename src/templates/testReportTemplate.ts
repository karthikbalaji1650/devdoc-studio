import type { DocumentModel } from '../types/document';

export const sampleTestReportDoc: DocumentModel = {
  metadata: {
    id: 'tr-2026-qa-sample',
    title: 'Firmware Security & REST API Test Execution Report',
    subtitle: 'Comprehensive Regression, Functional & Cybersecurity Validation',
    docNumber: 'TR-2026-0813',
    author: 'Platform QA & Security Testing Team',
    department: 'Quality Assurance & Release Engineering',
    date: '2026-08-13',
    version: '2.1',
    classification: 'INTERNAL ONLY',
    status: 'APPROVED',
    templateType: 'test-report',
    tags: ['QA', 'Test Execution', 'Cybersecurity', 'Regression', 'Release-Gate'],
    ownerId: '1',
    ownerEmail: 'admin@doccraft.com',
    createdAt: '2026-08-13T00:00:00.000Z'
  },
  sections: [
    {
      id: 'sec-exec-summary',
      title: 'Executive Summary',
      level: 1,
      type: 'richText',
      content: 'This document presents the official test execution results for the **BMC Firmware Release 13.03.01 Patch**. Testing encompassed WebUI HPM upload workflows, IPMI interface upgrade validations, REST API schema conformance, and automated cybersecurity penetration vectors.'
    },
    {
      id: 'sec-metrics-summary',
      title: 'Test Execution Metrics & Pass Rate',
      level: 1,
      type: 'table',
      tableData: {
        headers: ['Metric', 'Count / Value', 'Percentage (%)', 'Threshold'],
        rows: [
          ['Total Test Cases Executed', '54', '100.0%', '50 minimum'],
          ['Passed Tests', '52', '96.3%', '95% required for GA'],
          ['Failed Tests', '0', '0.0%', '0 tolerance for Blocker/Critical'],
          ['Blocked Tests', '2 (Deferred non-critical UI cosmetics)', '3.7%', '< 5% allowable'],
          ['Overall Release Verdict', 'READY FOR PRODUCTION DEPLOYMENT', 'GO', 'Release Gate Passed']
        ]
      }
    },
    {
      id: 'sec-env-spec',
      title: 'Test Environment & Hardware Setup',
      level: 1,
      type: 'table',
      tableData: {
        headers: ['Hardware / Component', 'Specification / Firmware Build', 'IP Address / Node'],
        rows: [
          ['DUT Hardware Node', 'iXsystem PVT3 Dual-Socket AST2600', '172.17.45.150'],
          ['Baseline BMC Firmware', 'Revision 13.03.00 (Pre-Patch)', 'Flash Bank A'],
          ['Target BMC Firmware', 'Revision 13.03.01 (Security & Fix Patch)', 'Flash Bank B'],
          ['Client Browser Test Suite', 'Chrome v127, Firefox ESR 115, Edge v127', 'Automation Node 01'],
          ['REST Security Test Harness', 'PyTest REST Runner + SPX Security Suite', '172.17.45.10']
        ]
      }
    },
    {
      id: 'sec-detailed-tc',
      title: 'Detailed Test Case Execution Matrix',
      level: 1,
      type: 'testCases',
      testCases: [
        {
          id: 'TC-SEC-01',
          title: 'REST Endpoint Payload Validation & Flag Check',
          objective: 'Verify /api/maintenance/flash endpoint rejects malformed requests and accepts valid preserve_config payload.',
          steps: [
            'Send PUT request with empty payload {} -> Expect HTTP 400 Bad Request.',
            'Send PUT request with string payload {"preserve_config": "true"} -> Expect automatic type handling or validation.',
            'Send PUT request with integer payload {"preserve_config": 1} -> Expect HTTP 200 OK and flag touch.'
          ],
          expectedResult: 'HTTP 200 OK received; /var/tmp/preserveconfig.flag created successfully on BMC.',
          status: 'PASSED',
          actualResult: 'HTTP status 200 returned in 42ms. Flag file verified via debug console.',
          notes: 'Passed automated security test suite.'
        },
        {
          id: 'TC-HPM-01',
          title: 'Full HPM Firmware Image Upload via WebUI',
          objective: 'Validate complete 64MB firmware image upload and flash progression from 0% to 100%.',
          steps: [
            'Log into WebUI at https://172.17.45.150 with admin credentials.',
            'Navigate to Maintenance > HPM Firmware Update.',
            'Select bmc-WH-13.03.01-full.hpm and click Upload.',
            'Observe progress bar and WebSocket progress notifications.'
          ],
          expectedResult: 'Progress bar advances smoothly without stalling on packet 1. Image validation passes.',
          status: 'PASSED',
          actualResult: 'Full upload completed in 1m 18s. Checksum validation verified SHA-256 integrity.',
          notes: 'Zero network retransmissions detected.'
        },
        {
          id: 'TC-DUAL-01',
          title: 'Dual-Image Bank Switching & Reboot Verification',
          objective: 'Verify BMC activates secondary flash bank and boots into new firmware revision successfully.',
          steps: [
            'Trigger reboot after flash completion.',
            'Monitor serial console UART log during u-boot and kernel init.',
            'Query BMC version via IPMI mc info.'
          ],
          expectedResult: 'Active flash bank switches to Bank B. IPMI reports version 13.03.01.',
          status: 'PASSED',
          actualResult: 'Reboot completed in 84 seconds. Firmware version verified.',
          notes: 'Watchdog timer normal.'
        },
        {
          id: 'TC-REG-01',
          title: 'Sensor & SDR Repository Integrity Regression',
          objective: 'Ensure thermal, voltage, and fan RPM sensor readings remain operational after upgrade.',
          steps: [
            'Run: ipmitool sdr elist full',
            'Compare sensor reading snapshot before vs after upgrade.'
          ],
          expectedResult: 'All 36 sensor readings report Normal Status with identical threshold calibrations.',
          status: 'PASSED',
          actualResult: '36/36 sensors nominal.',
          notes: 'No dropped SDR records.'
        }
      ]
    },
    {
      id: 'sec-defect-log',
      title: 'Defect Log & Non-Conformance Tracker',
      level: 1,
      type: 'table',
      tableData: {
        headers: ['Defect ID', 'Severity', 'Summary', 'Status', 'Resolution Plan'],
        rows: [
          ['DEF-1041', 'Minor', 'UI tooltip on Dual Image Toggle has typo', 'DEFERRED', 'Scheduled for next maintenance sprint UI sync'],
          ['DEF-1042', 'Trivial', 'Dark mode table border contrast in safari', 'DEFERRED', 'CSS cosmetic update in v13.04']
        ]
      }
    },
    {
      id: 'sec-signoff',
      title: 'QA Sign-off & Release Recommendation',
      level: 1,
      type: 'callout',
      callout: {
        type: 'success',
        title: 'Release Gate Approved',
        text: 'All mandatory functional, regression, and security tests have PASSED. This build is certified for customer deployment.'
      }
    }
  ]
};

export const blankTestReportDoc: DocumentModel = {
  metadata: {
    id: 'test-report-blank',
    title: 'Test Execution & Validation Report',
    subtitle: 'QA Test Results, Test Case Matrices & Release Certification',
    docNumber: 'TR-2026-001',
    author: 'QA Engineer',
    department: 'Quality Assurance',
    date: new Date().toISOString().split('T')[0],
    version: '1.0',
    classification: 'INTERNAL ONLY',
    status: 'DRAFT',
    templateType: 'test-report',
    tags: ['QA', 'Test Report'],
    ownerId: '1',
    ownerEmail: 'admin@doccraft.com',
    createdAt: new Date().toISOString()
  },
  sections: [
    {
      id: 'sec-summary',
      title: 'Test Summary & Scope',
      level: 1,
      type: 'richText',
      content: 'Provide a concise overview of the test campaign, scope of testing, and overall pass/fail results.'
    },
    {
      id: 'sec-env',
      title: 'Test Environment & Setup',
      level: 1,
      type: 'table',
      tableData: {
        headers: ['Parameter', 'Details / Value'],
        rows: [
          ['Environment', 'Staging / Lab Testbench'],
          ['Target Build / Release', 'Build v1.0.0'],
          ['Test Tools', 'Automated Test Suite / Manual Testbench']
        ]
      }
    },
    {
      id: 'sec-testcases',
      title: 'Test Case Execution Matrix',
      level: 1,
      type: 'testCases',
      testCases: [
        {
          id: 'TC-001',
          title: 'Primary Test Case',
          objective: 'Verify feature functionality according to specification.',
          steps: ['Step 1: Perform action', 'Step 2: Inspect outcome'],
          expectedResult: 'Feature behaves as expected with 0 errors.',
          status: 'PENDING'
        }
      ]
    },
    {
      id: 'sec-defects',
      title: 'Defect Summary',
      level: 1,
      type: 'table',
      tableData: {
        headers: ['Defect ID', 'Severity', 'Description', 'Status'],
        rows: [
          ['DEF-01', 'Medium', 'Sample issue description', 'OPEN']
        ]
      }
    }
  ]
};
