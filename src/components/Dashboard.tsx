import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Brain, 
  Code, 
  Trophy, 
  Target, 
  Clock, 
  Play, 
  MessageCircle,
  BookOpen,
  Zap,
  Star,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { LessonViewer } from './LessonViewer';
import { AITutorChat } from './AITutorChat';

interface DashboardProps {
  userProfile: any;
  currentUser: any;
  onBack: () => void;
  onSignOut: () => void;
}

export const Dashboard = ({ userProfile, currentUser, onBack, onSignOut }: DashboardProps) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'lesson' | 'chat'>('dashboard');
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Load user progress from localStorage
  const getUserProgress = () => {
    const savedProgress = localStorage.getItem(`progress_${currentUser?.id || 'default'}`);
    return savedProgress ? JSON.parse(savedProgress) : {
      level: 1,
      xp: 0,
      xpToNext: 1000,
      streak: 0,
      completedLessons: 0,
      certificates: 0,
      currentSkills: []
    };
  };

  const [userData, setUserData] = useState(() => ({
    name: currentUser?.name || "Learner",
    avatar: currentUser?.avatar || "",
    ...getUserProgress()
  }));

  const updateProgress = (newProgress: any) => {
    const updatedData = { ...userData, ...newProgress };
    setUserData(updatedData);
    localStorage.setItem(`progress_${currentUser?.id || 'default'}`, JSON.stringify(updatedData));
  };

  const learningPath = [
    {
      id: 1,
      title: "Python Fundamentals",
      description: "Master the basics of Python programming",
      progress: 75,
      lessons: 8,
      completedLessons: 6,
      status: 'in-progress',
      difficulty: 'Beginner',
      estimatedTime: '2 weeks',
      skills: ['Variables', 'Data Types', 'Control Flow']
    },
    {
      id: 2,
      title: "Data Structures",
      description: "Learn about lists, dictionaries, and more",
      progress: 30,
      lessons: 10,
      completedLessons: 3,
      status: 'in-progress',
      difficulty: 'Intermediate',
      estimatedTime: '3 weeks',
      skills: ['Lists', 'Dictionaries', 'Sets']
    },
    {
      id: 3,
      title: "Object-Oriented Programming",
      description: "Master classes, objects, and inheritance",
      progress: 0,
      lessons: 12,
      completedLessons: 0,
      status: 'locked',
      difficulty: 'Intermediate',
      estimatedTime: '4 weeks',
      skills: ['Classes', 'Inheritance', 'Polymorphism']
    },
    {
      id: 4,
      title: "Web Development with Python",
      description: "Build web applications using Flask",
      progress: 0,
      lessons: 15,
      completedLessons: 0,
      status: 'locked',
      difficulty: 'Advanced',
      estimatedTime: '6 weeks',
      skills: ['Flask', 'HTML/CSS', 'Databases']
    }
  ];

  const recentLessons = [
    {
      id: 1,
      title: "Python Variables and Data Types",
      type: "Interactive Lesson",
      duration: "25 min",
      status: "completed",
      score: 95
    },
    {
      id: 2,
      title: "Working with Lists",
      type: "Coding Exercise", 
      duration: "30 min",
      status: "in-progress",
      score: null
    },
    {
      id: 3,
      title: "Functions and Parameters",
      type: "Project",
      duration: "45 min",
      status: "upcoming",
      score: null
    }
  ];

  const achievements = [
    { id: 1, title: "First Steps", description: "Completed first lesson", icon: Trophy, unlocked: true },
    { id: 2, title: "Week Warrior", description: "7 day streak", icon: Zap, unlocked: true },
    { id: 3, title: "Code Master", description: "Scored 90%+ on 5 lessons", icon: Star, unlocked: true },
    { id: 4, title: "Problem Solver", description: "Solved 25 coding challenges", icon: Target, unlocked: false }
  ];

  if (currentView === 'lesson') {
    return (
      <LessonViewer
        lesson={selectedLesson}
        onBack={() => setCurrentView('dashboard')}
        onComplete={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'chat') {
    return (
      <AITutorChat
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Landing
            </Button>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                <Brain className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">CodeMentor AI</span>
            </div>
          </div>

            <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentView('chat')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              AI Tutor
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onSignOut}
            >
              Sign Out
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium">{userData.name}</div>
                <div className="text-xs text-muted-foreground">Level {userData.level}</div>
              </div>
              <Avatar>
                <AvatarImage src={userData.avatar} />
                <AvatarFallback>{userData.name?.charAt(0) || 'L'}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Progress & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Level Progress */}
            <Card className="learning-card">
              <CardHeader className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-2">
                  {userData.level}
                </div>
                <CardTitle>Level {userData.level}</CardTitle>
                <CardDescription>Python Learner</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>XP Progress</span>
                    <span>{userData.xp}/{userData.xpToNext}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(userData.xp / userData.xpToNext) * 100}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="xp-badge">
                      <Zap className="h-3 w-3 mr-1" />
                      {userData.xpToNext - userData.xp} XP to next level
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="learning-card">
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span className="text-sm">Streak</span>
                  </div>
                  <Badge variant="secondary">{userData.streak} days</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm">Lessons</span>
                  </div>
                  <Badge variant="secondary">{userData.completedLessons} completed</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-success" />
                    <span className="text-sm">Certificates</span>
                  </div>
                  <Badge variant="secondary">{userData.certificates} earned</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Current Skills */}
            <Card className="learning-card">
              <CardHeader>
                <CardTitle className="text-lg">Skills Mastered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userData.currentSkills.map((skill, index) => (
                    <span key={index} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="path" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="path">Learning Path</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="path" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Your Personalized Learning Path</h2>
                  <Badge variant="outline" className="text-sm">
                    <Target className="h-4 w-4 mr-1" />
                    {userProfile?.goal?.replace('-', ' ').toUpperCase()} Track
                  </Badge>
                </div>

                <div className="space-y-4">
                  {learningPath.map((module, index) => (
                    <Card 
                      key={module.id} 
                      className={`${
                        module.status === 'locked' ? 'opacity-60' : 'learning-card cursor-pointer hover:scale-[1.02]'
                      } transition-all duration-200`}
                      onClick={() => {
                        if (module.status !== 'locked') {
                          setSelectedLesson(module);
                          setCurrentView('lesson');
                        }
                      }}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="text-2xl font-bold text-muted-foreground">
                                {index + 1}
                              </div>
                              <div>
                                <CardTitle className="flex items-center gap-2">
                                  {module.title}
                                  {module.status === 'locked' && <Lock className="h-4 w-4" />}
                                  {module.status === 'completed' && <CheckCircle className="h-4 w-4 text-success" />}
                                </CardTitle>
                                <CardDescription>{module.description}</CardDescription>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{module.difficulty}</span>
                              <span>•</span>
                              <span>{module.lessons} lessons</span>
                              <span>•</span>
                              <span>{module.estimatedTime}</span>
                            </div>
                          </div>
                          
                          {module.status !== 'locked' && (
                            <Button size="sm" className="btn-hero">
                              <Play className="h-4 w-4 mr-1" />
                              {module.status === 'completed' ? 'Review' : 'Continue'}
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      
                      {module.status !== 'locked' && (
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{module.completedLessons}/{module.lessons} lessons</span>
                            </div>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${module.progress}%` }}
                              />
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {module.skills.map((skill, skillIndex) => (
                                <span key={skillIndex} className="skill-badge text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recent" className="space-y-6">
                <h2 className="text-2xl font-bold">Recent Activity</h2>
                
                <div className="space-y-4">
                  {recentLessons.map((lesson) => (
                    <Card key={lesson.id} className="learning-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{lesson.title}</CardTitle>
                            <CardDescription>
                              {lesson.type} • {lesson.duration}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.status === 'completed' && (
                              <Badge variant="secondary" className="text-success">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {lesson.score}%
                              </Badge>
                            )}
                            <Button 
                              size="sm" 
                              variant={lesson.status === 'upcoming' ? 'outline' : 'default'}
                              disabled={lesson.status === 'upcoming'}
                            >
                              {lesson.status === 'completed' ? 'Review' : 
                               lesson.status === 'in-progress' ? 'Continue' : 'Locked'}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <h2 className="text-2xl font-bold">Achievements</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <Card 
                      key={achievement.id} 
                      className={`${
                        achievement.unlocked ? 'learning-card-active' : 'learning-card opacity-60'
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            achievement.unlocked ? 'bg-gradient-success text-success-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            <achievement.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{achievement.title}</CardTitle>
                            <CardDescription>{achievement.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <h2 className="text-2xl font-bold">Learning Analytics</h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="learning-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Weekly Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">+25%</div>
                      <p className="text-sm text-muted-foreground">Compared to last week</p>
                    </CardContent>
                  </Card>

                  <Card className="learning-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-secondary" />
                        Study Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-secondary">8.5h</div>
                      <p className="text-sm text-muted-foreground">This week</p>
                    </CardContent>
                  </Card>

                  <Card className="learning-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-accent" />
                        Accuracy Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-accent">87%</div>
                      <p className="text-sm text-muted-foreground">Average score</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};