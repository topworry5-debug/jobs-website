/**
 * Official Government of Pakistan Basic Pay Scales (BPS-1 to BPS-22)
 * Based on Ministry of Finance Revised Pay Scales & Allowances Notifications.
 * Note: Actual net salary includes various special allowances (e.g. Executive, Health, Judicial)
 * and deductions (GP Fund, Benevolent Fund, Group Insurance, Income Tax).
 */

export const BPS_DATA = [
  {
    grade: 1,
    minBasic: 13550,
    increment: 430,
    maxBasic: 26450,
    stages: 30,
    conveyance: 1930,
    medical: 1500,
    adhocPercent: 35,
    houseRentBigCity: 3950,
    houseRentOtherCity: 2630,
    cadres: "Naib Qasid, Chowkidar, Mali, Sanitary Worker, Peon, Baildar",
    roleTier: "Support Staff / Class-IV"
  },
  {
    grade: 2,
    minBasic: 13960,
    increment: 480,
    maxBasic: 28360,
    stages: 30,
    conveyance: 1930,
    medical: 1500,
    adhocPercent: 35,
    houseRentBigCity: 4100,
    houseRentOtherCity: 2750,
    cadres: "Daftari, Jamadar, Helper, Security Guard, Lab Attendant",
    roleTier: "Support Staff / Class-IV"
  },
  {
    grade: 3,
    minBasic: 14500,
    increment: 560,
    maxBasic: 31300,
    stages: 30,
    conveyance: 1930,
    medical: 1500,
    adhocPercent: 35,
    houseRentBigCity: 4350,
    houseRentOtherCity: 2900,
    cadres: "Cook, Senior Peon, Dispatch Runner, Skilled Attendant",
    roleTier: "Support Staff / Class-IV"
  },
  {
    grade: 4,
    minBasic: 15030,
    increment: 640,
    maxBasic: 34230,
    stages: 30,
    conveyance: 1930,
    medical: 1500,
    adhocPercent: 35,
    houseRentBigCity: 4600,
    houseRentOtherCity: 3100,
    cadres: "Driver (LTV Initial), Electrician Helper, Plumber, Dispatch Rider",
    roleTier: "Clerical & Technical Staff"
  },
  {
    grade: 5,
    minBasic: 15630,
    increment: 740,
    maxBasic: 37830,
    stages: 30,
    conveyance: 1930,
    medical: 1500,
    adhocPercent: 35,
    houseRentBigCity: 4900,
    houseRentOtherCity: 3300,
    cadres: "Driver (Senior LTV/HTV), Store Keeper, Tracer, Assistant Lineman (ALM)",
    roleTier: "Clerical & Technical Staff"
  },
  {
    grade: 6,
    minBasic: 16280,
    increment: 840,
    maxBasic: 41480,
    stages: 30,
    conveyance: 2856,
    medical: 1500,
    adhocPercent: 35,
    houseRentBigCity: 5200,
    houseRentOtherCity: 3500,
    cadres: "Photocopier Operator, Senior Driver, Meter Reader, Forest Guard",
    roleTier: "Clerical & Technical Staff"
  },
  {
    grade: 7,
    minBasic: 16990,
    increment: 960,
    maxBasic: 45790,
    stages: 30,
    conveyance: 2856,
    medical: 1500,
    adhocPercent: 35,
    houseRentBigCity: 5550,
    houseRentOtherCity: 3700,
    cadres: "Police Constable, Head Constable, Patwari, Field Assistant, Telephone Operator",
    roleTier: "Law Enforcement & Field Cadre"
  },
  {
    grade: 8,
    minBasic: 17800,
    increment: 1080,
    maxBasic: 50200,
    stages: 30,
    conveyance: 2856,
    medical: 1500,
    adhocPercent: 35,
    houseRentBigCity: 5900,
    houseRentOtherCity: 3950,
    cadres: "ASI (Assistant Sub-Inspector Police), Havildar, Senior Patwari",
    roleTier: "Law Enforcement & Field Cadre"
  },
  {
    grade: 9,
    minBasic: 18670,
    increment: 1200,
    maxBasic: 54670,
    stages: 30,
    conveyance: 2856,
    medical: 1500,
    adhocPercent: 35,
    houseRentBigCity: 6300,
    houseRentOtherCity: 4200,
    cadres: "Sub-Inspector (Initial), Primary School Teacher (PST), Statistical Assistant",
    roleTier: "Education & Field Administration"
  },
  {
    grade: 10,
    minBasic: 19630,
    increment: 1350,
    maxBasic: 60130,
    stages: 30,
    conveyance: 2856,
    medical: 1500,
    adhocPercent: 35,
    houseRentBigCity: 6700,
    houseRentOtherCity: 4500,
    cadres: "Draftsman, Data Entry Operator (DEO Initial), Revenue Girdawar",
    roleTier: "Technical & Clerical Staff"
  },
  {
    grade: 11,
    minBasic: 20680,
    increment: 1500,
    maxBasic: 65680,
    stages: 30,
    conveyance: 2856,
    medical: 1500,
    adhocPercent: 35,
    houseRentBigCity: 7200,
    houseRentOtherCity: 4800,
    cadres: "Junior Clerk, Sub-Inspector Police, Elementary School Teacher (EST), Assistant Sub-Inspector (FIA)",
    roleTier: "Clerical & Investigative Cadre"
  },
  {
    grade: 12,
    minBasic: 22120,
    increment: 1740,
    maxBasic: 74320,
    stages: 30,
    conveyance: 2856,
    medical: 1500,
    adhocPercent: 35,
    houseRentBigCity: 7800,
    houseRentOtherCity: 5200,
    cadres: "Senior Clerk, Head Constable (Motorway Police), Stenotypist (Grade 12)",
    roleTier: "Clerical & Police Operations"
  },
  {
    grade: 13,
    minBasic: 23850,
    increment: 2000,
    maxBasic: 83850,
    stages: 30,
    conveyance: 2856,
    medical: 1500,
    adhocPercent: 35,
    houseRentBigCity: 8500,
    houseRentOtherCity: 5700,
    cadres: "Revenue Accountant, Sub-Engineer (Initial), Court Reader",
    roleTier: "Technical & Court Staff"
  },
  {
    grade: 14,
    minBasic: 25770,
    increment: 2260,
    maxBasic: 93570,
    stages: 30,
    conveyance: 2856,
    medical: 1500,
    adhocPercent: 35,
    houseRentBigCity: 9300,
    houseRentOtherCity: 6200,
    cadres: "Assistant (Federal/Provincial Secretariat), Police Inspector, Secondary School Educator (SSE), Sub-Engineer (DAE)",
    roleTier: "Secretariat & Middle Management"
  },
  {
    grade: 15,
    minBasic: 27880,
    increment: 2580,
    maxBasic: 105280,
    stages: 30,
    conveyance: 2856,
    medical: 1500,
    adhocPercent: 35,
    houseRentBigCity: 10200,
    houseRentOtherCity: 6800,
    cadres: "Superintendent (Initial), Sub-Inspector (FIA/NAB), Revenue Tehsildar (Cadre)",
    roleTier: "Secretariat & Enforcement"
  },
  {
    grade: 16,
    minBasic: 32000,
    increment: 2800,
    maxBasic: 116000,
    stages: 30,
    conveyance: 5000,
    medical: 2500,
    adhocPercent: 35,
    houseRentBigCity: 12800,
    houseRentOtherCity: 8500,
    cadres: "Secondary School Teacher (SST), Charge Nurse, Naib Tehsildar, Superintendent, Assistant Private Secretary (APS)",
    roleTier: "Gazetted Officer (BPS-16)"
  },
  {
    grade: 17,
    minBasic: 45070,
    increment: 3420,
    maxBasic: 147670,
    stages: 30,
    conveyance: 5000,
    medical: 3000,
    adhocPercent: 30,
    houseRentBigCity: 18500,
    houseRentOtherCity: 12300,
    cadres: "College Lecturer, Medical Officer (MBBS), Assistant Director (FPSC/FIA), Assistant Commissioner (PMS/CSS), SBP OG-2, Civil Judge",
    roleTier: "Gazetted Class-I Junior Executive"
  },
  {
    grade: 18,
    minBasic: 53120,
    increment: 4200,
    maxBasic: 179120,
    stages: 30,
    conveyance: 5000,
    medical: 3000,
    adhocPercent: 30,
    houseRentBigCity: 23200,
    houseRentOtherCity: 15500,
    cadres: "Assistant Commissioner (Senior), Assistant Professor, Senior Medical Officer (SMO), Deputy District Attorney, Executive Engineer (XEN initial)",
    roleTier: "Gazetted Class-I Senior Executive"
  },
  {
    grade: 19,
    minBasic: 87840,
    increment: 4950,
    maxBasic: 236340,
    stages: 30,
    conveyance: 5000,
    medical: 3000,
    adhocPercent: 30,
    houseRentBigCity: 36500,
    houseRentOtherCity: 24300,
    cadres: "Deputy Secretary, Associate Professor, Chief Medical Officer, District & Sessions Judge (Senior), Senior Superintendent of Police (SSP)",
    roleTier: "Gazetted Senior Leadership"
  },
  {
    grade: 20,
    minBasic: 104100,
    increment: 6500,
    maxBasic: 299100,
    stages: 30,
    conveyance: 0, // Staff Car entitlement usually provided
    medical: 4000,
    adhocPercent: 30,
    houseRentBigCity: 46800,
    houseRentOtherCity: 31200,
    cadres: "Joint Secretary, Professor / Dean, DIG Police, Chief Engineer, Member Board of Revenue, District & Sessions Judge",
    roleTier: "Senior Civil Service (Joint Sec / DIG)"
  },
  {
    grade: 21,
    minBasic: 115900,
    increment: 7400,
    maxBasic: 337900,
    stages: 30,
    conveyance: 0,
    medical: 4500,
    adhocPercent: 30,
    houseRentBigCity: 54500,
    houseRentOtherCity: 36300,
    cadres: "Additional Secretary, Inspector General of Police (IGP / AIG), Director General (DG), High Court Registrar",
    roleTier: "Top Civil Service (Addl Secretary)"
  },
  {
    grade: 22,
    minBasic: 127900,
    increment: 8300,
    maxBasic: 376900,
    stages: 30,
    conveyance: 0,
    medical: 5000,
    adhocPercent: 30,
    houseRentBigCity: 63000,
    houseRentOtherCity: 42000,
    cadres: "Federal Secretary to Government of Pakistan, Chief Secretary (Provincial), Senior Member Board of Revenue (SMBR)",
    roleTier: "Apex Executive (Federal Secretary)"
  }
];

export const BIG_CITIES = [
  "Islamabad",
  "Rawalpindi",
  "Lahore",
  "Karachi",
  "Peshawar",
  "Quetta",
  "Faisalabad",
  "Multan",
  "Hyderabad"
];

/**
 * Calculates estimated salary breakdown for a given BPS grade, service stage, and city type.
 */
export function calculateBpsSalary({ gradeNumber = 17, stage = 0, isBigCity = true }) {
  const bps = BPS_DATA.find(b => b.grade === Number(gradeNumber)) || BPS_DATA[16]; // Default BPS-17
  
  const validStage = Math.max(0, Math.min(bps.stages, Number(stage)));
  const basicPay = Math.min(bps.maxBasic, bps.minBasic + (bps.increment * validStage));
  
  const houseRent = isBigCity ? bps.houseRentBigCity : bps.houseRentOtherCity;
  const conveyance = bps.conveyance;
  const medical = bps.medical;
  
  // Adhoc Relief is computed on running or initial basic pay depending on notification (typically 30-35% of running basic)
  const adhocRelief = Math.round(basicPay * (bps.adhocPercent / 100));
  
  // Standard allowances total
  const grossSalary = basicPay + houseRent + conveyance + medical + adhocRelief;
  
  // Standard mandatory deductions estimate: GP Fund (approx 5-8%), Benevolent Fund (~2%), Group Insurance
  const estimatedDeductions = Math.round(basicPay * 0.08);
  const estimatedNetPay = grossSalary - estimatedDeductions;
  
  return {
    bps,
    stage: validStage,
    basicPay,
    houseRent,
    conveyance,
    medical,
    adhocRelief,
    grossSalary,
    estimatedDeductions,
    estimatedNetPay
  };
}
