import React, { useState } from 'react';
import { 
  Salad, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Heart, 
  Sparkles, 
  Search, 
  Printer, 
  Share2, 
  Calendar, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';

interface DietPlanViewProps {
  onNavigateToEmergency?: () => void;
  onNavigateToRoutine?: () => void;
}

export const DietPlanView: React.FC<DietPlanViewProps> = ({
  onNavigateToEmergency,
  onNavigateToRoutine
}) => {
  const [selectedTrimester, setSelectedTrimester] = useState<'trimester1' | 'trimester2' | 'trimester3'>('trimester2');
  const [dietType, setDietType] = useState<'all' | 'veg' | 'eggetarian'>('all');
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const trimesterDetails = {
    trimester1: {
      name: 'Trimester 1 (Weeks 1 – 12)',
      badge: 'Organogenesis & Neural Tube Focus',
      calorieAdjustment: '+0 to +100 kcal / day (Nutrient Quality Focus)',
      priorityNutrients: [
        { name: 'Folic Acid / Folate (400-800 mcg)', reason: 'Fetal brain and neural tube closure; prevents spina bifida.' },
        { name: 'Vitamin B6 & Ginger', reason: 'Natural soothing relief for morning sickness and nausea.' },
        { name: 'Hydration & Electrolytes (2.5L)', reason: 'Counters nausea-induced dehydration and expands blood volume.' },
      ],
      clinicalGuidance: 'Focus on keeping small, frequent nutritious meals down. Dry biscuits, toasted phulkas, and lemons help soothe queasiness.',
    },
    trimester2: {
      name: 'Trimester 2 (Weeks 13 – 27)',
      badge: 'Rapid Skeletal & Blood Expansion',
      calorieAdjustment: '+340 kcal / day (1 extra wholesome snack + protein portion)',
      priorityNutrients: [
        { name: 'Elemental Iron (30-60 mg)', reason: 'Doubles maternal blood plasma; prevents anemia and low birth weight.' },
        { name: 'Calcium (1000-1200 mg)', reason: 'Fetal skeletal ossification; protects maternal bones and teeth.' },
        { name: 'Protein (75-80 g/day)', reason: 'Growth of fetal muscle, placenta, and maternal tissues.' },
        { name: 'Omega-3 / DHA (200-300 mg)', reason: 'Retinal visual acuity and cognitive neural development.' },
      ],
      clinicalGuidance: 'Appetite returns during this golden period. Keep a strict 2-4 hour gap between morning Iron and afternoon Calcium.',
    },
    trimester3: {
      name: 'Trimester 3 (Weeks 28 – 40)',
      badge: 'Fetal Weight Gain & Heartburn Defense',
      calorieAdjustment: '+450 kcal / day (Dense nourishment, light nocturnal dinners)',
      priorityNutrients: [
        { name: 'Dietary Fiber (28-32 g/day)', reason: 'Prevents sluggish bowel motility, constipation, and hemorrhoids.' },
        { name: 'Vitamin C & Zinc', reason: 'Collagen synthesis, tissue healing for labor, and neonatal immunity.' },
        { name: 'Choline & DHA', reason: 'Accelerated third-trimester fetal brain growth.' },
      ],
      clinicalGuidance: 'Eat light, early dinners 2 hours before bed to stop nocturnal acid reflux (GERD) caused by uterine pressure.',
    },
  };

  const mealPlans = {
    trimester1: [
      {
        time: '07:00 AM',
        meal: 'Early Morning Awakening',
        items: ['4-5 Soaked & peeled almonds + 1 walnut', 'Warm water with fresh lemon slice or ginger infusion', 'Dry toast or cracker before stepping out of bed (counters morning nausea)'],
        nutrients: 'Healthy fats, Vitamin E, gingerol',
        veg: true,
      },
      {
        time: '08:45 AM',
        meal: 'Easily Digestible Breakfast',
        items: ['Vegetable Poha with roasted peanuts and green peas OR Moong Dal Chilla', 'Fresh homemade mint-coriander chutney', '1 Glass of fresh Amla-Orange juice (High Vitamin C for natural folate absorption)'],
        nutrients: 'Complex carbs, plant protein, Vitamin C',
        veg: true,
      },
      {
        time: '11:15 AM',
        meal: 'Mid-Morning Refreshment',
        items: ['1 Tender coconut water (natural isotonic electrolytes)', '1 Ripe sweet banana or fresh pomegranate arils'],
        nutrients: 'Potassium, magnesium, antioxidants',
        veg: true,
      },
      {
        time: '01:15 PM',
        meal: 'Wholesome Balanced Lunch',
        items: ['2 Soft Phulkas (whole wheat) with ghee', '1 Bowl Toor Dal or Yellow Moong Dal', '1 Bowl Bottle Gourd (Lauki) or Spinach (Palak) sabzi', '1 Small bowl of steamed rice', 'Fresh cucumber salad with lemon squeeze'],
        nutrients: 'Dietary folate, soluble fiber, easily digested protein',
        veg: true,
      },
      {
        time: '04:30 PM',
        meal: 'Evening Nausea-Soothing Snack',
        items: ['Roasted Makhana (Foxnuts) tossed with mild turmeric & rock salt', '1 Cup fresh chaas (buttermilk) with roasted jeera (cooling, soothes gut)'],
        nutrients: 'Probiotics, calcium, low GI energy',
        veg: true,
      },
      {
        time: '07:45 PM',
        meal: 'Gentle Early Dinner',
        items: ['Moong Dal & Rice Khichdi with carrots, beans, and 1 tsp pure cow ghee', 'Clear tomato-vegetable soup', 'Avoid deep-fried papad or raw onions at night'],
        nutrients: 'Gentle gut motility, amino acids, prevents nocturnal reflux',
        veg: true,
      },
      {
        time: '09:45 PM',
        meal: 'Bedtime Nourishment',
        items: ['1 Small cup of warm milk with a pinch of nutmeg or cardamom (promotes calm sleep)'],
        nutrients: 'Tryptophan, calcium',
        veg: true,
      },
    ],
    trimester2: [
      {
        time: '07:00 AM',
        meal: 'Power Awakening (Iron Primer)',
        items: ['5 Soaked almonds + 2 walnuts + 2 black raisins (munakka)', 'Warm water with lemon (prepares stomach acid for iron absorption)', '1 Boiled egg (eggetarian) OR soaked chia seeds in coconut water (veg)'],
        nutrients: 'DHA precursors, zinc, early morning protein',
        veg: false,
      },
      {
        time: '08:45 AM',
        meal: 'High-Protein Breakfast',
        items: ['Ragi (Nachni) Dosa or Idli with Sambhar rich in drumsticks (moringa) & vegetables', 'OR Vegetable paneer paratha with minimal oil', '1 Glass of fresh orange or sweet lime juice (take alongside 09:00 AM IFA Iron tablet)'],
        nutrients: 'Iron + Vitamin C synergy, elemental calcium, bioavailable protein',
        veg: true,
      },
      {
        time: '11:30 AM',
        meal: 'Mid-Day Fruit & Hydration',
        items: ['1 Seasonal fruit: Guava (rich in Vitamin C), Apple, or fresh Chikoo/Sapota', '1 Glass of fresh tender coconut water OR fresh lime water'],
        nutrients: 'Pectin, electrolyte balance, cellular hydration',
        veg: true,
      },
      {
        time: '01:30 PM',
        meal: 'Nutrient-Dense Indian Thali',
        items: ['2 Jowar (Sorghum) Bhakris OR 2 Whole Wheat Chapatis', '1 Large bowl of Rajma / Chana / Sprouted Moong curry', '1 Bowl Methi (Fenugreek) or Shevga (Drumstick) leaves stir fry', 'Steamed brown or white rice with dal tadka', '1 Cup fresh homemade curd (rich in lactobacillus)'],
        nutrients: 'Complex B-vitamins, iron, calcium, gut microbiome support',
        veg: true,
      },
      {
        time: '04:15 PM',
        meal: 'Calcium Protocol & Snack Time',
        items: ['1 Glass of warm milk (take your doctor-prescribed Calcium supplement now, 7 hours after morning iron)', 'Handful of roasted chana (Bengal gram) OR sesame-flaxseed laddu (mild jaggery)'],
        nutrients: 'Calcium 500mg, magnesium, phosphorus for fetal skeleton',
        veg: true,
      },
      {
        time: '07:45 PM',
        meal: 'Light High-Fiber Dinner',
        items: ['2 Whole wheat rotis with Paneer Bhurji OR 2 Egg curry (soft boiled)', 'Mixed vegetable soup with peas, carrots, and sweet corn', 'Finish eating at least 90 minutes before lying down'],
        nutrients: 'Clean muscle protein, prevents nighttime hypoglycemic drops',
        veg: false,
      },
      {
        time: '10:00 PM',
        meal: 'Restorative Bedtime Drink',
        items: ['Warm turmeric milk (Golden Milk) with a pinch of saffron (kesar) and crushed almonds'],
        nutrients: 'Anti-inflammatory curcumin, calming melatonin precursor',
        veg: true,
      },
    ],
    trimester3: [
      {
        time: '07:00 AM',
        meal: 'Third Trimester Awakening',
        items: ['5 Soaked almonds + 2 soft soaked figs (anjeer) + 2 dates (helps natural cervical softening in late pregnancy)', 'Warm lemon-ginger water to activate sluggish morning peristalsis'],
        nutrients: 'High soluble fiber, natural potassium, iron',
        veg: true,
      },
      {
        time: '08:30 AM',
        meal: 'Heartburn-Friendly Breakfast',
        items: ['Warm rolled oats porridge cooked in milk with sliced bananas and crushed flaxseeds', 'OR 2 soft Vegetable Uttappams with mild coconut chutney', 'Boiled egg white (optional for extra albumin)'],
        nutrients: 'Beta-glucan fiber, slow-release energy, lean protein',
        veg: true,
      },
      {
        time: '11:15 AM',
        meal: 'Hydration & Fiber Boost',
        items: ['1 Bowl of fresh pomegranate and apple chunks', '1 Glass of coconut water OR fresh homemade buttermilk with mint'],
        nutrients: 'Polyphenols, hydration preventing false Braxton Hicks contractions',
        veg: true,
      },
      {
        time: '01:00 PM',
        meal: 'Digestive Lunch (Small Portions)',
        items: ['2 Soft Phulkas smeared with 1/2 tsp ghee', '1 Cup Masoor Dal or Palak Dal', '1 Bowl Turai (Ridge Gourd) or Tinda sabzi (mild, non-gassy)', '1/2 Cup Jeera Rice', 'Fresh beet-carrot salad (grated fine for easy digestion)'],
        nutrients: 'Easily digestible vitamins, iron, non-irritating vegetable fiber',
        veg: true,
      },
      {
        time: '04:30 PM',
        meal: 'Evening Calcium & Relaxation Snack',
        items: ['1 Glass of milk with Calcium tablet (never take with tea or iron)', 'Roasted lotus seeds (Makhana) or 1 slice of whole wheat bread with peanut butter'],
        nutrients: 'Elemental calcium, zinc, steady energy',
        veg: true,
      },
      {
        time: '07:30 PM',
        meal: 'Early Anti-Acid Reflux Dinner',
        items: ['Light Vegetable Moong Khichdi or soft Dalia (broken wheat) with seasonal vegetables', 'Warm clear vegetable or chicken bone broth (if non-veg)', 'Eat before 08:00 PM so stomach empties before left-lateral sleep'],
        nutrients: 'Rapid gastric emptying, collagen, hydration',
        veg: true,
      },
      {
        time: '09:45 PM',
        meal: 'Nocturnal Muscle Ease',
        items: ['Small cup of warm milk with cardamom; sip slowly while sitting upright'],
        nutrients: 'Magnesium and calcium to ease painful nocturnal leg cramps',
        veg: true,
      },
    ],
  };

  const foodSafetyDatabase = [
    {
      name: 'Unpasteurized Milk & Raw Cheeses',
      marathi: 'कच्चे किंवा अनपाश्चराइज्ड दूध व पनीर',
      category: 'dairy',
      safety: 'avoid',
      statusLabel: 'Strictly Avoid',
      reason: 'Carries Listeria monocytogenes bacteria, which can cross the placenta causing miscarriage, premature labor, or severe neonatal sepsis.',
      safeAlternative: 'Drink only well-boiled or pasteurized packaged milk. Eat fresh homemade pasteurized paneer.',
    },
    {
      name: 'Raw or Semi-Ripe Papaya',
      marathi: 'कच्ची किंवा अर्धवट पिकलेली पपई',
      category: 'fruits',
      safety: 'avoid',
      statusLabel: 'Strictly Avoid',
      reason: 'Contains high concentrations of latex and papain, which can trigger strong uterine contractions and premature labor in early pregnancy.',
      safeAlternative: 'Only fully ripe, sweet yellow/orange papaya in very small quantities if approved by your doctor.',
    },
    {
      name: 'Pineapple (Excessive Quantities)',
      marathi: 'अननस (जास्त प्रमाणात)',
      category: 'fruits',
      safety: 'moderate',
      statusLabel: 'Eat with Caution',
      reason: 'Contains bromelain, an enzyme that can soften the cervix if consumed in very high concentrations, though occasional 1-2 small slices are harmless.',
      safeAlternative: 'Opt for oranges, sweet lime (mosambi), apples, guavas, and pomegranates.',
    },
    {
      name: 'Iron & Folic Acid with Vitamin C',
      marathi: 'लोह (आयर्न) गोळी + व्हिटॅमिन सी (लिंबू/संत्री)',
      category: 'supplements',
      safety: 'safe',
      statusLabel: 'Essential Daily',
      reason: 'Vitamin C converts ferric iron (Fe3+) into ferrous iron (Fe2+), boosting intestinal absorption by over 300% to protect against maternal anemia.',
      safeAlternative: 'Always swallow IFA tablets with orange juice or lemon water, never with tea or milk.',
    },
    {
      name: 'Calcium Supplements with Tea or Iron',
      marathi: 'कॅल्शियम गोळी चहा किंवा आयर्न सोबत घेणे',
      category: 'supplements',
      safety: 'avoid',
      statusLabel: 'Strictly Avoid Combination',
      reason: 'Calcium and Iron compete directly for the same DMT1 intestinal transporters; taking them together drastically blocks both nutrients.',
      safeAlternative: 'Keep a 2 to 4 hour gap: Take Iron at 09:00 AM breakfast, and Calcium at 04:15 PM evening.',
    },
    {
      name: 'Sprouted Moong & Lentils (Well Cooked)',
      marathi: 'मोड आलेले मूग व कडधान्ये (शिल्लक शिजवून)',
      category: 'protein',
      safety: 'safe',
      statusLabel: 'Highly Recommended',
      reason: 'Sprouting multiplies Vitamin C, folate, and bioavailable protein. Steaming kills any bacterial surface pathogens.',
      safeAlternative: 'Always steam or cook sprouts; never eat raw market sprouts due to Salmonella risks.',
    },
    {
      name: 'Ragi (Finger Millet / Nachni)',
      marathi: 'नाचणी / रागी',
      category: 'grains',
      safety: 'safe',
      statusLabel: 'Superfood',
      reason: 'One of the richest natural vegetarian sources of calcium (344 mg per 100g) plus dietary fiber, controlling gestational blood sugar.',
      safeAlternative: 'Enjoy as morning Ragi porridge, Bhakri, or Ragi idli.',
    },
    {
      name: 'Drumstick & Moringa Leaves (Shevga)',
      marathi: 'शेवग्याच्या शेंगा व शेवग्याची पाने',
      category: 'vegetables',
      safety: 'safe',
      statusLabel: 'Highly Recommended',
      reason: 'Packed with iron, Vitamin A, Vitamin C, and calcium. Traditional Marathwada medicine for building hemoglobin.',
      safeAlternative: 'Add to daily sambhar, dal, or prepare mild soup.',
    },
    {
      name: 'Raw or Half-Boiled Eggs',
      marathi: 'कच्चे किंवा अर्धवट उकडलेले अंडे',
      category: 'protein',
      safety: 'avoid',
      statusLabel: 'Strictly Avoid',
      reason: 'Risk of virulent Salmonella food poisoning leading to maternal dehydration, fever, and uterine irritability.',
      safeAlternative: 'Eat only fully hard-boiled eggs with firm yolk, or well-cooked omelets.',
    },
    {
      name: 'Excessive Caffeine (Tea / Coffee >200mg)',
      marathi: 'जास्त चहा किंवा कॉफी (दिवसात २ कप पेक्षा जास्त)',
      category: 'beverages',
      safety: 'moderate',
      statusLabel: 'Limit Severely',
      reason: 'Caffeine crosses the placenta easily. The fetal liver lacks enzymes to metabolize it, restricting fetal growth and reducing maternal iron absorption.',
      safeAlternative: 'Limit to maximum 1 small cup of mild tea a day. Switch to fresh coconut water, buttermilk, or lemon water.',
    },
    {
      name: 'Street Food / Roadside Pani Puri & Ice',
      marathi: 'रस्त्यावरील पाणीपुरी, कच्चे चाट व बर्फ',
      category: 'street_food',
      safety: 'avoid',
      statusLabel: 'Strictly Avoid',
      reason: 'Contaminated water causes Hepatitis E, typhoid, and amoebic dysentery, which are life-threatening to pregnant mothers in third trimester.',
      safeAlternative: 'Prepare hygienic boiled-water pani puri or sprout chaat at home.',
    },
    {
      name: 'Fresh Curd & Chaas (Taak)',
      marathi: 'ताजे दही व जिरे घातलेले ताक',
      category: 'dairy',
      safety: 'safe',
      statusLabel: 'Essential Daily',
      reason: 'Provides natural gut probiotics, eases heartburn, prevents vaginal yeast infections, and supplies non-gassy calcium.',
      safeAlternative: 'Consume fresh homemade curd with lunch and chilled spiced buttermilk in the afternoon.',
    },
    {
      name: 'High-Mercury Sea Fishes (King Mackerel / Tuna)',
      marathi: 'मोठे समुद्री मासे (पारा, टूना)',
      category: 'seafood',
      safety: 'avoid',
      statusLabel: 'Strictly Avoid',
      reason: 'High methylmercury levels accumulate in the fetal bloodstream, causing irreversible brain and nervous system damage.',
      safeAlternative: 'If eating fish, choose small, fresh local freshwater varieties (Rohu, Katla) thoroughly cooked.',
    },
    {
      name: 'Pure Cow Ghee (In Moderate Quantities)',
      marathi: 'शुद्ध देशी गायीचे तूप (मर्यादित प्रमाणात)',
      category: 'fats',
      safety: 'safe',
      statusLabel: 'Beneficial (1-2 tsp/day)',
      reason: 'Contains butyric acid for gut health and aids fat-soluble vitamin absorption (A, D, E, K). Myth: Ghee does not "lubricate the birth canal", so avoid heavy excess.',
      safeAlternative: '1 to 2 teaspoons smeared over warm rotis or dal.',
    },
  ];

  const filteredFoodList = foodSafetyDatabase.filter(food => {
    if (!foodSearchQuery.trim()) return true;
    const q = foodSearchQuery.toLowerCase();
    return (
      food.name.toLowerCase().includes(q) ||
      food.marathi.toLowerCase().includes(q) ||
      food.reason.toLowerCase().includes(q) ||
      food.category.toLowerCase().includes(q)
    );
  });

  const activePlan = mealPlans[selectedTrimester].filter(meal => {
    if (dietType === 'veg') return meal.veg;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPlan = () => {
    const summary = [
      `=== MOMBOND MATERNAL CLINICAL DIET PLAN ===`,
      `Stage: ${trimesterDetails[selectedTrimester].name}`,
      `Calorie Target: ${trimesterDetails[selectedTrimester].calorieAdjustment}`,
      `Priority: ${trimesterDetails[selectedTrimester].priorityNutrients.map(p => p.name).join(' · ')}`,
      `\nDaily Meal Schedule:`,
      ...activePlan.map(p => `• [${p.time}] ${p.meal}: ${p.items.join(', ')} (Nutrients: ${p.nutrients})`),
      `\nGolden Rules:`,
      `- Keep 2-3 hour gap between Iron (Morning) and Calcium (Afternoon).`,
      `- Drink minimum 2.5 Liters (10 glasses) of safe water daily.`,
      `- Strictly avoid raw papaya, unpasteurized milk, and roadside unboiled water.`,
      `\nMomBond Maternal Care Network · Chhatrapati Sambhajinagar (Aurangabad)`,
    ].join('\n');

    navigator.clipboard.writeText(summary);
    triggerToast('Maternal Diet Plan copied to clipboard! You can share it with family or your doctor.');
  };

  return (
    <div className="space-y-8 animate-fade-in relative max-w-7xl mx-auto">
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 border border-emerald-500/80 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-bounce font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP CLINICAL HERO BANNER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 uppercase tracking-wider">
              <Salad className="w-4 h-4" />
              <span>Evidence-Based Maternal Clinical Nutrition</span>
              <span aria-hidden="true">·</span>
              <span>ICMR-NIN & WHO Antenatal Standards</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Maternal Diet Plan & Safe Nutrition Guide
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Tailored nutrition schedules for Indian mothers across all 3 trimesters. Learn what foods accelerate fetal development, critical mineral separation (Iron vs. Calcium), and red-flag foods that must be strictly avoided to prevent pregnancy complications.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0 sm:w-64">
            <button
              type="button"
              onClick={onNavigateToRoutine}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Clock className="w-4 h-4 text-emerald-200" />
              <span>Daily Routine Timetable</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
            </button>
            <button
              onClick={() => setShowPrintModal(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-pink-950 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Kitchen Diet Chart</span>
            </button>
            <button
              onClick={handleCopyPlan}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-sky-400" />
              <span>Copy Plan Summary</span>
            </button>
          </div>
        </div>

        {/* Trimester Switcher Selector */}
        <div className="pt-6 mt-6 border-t border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-pink-400" />
              <span>Select Your Gestational Stage:</span>
            </span>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 hidden sm:inline">Diet Preference:</span>
              <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center gap-1">
                {(['all', 'veg', 'eggetarian'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setDietType(type)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer capitalize ${
                      dietType === type
                        ? 'bg-pink-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {type === 'all' ? 'All Foods' : type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(['trimester1', 'trimester2', 'trimester3'] as const).map((triKey) => {
              const info = trimesterDetails[triKey];
              const isSelected = selectedTrimester === triKey;
              return (
                <button
                  key={triKey}
                  onClick={() => setSelectedTrimester(triKey)}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-pink-950/40 border-pink-500 shadow-lg shadow-pink-950/40 ring-1 ring-pink-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{info.name}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />}
                  </div>
                  <span className="text-[11px] font-mono text-pink-300 block">{info.badge}</span>
                  <span className="text-[10px] text-slate-400 mt-1 block line-clamp-1">{info.calorieAdjustment}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TRIMESTER CLINICAL SPOTLIGHT CARD */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-950 border border-pink-800/80 text-pink-300">
                {trimesterDetails[selectedTrimester].name}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {trimesterDetails[selectedTrimester].calorieAdjustment}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Physiological Milestones & Clinical Dietary Priorities
            </h2>
          </div>

          <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 max-w-md">
            <strong className="text-pink-300 block mb-0.5">Doctor's Note:</strong>
            {trimesterDetails[selectedTrimester].clinicalGuidance}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {trimesterDetails[selectedTrimester].priorityNutrients.map((nut, idx) => (
            <div key={idx} className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{nut.name}</span>
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {nut.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CORE TIMETABLE: STEP-BY-STEP DAILY MEAL SCHEDULE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-pink-400" />
              <h2 className="text-lg font-bold text-white">Full-Day Maternal Timetable & Recipes</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {activePlan.length} Balanced Meal Points
            </span>
          </div>

          <div className="space-y-3">
            {activePlan.map((meal, index) => (
              <div
                key={index}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-extrabold font-mono bg-pink-950/70 border border-pink-800/80 text-pink-400 tabular-nums">
                      {meal.time}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-white">{meal.meal}</h3>
                      <span className="text-[11px] font-mono text-emerald-400">
                        Nutrient Key: {meal.nutrients}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded self-start ${
                    meal.veg ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60' : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                  }`}>
                    {meal.veg ? '100% Vegetarian' : 'Includes Eggs / Poultry Option'}
                  </span>
                </div>

                <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Recommended Food Combinations:
                  </span>
                  <ul className="space-y-1.5">
                    {meal.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2 text-xs text-slate-200">
                        <Check className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">Scheduled clinical milestone</span>
                  <button
                    type="button"
                    onClick={onNavigateToRoutine}
                    className="text-[11px] font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Clock className="w-3 h-3 text-pink-400" />
                    <span>View on Daily Routine Timeline</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-pink-950/30 to-purple-950/30 border border-pink-900/50 rounded-2xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-pink-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>3 Golden Rules of Maternal Nutrition in Maharashtra</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <strong className="text-white block mb-1">1. Separate Iron & Calcium</strong>
                <span>Never take Iron (IFA) tablet and Calcium at the same time. Maintain a strict 2 to 4-hour gap.</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <strong className="text-white block mb-1">2. 10 Glasses of Clean Water</strong>
                <span>Minimum 2500 ml water prevents oligohydramnios (low amniotic fluid) and urinary tract infections.</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <strong className="text-white block mb-1">3. Early Light Dinner</strong>
                <span>Eat 2 hours before bed. Avoid lying flat after eating to prevent intense burning nocturnal acid reflux.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Nutrition Tools & Food Safety Checker (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Iron vs. Calcium Timing Guide</h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80">
                Strict Medical Rule
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Why can't Iron and Calcium be taken together? Calcium binds directly to DMT1 receptor sites in your duodenum, completely blocking iron absorption and worsening maternal anemia.
            </p>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <Sun className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block">09:00 AM — Morning Iron (IFA)</strong>
                  <span className="text-slate-400 text-[11px]">Take with lemon water or orange juice (Vitamin C triples absorption). ZERO dairy or tea for 2 hours.</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <Moon className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sky-300 block">04:15 PM — Evening Calcium</strong>
                  <span className="text-slate-400 text-[11px]">Take 7 hours later with a glass of milk or evening tea snack. Keeps bones strong and blood pressure steady.</span>
                </div>
              </div>
            </div>

            <button
              onClick={onNavigateToRoutine}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View 13-Step Daily Routine Schedule</span>
              <ArrowRight className="w-3.5 h-3.5 text-pink-400" />
            </button>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Nutrition for Common Pregnancy Discomforts</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <span className="text-rose-300 font-bold block mb-0.5">Morning Sickness & Nausea:</span>
                <span className="text-slate-300 text-[11px]">Keep dry crackers on bedstand; eat before getting out of bed. Sip ginger lemon water. Avoid empty stomach.</span>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <span className="text-amber-300 font-bold block mb-0.5">Heartburn & Acid Reflux:</span>
                <span className="text-slate-300 text-[11px]">Sip chilled milk or fresh buttermilk. Stop fried snacks and raw onions. Never recline for 90 mins after eating.</span>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <span className="text-sky-300 font-bold block mb-0.5">Pregnancy Constipation:</span>
                <span className="text-slate-300 text-[11px]">Eat 2 soaked anjeer (figs) and prunes every morning. Drink 10 glasses of water. Switch to jowar bhakri.</span>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <span className="text-emerald-300 font-bold block mb-0.5">Painful Leg Cramps at Night:</span>
                <span className="text-slate-300 text-[11px]">Magnesium and potassium deficiency. Eat 1 banana daily and drink tender coconut water.</span>
              </div>
            </div>
          </div>

          <div className="bg-pink-950/40 border border-pink-900/70 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-pink-300">
              <AlertTriangle className="w-4 h-4 text-pink-400" />
              <span>Severe Dehydration / Bleeding Alert</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              If uncontrollable vomiting persists for 24 hours (Hyperemesis Gravidarum), or if you experience abdominal cramping or fluid leakage, contact emergency transport immediately.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="tel:108"
                className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Call 108 Ambulance</span>
              </a>
              <button
                onClick={onNavigateToEmergency}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors border border-slate-700 cursor-pointer"
              >
                Aurangabad Hospitals →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE FOOD SAFETY DIRECTORY: WHAT TO EAT VS AVOID */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Food Safety Database: What Pregnant Women Must Eat vs. Strictly Avoid</span>
            </h2>
            <p className="text-xs text-slate-400">
              Search any food item (e.g. Papaya, Eggs, Curd, Ghee, Tea, Fish, Milk) to verify its safety profile.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={foodSearchQuery}
              onChange={(e) => setFoodSearchQuery(e.target.value)}
              placeholder="Search food item (e.g. Papaya, Paneer)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-semibold">Safe & Recommended</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-semibold">Consume with Caution / Strict Limits</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <XCircle className="w-4 h-4" />
            <span className="font-semibold">Strictly Avoid (Harmful to Fetus)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFoodList.map((item, idx) => {
            const isSafe = item.safety === 'safe';
            const isAvoid = item.safety === 'avoid';

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                  isSafe
                    ? 'bg-slate-950/70 border-emerald-900/50 hover:border-emerald-700'
                    : isAvoid
                    ? 'bg-slate-950/70 border-rose-900/60 hover:border-rose-700'
                    : 'bg-slate-950/70 border-amber-900/50 hover:border-amber-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <span className="text-[11px] font-medium text-pink-300 block">{item.marathi}</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                    isSafe
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : isAvoid
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {item.statusLabel}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.reason}
                </p>

                <div className="text-[11px] pt-1.5 border-t border-slate-800/80 flex items-start gap-1.5">
                  <span className="text-slate-400 font-semibold shrink-0">Safe Advice:</span>
                  <span className="text-slate-300">{item.safeAlternative}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PRINTABLE KITCHEN DIET CHART MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-950/80 border border-pink-700/60 flex items-center justify-center text-pink-300">
                  <Salad className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Kitchen Refrigerator Diet Chart</h3>
                  <p className="text-xs text-slate-400">Printable Antenatal Nutritional Guide · MomBond Maternal Network</p>
                </div>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-3 gap-2">
                <div>
                  <span className="text-[10px] text-pink-400 font-mono uppercase tracking-wider block font-bold">MomBond Maternal Health Protocols</span>
                  <strong className="text-base text-white">Daily Antenatal Nutritional Schedule ({trimesterDetails[selectedTrimester].name})</strong>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <div>Target: <strong className="text-white">{trimesterDetails[selectedTrimester].calorieAdjustment}</strong></div>
                  <div>District: <strong className="text-slate-300">Chh. Sambhajinagar (Aurangabad)</strong></div>
                </div>
              </div>

              <div className="space-y-2">
                {activePlan.map((m, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 gap-2">
                    <div className="flex items-center gap-2 sm:w-48 shrink-0">
                      <span className="font-mono text-pink-400 font-bold text-[11px]">{m.time}</span>
                      <strong className="text-white text-xs">{m.meal}</strong>
                    </div>
                    <div className="text-slate-300 text-xs flex-1">
                      {m.items.join(' · ')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-pink-950/30 rounded-xl border border-pink-900/60 text-pink-200 text-xs space-y-1">
                <strong>Crucial Health Warnings:</strong>
                <p>• Strictly avoid unpasteurized milk, raw papaya, and roadside unboiled water.</p>
                <p>• Take Iron tablet (IFA) at 09:00 AM with lemon water; take Calcium tablet 7 hours later at 04:15 PM with milk.</p>
                <p>• Emergency: In case of acute weakness, bleeding, or reduced fetal kicks, call 108 Ambulance immediately.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyPlan}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Copy Text
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 rounded-xl transition-colors shadow-lg shadow-pink-950 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Kitchen Chart</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
