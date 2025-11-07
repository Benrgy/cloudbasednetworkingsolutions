import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { HelpCircle, CheckCircle, ArrowRight, Lightbulb } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    description: string;
  }[];
}

const questions: Question[] = [
  {
    id: "purpose",
    question: "What's your primary goal?",
    options: [
      {
        value: "new-network",
        label: "Planning a new cloud network",
        description: "Starting from scratch with a new infrastructure"
      },
      {
        value: "optimize",
        label: "Optimizing existing network",
        description: "Improving current network performance or costs"
      },
      {
        value: "troubleshoot",
        label: "Troubleshooting network issues",
        description: "Diagnosing and fixing network problems"
      },
      {
        value: "compare",
        label: "Comparing cloud providers",
        description: "Evaluating AWS, Azure, or GCP options"
      }
    ]
  },
  {
    id: "scale",
    question: "What's your infrastructure scale?",
    options: [
      {
        value: "small",
        label: "Small (< 50 hosts)",
        description: "Startup or small project"
      },
      {
        value: "medium",
        label: "Medium (50-500 hosts)",
        description: "Growing business or department"
      },
      {
        value: "large",
        label: "Large (500+ hosts)",
        description: "Enterprise-scale infrastructure"
      }
    ]
  },
  {
    id: "priority",
    question: "What's most important to you?",
    options: [
      {
        value: "cost",
        label: "Cost Optimization",
        description: "Minimize networking expenses"
      },
      {
        value: "security",
        label: "Security & Compliance",
        description: "Maximum security and regulatory compliance"
      },
      {
        value: "performance",
        label: "Performance",
        description: "Lowest latency and highest throughput"
      },
      {
        value: "simplicity",
        label: "Simplicity",
        description: "Easy to manage and maintain"
      }
    ]
  }
];

interface Recommendation {
  tool: string;
  title: string;
  description: string;
  steps: string[];
  estimatedTime: string;
}

const getRecommendation = (answers: Record<string, string>): Recommendation => {
  const { purpose, scale, priority } = answers;
  
  // Logic to determine best tool and approach
  if (purpose === "new-network") {
    return {
      tool: "Subnet Calculator",
      title: "Start with Subnet Planning",
      description: "For new networks, proper subnet design is crucial. Our calculator will help you allocate IP addresses efficiently.",
      steps: [
        "Determine total number of hosts needed",
        "Calculate required subnet size using CIDR notation",
        "Plan for future growth (add 30-50% capacity)",
        "Design separate subnets for different tiers (web, app, database)",
        "Review security recommendations for each subnet"
      ],
      estimatedTime: "15-30 minutes"
    };
  } else if (purpose === "compare") {
    return {
      tool: "Cost Estimation",
      title: "Compare Cloud Provider Costs",
      description: "Get detailed cost breakdowns across AWS, Azure, and GCP to make informed decisions.",
      steps: [
        "Input your expected data transfer volumes",
        "Specify number of instances and regions",
        "Compare pricing across all three providers",
        "Review recommendations for cost optimization",
        "Consider reserved capacity discounts"
      ],
      estimatedTime: "10-20 minutes"
    };
  } else if (priority === "security") {
    return {
      tool: "Security-Focused Subnet Calculator",
      title: "Design Secure Network Architecture",
      description: "Create network segments with built-in security best practices and compliance recommendations.",
      steps: [
        "Define security zones (DMZ, private, restricted)",
        "Calculate subnet sizes for each zone",
        "Review security scoring for your design",
        "Implement recommended access controls",
        "Plan for compliance requirements (HIPAA, PCI-DSS, SOC 2)"
      ],
      estimatedTime: "20-40 minutes"
    };
  } else if (purpose === "optimize" && priority === "cost") {
    return {
      tool: "Cost Estimation & IP Allocation",
      title: "Optimize for Cost Efficiency",
      description: "Analyze your current network and identify cost-saving opportunities.",
      steps: [
        "Calculate current IP utilization",
        "Identify over-provisioned subnets",
        "Consolidate underutilized network segments",
        "Compare costs across regions",
        "Implement recommended optimizations"
      ],
      estimatedTime: "25-45 minutes"
    };
  }
  
  // Default recommendation
  return {
    tool: "Advanced Network Calculator",
    title: "Comprehensive Network Planning",
    description: "Use our full suite of tools to plan, optimize, and secure your cloud network.",
    steps: [
      "Start with subnet calculation for proper segmentation",
      "Plan IP allocation across your infrastructure",
      "Estimate costs for your cloud provider",
      "Review security recommendations",
      "Save and share results with your team"
    ],
    estimatedTime: "30-60 minutes"
  };
};

export const DecisionHelper = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const rec = getRecommendation(answers);
      setRecommendation(rec);
      setShowRecommendation(true);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setShowRecommendation(false);
    setRecommendation(null);
  };

  const currentQuestion = questions[step];
  const isAnswered = answers[currentQuestion?.id];

  if (showRecommendation && recommendation) {
    return (
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Your Personalized Recommendation</CardTitle>
          </div>
          <CardDescription className="text-base">
            Based on your answers, here's the best approach for your needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/5 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="text-sm px-3 py-1">Recommended Tool</Badge>
              <span className="text-lg font-semibold">{recommendation.tool}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{recommendation.title}</h3>
            <p className="text-muted-foreground">{recommendation.description}</p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Step-by-Step Action Plan
            </h4>
            <ol className="space-y-3">
              {recommendation.steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Estimated time: <span className="font-semibold">{recommendation.estimatedTime}</span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleReset}>
                Start Over
              </Button>
              <Button onClick={() => {
                const calculatorElement = document.getElementById('calculator');
                if (calculatorElement) {
                  calculatorElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                Start Calculating
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Not Sure Where to Start?</CardTitle>
        </div>
        <CardDescription className="text-base">
          Answer a few quick questions and we'll recommend the best tool for your needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 mb-4">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-all ${
                index <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {currentQuestion.question}
            </h3>
            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
            >
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                      answers[currentQuestion.id] === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-muted'
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label
                      htmlFor={option.value}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-semibold mb-1">{option.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext} disabled={!isAnswered}>
              {step === questions.length - 1 ? 'Get Recommendation' : 'Next'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
