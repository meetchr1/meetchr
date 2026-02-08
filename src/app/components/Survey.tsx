"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

interface SurveyData {
  district: string;
  school: string;
  role: string;
  gradeLevel: string;
  elementaryGradeLevel: string;
  subjectArea: string;
  districtEnvironment: string;
  districtSize: string;
  title1: string;
  timeCommitment: string;
  deskSituation: string;
  lessonPlanningStyle: string;
  classroomManagement: string;
  superpower: string;
  badDayProtocol: string;
  feedbackStyle: string;
  goal: string;
  communicationStyle: string;
  teacherArchetype: string;
  professionalBoundaries: string;
  introvertExtrovert: string;
  morningEnergy: string;
  redFlag: string;
  conflictStyle: string;
  studentAdvocacy: string;
  standardsChange: string;
  sundayFunday: string;
  gradingMarathon: string;
  adminAlert: string;
  meetingVibe: string;
  summerFun: string;
  respectCheck: string;
  pivotPotential: string;
  lightbulbMoment: string;
  standardizedStruggle: string;
  ruleFollower: string;
  socialBattery: string;
  masterOfMessiness: string;
  pdPreference: string;
  groupingGame: string;
  failedTestFunk: string;
  popInPanic: string;
}

interface SurveyProps {
  onComplete?: () => void;
}

export function Survey({ onComplete }: SurveyProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<SurveyData>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const totalSteps = 5;

  const updateFormData = (field: keyof SurveyData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data.error || "Failed to submit survey.");
        setIsSubmitting(false);
        return;
      }

      setIsComplete(true);
      window.scrollTo(0, 0);
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  if (isComplete) {
    return <CompletionScreen onComplete={onComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-coral-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="MeeTchr" className="w-10 h-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-coral-500 bg-clip-text text-transparent">
                MeeTchr
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-200 h-1">
          <div 
            className="h-1 bg-gradient-to-r from-pink-600 to-coral-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          {currentStep === 1 && <StepIntro onNext={nextStep} />}
          {currentStep === 2 && (
            <StepLogistics 
              formData={formData} 
              updateFormData={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 3 && (
            <StepPersonality1 
              formData={formData} 
              updateFormData={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 4 && (
            <StepPersonality2 
              formData={formData} 
              updateFormData={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 5 && (
            <StepPersonality3 
              formData={formData} 
              updateFormData={updateFormData}
              onSubmit={handleSubmit}
              onBack={prevStep}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function StepIntro({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-coral-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-pink-600" />
      </div>
      <h1 className="text-4xl lg:text-5xl">
        Welcome to <span className="text-pink-600">MeeTchr</span>!
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Let&apos;s find your perfect teaching partner. This survey helps us match you with someone who truly gets you—
        your teaching style, your needs, and your vibe.
      </p>
      <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 text-left max-w-2xl mx-auto">
        <h3 className="font-semibold text-gray-900 mb-3">What to expect:</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-pink-600 mt-1">•</span>
            <span>41 questions to help us understand you</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-600 mt-1">•</span>
            <span>Takes about 10-15 minutes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-600 mt-1">•</span>
            <span>Be honest—there are no wrong answers!</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-600 mt-1">•</span>
            <span>You can always update your preferences later</span>
          </li>
        </ul>
      </div>
      <button
        onClick={onNext}
        className="px-8 py-4 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto group"
      >
        Let&apos;s Get Started
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

interface StepProps {
  formData: Partial<SurveyData>;
  updateFormData: (field: keyof SurveyData, value: string) => void;
  onNext?: () => void;
  onBack: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

function StepLogistics({ formData, updateFormData, onNext, onBack }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl mb-3">
          Let&apos;s Start with the <span className="text-pink-600">Basics</span>
        </h2>
        <p className="text-gray-600">Tell us about your teaching context</p>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-gray-900 mb-2">1. What school district do you work in?</label>
          <input type="text" value={formData.district || ""} onChange={(e) => updateFormData("district", e.target.value)} placeholder="Enter your district name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-900 mb-2">2. What school do you work in?</label>
          <input type="text" value={formData.school || ""} onChange={(e) => updateFormData("school", e.target.value)} placeholder="Enter your school name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-900 mb-2">3. Are you a Mentor or a Novice?</label>
          <div className="grid md:grid-cols-2 gap-4">
            {[{ value: "Mentor (5+ years)", label: "Mentor", desc: "5+ years of experience" }, { value: "Novice (0-5 years)", label: "Novice", desc: "0-5 years of experience" }].map(opt => (
              <button key={opt.value} onClick={() => updateFormData("role", opt.value)} className={`p-4 border-2 rounded-lg transition-all ${formData.role === opt.value ? "border-pink-600 bg-pink-50" : "border-gray-300 hover:border-pink-300"}`}>
                <div className="font-semibold text-gray-900">{opt.label}</div>
                <div className="text-sm text-gray-600">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-gray-900 mb-2">4. What grade level do you teach?</label>
          <div className="grid md:grid-cols-3 gap-4">
            {["Elementary", "Middle School", "High School"].map((level) => (
              <button key={level} onClick={() => { updateFormData("gradeLevel", level); if (level !== "Elementary" && formData.elementaryGradeLevel) updateFormData("elementaryGradeLevel", ""); }} className={`p-4 border-2 rounded-lg transition-all ${formData.gradeLevel === level ? "border-pink-600 bg-pink-50" : "border-gray-300 hover:border-pink-300"}`}>
                <div className="font-semibold text-gray-900">{level}</div>
              </button>
            ))}
          </div>
        </div>
        {formData.gradeLevel === "Elementary" && (
          <div className="ml-4 pl-4 border-l-4 border-pink-200">
            <label className="block text-gray-900 mb-2">4a. Which elementary grade level?</label>
            <div className="grid md:grid-cols-3 gap-4">
              {["K-1", "2-3", "4-5"].map((level) => (
                <button key={level} onClick={() => updateFormData("elementaryGradeLevel", level)} className={`p-4 border-2 rounded-lg transition-all ${formData.elementaryGradeLevel === level ? "border-pink-600 bg-pink-50" : "border-gray-300 hover:border-pink-300"}`}>
                  <div className="font-semibold text-gray-900">Grades {level}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          <label className="block text-gray-900 mb-2">5. What subject or content area do you teach?</label>
          <input type="text" value={formData.subjectArea || ""} onChange={(e) => updateFormData("subjectArea", e.target.value)} placeholder="e.g., Algebra I, Special Education, ESL, Art" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-900 mb-2">6. Is your school Urban, Rural, or Suburban?</label>
          <div className="grid md:grid-cols-3 gap-4">
            {["Urban", "Suburban", "Rural"].map((env) => (
              <button key={env} onClick={() => updateFormData("districtEnvironment", env)} className={`p-4 border-2 rounded-lg transition-all ${formData.districtEnvironment === env ? "border-pink-600 bg-pink-50" : "border-gray-300 hover:border-pink-300"}`}>
                <div className="font-semibold text-gray-900">{env}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-gray-900 mb-2">7. What&apos;s your district size?</label>
          <div className="grid md:grid-cols-2 gap-4">
            {[{ value: "Large/Corporate-style", label: "Large District", desc: "Corporate-style" }, { value: "Small/Tight-knit", label: "Small District", desc: "Tight-knit community" }].map(opt => (
              <button key={opt.value} onClick={() => updateFormData("districtSize", opt.value)} className={`p-4 border-2 rounded-lg transition-all ${formData.districtSize === opt.value ? "border-pink-600 bg-pink-50" : "border-gray-300 hover:border-pink-300"}`}>
                <div className="font-semibold text-gray-900">{opt.label}</div>
                <div className="text-sm text-gray-600">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-gray-900 mb-2">8. Is your school Title 1?</label>
          <div className="grid md:grid-cols-2 gap-4">
            {["Yes", "No"].map((answer) => (
              <button key={answer} onClick={() => updateFormData("title1", answer)} className={`p-4 border-2 rounded-lg transition-all ${formData.title1 === answer ? "border-pink-600 bg-pink-50" : "border-gray-300 hover:border-pink-300"}`}>
                <div className="font-semibold text-gray-900">{answer}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-gray-900 mb-2">9. What&apos;s your ideal time commitment?</label>
          <div className="grid md:grid-cols-2 gap-4">
            {[{ value: "15-minute weekly check-in", label: "Quick Check-In", desc: "15 minutes weekly" }, { value: "1-hour monthly strategy session", label: "Deep Dive", desc: "1 hour monthly" }].map(opt => (
              <button key={opt.value} onClick={() => updateFormData("timeCommitment", opt.value)} className={`p-4 border-2 rounded-lg transition-all ${formData.timeCommitment === opt.value ? "border-pink-600 bg-pink-50" : "border-gray-300 hover:border-pink-300"}`}>
                <div className="font-semibold text-gray-900">{opt.label}</div>
                <div className="text-sm text-gray-600">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-4 pt-8 border-t">
        <button onClick={onBack} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button onClick={onNext} className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group">
          Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

function OptionButton({ field, value, label, formData, updateFormData }: { field: keyof SurveyData; value: string; label: string; formData: Partial<SurveyData>; updateFormData: (f: keyof SurveyData, v: string) => void }) {
  return (
    <button onClick={() => updateFormData(field, value)} className={`w-full p-4 border-2 rounded-lg text-left transition-all ${formData[field] === value ? "border-pink-600 bg-pink-50" : "border-gray-300 hover:border-pink-300"}`}>
      <div className="font-semibold text-gray-900">{label}</div>
    </button>
  );
}

function StepPersonality1({ formData, updateFormData, onNext, onBack }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl mb-3">Now Let&apos;s Talk <span className="text-pink-600">Teaching Style</span></h2>
        <p className="text-gray-600">Help us understand your personality and approach</p>
      </div>
      <div className="space-y-6">
        <div><label className="block text-gray-900 mb-3">10. The Desk Situation</label><div className="space-y-3"><OptionButton field="deskSituation" value="pristine" label="My desk is a pristine sanctuary" formData={formData} updateFormData={updateFormData} /><OptionButton field="deskSituation" value="chaotic" label="My desk is where paper goes to be lost forever" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">11. Lesson Planning Style</label><div className="space-y-3"><OptionButton field="lessonPlanningStyle" value="detailed" label="I have a 10-page script for every minute" formData={formData} updateFormData={updateFormData} /><OptionButton field="lessonPlanningStyle" value="flexible" label="I have 3 bullet points and a dream" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">12. Classroom Management</label><div className="space-y-3"><OptionButton field="classroomManagement" value="silence" label='I&apos;m the "Wait for Silence" teacher' formData={formData} updateFormData={updateFormData} /><OptionButton field="classroomManagement" value="chaos" label='I&apos;m the "Controlled Chaos" teacher' formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">13. Teacher Superpower</label><div className="grid md:grid-cols-3 gap-4">{[{ value: "patience", label: "Endless Patience" }, { value: "speed", label: "Master of Grading Speed" }, { value: "whisperer", label: "The Student Whisperer" }].map((opt) => (<button key={opt.value} onClick={() => updateFormData("superpower", opt.value)} className={`p-4 border-2 rounded-lg transition-all ${formData.superpower === opt.value ? "border-pink-600 bg-pink-50" : "border-gray-300 hover:border-pink-300"}`}><div className="font-semibold text-gray-900">{opt.label}</div></button>))}</div></div>
        <div><label className="block text-gray-900 mb-3">14. When I have a terrible day, I want:</label><div className="space-y-3"><OptionButton field="badDayProtocol" value="action-plan" label="A 5-step action plan to fix it" formData={formData} updateFormData={updateFormData} /><OptionButton field="badDayProtocol" value="vent" label="A safe space to vent for 20 minutes" formData={formData} updateFormData={updateFormData} /><OptionButton field="badDayProtocol" value="humor" label="A funny meme and a reminder that it's just one day" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">15. Feedback Style</label><div className="space-y-3"><OptionButton field="feedbackStyle" value="direct" label="Give it to me straight (The Truth-Teller)" formData={formData} updateFormData={updateFormData} /><OptionButton field="feedbackStyle" value="encouraging" label="A compliment sandwich, please (The Encourager)" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">16. The Goal: What are you looking for?</label><div className="space-y-3"><OptionButton field="goal" value="workplace-bestie" label='"Workplace Bestie" to keep you sane' formData={formData} updateFormData={updateFormData} /><OptionButton field="goal" value="strategic-coach" label='"Strategic Coach" to help you stay on track' formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">17. Communication Style</label><div className="space-y-3"><OptionButton field="communicationStyle" value="quick-texts" label="Quick texts during lunch" formData={formData} updateFormData={updateFormData} /><OptionButton field="communicationStyle" value="scheduled-calls" label="Scheduled Zoom calls with an agenda" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">18. Teacher Archetype</label><div className="space-y-3"><OptionButton field="teacherArchetype" value="tech-innovator" label="The Enthusiastic Tech-Savvy Innovator" formData={formData} updateFormData={updateFormData} /><OptionButton field="teacherArchetype" value="traditional-pillar" label="The Traditional Pillar of Wisdom" formData={formData} updateFormData={updateFormData} /><OptionButton field="teacherArchetype" value="creative-rebel" label="The Creative Artsy Rebel" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">19. Professional Boundaries</label><div className="space-y-3"><OptionButton field="professionalBoundaries" value="work-at-school" label="Work stays at school" formData={formData} updateFormData={updateFormData} /><OptionButton field="professionalBoundaries" value="grading-at-night" label="I'm grading until 9:00 PM every night" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">20. Introvert vs. Extrovert: How do you recharge?</label><div className="space-y-3"><OptionButton field="introvertExtrovert" value="introvert" label="Closing my door at lunch" formData={formData} updateFormData={updateFormData} /><OptionButton field="introvertExtrovert" value="extrovert" label="Talking to colleagues in the breakroom" formData={formData} updateFormData={updateFormData} /></div></div>
      </div>
      <div className="flex gap-4 pt-8 border-t">
        <button onClick={onBack} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all flex items-center gap-2"><ArrowLeft className="w-5 h-5" /> Back</button>
        <button onClick={onNext} className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group">Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></button>
      </div>
    </div>
  );
}

function StepPersonality2({ formData, updateFormData, onNext, onBack }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl mb-3">Understanding Your <span className="text-coral-500">Daily Routine</span></h2>
        <p className="text-gray-600">Let&apos;s explore your work habits and preferences</p>
      </div>
      <div className="space-y-6">
        <div><label className="block text-gray-900 mb-3">21. Morning Energy</label><div className="space-y-3"><OptionButton field="morningEnergy" value="early-bird" label="I'm in my classroom an hour early with coffee" formData={formData} updateFormData={updateFormData} /><OptionButton field="morningEnergy" value="just-in-time" label="I'm sliding into my chair 30 seconds before the bell" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">22. Professional &quot;Red Flag&quot;: What&apos;s your biggest pet peeve?</label><div className="space-y-3"><OptionButton field="redFlag" value="unnecessary-meetings" label="Unnecessary meetings" formData={formData} updateFormData={updateFormData} /><OptionButton field="redFlag" value="disorganized-admin" label="Disorganized admin" formData={formData} updateFormData={updateFormData} /><OptionButton field="redFlag" value="lack-of-discipline" label="Lack of student discipline" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">23. Conflict Style</label><div className="space-y-3"><OptionButton field="conflictStyle" value="immediate" label="When there's a problem, I address it immediately" formData={formData} updateFormData={updateFormData} /><OptionButton field="conflictStyle" value="process" label="I need time to process before I speak" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">24. Student Advocacy</label><div className="space-y-3"><OptionButton field="studentAdvocacy" value="strict-rules" label="I believe in strict rules for student growth" formData={formData} updateFormData={updateFormData} /><OptionButton field="studentAdvocacy" value="flexible-grace" label="I believe in flexible grace for student growth" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">25. When the state announces an overhaul of their standards, I think:</label><div className="space-y-3"><OptionButton field="standardsChange" value="challenge-accepted" label="Challenge accepted. I've been wanting to try a more modern approach anyway." formData={formData} updateFormData={updateFormData} /><OptionButton field="standardsChange" value="frustration" label="Frustration. Why can't the state ever keep anything the same?" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">26. Sunday Funday: It&apos;s Sunday night, how are you feeling?</label><div className="space-y-3"><OptionButton field="sundayFunday" value="excited" label="Excited about what the week will bring" formData={formData} updateFormData={updateFormData} /><OptionButton field="sundayFunday" value="stressed" label="Stressed because I can't anticipate what this week will bring" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">27. Grading Marathon: When it comes to grading exams, I am...</label><div className="space-y-3"><OptionButton field="gradingMarathon" value="machine" label="The machine: I clear the stack in one sitting" formData={formData} updateFormData={updateFormData} /><OptionButton field="gradingMarathon" value="philosopher" label="The philosopher: I agonize over every partial credit point" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">28. Admin Alert: An unexpected email from an administrator makes me...</label><div className="space-y-3"><OptionButton field="adminAlert" value="roll-eyes" label="Roll my eyes and add it to my to-do list" formData={formData} updateFormData={updateFormData} /><OptionButton field="adminAlert" value="worry" label="Check my heart rate, and worry about what I did wrong" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">29. Meeting Vibe: In meetings, I am often...</label><div className="space-y-3"><OptionButton field="meetingVibe" value="entertainer" label="The Entertainer: Cracking jokes to keep the mood light" formData={formData} updateFormData={updateFormData} /><OptionButton field="meetingVibe" value="scribe" label="The Scribe: Taking meticulous notes on action items" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">30. Summer Fun: By mid-July, my teacher brain is...</label><div className="space-y-3"><OptionButton field="summerFun" value="already-planning" label="Already browsing Pinterest for new classroom décor" formData={formData} updateFormData={updateFormData} /><OptionButton field="summerFun" value="shut-off" label="Firmly shut off; I haven't thought about a desk in weeks" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">31. Respect Check: A student is talking back in class, my go-to is...</label><div className="space-y-3"><OptionButton field="respectCheck" value="logical-consequence" label="The logical consequence: Immediate and consistent" formData={formData} updateFormData={updateFormData} /><OptionButton field="respectCheck" value="sidebar" label="The sidebar: Checking in to see what's actually wrong" formData={formData} updateFormData={updateFormData} /></div></div>
      </div>
      <div className="flex gap-4 pt-8 border-t">
        <button onClick={onBack} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all flex items-center gap-2"><ArrowLeft className="w-5 h-5" /> Back</button>
        <button onClick={onNext} className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group">Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></button>
      </div>
    </div>
  );
}

function StepPersonality3({ formData, updateFormData, onSubmit, onBack, isSubmitting, submitError }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl mb-3">Almost There! <span className="text-pink-600">Final Questions</span></h2>
        <p className="text-gray-600">Let&apos;s finish understanding your teaching philosophy</p>
      </div>
      <div className="space-y-6">
        <div><label className="block text-gray-900 mb-3">32. Pivot Potential: I find a great new lesson plan online...</label><div className="space-y-3"><OptionButton field="pivotPotential" value="scrap-and-try" label="I scrap mine and try the new one tomorrow" formData={formData} updateFormData={updateFormData} /><OptionButton field="pivotPotential" value="save-for-later" label="I save it for 'maybe next year' and stick to my plan" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">33. Lightbulb Moment: When a student doesn&apos;t understand, my instinct is to...</label><div className="space-y-3"><OptionButton field="lightbulbMoment" value="explain-again" label="Explain it again, but more slowly and clearly" formData={formData} updateFormData={updateFormData} /><OptionButton field="lightbulbMoment" value="hands-on" label="Build a hands-on activity or game on the fly" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">34. Standardized Struggle: My philosophy on test-taking is...</label><div className="space-y-3"><OptionButton field="standardizedStruggle" value="necessary-metric" label="It's a necessary metric for data and growth" formData={formData} updateFormData={updateFormData} /><OptionButton field="standardizedStruggle" value="stressful-hurdle" label="It's a stressful hurdle that doesn't show the 'whole child'" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">35. Rule Follower: If a policy seems pointless, I usually...</label><div className="space-y-3"><OptionButton field="ruleFollower" value="ignore-it" label="Quietly ignore it and do what's best for my kids" formData={formData} updateFormData={updateFormData} /><OptionButton field="ruleFollower" value="follow-rules" label="Follow it to the letter because those are the rules" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">36. Social Battery: After a long team meeting, I feel...</label><div className="space-y-3"><OptionButton field="socialBattery" value="drained" label="Drained; I need 10 minutes of silence in my room" formData={formData} updateFormData={updateFormData} /><OptionButton field="socialBattery" value="energized" label="Energized; I'm ready to go implement what we discussed" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">37. Master of Messiness: In my classroom, a &quot;messy&quot; room is...</label><div className="space-y-3"><OptionButton field="masterOfMessiness" value="creative-learning" label="Evidence of deep, creative learning" formData={formData} updateFormData={updateFormData} /><OptionButton field="masterOfMessiness" value="distraction" label="A distraction that needs to be cleaned immediately" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">38. PD Preference: My summer professional development style is...</label><div className="space-y-3"><OptionButton field="pdPreference" value="formal-workshop" label="A formal workshop with a certificate" formData={formData} updateFormData={updateFormData} /><OptionButton field="pdPreference" value="beach-books" label="Reading three books on a beach that have nothing to do with school" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">39. Grouping Game: I believe the best way to group students is...</label><div className="space-y-3"><OptionButton field="groupingGame" value="by-data" label="By data: Similar ability levels together" formData={formData} updateFormData={updateFormData} /><OptionButton field="groupingGame" value="by-vibe" label="By vibe: Personalities that balance each other out" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">40. Failed Test Funk: When a whole class bombs a test, my first thought is...</label><div className="space-y-3"><OptionButton field="failedTestFunk" value="review-teaching" label="I need to look at my teaching data and re-teach" formData={formData} updateFormData={updateFormData} /><OptionButton field="failedTestFunk" value="rough-week" label="They must have had a really rough week" formData={formData} updateFormData={updateFormData} /></div></div>
        <div><label className="block text-gray-900 mb-3">41. Pop-In Panic: An unannounced observation is...</label><div className="space-y-3"><OptionButton field="popInPanic" value="show-off" label="A chance to show off what we do every day" formData={formData} updateFormData={updateFormData} /><OptionButton field="popInPanic" value="nightmare" label="A nightmare that ruins my entire week's focus" formData={formData} updateFormData={updateFormData} /></div></div>
      </div>
      <div className="bg-gradient-to-br from-pink-50 to-coral-50 border-2 border-pink-200 rounded-xl p-8 text-center">
        <h3 className="text-2xl mb-3">You&apos;re All Set!</h3>
        <p className="text-gray-600 mb-6">Click below to submit your responses and let our AI find your perfect teaching partner.</p>
      </div>
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {submitError}
        </div>
      )}
      <div className="flex gap-4 pt-8 border-t">
        <button onClick={onBack} disabled={isSubmitting} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all flex items-center gap-2 disabled:opacity-50"><ArrowLeft className="w-5 h-5" /> Back</button>
        <button onClick={onSubmit} disabled={isSubmitting} className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70">
          {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : <><CheckCircle className="w-5 h-5" /> Complete Survey</>}
        </button>
      </div>
    </div>
  );
}

function CompletionScreen({ onComplete }: { onComplete?: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-coral-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 max-w-2xl text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-coral-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-pink-600" />
        </div>
        <h1 className="text-4xl lg:text-5xl mb-6">You&apos;re All Set<span className="text-pink-600">!</span></h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Thank you for completing your profile! Our AI is already working on finding your perfect teaching partner—
          someone who shares your values, understands your style, and will help you thrive.
        </p>
        <div className="bg-gradient-to-br from-pink-50 to-coral-50 border-2 border-pink-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">What happens next:</h3>
          <ul className="space-y-3 text-left text-gray-700">
            <li className="flex items-start gap-3"><span className="text-pink-600 mt-1">1.</span><span>Our AI analyzes your responses to find your perfect teaching partner</span></li>
            <li className="flex items-start gap-3"><span className="text-pink-600 mt-1">2.</span><span>You&apos;ll be matched with one compatible mentor or mentee</span></li>
            <li className="flex items-start gap-3"><span className="text-pink-600 mt-1">3.</span><span>If no match exists yet, our system will continue working until someone is available</span></li>
            <li className="flex items-start gap-3"><span className="text-pink-600 mt-1">4.</span><span>Once matched, connect with your partner and begin your mentorship journey!</span></li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onComplete} className="px-8 py-4 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
            View Dashboard <ArrowRight className="w-5 h-5" />
          </button>
          <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-pink-600 hover:text-pink-600 transition-all">
            Edit My Responses
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-8">Check your email for updates on your matches and next steps.</p>
      </div>
    </div>
  );
}
