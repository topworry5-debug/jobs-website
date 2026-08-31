export const TEST_PREP_MODULES = [
  {
    id: "quiz-fpsc-gen-01",
    title: "FPSC General Recruitment Screening Mock (BPS-16 & 17)",
    subject: "General Ability & English",
    agency: "FPSC",
    timeLimitMinutes: 10,
    totalMarks: 50,
    negativeMarking: 0,
    description: "Official FPSC General Recruitment standard covering English grammar, Pakistan affairs, current affairs, and basic mathematics.",
    questions: [
      {
        id: "q1",
        question: "Under the Federal Investigation Agency (FIA) Act 1974, who is the head of the agency?",
        options: [
          "Inspector General of Police (IGP)",
          "Director General (DG) appointed by the Federal Government",
          "Federal Minister for Interior",
          "Chief Justice of Pakistan"
        ],
        correctIndex: 1,
        explanation: "Section 3(2) of the FIA Act 1974 specifies that the superintendence of the Agency vests in the Federal Government and its administration is headed by a Director General (DG) appointed by the Federal Government."
      },
      {
        id: "q2",
        question: "Which Constitutional Amendment in Pakistan abolished the Concurrent Legislative List?",
        options: [
          "17th Constitutional Amendment",
          "18th Constitutional Amendment (2010)",
          "19th Constitutional Amendment",
          "21st Constitutional Amendment"
        ],
        correctIndex: 1,
        explanation: "The 18th Constitutional Amendment passed in April 2010 abolished the Concurrent Legislative List, devolving 47 subjects including health and education to the provinces to enhance provincial autonomy."
      },
      {
        id: "q3",
        question: "Select the correctly spelt word:",
        options: [
          "Bureaucracy",
          "Bureacracy",
          "Beurocracy",
          "Bureaucrasy"
        ],
        correctIndex: 0,
        explanation: "'Bureaucracy' is derived from French 'bureau' (desk/office) and Greek 'kratos' (rule/power)."
      },
      {
        id: "q4",
        question: "What is the speed of light in vacuum?",
        options: [
          "3 × 10^8 meters per second",
          "3 × 10^6 kilometers per hour",
          "1.5 × 10^8 meters per second",
          "3 × 10^5 meters per second"
        ],
        correctIndex: 0,
        explanation: "The speed of light in a vacuum is approximately 299,792,458 m/s, commonly rounded to 3.0 × 10^8 m/s in Everyday Science exams."
      },
      {
        id: "q5",
        question: "If 12 men can complete a project in 20 days, how many days will 15 men take to complete the same work at the same rate?",
        options: [
          "18 Days",
          "16 Days",
          "14 Days",
          "15 Days"
        ],
        correctIndex: 1,
        explanation: "Using inverse proportion: Men × Days = Total Man-Days. 12 × 20 = 240 man-days. For 15 men: 240 / 15 = 16 days."
      }
    ]
  },
  {
    id: "quiz-ppsc-gk-02",
    title: "PPSC General Knowledge & Land Revenue System",
    subject: "PPSC Tehsildar & PMS Screening",
    agency: "PPSC",
    timeLimitMinutes: 10,
    totalMarks: 50,
    negativeMarking: 0.25,
    description: "Designed for Punjab Public Service Commission candidates covering land administration terminology (Khasra, Jamabandi, Fard) and Pakistan Geography.",
    questions: [
      {
        id: "pq1",
        question: "In the Punjab Land Revenue System, what is 'Jamabandi'?",
        options: [
          "Record of Rights (Ror) showing ownership and tenancy",
          "Tax payment receipt",
          "Survey measurement chain",
          "Court summons document"
        ],
        correctIndex: 0,
        explanation: "Jamabandi is the Register of Record of Rights (RoR) prepared quadrennially (every 4 years) containing complete details of land owners, cultivators, rent, and revenue assessed."
      },
      {
        id: "pq2",
        question: "Which pass connects Peshawar with Afghanistan through the Hindu Kush range?",
        options: [
          "Bolan Pass",
          "Khyber Pass",
          "Khunjerab Pass",
          "Gomal Pass"
        ],
        correctIndex: 1,
        explanation: "The historical Khyber Pass (length ~53 km) connects Peshawar (Pakistan) with Kabul via Torkham border."
      },
      {
        id: "pq3",
        question: "What is the penalty deduction for an incorrect answer in PPSC MCQ examinations?",
        options: [
          "0.50 marks",
          "0.25 marks (Negative Marking)",
          "No negative marking",
          "0.33 marks"
        ],
        correctIndex: 1,
        explanation: "PPSC regulations deduct 0.25 marks for every incorrect answer. Blank answers carry zero penalty."
      }
    ]
  },
  {
    id: "quiz-cs-tech-03",
    title: "Computer Science & Software Engineering Aptitude",
    subject: "IT / Lecturer CS / Software Jobs",
    agency: "IT & Higher Education",
    timeLimitMinutes: 8,
    totalMarks: 30,
    negativeMarking: 0,
    description: "Fundamental algorithms, data structures, cloud architectures, and database queries for software roles in Pakistan.",
    questions: [
      {
        id: "cq1",
        question: "What is the average time complexity of searching in a Balanced Binary Search Tree (AVL / Red-Black Tree)?",
        options: [
          "O(N)",
          "O(log N)",
          "O(N log N)",
          "O(1)"
        ],
        correctIndex: 1,
        explanation: "Because the height of a self-balancing binary search tree is kept strictly at O(log N), search, insertion, and deletion operations take O(log N) time."
      },
      {
        id: "cq2",
        question: "In relational database design, which Normal Form removes Transitive Dependencies?",
        options: [
          "First Normal Form (1NF)",
          "Second Normal Form (2NF)",
          "Third Normal Form (3NF)",
          "Boyce-Codd Normal Form (BCNF)"
        ],
        correctIndex: 2,
        explanation: "Third Normal Form (3NF) requires the relation to be in 2NF and have no non-prime attribute transitively dependent on the primary key."
      }
    ]
  }
];
