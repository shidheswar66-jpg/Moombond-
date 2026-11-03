import React, { useState } from 'react';
import { 
  Heart, 
  AlertTriangle, 
  ShieldCheck, 
  Calendar, 
  PhoneCall, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Activity,
  HeartHandshake,
  Smile,
  Shield
} from 'lucide-react';

interface AbortionCareViewProps {
  onNavigateToEmergency: () => void;
}

export const AbortionCareView: React.FC<AbortionCareViewProps> = ({ onNavigateToEmergency }) => {
  const [activeCategory, setActiveCategory] = useState<string>('understanding-loss');

  const lossCareCategories = [
    {
      id: 'understanding-loss',
      title: 'Understanding Loss of Pregnancy (Miscarriage)',
      summary: 'Medical reassurance, causes, and dispelling unfounded guilt.',
      details: [
        {
          heading: 'Why Pregnancy Loss Occurs (It Was Not Your Fault)',
          content: 'More than 80% of spontaneous pregnancy losses (early miscarriages) are caused by random chromosomal variations during early cell division that are completely beyond anyone’s control. It is never caused by routine walking, stress, normal work, or having normal food. You did not do anything wrong.',
        },
        {
          heading: 'Types of Spontaneous Pregnancy Loss',
          content: 'Loss can present as a threatened miscarriage (bleeding with closed cervix), incomplete loss (some tissue passed), complete miscarriage, or a missed miscarriage (fetal development ceased without immediate bleeding, detected on ultrasound). Each requires compassionate, gentle obstetric evaluation.',
        },
        {
          heading: 'Clinical Management of Pregnancy Loss',
          content: 'Depending on ultrasound findings and maternal stability, your doctor in Aurangabad may recommend expectant management (allowing the body to naturally and safely complete the loss), supportive prescribed medications to assist natural uterine emptying and prevent infection, or gentle aspiration (D&C) to protect the mother from complications of retained tissue.',
        },
      ],
    },
    {
      id: 'physical-recovery',
      title: 'Physical Recovery & Uterine Healing After Loss',
      summary: 'What to expect in your body during the days and weeks following loss.',
      details: [
        {
          heading: 'Bleeding Patterns (First 7 to 14 Days)',
          content: 'Vaginal bleeding following pregnancy loss typically resembles a heavy menstrual period for 3 to 7 days, gradually tapering into pinkish or brownish spotting over the next 1 to 2 weeks. Small clots are common as the uterus naturally cleanses itself.',
        },
        {
          heading: 'Uterine Involution & Cramping',
          content: 'Mild to moderate lower abdominal cramping occurs as the uterus contracts back to its pre-pregnancy size. This natural involution can be eased with a warm heating pad, gentle rest, and doctor-prescribed paracetamol.',
        },
        {
          heading: 'Breast Changes & Hormonal Plunge',
          content: 'As pregnancy hormones (beta-hCG, estrogen, and progesterone) drop sharply, you may experience temporary breast engorgement, tenderness, or minor milk leakage. Wear a comfortable supportive cotton bra (without tight underwires), avoid manual breast stimulation, and apply cool compresses.',
        },
      ],
    },
    {
      id: 'warning-signs',
      title: 'Post-Loss Warning Signs (Emergency Care)',
      summary: 'Critical red flags requiring immediate hospital evaluation in Aurangabad.',
      details: [
        {
          heading: 'Heavy Hemorrhaging (Excessive Bleeding)',
          content: 'Completely soaking through 2 or more large sanitary pads per hour for 2 consecutive hours, or passing blood clots larger than a lemon. This requires immediate hospital attendance.',
        },
        {
          heading: 'Persistent High Fever & Chills',
          content: 'A body temperature of 38°C (100.4°F) or higher lasting more than 24 hours, or any fever accompanied by shivers and chills, signaling potential uterine bacterial infection (endometritis).',
        },
        {
          heading: 'Severe Unrelieved Pelvic Pain',
          content: 'Intense or worsening abdominal pain that does not respond to prescribed painkillers, or localized sharp pain on one side or at the shoulder tip (which must rule out an undetected ectopic pregnancy).',
        },
        {
          heading: 'Foul-Smelling Vaginal Discharge',
          content: 'Any vaginal discharge having an offensive, foul odor indicates retained gestational tissue requiring urgent clinical review at GMCH Ghati or Civil Hospital.',
        },
      ],
    },
    {
      id: 'emotional-healing',
      title: 'Emotional Healing, Grief & Mental Support',
      summary: 'Validating the profound emotional impact and pathways to healing.',
      details: [
        {
          heading: 'The Validity of Your Grief',
          content: 'Losing a pregnancy is the loss of a child and all the hopes, dreams, and future imagined with them. There is no right or wrong way to grieve. Feelings of intense sadness, numbness, anger, guilt, or emptiness are normal human responses to loss.',
        },
        {
          heading: 'Partner & Family Connection',
          content: 'Partners grieve differently—some express deep sadness openly, while others internalize pain or try to be strong. Honest, gentle conversations and giving each other space without judgment helps couples heal together.',
        },
        {
          heading: 'Honoring and Memorializing Your Baby',
          content: 'Many mothers and families find comfort in gentle memorial acts: planting a sacred tree or flowering bush, keeping an ultrasound photograph in a private journal, naming your baby, or holding a quiet prayer ceremony.',
        },
        {
          heading: 'When to Seek Professional Emotional Care',
          content: 'If profound grief, sleeplessness, or despair persists for several weeks without relief, please reach out. Compassionate maternal counselors and support groups are available through regional health departments and hotlines.',
        },
      ],
    },
    {
      id: 'future-preparedness',
      title: 'Rebuilding, Fertility & Future Conceiving',
      summary: 'Restoring your vitality and understanding when it is safe to try again.',
      details: [
        {
          heading: 'Nutritional Rebuilding & Iron Stores',
          content: 'Replenish blood loss with iron-rich wholesome foods: spinach, beetroots, pomegranate, lentils, jaggery (gud), and dates. Continue taking your prescribed iron-folic acid tablets for at least 3 months.',
        },
        {
          heading: 'Return of Menstruation & Ovulation',
          content: 'Your normal menstrual cycle will generally return within 4 to 6 weeks after the loss. However, ovulation can occur as early as 10 to 14 days post-loss, meaning conception is biologically possible before your next period.',
        },
        {
          heading: 'When Can You Safely Try to Conceive Again?',
          content: 'Obstetricians generally recommend waiting until you have had at least one normal menstrual period and feel emotionally prepared. Having one pregnancy loss does not increase your risk of future loss—over 85% of women with a history of miscarriage go on to carry healthy, full-term pregnancies.',
        },
      ],
    },
  ];

  const selectedCategory = lossCareCategories.find((c) => c.id === activeCategory) || lossCareCategories[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="bg-slate-900/90 border border-pink-900/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            <span>Maternal Grief, Recovery & Clinical Support</span>
            <span aria-hidden="true">·</span>
            <span>Compassionate Care for Loss of Pregnancy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Loss of Pregnancy & Miscarriage Healing Guide
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            A safe, loving, and medically grounded space dedicated entirely to supporting mothers and families who have experienced the loss of a pregnancy. Here you will find bodily recovery steps, grief support, red-flag safety signs, and medical guidance for future healing.
          </p>
        </div>

        {/* Category Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-slate-800">
          {lossCareCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-950'
                  : 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800'
              }`}
            >
              <span>{cat.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Red Flags Callout */}
      <div className="bg-pink-950/20 border border-pink-800/60 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0 text-pink-400" />
            <span>Post-Loss Emergency Warning Signs</span>
          </div>
          <p className="text-xs text-pink-200/90 leading-relaxed max-w-3xl">
            If you experience heavy soaking (&gt;2 maxi pads/hour for 2 hours), high fever over 38°C (100.4°F), intractable pelvic pain, or foul discharge, seek immediate medical care at your nearest hospital casualty.
          </p>
        </div>

        <button
          onClick={onNavigateToEmergency}
          className="px-4 py-2.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-md shadow-pink-950"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Aurangabad Casualty Line</span>
        </button>
      </div>

      {/* Selected Category Details */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
            <span>{selectedCategory.title}</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {selectedCategory.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedCategory.details.map((detail, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-2 hover:border-pink-800/50 transition-colors"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0" />
                <span>{detail.heading}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {detail.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Physical vs Emotional Support Side-by-Side Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-pink-400" />
            <span>Gentle Physical Care Checklist</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0 mt-1.5" />
              <span>Use sanitary pads instead of tampons or cups for 2 weeks to allow natural drainage and prevent infection.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0 mt-1.5" />
              <span>Apply warm heating compresses over the lower abdomen to ease uterine involution cramps.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0 mt-1.5" />
              <span>Avoid heavy weight lifting and swimming until your bleeding stops completely.</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-pink-400" />
            <span>Nurturing Your Heart & Mind</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0 mt-1.5" />
              <span>Allow yourself to cry and express sorrow without apologizing to anyone.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0 mt-1.5" />
              <span>Do not rush back into exhausting social obligations; take time away from work if possible.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0 mt-1.5" />
              <span>Remember: more than 85% of mothers who experience pregnancy loss go on to hold a healthy baby in the future.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
