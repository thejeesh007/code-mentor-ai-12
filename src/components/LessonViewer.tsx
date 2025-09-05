import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  CheckCircle, 
  MessageCircle, 
  Code, 
  Lightbulb,
  Target,
  Clock,
  BookOpen,
  Terminal
} from 'lucide-react';

interface LessonViewerProps {
  lesson: any;
  onBack: () => void;
  onComplete: () => void;
}

export const LessonViewer = ({ lesson, onBack, onComplete }: LessonViewerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Mock lesson content
  const lessonContent = {
    title: "Python Lists and Indexing",
    description: "Learn how to create, access, and manipulate lists in Python",
    difficulty: "Beginner",
    estimatedTime: "25 minutes",
    steps: [
      {
        id: 1,
        type: "theory",
        title: "Introduction to Lists",
        content: `
Lists are one of the most important data structures in Python. They allow you to store multiple items in a single variable and are ordered, changeable, and allow duplicate values.

## Creating Lists

You can create a list by placing items inside square brackets [], separated by commas:

\`\`\`python
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]
mixed = ["hello", 42, True, 3.14]
\`\`\`

## Key Properties of Lists

- **Ordered**: Lists maintain the order of items
- **Changeable**: You can modify lists after creation  
- **Allow Duplicates**: The same value can appear multiple times
        `,
        interactive: false
      },
      {
        id: 2,
        type: "practice",
        title: "Create Your First List",
        content: `
Now let's practice creating lists. Your task is to create a list called \`my_list\` containing the numbers 1, 2, and 3.

**Instructions:**
1. Create a variable named \`my_list\`
2. Assign it a list containing the numbers 1, 2, and 3
3. Print the list using \`print(my_list)\`
        `,
        starterCode: "# Create your list here\n",
        expectedOutput: "[1, 2, 3]",
        hint: "Remember to use square brackets [] and separate items with commas",
        solution: "my_list = [1, 2, 3]\nprint(my_list)",
        interactive: true
      },
      {
        id: 3,
        type: "theory",
        title: "List Indexing",
        content: `
## Accessing List Items

You can access individual items in a list using **indexing**. Python uses zero-based indexing, meaning the first item is at index 0.

\`\`\`python
fruits = ["apple", "banana", "orange"]

print(fruits[0])   # Output: "apple"
print(fruits[1])   # Output: "banana"  
print(fruits[2])   # Output: "orange"
\`\`\`

## Negative Indexing

Python also supports negative indexing, where -1 refers to the last item:

\`\`\`python
print(fruits[-1])  # Output: "orange"
print(fruits[-2])  # Output: "banana"
\`\`\`
        `,
        interactive: false
      },
      {
        id: 4,
        type: "practice", 
        title: "Practice List Indexing",
        content: `
Given a list of colors, practice accessing different elements.

**Your task:**
1. Create a list called \`colors\` with: "red", "green", "blue", "yellow"
2. Print the first color (index 0)
3. Print the last color using negative indexing (-1)
4. Print the second color (index 1)
        `,
        starterCode: "# Create the colors list and practice indexing\n",
        expectedOutput: "red\nyellow\ngreen",
        hint: "Use colors[0], colors[-1], and colors[1] to access the elements",
        solution: "colors = ['red', 'green', 'blue', 'yellow']\nprint(colors[0])\nprint(colors[-1])\nprint(colors[1])",
        interactive: true
      }
    ]
  };

  const currentStepData = lessonContent.steps[currentStep];
  const progress = ((currentStep + 1) / lessonContent.steps.length) * 100;

  const runCode = async () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      // Simple code execution simulation
      if (currentStepData.type === 'practice') {
        try {
          // This is a simplified simulation - in reality you'd send to a backend
          if (userCode.includes('my_list = [1, 2, 3]') && userCode.includes('print(my_list)')) {
            setOutput('[1, 2, 3]');
          } else if (userCode.includes('colors') && userCode.includes('print')) {
            setOutput('red\nyellow\ngreen');
          } else {
            setOutput('# Enter your code above and click Run');
          }
        } catch (error) {
          setOutput(`Error: ${error}`);
        }
      }
      setIsRunning(false);
    }, 1500);
  };

  const nextStep = () => {
    if (currentStep < lessonContent.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setUserCode(lessonContent.steps[currentStep + 1].starterCode || '');
      setOutput('');
      setShowHint(false);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setUserCode(lessonContent.steps[currentStep - 1].starterCode || '');
      setOutput('');
      setShowHint(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{lessonContent.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge variant="outline">{lessonContent.difficulty}</Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {lessonContent.estimatedTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    Step {currentStep + 1} of {lessonContent.steps.length}
                  </span>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {/* AI Tutor integration */}}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Ask AI Tutor
            </Button>
          </div>
          
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {currentStepData.type === 'theory' ? (
          // Theory Step
          <div className="max-w-4xl mx-auto">
            <Card className="learning-card">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <Badge variant="secondary">Theory</Badge>
                </div>
                <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-line text-foreground leading-relaxed">
                    {currentStepData.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button onClick={nextStep} className="btn-hero">
                {currentStep === lessonContent.steps.length - 1 ? 'Complete Lesson' : 'Next Step'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          // Practice Step
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Instructions */}
              <div className="space-y-4">
                <Card className="learning-card">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-5 w-5 text-secondary" />
                      <Badge variant="secondary">Practice</Badge>
                    </div>
                    <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line text-foreground leading-relaxed">
                      {currentStepData.content}
                    </div>
                  </CardContent>
                </Card>

                {/* Hint Card */}
                <Card className="learning-card">
                  <CardHeader>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowHint(!showHint)}
                      className="w-fit"
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </Button>
                  </CardHeader>
                  {showHint && (
                    <CardContent>
                      <p className="text-muted-foreground italic">
                        💡 {currentStepData.hint}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </div>

              {/* Code Editor */}
              <div className="space-y-4">
                <Card className="learning-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Terminal className="h-5 w-5" />
                        Code Editor
                      </CardTitle>
                      <Button 
                        onClick={runCode}
                        disabled={isRunning}
                        className="btn-hero"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {isRunning ? 'Running...' : 'Run Code'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      placeholder="Write your Python code here..."
                      className="font-mono text-sm min-h-[200px] resize-none"
                    />
                  </CardContent>
                </Card>

                {/* Output */}
                <Card className="learning-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="code-editor min-h-[100px] bg-muted/30">
                      <pre className="text-sm">
                        {output || '# Click "Run Code" to see the output'}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Expected Output */}
                {currentStepData.expectedOutput && (
                  <Card className="learning-card border-success/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-4 w-4 text-success" />
                        Expected Output
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="code-editor bg-success/5 border-success/20">
                        <pre className="text-sm text-success">
                          {currentStepData.expectedOutput}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <Separator className="my-8" />

            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-3">
                {output === currentStepData.expectedOutput && (
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Correct! Well done!</span>
                  </div>
                )}
                
                <Button 
                  onClick={nextStep} 
                  className="btn-hero"
                  disabled={currentStepData.expectedOutput && output !== currentStepData.expectedOutput}
                >
                  {currentStep === lessonContent.steps.length - 1 ? 'Complete Lesson' : 'Next Step'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};