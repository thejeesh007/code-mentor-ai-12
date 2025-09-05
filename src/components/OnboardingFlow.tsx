import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Target, Code, Briefcase, GraduationCap, Zap, Clock } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (profile: any) => void;
  onBack: () => void;
}

export const OnboardingFlow = ({ onComplete, onBack }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState({
    goal: '',
    experience: '',
    timeCommitment: '',
    interests: [] as string[],
    diagnosticAnswers: {} as Record<string, string>
  });

  const totalSteps = 4;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const goals = [
    {
      id: 'career-change',
      title: 'Career Change',
      description: 'Transition into a tech career',
      icon: Briefcase,
      color: 'text-primary'
    },
    {
      id: 'skill-improvement',
      title: 'Skill Improvement',
      description: 'Enhance existing programming skills',
      icon: Zap,
      color: 'text-secondary'
    },
    {
      id: 'academic',
      title: 'Academic Success',
      description: 'Prepare for exams or coursework',
      icon: GraduationCap,
      color: 'text-accent'
    },
    {
      id: 'personal-projects',
      title: 'Personal Projects',
      description: 'Build apps and side projects',
      icon: Code,
      color: 'text-success'
    }
  ];

  const experienceLevels = [
    { id: 'beginner', label: 'Complete Beginner', description: 'Never written code before' },
    { id: 'some-experience', label: 'Some Experience', description: '1-6 months of coding' },
    { id: 'intermediate', label: 'Intermediate', description: '6+ months of coding' },
    { id: 'advanced', label: 'Advanced', description: 'Years of experience' }
  ];

  const timeCommitments = [
    { id: '5-10-hours', label: '5-10 hours/week', description: 'Casual learning pace' },
    { id: '10-20-hours', label: '10-20 hours/week', description: 'Steady progress' },
    { id: '20-40-hours', label: '20-40 hours/week', description: 'Intensive learning' },
    { id: '40-plus-hours', label: '40+ hours/week', description: 'Full-time commitment' }
  ];

  const interests = [
    'Web Development', 'Mobile Apps', 'Data Science', 'Machine Learning',
    'Game Development', 'Desktop Applications', 'DevOps', 'Cybersecurity'
  ];

  const diagnosticQuestions = [
    {
      id: 'loops',
      question: 'What does this code output?',
      code: `for i in range(3):
    print(i * 2)`,
      options: ['0, 2, 4', '0, 1, 2', '2, 4, 6', 'Error'],
      correct: '0, 2, 4'
    },
    {
      id: 'functions',
      question: 'What is the purpose of a function?',
      options: [
        'To store data',
        'To reuse code and organize logic',
        'To display output',
        'To handle errors'
      ],
      correct: 'To reuse code and organize logic'
    },
    {
      id: 'variables',
      question: 'Which is a valid variable name in most programming languages?',
      options: ['2name', 'user-age', 'user_name', 'class'],
      correct: 'user_name'
    }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate skill level based on diagnostic
      const correctAnswers = diagnosticQuestions.filter(q => 
        profile.diagnosticAnswers[q.id] === q.correct
      ).length;
      
      const skillLevel = correctAnswers === 3 ? 'advanced' : 
                        correctAnswers === 2 ? 'intermediate' :
                        correctAnswers === 1 ? 'some-experience' : 'beginner';

      onComplete({
        ...profile,
        calculatedSkillLevel: skillLevel,
        diagnosticScore: correctAnswers
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return profile.goal !== '';
      case 1: return profile.experience !== '';
      case 2: return profile.timeCommitment !== '';
      case 3: return Object.keys(profile.diagnosticAnswers).length === diagnosticQuestions.length;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">What's Your Goal?</h2>
              <p className="text-muted-foreground">Help us personalize your learning journey</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {goals.map((goal) => (
                <Card 
                  key={goal.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    profile.goal === goal.id ? 'learning-card-active' : 'learning-card'
                  }`}
                  onClick={() => setProfile({ ...profile, goal: goal.id })}
                >
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-2 ${goal.color}`}>
                      <goal.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <CardDescription>{goal.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Code className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Experience Level</h2>
              <p className="text-muted-foreground">This helps us start you at the right level</p>
            </div>

            <RadioGroup 
              value={profile.experience} 
              onValueChange={(value) => setProfile({ ...profile, experience: value })}
              className="space-y-4"
            >
              {experienceLevels.map((level) => (
                <div key={level.id} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={level.id} id={level.id} />
                  <Label htmlFor={level.id} className="flex-1 cursor-pointer">
                    <div className="font-medium">{level.label}</div>
                    <div className="text-sm text-muted-foreground">{level.description}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Time Commitment</h2>
              <p className="text-muted-foreground">How much time can you dedicate to learning?</p>
            </div>

            <RadioGroup 
              value={profile.timeCommitment} 
              onValueChange={(value) => setProfile({ ...profile, timeCommitment: value })}
              className="space-y-4"
            >
              {timeCommitments.map((time) => (
                <div key={time.id} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={time.id} id={time.id} />
                  <Label htmlFor={time.id} className="flex-1 cursor-pointer">
                    <div className="font-medium">{time.label}</div>
                    <div className="text-sm text-muted-foreground">{time.description}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Areas of Interest (Optional)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interests.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={profile.interests.includes(interest)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setProfile({
                            ...profile,
                            interests: [...profile.interests, interest]
                          });
                        } else {
                          setProfile({
                            ...profile,
                            interests: profile.interests.filter(i => i !== interest)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={interest} className="text-sm cursor-pointer">
                      {interest}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <GraduationCap className="h-12 w-12 text-success mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Quick Assessment</h2>
              <p className="text-muted-foreground">Help us understand your current knowledge</p>
            </div>

            <div className="space-y-6">
              {diagnosticQuestions.map((question, index) => (
                <Card key={question.id} className="learning-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                    <CardDescription>{question.question}</CardDescription>
                    {question.code && (
                      <div className="code-editor mt-4">
                        <pre className="text-sm">{question.code}</pre>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      value={profile.diagnosticAnswers[question.id] || ''} 
                      onValueChange={(value) => setProfile({
                        ...profile,
                        diagnosticAnswers: {
                          ...profile.diagnosticAnswers,
                          [question.id]: value
                        }
                      })}
                    >
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                          <Label htmlFor={`${question.id}-${optionIndex}`} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Setup Your Learning Profile</h1>
            <Badge variant="secondary">
              Step {currentStep + 1} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-fade-in">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Button 
              onClick={handleNext}
              disabled={!isStepValid()}
              className="btn-hero flex items-center gap-2"
            >
              {currentStep === totalSteps - 1 ? 'Complete Setup' : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};