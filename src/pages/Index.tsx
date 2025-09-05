import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Code, Target, Zap, Trophy, Users, ArrowRight, Play, Star, User, Lock } from 'lucide-react';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { Dashboard } from '@/components/Dashboard';
import { LessonViewer } from '@/components/LessonViewer';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'onboarding' | 'dashboard' | 'demo'>('landing');
  const [userProfile, setUserProfile] = useState(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [currentUser, setCurrentUser] = useState(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('codementor_user');
    const savedProfile = localStorage.getItem('codementor_profile');
    if (savedUser && savedProfile) {
      setCurrentUser(JSON.parse(savedUser));
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSignIn = () => {
    // Simple mock authentication
    if (signInData.email && signInData.password) {
      const user = {
        email: signInData.email,
        name: signInData.email.split('@')[0],
        id: Date.now()
      };
      setCurrentUser(user);
      localStorage.setItem('codementor_user', JSON.stringify(user));
      setIsSignInOpen(false);
      
      // Check if user has completed onboarding
      const savedProfile = localStorage.getItem('codementor_profile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
        setCurrentView('dashboard');
      } else {
        setCurrentView('onboarding');
      }
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setUserProfile(null);
    localStorage.removeItem('codementor_user');
    localStorage.removeItem('codementor_profile');
    setCurrentView('landing');
  };

  const demoLesson = {
    id: 'demo',
    title: 'Python Basics Demo',
    description: 'A quick introduction to Python programming',
    status: 'available',
    difficulty: 'Beginner',
    estimatedTime: '10 min'
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Tutor",
      description: "Get instant hints, explanations, and personalized guidance from our advanced LLM tutor.",
      color: "text-primary"
    },
    {
      icon: Target,
      title: "Adaptive Learning",
      description: "ML models adjust difficulty in real-time based on your progress and understanding.",
      color: "text-secondary"
    },
    {
      icon: Code,
      title: "Safe Code Execution",
      description: "Practice coding in secure Docker sandboxes with instant feedback on your solutions.",
      color: "text-accent"
    },
    {
      icon: Trophy,
      title: "Gamified Progress",
      description: "Earn XP, badges, and certificates as you master new skills and complete challenges.",
      color: "text-success"
    }
  ];

  const stats = [
    { label: "Active Learners", value: "50K+" },
    { label: "Success Rate", value: "94%" },
    { label: "Skills Mastered", value: "500+" },
    { label: "Projects Built", value: "25K+" }
  ];

  if (currentView === 'onboarding') {
    return (
      <OnboardingFlow
        onComplete={(profile) => {
          setUserProfile(profile);
          localStorage.setItem('codementor_profile', JSON.stringify(profile));
          setCurrentView('dashboard');
        }}
        onBack={() => setCurrentView('landing')}
      />
    );
  }

  if (currentView === 'dashboard') {
    return (
      <Dashboard 
        userProfile={userProfile}
        currentUser={currentUser}
        onBack={() => setCurrentView('landing')}
        onSignOut={handleSignOut}
      />
    );
  }

  if (currentView === 'demo') {
    return (
      <LessonViewer
        lesson={demoLesson}
        onBack={() => setCurrentView('landing')}
        onComplete={() => setCurrentView('landing')}
        isDemo={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
              <Brain className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">CodeMentor AI</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How it Works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center space-x-3">
            {currentUser ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentView('dashboard')}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost">
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Sign In to CodeMentor AI</DialogTitle>
                      <DialogDescription>
                        Enter your credentials to access your learning dashboard
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={signInData.email}
                          onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={signInData.password}
                          onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                          placeholder="Enter your password"
                        />
                      </div>
                      <Button 
                        onClick={handleSignIn}
                        className="w-full btn-hero"
                        disabled={!signInData.email || !signInData.password}
                      >
                        Sign In
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button 
                  className="btn-hero"
                  onClick={() => currentUser ? setCurrentView('dashboard') : setCurrentView('onboarding')}
                >
                  Start Learning
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 animate-fade-in">
              <Zap className="mr-2 h-4 w-4" />
              AI-Powered Learning Platform
            </Badge>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl animate-slide-up">
              Master Coding with{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                AI Guidance
              </span>
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Experience personalized learning with adaptive AI tutoring, real-time feedback, 
              and a curriculum that evolves with your progress. From beginner to expert.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button 
                size="lg" 
                className="btn-hero w-full sm:w-auto"
                onClick={() => setCurrentView('onboarding')}
              >
                <Play className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-hero-outline w-full sm:w-auto"
                onClick={() => setCurrentView('demo')}
              >
                Watch Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-scale-in" style={{ animationDelay: '0.3s' }}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-secondary/5" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powered by Advanced AI</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform combines machine learning, adaptive algorithms, and AI tutoring 
              to create the most effective coding education experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="learning-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How CodeMentor AI Works</h2>
            <p className="text-xl text-muted-foreground">
              A comprehensive learning system designed around your success
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Onboarding & Skill Graph",
                  description: "Tell us your goals and take a diagnostic assessment. We create a personalized skill graph mapping your journey.",
                  icon: Target
                },
                {
                  step: "02", 
                  title: "Adaptive Learning Loop",
                  description: "Our ML models continuously adjust lesson difficulty using Knowledge Tracing and IRT algorithms.",
                  icon: Brain
                },
                {
                  step: "03",
                  title: "AI Tutor Support", 
                  description: "Get instant help, hints, and explanations from our LLM-powered tutor available 24/7.",
                  icon: Users
                },
                {
                  step: "04",
                  title: "Portfolio & Certification",
                  description: "Build a professional portfolio with GitHub-ready projects and earn verifiable certificates.",
                  icon: Trophy
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-8 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <item.icon className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-lg">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Coding Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of learners who are mastering programming with AI-powered personalized education.
            </p>
            
            <div className="flex items-center justify-center gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-accent text-accent" />
              ))}
              <span className="ml-2 text-muted-foreground">Rated 4.9/5 by 10,000+ students</span>
            </div>

            <Button 
              size="lg" 
              className="btn-hero text-xl px-12 py-6"
              onClick={() => currentUser ? setCurrentView('dashboard') : setCurrentView('onboarding')}
            >
              {currentUser ? 'Go to Dashboard' : 'Start Your Free Trial'}
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                <Brain className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">CodeMentor AI</span>
            </div>
            <p className="text-muted-foreground">&copy; 2024 CodeMentor AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;