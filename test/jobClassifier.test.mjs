import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyNotice } from '../pipeline/utils/jobClassifier.js';

test('FPSC Non-recruitment circulars are correctly rejected', () => {
  // FPO exam schedule from audit
  const fpo = classifyNotice(
    "FPO Examination-2026 of 52nd CTP Probationers (IRS & PCS)",
    "Click Here to Download Admission Certificates for FPO Exam-2026 (52nd CTP - IRS & PCS). Time Table - FPO Exam-2026"
  );
  assert.equal(fpo.isRecruitment, false);
  assert.match(fpo.reason, /fpo|time|admission/i);

  // Time table / datesheet notices
  const timetable = classifyNotice("Time Table - CSS Competitive Examination 2026");
  assert.equal(timetable.isRecruitment, false);

  // Exam result notice
  const result = classifyNotice("Result of Written Examination for the Posts of Assistant Director");
  assert.equal(result.isRecruitment, false);

  // Roll number slip
  const rollNo = classifyNotice("Download Roll Number Slip for Screening Test Phase 4");
  assert.equal(rollNo.isRecruitment, false);

  // Syllabus only
  const syllabus = classifyNotice("Syllabus Outline for General Recruitment 2026");
  assert.equal(syllabus.isRecruitment, false);

  // Interview schedule
  const interview = classifyNotice("Interview Schedule Phase-II for Medical Officers");
  assert.equal(interview.isRecruitment, false);
});

test('Valid recruitment notices are correctly accepted', () => {
  // CSS 2027 Written Exam Call for Applications
  const css = classifyNotice(
    "CSS Competitive Examination-2027 (Written Exam)",
    "Public Notice - CSS-CE-2027-Written-Exam. Applications for written part of CSS CE-2027 are invited."
  );
  assert.equal(css.isRecruitment, true);

  // FPSC Consolidated Advt 04/2026
  const gr = classifyNotice(
    "GR – Consolidated Advertisement No. 4/2026",
    "To view Advertisement Click here. Applications invited for 48 cases."
  );
  assert.equal(gr.isRecruitment, true);

  // FPSC Ministerial Posts
  const ministerial = classifyNotice(
    "Positions Vacant - FPSC Ministerial Posts [Balochistan Quota]",
    "Applications are invited from citizen of Pakistan having domicile of Balochistan for recruitment against the following posts"
  );
  assert.equal(ministerial.isRecruitment, true);

  // PPSC CCE 2026
  const ppsc = classifyNotice("COMBINED COMPETITIVE EXAMINATION-2026 - BPS-17");
  assert.equal(ppsc.isRecruitment, true);

  // NTS FESCO
  const nts = classifyNotice("Faisalabad Electric Supply Company Limited (FESCO) Career Opportunities");
  assert.equal(nts.isRecruitment, true);
});
