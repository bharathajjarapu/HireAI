"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import {
  Brain,
  Users,
  Mail,
  TrendingUp,
  Search,
  Plus,
  Sparkles,
  Target,
  ArrowRight,
  BarChart3,
  UserCheck,
  FileText,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Clock,
  Globe,
  Award,
  MessageSquare,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  Play,
  Download,
  Building,
  Briefcase
} from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description: "Advanced algorithms find the perfect candidates based on skills, experience, and cultural fit.",
    color: "text-blue-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Reduce hiring time from weeks to days with automated screening and outreach.",
    color: "text-yellow-500"
  },
  {
    icon: Target,
    title: "Precision Targeting",
    description: "Find candidates with exact skill sets and experience levels you need.",
    color: "text-green-500"
  },
  {
    icon: Shield,
    title: "Realtime Resume Scoring",
    description: "Get realtime scores for each candidate based on your job description.",
    color: "text-purple-500"
  },
  {
    icon: BarChart3,
    title: "Gets Realtime Updates",
    description: "Get realtime updates on your hiring pipeline and candidate engagement.",
    color: "text-orange-500"
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Access candidates from 150+ countries with local compliance support.",
    color: "text-cyan-500"
  }
]

const steps = [
  {
    step: "01",
    title: "Define Your Role",
    description: "Create detailed job descriptions with our AI assistant that understands your requirements.",
    icon: FileText
  },
  {
    step: "02", 
    title: "AI Finds Candidates",
    description: "Our AI scours databases, social platforms, and networks to find perfect matches.",
    icon: Search
  },
  {
    step: "03",
    title: "Automated Outreach",
    description: "Personalized emails sent automatically to engage candidates at the right time.",
    icon: Mail
  },
  {
    step: "04",
    title: "Smart Screening",
    description: "AI conducts initial screening and ranks candidates based on your criteria.",
    icon: UserCheck
  }
]

const faqs = [
  {
    question: "How does the AI candidate matching work?",
    answer: "Our AI analyzes job requirements, candidate profiles, skills, experience, and past hiring patterns to score and rank candidates. It continuously learns from successful hires to improve matching accuracy."
  },
  {
    question: "What sources does HireAI search for candidates?",
    answer: "We search across professional networks, job boards, github profiles, open source contributions, and more."
  },
  {
    question: "How long does it take to see results?",
    answer: "Most clients see qualified candidates within 24-48 hours of posting a job. Our AI works 24/7 to continuously find and rank new candidates as they become available."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we ensure that all data is encrypted in transit and at rest. We never share your data with competitors or third parties."
  },
  {
    question: "Can I integrate HireAI with my existing ATS?",
    answer: "No, we don't offer integrations with any ATS platforms currently. We are working on it though."
  },
  {
    question: "What if I'm not satisfied with the results?",
    answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied, we'll refund your subscription and help you transition to another solution."
  }
]

// Updated with real-world benchmarks (LinkedIn & SHRM research)
const stats = [
  { label: "Avg. sourcing hours / week", value: "13h", icon: Clock },
  { label: "CVs screened per hire", value: "160+", icon: FileText },
  { label: "Cost of a bad hire", value: "₹8.4 L", icon: Award },
  { label: "Time can be saved with HireAI", value: "60%", icon: Zap },
]

// Testimonials displayed on the landing page
const testimonials = [
  {
    name: "Adithya Penagonda",
    title: "CEO of Laminin Digital",
    quote: "The potential is massive. If HireAI delivers on what it promises, it'll replace at least three tools we're using right now.",
    image: "/Adithya.png",
  },
  {
    name: "Vedika Manek",
    title: "Founder of UniVoyage",
    quote: "I got early access to HireAI's platform, and it already feels like having a co-founder focused only on hiring.",
    image: "/Vedika.png",
  },
  {
    name: "Srujan Panuganti",
    title: "CEO of Xairo Robotics",
    quote: "Even in the early demo phase, HireAI gave us a glimpse of what recruitment could be and we're excited to see how it evolves.",
    image: "/Srujan.png",
  },
]

// Dashboard data for logged-in users
const dashboardStats = [
  { label: "Active Jobs", value: "2", icon: Target, color: "text-blue-500" },
  { label: "Candidates Found", value: "124", icon: Users, color: "text-green-500" },
  { label: "Emails Sent", value: "82", icon: Mail, color: "text-purple-500" },
  { label: "Success Rate", value: "8%", icon: TrendingUp, color: "text-orange-500" },
]

const recentJobs = [
  { title: "AI Developer", candidates: 5, status: "Active", progress: 75 },
  { title: "Data Engineer", candidates: 3, status: "Screening", progress: 60 },
  { title: "Full Stack Developer", candidates: 8, status: "Outreach", progress: 40 },
  { title: "AI/ML Engineer", candidates: 7, status: "Active", progress: 85 },
]

// Pricing tiers (based on number of conversions)
const pricingTiers = [
  {
    name: "Starter",
    conversions: "Up to 100 hires / year",
    price: "₹2,000 /mo",
    popular: false,
  },
  {
    name: "Growth",
    conversions: "Up to 1000 hires / year",
    price: "₹10,000 /mo",
    popular: true,
  },
  {
    name: "Scale",
    conversions: "Unlimited hires",
    price: "Contact Us",
    popular: false,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
}

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const { isSignedIn, user } = useUser()

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  HireAI
                </h1>
                <p className="text-sm text-gray-500">AI-Powered Hiring Platform</p>
              </div>
            </div>

            {!isSignedIn && (
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
                <a href="#transformation" className="text-gray-600 hover:text-blue-600 transition-colors">Transformation</a>
                <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQ</a>
              </nav>
            )}

            <div className="flex items-center space-x-4">
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="text-gray-600">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Get Started
                    </Button>
                  </SignUpButton>
                </>
              ) : (
                <>
                  <Link href="/create-job">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      New Job
                    </Button>
                  </Link>
                  <Link href="/search">
                    <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                      <Search className="w-4 h-4 mr-2" />
                      Search Candidates
                    </Button>
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {!isSignedIn ? (
        // Landing page content for non-authenticated users
        <>
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-6 py-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Badge variant="outline" className="mb-6 border-blue-200 text-blue-600">
                    ⚡️ Automate your candidate search
                  </Badge>
                  
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      Hire Top Talent
                    </span>
                    <br />
                    <span className="text-gray-900">10x Faster</span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Transform your hiring process with AI that finds, screens, and engages the perfect candidates automatically. 
                    Reduce time-to-hire from weeks to days.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <SignUpButton mode="modal">
                      <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                        Get Started
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </SignUpButton>
                    <Link href="https://www.loom.com/share/80020e7646ed4f3c8683702d91393a23?sid=94545186-fc83-4d6e-b8ed-1aad6335c07a" target="_blank" rel="noopener noreferrer">
                      <Button size="lg" variant="outline" className="border-gray-300 px-8 py-4 text-lg">
                        <Play className="w-5 h-5 mr-2" />
                        Watch Demo
                      </Button>
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <div className="mb-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Senior Frontend Developer</h3>
                      <p className="text-gray-600">React, TypeScript, 5+ years exp</p>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { name: "Alice Johnson", score: 98, status: "Perfect Match" },
                        { name: "David Chen", score: 94, status: "Excellent" },
                        { name: "Sarah Kim", score: 91, status: "Great Fit" }
                      ].map((candidate, index) => (
                        <motion.div
                          key={candidate.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {candidate.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{candidate.name}</p>
                              <p className="text-sm text-gray-500">{candidate.status}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{candidate.score}%</p>
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-green-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${candidate.score}%` }}
                                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Floating elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Match Found!</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Background decorations */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-xl"></div>
          </section>

          {/* Problem Section */}
          <section id="problem" className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center max-w-3xl mx-auto"
              >
                <Badge variant="outline" className="mb-4 border-blue-200 text-blue-600">Problem</Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Recruiters spend too much time sourcing</h2>
                <p className="text-xl text-gray-600">On average, talent teams waste <span className="font-semibold text-blue-600">13 hours every week</span> manually searching LinkedIn, job boards and inboxes. That is time that could be spent engaging great candidates instead.</p>
              </motion.div>
            </div>
          </section>

          {/* Social Proof Section */}
          <section id="social-proof" className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <Badge variant="outline" className="mb-4 border-blue-200 text-blue-600">
                  Social Proof
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Hiring is broken — the numbers prove it
                </h2>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    className="text-center"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <stat.icon className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                    <p className="text-gray-600">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <Badge variant="outline" className="mb-4 border-blue-200 text-blue-600">
                  Features
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Everything You Need to
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Hire Smarter</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our AI-powered platform combines the best of human intelligence and machine learning to transform your hiring process.
                </p>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    onHoverStart={() => setHoveredCard(index)}
                    onHoverEnd={() => setHoveredCard(null)}
                  >
                    <Card className="relative overflow-hidden border-0 shadow-lg bg-white h-full">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"
                        initial={{ x: "-100%" }}
                        animate={{ x: hoveredCard === index ? "0%" : "-100%" }}
                        transition={{ duration: 0.3 }}
                      />
                      <CardContent className="p-8">
                        <motion.div 
                          animate={{ rotate: hoveredCard === index ? 360 : 0 }} 
                          transition={{ duration: 0.5 }}
                          className={`w-16 h-16 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mb-6`}
                        >
                          <feature.icon className={`w-8 h-8 ${feature.color}`} />
                        </motion.div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-20 bg-white">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <Badge variant="outline" className="mb-4 border-blue-200 text-blue-600">
                  Pricing
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Simple pricing based on conversions
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Only pay for the hires you make. No hidden fees, no long-term contracts.
                </p>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {pricingTiers.map((tier, idx) => (
                  <motion.div
                    key={tier.name}
                    variants={itemVariants}
                    className={`relative rounded-3xl p-10 shadow-lg bg-white flex flex-col transition transform hover:-translate-y-2 ${tier.popular ? 'ring-2 ring-offset-2 ring-blue-500' : 'border border-gray-200'}`}
                  >
                    {tier.popular && <span className="inline-block mb-4 px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">Most Popular</span>}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <p className="text-gray-600 mb-6">{tier.conversions}</p>
                    <p className="text-3xl font-extrabold text-gray-900 mb-6">{tier.price}</p>
                    <Button className="mt-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white w-full">Start {tier.name}</Button>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <Badge variant="outline" className="mb-4 border-blue-200 text-blue-600">
                  Testimonials
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  What leaders are saying
                </h2>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {testimonials.map((t, idx) => (
                  <motion.div key={idx} variants={itemVariants} className="bg-indigo-100 rounded-2xl p-8 text-center shadow-lg">
                    <div className="flex justify-center -mt-16 mb-6">
                      <img src={t.image} alt={t.name} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md" />
                    </div>
                    <p className="italic text-gray-700 mb-6">“{t.quote}”</p>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-600">{t.title}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Transformation Section */}
          <section id="transformation" className="py-20 bg-white">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <Badge variant="outline" className="mb-4 border-blue-200 text-blue-600">
                  Transformation
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  From Manual Sourcing to 
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Automated Success</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our streamlined process makes hiring effortless. Just describe your ideal candidate and let our AI do the rest.
                </p>
              </motion.div>

              <div className="max-w-6xl mx-auto">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
                >
                  {/* Connection line for desktop */}
                  <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 mx-12"></div>
                  
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.step}
                      variants={itemVariants}
                      className="relative text-center group"
                    >
                      <div className="relative mb-6">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto relative z-10 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                        >
                          <step.icon className="w-10 h-10 text-white" />
                        </motion.div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 z-20 shadow-md">
                          {step.step}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* Final Call To Action */}
          <section id="cta" className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="container mx-auto px-6 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                Ready to hire smarter?
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xl mb-8 max-w-2xl mx-auto">
                Join the companies already using HireAI to cut sourcing time and build winning teams.
              </motion.p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <SignUpButton mode="modal">
                  <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50">Get Started</Button>
                </SignUpButton>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <Badge variant="outline" className="mb-4 border-blue-200 text-blue-600">
                  FAQ
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Frequently Asked 
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Questions</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Get answers to common questions about HireAI and how it can transform your hiring process.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
              >
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-6 bg-white">
                      <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </div>
          </section>
        </>
      ) : (
        // Dashboard content for authenticated users
        <div className="container mx-auto px-6 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-4 pb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
            >
              Welcome back, {user?.firstName || 'User'}!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Your AI-powered hiring dashboard is ready. Manage your jobs, find candidates, and track your hiring success.
            </motion.p>
          </motion.div>

          {/* Dashboard Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {dashboardStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card className="relative overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                    initial={{ x: "-100%" }}
                    animate={{ x: hoveredCard === index ? "0%" : "-100%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <motion.p
                          className="text-3xl font-bold text-gray-900"
                          animate={{ scale: hoveredCard === index ? 1.1 : 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {stat.value}
                        </motion.p>
                      </div>
                      <motion.div animate={{ rotate: hoveredCard === index ? 360 : 0 }} transition={{ duration: 0.5 }}>
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <Link href="/create-job" className="block h-full">
              <motion.div whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }} className="h-full">
                <Card className="cursor-pointer border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <Plus className="w-8 h-8" />
                      <ArrowRight className="w-5 h-5 opacity-70" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Create New Job</h3>
                    <p className="text-blue-100">Start your AI-powered candidate search</p>
                  </CardContent>
                  <motion.div
                    className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                </Card>
              </motion.div>
            </Link>

            <Link href="/search" className="block h-full">
              <motion.div whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }} className="h-full">
                <Card className="cursor-pointer border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <Search className="w-8 h-8" />
                      <ArrowRight className="w-5 h-5 opacity-70" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Search Candidates</h3>
                    <p className="text-purple-100">Find perfect matches with AI</p>
                  </CardContent>
                  <motion.div
                    className="absolute -top-2 -left-2 w-16 h-16 bg-white/10 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                </Card>
              </motion.div>
            </Link>

            <Link href="/resume-parser" className="block h-full">
              <motion.div whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }} className="h-full">
                <Card className="cursor-pointer border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <FileText className="w-8 h-8" />
                      <ArrowRight className="w-5 h-5 opacity-70" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Parse Resumes</h3>
                    <p className="text-green-100">Extract insights from resumes</p>
                  </CardContent>
                  <motion.div
                    className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/10 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                </Card>
              </motion.div>
            </Link>

            <Link href="/analytics" className="block h-full">
              <motion.div whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }} className="h-full">
                <Card className="cursor-pointer border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <BarChart3 className="w-8 h-8" />
                      <ArrowRight className="w-5 h-5 opacity-70" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Analytics</h3>
                    <p className="text-orange-100">Track hiring performance</p>
                  </CardContent>
                  <motion.div
                    className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                </Card>
              </motion.div>
            </Link>
          </motion.div>

          {/* Recent Jobs */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Recent Jobs</CardTitle>
                    <CardDescription>Track your active hiring campaigns</CardDescription>
                  </div>
                  <Link href="/jobs">
                    <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                      View All
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentJobs.map((job, index) => (
                    <motion.div
                      key={job.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.01, x: 5 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center"
                        >
                          <UserCheck className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{job.title}</h4>
                          <p className="text-sm text-gray-500">{job.candidates} candidates found</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge
                            variant={job.status === "Active" ? "default" : "secondary"}
                            className={job.status === "Active" ? "bg-green-100 text-green-800" : ""}
                          >
                            {job.status}
                          </Badge>
                          <div className="flex items-center space-x-2 mt-2">
                            <Progress value={job.progress} className="w-20" />
                            <span className="text-sm text-gray-500">{job.progress}%</span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Footer - only show for non-authenticated users */}
      {!isSignedIn && (
        <footer className="bg-gray-900 text-gray-300 py-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              {/* Brand */}
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">HireAI</h3>
                </div>
              </div>

              {/* LinkedIn and Copyright */}
              <div className="flex items-center space-x-6">
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800 p-2">
                  <Linkedin className="w-5 h-5" />
                </Button>
                <p className="text-gray-400 text-sm">
                  © 2024 HireAI. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
