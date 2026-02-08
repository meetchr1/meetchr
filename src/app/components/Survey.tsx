"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import type { MatchResult } from "@/lib/types/database";

interface SurveyData {
  // Logistics
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

  // Personality/Methodology
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

export function Survey() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<SurveyData>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const totalSteps = 5;

  const updateFormData = (field: keyof SurveyData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

      setMatchResult(data.match);
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
    return <CompletionScreen matchResult={matchResult} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-coral-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="MeeTchr" width={40} height={40} />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-coral-500 bg-clip-text text-transparent">
                MeeTchr
              </span>
            </Link>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div
            className="h-1 bg-gradient-to-r from-pink-600 to-coral-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
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

// Intro Step
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
        Let&apos;s find your perfect teaching partner. This survey helps us
        match you with someone who truly gets you&mdash;your teaching style,
        your needs, and your vibe.
      </p>
      <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 text-left max-w-2xl mx-auto">
        <h3 className="font-semibold text-gray-900 mb-3">What to expect:</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-pink-600 mt-1">&bull;</span>
            <span>41 questions to help us understand you</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-600 mt-1">&bull;</span>
            <span>Takes about 10-15 minutes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-600 mt-1">&bull;</span>
            <span>Be honest&mdash;there are no wrong answers!</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-600 mt-1">&bull;</span>
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

// Component interfaces
interface StepProps {
  formData: Partial<SurveyData>;
  updateFormData: (field: keyof SurveyData, value: string) => void;
  onNext?: () => void;
  onBack: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

// Logistics Step (Questions 1-9)
function StepLogistics({
  formData,
  updateFormData,
  onNext,
  onBack,
}: StepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl mb-3">
          Let&apos;s Start with the <span className="text-pink-600">Basics</span>
        </h2>
        <p className="text-gray-600">Tell us about your teaching context</p>
      </div>

      <div className="space-y-6">
        {/* Question 1: District */}
        <div>
          <label className="block text-gray-900 mb-2">
            1. What school district do you work in?
          </label>
          <input
            type="text"
            value={formData.district || ""}
            onChange={(e) => updateFormData("district", e.target.value)}
            placeholder="Enter your district name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Question 2: School */}
        <div>
          <label className="block text-gray-900 mb-2">
            2. What school do you work in?
          </label>
          <input
            type="text"
            value={formData.school || ""}
            onChange={(e) => updateFormData("school", e.target.value)}
            placeholder="Enter your school name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Question 3: Role */}
        <div>
          <label className="block text-gray-900 mb-2">
            3. Are you a Mentor or a Novice?
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => updateFormData("role", "Mentor (5+ years)")}
              className={`p-4 border-2 rounded-lg transition-all ${
                formData.role === "Mentor (5+ years)"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">Mentor</div>
              <div className="text-sm text-gray-600">
                5+ years of experience
              </div>
            </button>
            <button
              onClick={() => updateFormData("role", "Novice (0-5 years)")}
              className={`p-4 border-2 rounded-lg transition-all ${
                formData.role === "Novice (0-5 years)"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">Novice</div>
              <div className="text-sm text-gray-600">
                0-5 years of experience
              </div>
            </button>
          </div>
        </div>

        {/* Question 4: Grade Level */}
        <div>
          <label className="block text-gray-900 mb-2">
            4. What grade level do you teach?
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {["Elementary", "Middle School", "High School"].map((level) => (
              <button
                key={level}
                onClick={() => {
                  updateFormData("gradeLevel", level);
                  if (
                    level !== "Elementary" &&
                    formData.elementaryGradeLevel
                  ) {
                    updateFormData("elementaryGradeLevel", "");
                  }
                }}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.gradeLevel === level
                    ? "border-pink-600 bg-pink-50"
                    : "border-gray-300 hover:border-pink-300"
                }`}
              >
                <div className="font-semibold text-gray-900">{level}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Question 4a: Elementary Grade Level (conditional) */}
        {formData.gradeLevel === "Elementary" && (
          <div className="ml-4 pl-4 border-l-4 border-pink-200">
            <label className="block text-gray-900 mb-2">
              4a. Which elementary grade level?
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              {["K-1", "2-3", "4-5"].map((level) => (
                <button
                  key={level}
                  onClick={() =>
                    updateFormData("elementaryGradeLevel", level)
                  }
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.elementaryGradeLevel === level
                      ? "border-pink-600 bg-pink-50"
                      : "border-gray-300 hover:border-pink-300"
                  }`}
                >
                  <div className="font-semibold text-gray-900">
                    Grades {level}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 5: Subject Area */}
        <div>
          <label className="block text-gray-900 mb-2">
            5. What subject or content area do you teach?
          </label>
          <input
            type="text"
            value={formData.subjectArea || ""}
            onChange={(e) => updateFormData("subjectArea", e.target.value)}
            placeholder="e.g., Algebra I, Special Education, ESL, Art"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Question 6: District Environment */}
        <div>
          <label className="block text-gray-900 mb-2">
            6. Is your school Urban, Rural, or Suburban?
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {["Urban", "Suburban", "Rural"].map((env) => (
              <button
                key={env}
                onClick={() => updateFormData("districtEnvironment", env)}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.districtEnvironment === env
                    ? "border-pink-600 bg-pink-50"
                    : "border-gray-300 hover:border-pink-300"
                }`}
              >
                <div className="font-semibold text-gray-900">{env}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Question 7: District Size */}
        <div>
          <label className="block text-gray-900 mb-2">
            7. What&apos;s your district size?
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() =>
                updateFormData("districtSize", "Large/Corporate-style")
              }
              className={`p-4 border-2 rounded-lg transition-all ${
                formData.districtSize === "Large/Corporate-style"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">Large District</div>
              <div className="text-sm text-gray-600">Corporate-style</div>
            </button>
            <button
              onClick={() =>
                updateFormData("districtSize", "Small/Tight-knit")
              }
              className={`p-4 border-2 rounded-lg transition-all ${
                formData.districtSize === "Small/Tight-knit"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">Small District</div>
              <div className="text-sm text-gray-600">
                Tight-knit community
              </div>
            </button>
          </div>
        </div>

        {/* Question 8: Title 1 */}
        <div>
          <label className="block text-gray-900 mb-2">
            8. Is your school Title 1?
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            {["Yes", "No"].map((answer) => (
              <button
                key={answer}
                onClick={() => updateFormData("title1", answer)}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.title1 === answer
                    ? "border-pink-600 bg-pink-50"
                    : "border-gray-300 hover:border-pink-300"
                }`}
              >
                <div className="font-semibold text-gray-900">{answer}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Question 9: Time Commitment */}
        <div>
          <label className="block text-gray-900 mb-2">
            9. What&apos;s your ideal time commitment?
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() =>
                updateFormData("timeCommitment", "15-minute weekly check-in")
              }
              className={`p-4 border-2 rounded-lg transition-all ${
                formData.timeCommitment === "15-minute weekly check-in"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">Quick Check-In</div>
              <div className="text-sm text-gray-600">15 minutes weekly</div>
            </button>
            <button
              onClick={() =>
                updateFormData(
                  "timeCommitment",
                  "1-hour monthly strategy session"
                )
              }
              className={`p-4 border-2 rounded-lg transition-all ${
                formData.timeCommitment === "1-hour monthly strategy session"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">Deep Dive</div>
              <div className="text-sm text-gray-600">1 hour monthly</div>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 pt-8 border-t">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
        >
          Continue
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// Personality Part 1 (Questions 10-20)
function StepPersonality1({
  formData,
  updateFormData,
  onNext,
  onBack,
}: StepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl mb-3">
          Now Let&apos;s Talk{" "}
          <span className="text-pink-600">Teaching Style</span>
        </h2>
        <p className="text-gray-600">
          Help us understand your personality and approach
        </p>
      </div>

      <div className="space-y-6">
        {/* Question 10: Desk Situation */}
        <div>
          <label className="block text-gray-900 mb-3">
            10. The Desk Situation
          </label>
          <div className="space-y-3">
            <button
              onClick={() => updateFormData("deskSituation", "pristine")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.deskSituation === "pristine"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                My desk is a pristine sanctuary
              </div>
            </button>
            <button
              onClick={() => updateFormData("deskSituation", "chaotic")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.deskSituation === "chaotic"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                My desk is where paper goes to be lost forever
              </div>
            </button>
          </div>
        </div>

        {/* Question 11: Lesson Planning */}
        <div>
          <label className="block text-gray-900 mb-3">
            11. Lesson Planning Style
          </label>
          <div className="space-y-3">
            <button
              onClick={() =>
                updateFormData("lessonPlanningStyle", "detailed")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.lessonPlanningStyle === "detailed"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                I have a 10-page script for every minute
              </div>
            </button>
            <button
              onClick={() =>
                updateFormData("lessonPlanningStyle", "flexible")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.lessonPlanningStyle === "flexible"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                I have 3 bullet points and a dream
              </div>
            </button>
          </div>
        </div>

        {/* Question 12: Classroom Management */}
        <div>
          <label className="block text-gray-900 mb-3">
            12. Classroom Management
          </label>
          <div className="space-y-3">
            <button
              onClick={() =>
                updateFormData("classroomManagement", "silence")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.classroomManagement === "silence"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                I&apos;m the &ldquo;Wait for Silence&rdquo; teacher
              </div>
            </button>
            <button
              onClick={() =>
                updateFormData("classroomManagement", "chaos")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.classroomManagement === "chaos"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                I&apos;m the &ldquo;Controlled Chaos&rdquo; teacher
              </div>
            </button>
          </div>
        </div>

        {/* Question 13: Superpower */}
        <div>
          <label className="block text-gray-900 mb-3">
            13. Teacher Superpower: If you were a superhero, what would your
            power be?
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { value: "patience", label: "Endless Patience" },
              { value: "speed", label: "Master of Grading Speed" },
              { value: "whisperer", label: "The Student Whisperer" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateFormData("superpower", option.value)}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.superpower === option.value
                    ? "border-pink-600 bg-pink-50"
                    : "border-gray-300 hover:border-pink-300"
                }`}
              >
                <div className="font-semibold text-gray-900">
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Question 14: Bad Day Protocol */}
        <div>
          <label className="block text-gray-900 mb-3">
            14. When I have a terrible day, I want:
          </label>
          <div className="space-y-3">
            <button
              onClick={() => updateFormData("badDayProtocol", "action-plan")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.badDayProtocol === "action-plan"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                A 5-step action plan to fix it
              </div>
            </button>
            <button
              onClick={() => updateFormData("badDayProtocol", "vent")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.badDayProtocol === "vent"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                A safe space to vent for 20 minutes
              </div>
            </button>
            <button
              onClick={() => updateFormData("badDayProtocol", "humor")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.badDayProtocol === "humor"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                A funny meme and a reminder that it&apos;s just one day
              </div>
            </button>
          </div>
        </div>

        {/* Question 15: Feedback Style */}
        <div>
          <label className="block text-gray-900 mb-3">
            15. Feedback Style
          </label>
          <div className="space-y-3">
            <button
              onClick={() => updateFormData("feedbackStyle", "direct")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.feedbackStyle === "direct"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Give it to me straight (The Truth-Teller)
              </div>
            </button>
            <button
              onClick={() => updateFormData("feedbackStyle", "encouraging")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.feedbackStyle === "encouraging"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                A compliment sandwich, please (The Encourager)
              </div>
            </button>
          </div>
        </div>

        {/* Question 16: The Goal */}
        <div>
          <label className="block text-gray-900 mb-3">
            16. The Goal: What are you looking for?
          </label>
          <div className="space-y-3">
            <button
              onClick={() => updateFormData("goal", "workplace-bestie")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.goal === "workplace-bestie"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                &ldquo;Workplace Bestie&rdquo; to keep you sane
              </div>
            </button>
            <button
              onClick={() => updateFormData("goal", "strategic-coach")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.goal === "strategic-coach"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                &ldquo;Strategic Coach&rdquo; to help you stay on track
              </div>
            </button>
          </div>
        </div>

        {/* Question 17: Communication Style */}
        <div>
          <label className="block text-gray-900 mb-3">
            17. Communication Style
          </label>
          <div className="space-y-3">
            <button
              onClick={() =>
                updateFormData("communicationStyle", "quick-texts")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.communicationStyle === "quick-texts"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Quick texts during lunch
              </div>
            </button>
            <button
              onClick={() =>
                updateFormData("communicationStyle", "scheduled-calls")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.communicationStyle === "scheduled-calls"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Scheduled Zoom calls with an agenda
              </div>
            </button>
          </div>
        </div>

        {/* Question 18: Teacher Archetype */}
        <div>
          <label className="block text-gray-900 mb-3">
            18. Teacher Archetype
          </label>
          <div className="space-y-3">
            <button
              onClick={() =>
                updateFormData("teacherArchetype", "tech-innovator")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.teacherArchetype === "tech-innovator"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                The Enthusiastic Tech-Savvy Innovator
              </div>
            </button>
            <button
              onClick={() =>
                updateFormData("teacherArchetype", "traditional-pillar")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.teacherArchetype === "traditional-pillar"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                The Traditional Pillar of Wisdom
              </div>
            </button>
            <button
              onClick={() =>
                updateFormData("teacherArchetype", "creative-rebel")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.teacherArchetype === "creative-rebel"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                The Creative Artsy Rebel
              </div>
            </button>
          </div>
        </div>

        {/* Question 19: Professional Boundaries */}
        <div>
          <label className="block text-gray-900 mb-3">
            19. Professional Boundaries
          </label>
          <div className="space-y-3">
            <button
              onClick={() =>
                updateFormData("professionalBoundaries", "work-at-school")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.professionalBoundaries === "work-at-school"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Work stays at school
              </div>
            </button>
            <button
              onClick={() =>
                updateFormData("professionalBoundaries", "grading-at-night")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.professionalBoundaries === "grading-at-night"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                I&apos;m grading until 9:00 PM every night
              </div>
            </button>
          </div>
        </div>

        {/* Question 20: Introvert vs Extrovert */}
        <div>
          <label className="block text-gray-900 mb-3">
            20. Introvert vs. Extrovert: How do you recharge?
          </label>
          <div className="space-y-3">
            <button
              onClick={() =>
                updateFormData("introvertExtrovert", "introvert")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.introvertExtrovert === "introvert"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Closing my door at lunch
              </div>
            </button>
            <button
              onClick={() =>
                updateFormData("introvertExtrovert", "extrovert")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.introvertExtrovert === "extrovert"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Talking to colleagues in the breakroom
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 pt-8 border-t">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
        >
          Continue
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// Personality Part 2 (Questions 21-31)
function StepPersonality2({
  formData,
  updateFormData,
  onNext,
  onBack,
}: StepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl mb-3">
          Understanding Your{" "}
          <span className="text-coral-500">Daily Routine</span>
        </h2>
        <p className="text-gray-600">
          Let&apos;s explore your work habits and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Question 21: Morning Energy */}
        <div>
          <label className="block text-gray-900 mb-3">
            21. Morning Energy
          </label>
          <div className="space-y-3">
            <button
              onClick={() => updateFormData("morningEnergy", "early-bird")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.morningEnergy === "early-bird"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                I&apos;m in my classroom an hour early with coffee
              </div>
            </button>
            <button
              onClick={() => updateFormData("morningEnergy", "just-in-time")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.morningEnergy === "just-in-time"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                I&apos;m sliding into my chair 30 seconds before the bell
              </div>
            </button>
          </div>
        </div>

        {/* Question 22: Red Flag */}
        <div>
          <label className="block text-gray-900 mb-3">
            22. Professional &ldquo;Red Flag&rdquo;: What&apos;s your biggest
            pet peeve?
          </label>
          <div className="space-y-3">
            <button
              onClick={() =>
                updateFormData("redFlag", "unnecessary-meetings")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.redFlag === "unnecessary-meetings"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Unnecessary meetings
              </div>
            </button>
            <button
              onClick={() =>
                updateFormData("redFlag", "disorganized-admin")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.redFlag === "disorganized-admin"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Disorganized admin
              </div>
            </button>
            <button
              onClick={() =>
                updateFormData("redFlag", "lack-of-discipline")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.redFlag === "lack-of-discipline"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Lack of student discipline
              </div>
            </button>
          </div>
        </div>

        {/* Question 23: Conflict Style */}
        <div>
          <label className="block text-gray-900 mb-3">
            23. Conflict Style
          </label>
          <div className="space-y-3">
            <button
              onClick={() => updateFormData("conflictStyle", "immediate")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.conflictStyle === "immediate"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                When there&apos;s a problem, I address it immediately
              </div>
            </button>
            <button
              onClick={() => updateFormData("conflictStyle", "process")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.conflictStyle === "process"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                I need time to process before I speak
              </div>
            </button>
          </div>
        </div>

        {/* Question 24: Student Advocacy */}
        <div>
          <label className="block text-gray-900 mb-3">
            24. Student Advocacy
          </label>
          <div className="space-y-3">
            <button
              onClick={() =>
                updateFormData("studentAdvocacy", "strict-rules")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.studentAdvocacy === "strict-rules"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                I believe in strict rules for student growth
              </div>
            </button>
            <button
              onClick={() =>
                updateFormData("studentAdvocacy", "flexible-grace")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.studentAdvocacy === "flexible-grace"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                I believe in flexible grace for student growth
              </div>
            </button>
          </div>
        </div>

        {/* Question 25: Standards Change */}
        <div>
          <label className="block text-gray-900 mb-3">
            25. When the state announces an overhaul of their standards, I
            think:
          </label>
          <div className="space-y-3">
            <button
              onClick={() =>
                updateFormData("standardsChange", "challenge-accepted")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.standardsChange === "challenge-accepted"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Challenge accepted. I&apos;ve been wanting to try a more
                modern approach anyway.
              </div>
            </button>
            <button
              onClick={() =>
                updateFormData("standardsChange", "frustration")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.standardsChange === "frustration"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Frustration. Why can&apos;t the state ever keep anything the
                same?
              </div>
            </button>
          </div>
        </div>

        {/* Question 26: Sunday Funday */}
        <div>
          <label className="block text-gray-900 mb-3">
            26. Sunday Funday: It&apos;s Sunday night, how are you feeling
            about the week ahead?
          </label>
          <div className="space-y-3">
            <button
              onClick={() => updateFormData("sundayFunday", "excited")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.sundayFunday === "excited"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Excited about what the week will bring
              </div>
            </button>
            <button
              onClick={() => updateFormData("sundayFunday", "stressed")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.sundayFunday === "stressed"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Stressed because I can&apos;t anticipate what this week will
                bring
              </div>
            </button>
          </div>
        </div>

        {/* Question 27: Grading Marathon */}
        <div>
          <label className="block text-gray-900 mb-3">
            27. Grading Marathon: When it comes to grading exams, I am...
          </label>
          <div className="space-y-3">
            <button
              onClick={() => updateFormData("gradingMarathon", "machine")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.gradingMarathon === "machine"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                The machine: I clear the stack in one sitting
              </div>
            </button>
            <button
              onClick={() =>
                updateFormData("gradingMarathon", "philosopher")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.gradingMarathon === "philosopher"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                The philosopher: I agonize over every partial credit point
              </div>
            </button>
          </div>
        </div>

        {/* Question 28: Admin Alert */}
        <div>
          <label className="block text-gray-900 mb-3">
            28. Admin Alert: An unexpected email from an administrator makes
            me...
          </label>
          <div className="space-y-3">
            <button
              onClick={() => updateFormData("adminAlert", "roll-eyes")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.adminAlert === "roll-eyes"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Roll my eyes and add it to my to-do list
              </div>
            </button>
            <button
              onClick={() => updateFormData("adminAlert", "worry")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.adminAlert === "worry"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Check my heart rate, and worry about what I did wrong
              </div>
            </button>
          </div>
        </div>

        {/* Question 29: Meeting Vibe */}
        <div>
          <label className="block text-gray-900 mb-3">
            29. Meeting Vibe: In meetings, I am often...
          </label>
          <div className="space-y-3">
            <button
              onClick={() => updateFormData("meetingVibe", "entertainer")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.meetingVibe === "entertainer"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                The Entertainer: Cracking jokes to keep the mood light
              </div>
            </button>
            <button
              onClick={() => updateFormData("meetingVibe", "scribe")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.meetingVibe === "scribe"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                The Scribe: Taking meticulous notes on action items
              </div>
            </button>
          </div>
        </div>

        {/* Question 30: Summer Fun */}
        <div>
          <label className="block text-gray-900 mb-3">
            30. Summer Fun: By mid-July, my teacher brain is...
          </label>
          <div className="space-y-3">
            <button
              onClick={() => updateFormData("summerFun", "already-planning")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.summerFun === "already-planning"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Already browsing Pinterest for new classroom d&eacute;cor
              </div>
            </button>
            <button
              onClick={() => updateFormData("summerFun", "shut-off")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.summerFun === "shut-off"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Firmly shut off; I haven&apos;t thought about a desk in weeks
              </div>
            </button>
          </div>
        </div>

        {/* Question 31: Respect Check */}
        <div>
          <label className="block text-gray-900 mb-3">
            31. Respect Check: A student is talking back in class, my go-to
            is...
          </label>
          <div className="space-y-3">
            <button
              onClick={() =>
                updateFormData("respectCheck", "logical-consequence")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.respectCheck === "logical-consequence"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                The logical consequence: Immediate and consistent
              </div>
            </button>
            <button
              onClick={() => updateFormData("respectCheck", "sidebar")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.respectCheck === "sidebar"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                The sidebar: Checking in to see what&apos;s actually wrong
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 pt-8 border-t">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
        >
          Continue
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// Personality Part 3 (Questions 32-41)
function StepPersonality3({
  formData,
  updateFormData,
  onSubmit,
  onBack,
  isSubmitting,
  submitError,
}: StepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl mb-3">
          Almost There! <span className="text-pink-600">Final Questions</span>
        </h2>
        <p className="text-gray-600">
          Let&apos;s finish understanding your teaching philosophy
        </p>
      </div>

      <div className="space-y-6">
        {/* Question 32: Pivot Potential */}
        <div>
          <label className="block text-gray-900 mb-3">
            32. Pivot Potential: I find a great new lesson plan online
            that&apos;s totally different from mine...
          </label>
          <div className="space-y-3">
            <button
              onClick={() =>
                updateFormData("pivotPotential", "scrap-and-try")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.pivotPotential === "scrap-and-try"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                I scrap mine and try the new one tomorrow
              </div>
            </button>
            <button
              onClick={() =>
                updateFormData("pivotPotential", "save-for-later")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.pivotPotential === "save-for-later"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                I save it for &lsquo;maybe next year&rsquo; and stick to my
                plan
              </div>
            </button>
          </div>
        </div>

        {/* Question 33: Lightbulb Moment */}
        <div>
          <label className="block text-gray-900 mb-3">
            33. Lightbulb Moment: When a student doesn&apos;t understand, my
            instinct is to...
          </label>
          <div className="space-y-3">
            <button
              onClick={() =>
                updateFormData("lightbulbMoment", "explain-again")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.lightbulbMoment === "explain-again"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Explain it again, but more slowly and clearly
              </div>
            </button>
            <button
              onClick={() =>
                updateFormData("lightbulbMoment", "hands-on")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.lightbulbMoment === "hands-on"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Build a hands-on activity or game on the fly
              </div>
            </button>
          </div>
        </div>

        {/* Question 34: Standardized Struggle */}
        <div>
          <label className="block text-gray-900 mb-3">
            34. Standardized Struggle: My philosophy on test-taking is...
          </label>
          <div className="space-y-3">
            <button
              onClick={() =>
                updateFormData("standardizedStruggle", "necessary-metric")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.standardizedStruggle === "necessary-metric"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                It&apos;s a necessary metric for data and growth
              </div>
            </button>
            <button
              onClick={() =>
                updateFormData("standardizedStruggle", "stressful-hurdle")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.standardizedStruggle === "stressful-hurdle"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                It&apos;s a stressful hurdle that doesn&apos;t show the
                &lsquo;whole child&rsquo;
              </div>
            </button>
          </div>
        </div>

        {/* Question 35: Rule Follower */}
        <div>
          <label className="block text-gray-900 mb-3">
            35. Rule Follower: If a policy seems pointless, I usually...
          </label>
          <div className="space-y-3">
            <button
              onClick={() => updateFormData("ruleFollower", "ignore-it")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.ruleFollower === "ignore-it"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Quietly ignore it and do what&apos;s best for my kids
              </div>
            </button>
            <button
              onClick={() => updateFormData("ruleFollower", "follow-rules")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.ruleFollower === "follow-rules"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Follow it to the letter because those are the rules
              </div>
            </button>
          </div>
        </div>

        {/* Question 36: Social Battery */}
        <div>
          <label className="block text-gray-900 mb-3">
            36. Social Battery: After a long team meeting, I feel...
          </label>
          <div className="space-y-3">
            <button
              onClick={() => updateFormData("socialBattery", "drained")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.socialBattery === "drained"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Drained; I need 10 minutes of silence in my room
              </div>
            </button>
            <button
              onClick={() => updateFormData("socialBattery", "energized")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.socialBattery === "energized"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Energized; I&apos;m ready to go implement what we discussed
              </div>
            </button>
          </div>
        </div>

        {/* Question 37: Master of Messiness */}
        <div>
          <label className="block text-gray-900 mb-3">
            37. Master of Messiness: In my classroom, a &ldquo;messy&rdquo;
            room is...
          </label>
          <div className="space-y-3">
            <button
              onClick={() =>
                updateFormData("masterOfMessiness", "creative-learning")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.masterOfMessiness === "creative-learning"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Evidence of deep, creative learning
              </div>
            </button>
            <button
              onClick={() =>
                updateFormData("masterOfMessiness", "distraction")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.masterOfMessiness === "distraction"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                A distraction that needs to be cleaned immediately
              </div>
            </button>
          </div>
        </div>

        {/* Question 38: PD Preference */}
        <div>
          <label className="block text-gray-900 mb-3">
            38. PD Preference: My summer professional development style is...
          </label>
          <div className="space-y-3">
            <button
              onClick={() =>
                updateFormData("pdPreference", "formal-workshop")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.pdPreference === "formal-workshop"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                A formal workshop with a certificate
              </div>
            </button>
            <button
              onClick={() => updateFormData("pdPreference", "beach-books")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.pdPreference === "beach-books"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                Reading three books on a beach that have nothing to do with
                school
              </div>
            </button>
          </div>
        </div>

        {/* Question 39: Grouping Game */}
        <div>
          <label className="block text-gray-900 mb-3">
            39. Grouping Game: I believe the best way to group students is...
          </label>
          <div className="space-y-3">
            <button
              onClick={() => updateFormData("groupingGame", "by-data")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.groupingGame === "by-data"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                By data: Similar ability levels together
              </div>
            </button>
            <button
              onClick={() => updateFormData("groupingGame", "by-vibe")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.groupingGame === "by-vibe"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                By vibe: Personalities that balance each other out
              </div>
            </button>
          </div>
        </div>

        {/* Question 40: Failed Test Funk */}
        <div>
          <label className="block text-gray-900 mb-3">
            40. Failed Test Funk: When a whole class bombs a test, my first
            thought is...
          </label>
          <div className="space-y-3">
            <button
              onClick={() =>
                updateFormData("failedTestFunk", "review-teaching")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.failedTestFunk === "review-teaching"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                I need to look at my teaching data and re-teach
              </div>
            </button>
            <button
              onClick={() =>
                updateFormData("failedTestFunk", "rough-week")
              }
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.failedTestFunk === "rough-week"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                They must have had a really rough week
              </div>
            </button>
          </div>
        </div>

        {/* Question 41: Pop-In Panic */}
        <div>
          <label className="block text-gray-900 mb-3">
            41. Pop-In Panic: An unannounced observation is...
          </label>
          <div className="space-y-3">
            <button
              onClick={() => updateFormData("popInPanic", "show-off")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.popInPanic === "show-off"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                A chance to show off what we do every day
              </div>
            </button>
            <button
              onClick={() => updateFormData("popInPanic", "nightmare")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.popInPanic === "nightmare"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
            >
              <div className="font-semibold text-gray-900">
                A nightmare that ruins my entire week&apos;s focus
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Final Submission */}
      <div className="bg-gradient-to-br from-pink-50 to-coral-50 border-2 border-pink-200 rounded-xl p-8 text-center">
        <h3 className="text-2xl mb-3">You&apos;re All Set!</h3>
        <p className="text-gray-600 mb-6">
          Click below to submit your responses and let our AI find your perfect
          teaching partner.
        </p>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {submitError}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4 pt-8 border-t">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Complete Survey
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Completion Screen
function CompletionScreen({
  matchResult,
}: {
  matchResult: MatchResult | null;
}) {
  const wasMatched = matchResult?.success === true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-coral-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 max-w-2xl text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-coral-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-pink-600" />
        </div>

        <h1 className="text-4xl lg:text-5xl mb-6">
          {wasMatched ? (
            <>
              You&apos;ve Been Matched
              <span className="text-pink-600">!</span>
            </>
          ) : (
            <>
              You&apos;re All Set
              <span className="text-pink-600">!</span>
            </>
          )}
        </h1>

        {wasMatched ? (
          <>
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#fce4ec"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeDasharray={`${matchResult.compatibility_score}, 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient">
                    <stop offset="0%" stopColor="#db2777" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">
                  {Math.round(matchResult.compatibility_score ?? 0)}%
                </span>
              </div>
            </div>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Great news! We found a compatible teaching partner for you.
              You&apos;re a{" "}
              <span className="font-bold text-pink-600">
                {Math.round(matchResult.compatibility_score ?? 0)}% Match
              </span>
              &mdash;based on your teaching style, personality, and goals!
            </p>

            <div className="bg-gradient-to-br from-pink-50 to-coral-50 border-2 border-pink-200 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">
                What happens next:
              </h3>
              <ul className="space-y-3 text-left text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-pink-600 mt-1">1.</span>
                  <span>
                    Check your email&mdash;we&apos;ll send you details about
                    your match
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-600 mt-1">2.</span>
                  <span>
                    Connect with your teaching partner and introduce yourselves
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-600 mt-1">3.</span>
                  <span>
                    Begin your mentorship journey together!
                  </span>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Thank you for completing your profile! Our AI is already working
              on finding your perfect teaching partner&mdash;someone who shares
              your values, understands your style, and will help you thrive.
            </p>

            <div className="bg-gradient-to-br from-pink-50 to-coral-50 border-2 border-pink-200 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">
                What happens next:
              </h3>
              <ul className="space-y-3 text-left text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-pink-600 mt-1">1.</span>
                  <span>
                    Our AI analyzes your responses to find your perfect teaching
                    partner
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-600 mt-1">2.</span>
                  <span>
                    You&apos;ll be matched with one compatible mentor or mentee
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-600 mt-1">3.</span>
                  <span>
                    If no match exists yet, our system will continue working
                    until someone is available
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-600 mt-1">4.</span>
                  <span>
                    Once matched, connect with your partner and begin your
                    mentorship journey!
                  </span>
                </li>
              </ul>
            </div>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            Back to Home
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Check your email for updates on your match and next steps.
        </p>
      </div>
    </div>
  );
}
