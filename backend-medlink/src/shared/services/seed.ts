/**
 * Idempotent development seed: an admin account, a small verified medicine
 * catalogue and a few reviewed interaction rules. Run with `npm run seed`.
 */
import { connectDatabase, disconnectDatabase } from '../../config/database';
import { ACCOUNT_STATUS, ROLES } from '../constants';
import { logger } from '../utils/logger';
import { User, hashPassword } from '../../modules/auth/auth.model';
import { Medicine } from '../../modules/intelligence/medicines/medicine.model';
import { DrugInteraction } from '../../modules/intelligence/interactions/interaction.model';

const MEDICINES = [
  {
    name: 'Paracetamol 500mg',
    genericName: 'paracetamol',
    brandNames: ['Crocin', 'Dolo 650', 'Calpol'],
    form: 'tablet' as const,
    strength: '500mg',
    ingredients: [{ name: 'paracetamol', strength: '500', unit: 'mg' }],
    therapeuticClass: 'Analgesic / Antipyretic',
    prescriptionRequired: false,
    explanation: {
      en: {
        uses: 'Reduces fever and relieves mild to moderate pain such as headache or body ache.',
        howToTake: 'Swallow with water, after food. Do not exceed 4g in 24 hours.',
        commonSideEffects: ['Nausea', 'Rash (uncommon)'],
        warnings: ['Avoid with alcohol', 'Tell your doctor about any liver problems'],
      },
      hi: {
        uses: 'बुखार कम करता है और सिरदर्द या बदन दर्द जैसे हल्के दर्द में राहत देता है।',
        howToTake: 'खाने के बाद पानी के साथ लें। 24 घंटे में 4 ग्राम से अधिक न लें।',
        commonSideEffects: ['जी मिचलाना', 'कभी-कभी त्वचा पर चकत्ते'],
        warnings: ['शराब के साथ न लें', 'जिगर की बीमारी हो तो डॉक्टर को बताएँ'],
      },
    },
    isVerified: true,
  },
  {
    name: 'Amoxicillin 500mg',
    genericName: 'amoxicillin',
    brandNames: ['Mox', 'Novamox'],
    form: 'capsule' as const,
    strength: '500mg',
    ingredients: [{ name: 'amoxicillin', strength: '500', unit: 'mg' }],
    therapeuticClass: 'Antibiotic (penicillin)',
    prescriptionRequired: true,
    explanation: {
      en: {
        uses: 'Treats bacterial infections of the throat, chest, ear, skin and urinary tract.',
        howToTake: 'Take at evenly spaced times. Finish the full course even if you feel better.',
        commonSideEffects: ['Loose motions', 'Nausea', 'Rash'],
        warnings: ['Do not take if allergic to penicillin', 'Tell your doctor if you develop a rash'],
      },
      hi: {
        uses: 'गले, छाती, कान, त्वचा और मूत्र मार्ग के जीवाणु संक्रमण का इलाज करता है।',
        howToTake: 'बराबर अंतराल पर लें। अच्छा महसूस होने पर भी पूरा कोर्स करें।',
        commonSideEffects: ['दस्त', 'जी मिचलाना', 'चकत्ते'],
        warnings: ['पेनिसिलिन से एलर्जी हो तो न लें', 'चकत्ते दिखें तो डॉक्टर को बताएँ'],
      },
    },
    isVerified: true,
  },
  {
    name: 'Metformin 500mg',
    genericName: 'metformin',
    brandNames: ['Glycomet', 'Glucophage'],
    form: 'tablet' as const,
    strength: '500mg',
    ingredients: [{ name: 'metformin', strength: '500', unit: 'mg' }],
    therapeuticClass: 'Antidiabetic (biguanide)',
    prescriptionRequired: true,
    explanation: {
      en: {
        uses: 'Controls blood sugar in type 2 diabetes.',
        howToTake: 'Take with or just after food to reduce stomach upset.',
        commonSideEffects: ['Stomach upset', 'Metallic taste', 'Loose motions'],
        warnings: ['Tell your doctor about kidney problems', 'Stop before a scan with contrast dye'],
      },
      hi: {
        uses: 'टाइप 2 मधुमेह में रक्त शर्करा नियंत्रित करता है।',
        howToTake: 'पेट की तकलीफ कम करने के लिए खाने के साथ या तुरंत बाद लें।',
        commonSideEffects: ['पेट खराब', 'मुँह में धातु जैसा स्वाद', 'दस्त'],
        warnings: ['गुर्दे की समस्या हो तो डॉक्टर को बताएँ'],
      },
    },
    isVerified: true,
  },
  {
    name: 'Ibuprofen 400mg',
    genericName: 'ibuprofen',
    brandNames: ['Brufen', 'Combiflam (combination)'],
    form: 'tablet' as const,
    strength: '400mg',
    ingredients: [{ name: 'ibuprofen', strength: '400', unit: 'mg' }],
    therapeuticClass: 'NSAID',
    prescriptionRequired: false,
    explanation: {
      en: {
        uses: 'Relieves pain, swelling and fever.',
        howToTake: 'Always take after food.',
        commonSideEffects: ['Stomach pain', 'Heartburn'],
        warnings: ['Avoid with stomach ulcers', 'Avoid in later pregnancy'],
      },
      hi: {
        uses: 'दर्द, सूजन और बुखार में राहत देता है।',
        howToTake: 'हमेशा खाने के बाद लें।',
        commonSideEffects: ['पेट दर्द', 'सीने में जलन'],
        warnings: ['पेट के अल्सर में न लें', 'गर्भावस्था के अंतिम महीनों में न लें'],
      },
    },
    isVerified: true,
  },
  {
    name: 'Warfarin 5mg',
    genericName: 'warfarin',
    brandNames: ['Warf', 'Uniwarfin'],
    form: 'tablet' as const,
    strength: '5mg',
    ingredients: [{ name: 'warfarin', strength: '5', unit: 'mg' }],
    therapeuticClass: 'Anticoagulant',
    prescriptionRequired: true,
    explanation: {
      en: {
        uses: 'Thins the blood to prevent clots.',
        howToTake: 'Take at the same time daily. Regular INR blood tests are essential.',
        commonSideEffects: ['Easy bruising', 'Bleeding gums'],
        warnings: ['Never change the dose yourself', 'Report any unusual bleeding immediately'],
      },
      hi: {
        uses: 'खून को पतला करके थक्के बनने से रोकता है।',
        howToTake: 'रोज़ एक ही समय पर लें। नियमित INR जाँच ज़रूरी है।',
        commonSideEffects: ['आसानी से नील पड़ना', 'मसूड़ों से खून'],
        warnings: ['खुराक खुद न बदलें', 'असामान्य रक्तस्राव तुरंत बताएँ'],
      },
    },
    isVerified: true,
  },
];

const INTERACTIONS = [
  {
    ingredientA: 'warfarin',
    ingredientB: 'ibuprofen',
    severity: 'major' as const,
    mechanism: 'NSAIDs inhibit platelet function and irritate the gastric lining.',
    effect: {
      en: 'Markedly increased risk of serious bleeding, especially from the stomach.',
      hi: 'गंभीर रक्तस्राव, विशेषकर पेट से, का खतरा बहुत बढ़ जाता है।',
    },
    advice: {
      en: 'Avoid this combination. Use paracetamol for pain unless a doctor advises otherwise.',
      hi: 'इस संयोजन से बचें। दर्द के लिए डॉक्टर की सलाह के बिना पैरासिटामोल ही लें।',
    },
    references: ['Reviewed clinical interaction reference'],
  },
  {
    ingredientA: 'metformin',
    ingredientB: 'ibuprofen',
    severity: 'moderate' as const,
    mechanism: 'NSAIDs can reduce kidney function, lowering metformin clearance.',
    effect: {
      en: 'Higher metformin levels and an increased risk of lactic acidosis if kidney function drops.',
      hi: 'गुर्दे की कार्यक्षमता घटने पर मेटफॉर्मिन का स्तर बढ़ सकता है।',
    },
    advice: {
      en: 'Use with caution, stay hydrated, and have kidney function monitored.',
      hi: 'सावधानी से उपयोग करें, पर्याप्त पानी पिएँ और गुर्दे की जाँच कराते रहें।',
    },
    references: ['Reviewed clinical interaction reference'],
  },
  {
    ingredientA: 'amoxicillin',
    ingredientB: 'warfarin',
    severity: 'moderate' as const,
    mechanism: 'Antibiotics disturb gut flora that produce vitamin K.',
    effect: { en: 'Warfarin effect may be amplified, raising bleeding risk.', hi: 'वारफेरिन का असर बढ़ सकता है।' },
    advice: { en: 'Monitor INR more frequently during and after the course.', hi: 'कोर्स के दौरान INR की जाँच अधिक बार कराएँ।' },
    references: ['Reviewed clinical interaction reference'],
  },
];

const run = async () => {
  await connectDatabase();

  const adminPhone = '+919999900001';
  const existingAdmin = await User.findOne({ phone: adminPhone }).lean();
  if (!existingAdmin) {
    await User.create({
      name: 'Platform Admin',
      phone: adminPhone,
      email: 'admin@medlink360.local',
      passwordHash: await hashPassword('Admin@12345'),
      role: ROLES.ADMIN,
      status: ACCOUNT_STATUS.ACTIVE,
      phoneVerified: true,
      emailVerified: true,
    });
    logger.info('Seeded admin account', { phone: adminPhone, password: 'Admin@12345' });
  }

  for (const medicine of MEDICINES) {
    const existing = await Medicine.findOne({ genericName: medicine.genericName, strength: medicine.strength });
    if (existing) continue;
    await new Medicine(medicine).save(); // save() so searchTokens are built
  }

  for (const interaction of INTERACTIONS) {
    const [a, b] = [interaction.ingredientA, interaction.ingredientB].sort();
    const existing = await DrugInteraction.findOne({ ingredientA: a, ingredientB: b });
    if (existing) continue;
    await DrugInteraction.create(interaction);
  }

  const [medicineCount, interactionCount] = await Promise.all([
    Medicine.countDocuments(),
    DrugInteraction.countDocuments(),
  ]);
  logger.info('Seed complete', { medicines: medicineCount, interactions: interactionCount });

  await disconnectDatabase();
};

void run().catch(async (err) => {
  logger.error('Seed failed', err);
  await disconnectDatabase();
  process.exit(1);
});
