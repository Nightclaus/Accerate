"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { ArrowRight, ChevronRight, Code, Globe, Zap, Shield, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [activeFeature, setActiveFeature] = useState("speed")

  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const platformRef = useRef(null)
  const testimonialsRef = useRef(null)

  const isHeroInView = useInView(heroRef, { once: false, amount: 0.5 })
  const isFeaturesInView = useInView(featuresRef, { once: false, amount: 0.3 })
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.5 })
  const isPlatformInView = useInView(platformRef, { once: false, amount: 0.3 })
  const isTestimonialsInView = useInView(testimonialsRef, { once: false, amount: 0.3 })

  const { scrollYProgress } = useScroll()
  const smoothScrollYProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  const heroOpacity = useTransform(smoothScrollYProgress, [0, 0.2], [1, 0.3])
  const heroScale = useTransform(smoothScrollYProgress, [0, 0.2], [1, 0.95])

  const triangleRotate = useTransform(smoothScrollYProgress, [0, 1], [0, 360])
  const triangleScale = useTransform(smoothScrollYProgress, [0, 0.5, 1], [1, 1.2, 1])

  const gridOpacity = useTransform(smoothScrollYProgress, [0, 0.1, 0.2], [0.2, 0.15, 0.1])

  const [stats, setStats] = useState({ // {stats.speed.toLocaleString()}
    deployments: 0,
    speed: 0,
    uptime: 0,
  })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    if (isStatsInView) {
      const interval = setInterval(() => {
        setStats((prev) => {
          const newStats = { ...prev }
          if (newStats.deployments < 99) newStats.deployments += 1
          if (newStats.speed < 300) newStats.speed += 3
          if (newStats.uptime < 99.99) newStats.uptime += 0.1

          if (newStats.deployments >= 99 && newStats.speed >= 300 && newStats.uptime >= 99.99) {
            clearInterval(interval)
          }

          return newStats
        })
      }, 20)

      return () => clearInterval(interval)
    }
  }, [isStatsInView])

  const features = {
    speed: {
      title: "Rapid Prototyping",
      description:
        "At Scrapyard Sydney, participants transform ideas into tangible projects within 48 hours, embracing the 'scrappy' spirit of innovation.",
      icon: <Zap className="h-8 w-8 text-primary" />,
      stats: "48-hour project turnaround",
      image: "/scrapyard-sydney-rapid-prototyping.jpg",
    },
    scale: {
      title: "Global Collaboration",
      description:
        "Join a worldwide network of young innovators, with Scrapyard events held in over 100 cities, fostering a global exchange of ideas and solutions.",
      icon: <Globe className="h-8 w-8 text-primary" />,
      stats: "100+ cities worldwide",
      image: "/scrapyard-global-collaboration.jpg",
    },
    security: {
      title: "Empowering Future Innovators",
      description:
        "Scrapyard Sydney provides a platform for high school students to explore technology, with support from industry leaders like Yubico, ensuring a secure and enriching experience.",
      icon: <Shield className="h-8 w-8 text-primary" />,
      stats: "Supported by Yubico",
      image: "/scrapyard-empowering-innovators.jpg",
    },
    developer: {
      title: "Hands-On Learning",
      description:
        "Whether you're building hardware or software, Scrapyard Sydney offers workshops and mentorship to help you create impactful projects from scratch.",
      icon: <Code className="h-8 w-8 text-primary" />,
      stats: "Beginner-friendly workshops",
      image: "/scrapyard-hands-on-learning.jpg",
    },
  };

  const testimonials = [
    {
      name: "Dhyan Tanna",
      role: "Organizer, Scrapyard Sydney",
      quote:
        "Scrapyard Sydney is all about fostering creativity and collaboration among young minds. It's inspiring to see high schoolers come together to solve real-world problems.",
      image: "/dhyan-tanna.jpg",
      logo: "/scrapyard-logo.jpg",
    },
    {
      name: "Aisha Patel",
      role: "Participant, Scrapyard Sydney 2025",
      quote:
        "The hackathon was an incredible experience. I learned so much about hardware development and met amazing people who share my passion for technology.",
      image: "/aisha-patel.jpg",
      logo: "/scrapyard-logo.jpg",
    },
    {
      name: "Michael Rodriguez",
      role: "Mentor, Scrapyard Sydney 2025",
      quote:
        "Mentoring at Scrapyard Sydney was a rewarding experience. The enthusiasm and innovation of the participants were truly inspiring.",
      image: "/michael-rodriguez.jpg",
      logo: "/scrapyard-logo.jpg",
    },
  ];

  const calculateGradientPosition = () => {
    if (typeof window === "undefined") {
      return { x: 50, y: 50 } // Default position for SSR
    }
    const x = (mousePosition.x / window.innerWidth) * 100
    const y = (mousePosition.y / window.innerHeight) * 100
    return { x, y }
  }

  const { x: gradientX, y: gradientY } = calculateGradientPosition()

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-textColor">
      {/* Background Grid */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(79, 253, 210, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(79, 253, 210, 0.05) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          opacity: typeof window !== "undefined" ? gridOpacity : 0.2,
        }}
      />

      {/* Gradient Background */}
      <div
        className="fixed inset-0 z-0 opacity-20 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at ${gradientX}% ${gradientY}%, rgba(79, 253, 210, 0.3), rgba(85, 161, 254, 0.3), transparent 70%)`,
        }}
      />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-md border-b border-secondary/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 bg-primary rounded-sm transform rotate-45"></div>
              <div className="absolute inset-0.5 bg-background rounded-sm transform rotate-45"></div>
            </div>
            <span className="font-bold text-xl">Accelrt</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-textColor/70 hover:text-textColor transition-colors">
              Skills
            </Link>
            <Link href="#platform" className="text-textColor/70 hover:text-textColor transition-colors">
              Events
            </Link>
            <Link href="#testimonials" className="text-textColor/70 hover:text-textColor transition-colors">
              Experience
            </Link>
            <Link href="#pricing" className="text-textColor/70 hover:text-textColor transition-colors">
              Home
            </Link>
            <a
              href="https://docs.google.com/document/d/e/2PACX-1vT0Az-qRC0CQTj1-VgrA-IW8wecHqU_ofC9Mus_V1mHwsddm1FKzk4FJkWXeWxIwBzk2gX-oIAHi85Q/pub"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-background hover:bg-primary/90 border-0"
            >
            <Button className="bg-primary text-background hover:bg-primary/90 border-0">Sign Up</Button>
            </a>
          </nav>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/90 backdrop-blur-md border-b border-secondary/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link href="#features" className="text-textColor/70 hover:text-textColor transition-colors py-2">
                Skills
              </Link>
              <Link href="#platform" className="text-textColor/70 hover:text-textColor transition-colors py-2">
                Events
              </Link>
              <Link href="#testimonials" className="text-textColor/70 hover:text-textColor transition-colors py-2">
                Experience
              </Link>
              <Link href="#pricing" className="text-textColor/70 hover:text-textColor transition-colors py-2">
                Home
              </Link>
              <a
                href="https://docs.google.com/document/d/e/2PACX-1vT0Az-qRC0CQTj1-VgrA-IW8wecHqU_ofC9Mus_V1mHwsddm1FKzk4FJkWXeWxIwBzk2gX-oIAHi85Q/pub"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-background hover:bg-primary/90 border-0 w-full"
              >
              <Button className="bg-primary text-background hover:bg-primary/90 border-0 w-full">Sign Up</Button>
              </a>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-24 pb-16">
        <div className="container mx-auto px-4 z-10">
          <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block mb-4 px-4 py-1 rounded-full bg-secondary/10 backdrop-blur-sm border border-secondary/20"
            >
              <span className="text-sm font-medium">Introducing Accelrt Platform v2.0</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary"
            >
              Welcome to Accelrt Development is here
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-textColor/70 mb-8 max-w-2xl mx-auto"
            >
              We provide STEAM initiatives, You explore your potential
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <a
                href="https://docs.google.com/document/d/e/2PACX-1vT0Az-qRC0CQTj1-VgrA-IW8wecHqU_ofC9Mus_V1mHwsddm1FKzk4FJkWXeWxIwBzk2gX-oIAHi85Q/pub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background text-lg px-8 py-6 border-0"
              >
              <Button className="bg-primary text-background hover:bg-primary/90 text-lg px-8 py-6 border-0">
                Sign Up
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              </a>
              <a
                href="https://docs.google.com/document/d/e/2PACX-1vQ73w2nkn0c_fRw6D8APzHfaxkgziWoHO3GKK1rsb4v55Gn7cDS395VYwGEgzQJR0KMMWMG2jMmkBi8/pub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg px-8 py-6 border-secondary/20"
              >
              <Button variant="outline" className="text-lg px-8 py-6 border-secondary/20 hover:bg-secondary/10">
                FAQ
              </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero Visual Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 5 }}
        >
          <div className="relative w-[600px] h-[600px] max-w-full">
            {/* Animated Lines */}
            <div className="absolute inset-0 opacity-70">
              <svg width="100%" height="100%" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g className="animate-pulse">
                  {[...Array(20)].map((_, i) => (
                    <motion.rect
                      key={i}
                      x={150 - i * 5}
                      y={150 - i * 5}
                      width={300 + i * 10}
                      height={300 + i * 10}
                      stroke={i % 2 === 0 ? "#4ffdd2" : "#55a1fe"}
                      strokeWidth="0.5"
                      fill="none"
                      initial={{ opacity: 0.1 }}
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{
                        duration: 3,
                        delay: i * 0.1,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                  ))}
                </g>
              </svg>
            </div>

            {/* Triangle Logo */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                rotate: triangleRotate,
                scale: triangleScale,
              }}
            >
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 bg-primary transform rotate-45"></div>
                <div className="absolute inset-[3px] bg-background transform rotate-45"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className="text-sm text-textColor/50 mb-2">Scroll to explore</span>
          <motion.div
            className="w-6 h-10 border-2 border-textColor/30 rounded-full flex justify-center"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative p-8 rounded-xl border border-secondary/10 bg-gradient-to-br from-secondary/5 to-secondary/[0.02] backdrop-blur-sm"
            >
              <div className="absolute -top-3 -left-3 w-16 h-16 bg-primary/20 rounded-lg blur-xl" />
              <h3 className="text-5xl font-bold mb-2">153</h3>
              <p className="text-textColor/70">Past Attendees</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative p-8 rounded-xl border border-secondary/10 bg-gradient-to-br from-secondary/5 to-secondary/[0.02] backdrop-blur-sm"
            >
              <div className="absolute -top-3 -left-3 w-16 h-16 bg-accent/20 rounded-lg blur-xl" />
              <h3 className="text-5xl font-bold mb-2">85% 👍 </h3>
              <p className="text-textColor/70">Overall Reception</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative p-8 rounded-xl border border-secondary/10 bg-gradient-to-br from-secondary/5 to-secondary/[0.02] backdrop-blur-sm"
            >
              <div className="absolute -top-3 -left-3 w-16 h-16 bg-primary/20 rounded-lg blur-xl" />
              <h3 className="text-5xl font-bold mb-2">{stats.uptime.toFixed(2)}%</h3>
              <p className="text-textColor/70">Value for time</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Get the skills you need
            </h2>
            <p className="text-textColor/70 text-lg">
              Our platform provides everything you need develop applications and experiences with confidence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {Object.keys(features).map((key, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className={`relative p-8 rounded-xl border border-secondary/10 bg-gradient-to-br from-secondary/5 to-secondary/[0.02] backdrop-blur-sm cursor-pointer transition-all duration-300 ${activeFeature === key ? "ring-2 ring-primary/50" : "hover:ring-1 hover:ring-secondary/30"}`}
                onClick={() => setActiveFeature(key)}
              >
                <div className="flex items-start">
                  <div className="mr-4">{features[key].icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{features[key].title}</h3>
                    <p className="text-textColor/70 mb-4">{features[key].description}</p>
                    <div className="flex items-center text-sm text-primary">
                      <span>Learn more</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative p-8 rounded-xl border border-secondary/10 bg-gradient-to-br from-secondary/5 to-secondary/[0.02] backdrop-blur-sm"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-4">{features[activeFeature].icon}</div>
                <h3 className="text-2xl font-bold mb-4">{features[activeFeature].title}</h3>
                <p className="text-textColor/70 mb-6">{features[activeFeature].description}</p>
                <div className="bg-secondary/10 p-4 rounded-lg mb-6">
                  <p className="font-medium">{features[activeFeature].stats}</p>
                </div>
                <Button className="bg-primary text-background hover:bg-primary/90 border-0">
                  Explore Past Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="relative">
                <Image
                  src={features[activeFeature].image || "/placeholder.svg"}
                  alt={features[activeFeature].title}
                  width={600}
                  height={400}
                  className="rounded-xl border border-secondary/10"
                />
                <div className="absolute -bottom-4 -right-4 w-full h-full border border-secondary/20 rounded-xl -z-10"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Section */}
      <section id="platform" ref={platformRef} className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isPlatformInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Explore our Hackathons
            </h2>
            <p className="text-textColor/70 text-lg">
              Join us at Scrapyard Sydney, a dynamic in-person hackathon event where creativity meets collaboration to build innovative projects in a high-energy environment.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isPlatformInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Tabs defaultValue="deploy" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-12 bg-secondary/5 p-1 rounded-lg">
                <TabsTrigger value="deploy" className="data-[state=active]:bg-secondary/10">
                  Deploy
                </TabsTrigger>
                <TabsTrigger value="monitor" className="data-[state=active]:bg-secondary/10">
                  Monitor
                </TabsTrigger>
                <TabsTrigger value="collaborate" className="data-[state=active]:bg-secondary/10">
                  Collaborate
                </TabsTrigger>
              </TabsList>

              <TabsContent value="deploy" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid md:grid-cols-2 gap-12 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Learn Github Skills</h3>
                    <p className="text-textColor/70 mb-6">
                      Learn how git works and collaborate Git repository and we'll guide you through deployment process to make your apps accessible by everyone. Our
                      platform handles the infrastructure so you can focus on your code.
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-start">
                        <div className="bg-primary/20 p-1 rounded-full mr-3 mt-1">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M13.3334 4L6.00008 11.3333L2.66675 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Review Code</h4>
                          <p className="text-sm text-textColor/60">
                            We will help you express your ideas
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-primary/20 p-1 rounded-full mr-3 mt-1">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M13.3334 4L6.00008 11.3333L2.66675 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Git Integration</h4>
                          <p className="text-sm text-textColor/60">Connect your GitHub, GitLab, or Bitbucket repository</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-primary/20 p-1 rounded-full mr-3 mt-1">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M13.3334 4L6.00008 11.3333L2.66675 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Deployment</h4>
                          <p className="text-sm text-textColor/60">Guides for Vercel, Netify, and Github pages</p>
                        </div>
                      </div>
                    </div>

                    <a
                      href="https://docs.google.com/document/d/e/2PACX-1vT0Az-qRC0CQTj1-VgrA-IW8wecHqU_ofC9Mus_V1mHwsddm1FKzk4FJkWXeWxIwBzk2gX-oIAHi85Q/pub"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-background hover:bg-primary/90 border-0"
                    >
                    <Button className="bg-primary text-background hover:bg-primary/90 border-0">
                      Sign Up
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    </a>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-xl -z-10" />
                    <div className="relative rounded-xl border border-secondary/10 overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt="Deployment Dashboard"
                        width={600}
                        height={400}
                        className="w-full"
                      />
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="monitor" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid md:grid-cols-2 gap-12 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Learning Real Skils</h3>
                    <p className="text-textColor/70 mb-6">
                        Participate in hands-on workshops led by industry experts designed to sharpen your technical abilities, introduce you to new tools, and help you develop practical skills that you can apply beyond the hackathon.
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-start">
                        <div className="bg-accent/20 p-1 rounded-full mr-3 mt-1">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M13.3334 4L6.00008 11.3333L2.66675 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Choose your workshops</h4>
                          <p className="text-sm text-textColor/60">
                            Pick the skills you want to learn
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-accent/20 p-1 rounded-full mr-3 mt-1">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M13.3334 4L6.00008 11.3333L2.66675 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Participate</h4>
                          <p className="text-sm text-textColor/60">Actively develop you skills via the guidance of experienced mentors</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-accent/20 p-1 rounded-full mr-3 mt-1">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M13.3334 4L6.00008 11.3333L2.66675 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Apply your Skills</h4>
                          <p className="text-sm text-textColor/60">
                            Use your project time to apply your knowledge to thing you want to build
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button className="bg-accent text-background hover:bg-accent/90 border-0">
                      View past workshops
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl blur-xl -z-10" />
                    <div className="relative rounded-xl border border-secondary/10 overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt="Monitoring Dashboard"
                        width={600}
                        height={400}
                        className="w-full"
                      />
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="collaborate" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid md:grid-cols-2 gap-12 items-center"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Team Collaboration</h3>
                    <p className="text-textColor/70 mb-6">
                      Connect and collaborate with fellow participants you meet on the day. Form dynamic teams, share ideas, and combine your unique skills to build innovative projects together.
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-start">
                        <div className="bg-primary/20 p-1 rounded-full mr-3 mt-1">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M13.3334 4L6.00008 11.3333L2.66675 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Find like-minded teammates</h4>
                          <p className="text-sm text-textColor/60">Meet new people at Scrapyard</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-primary/20 p-1 rounded-full mr-3 mt-1">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M13.3334 4L6.00008 11.3333L2.66675 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Start Creating</h4>
                          <p className="text-sm text-textColor/60">Select a project idea and owrk as a team to achieve it</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-primary/20 p-1 rounded-full mr-3 mt-1">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M13.3334 4L6.00008 11.3333L2.66675 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Deploy and Share</h4>
                          <p className="text-sm text-textColor/60">
                            Share your software or hardware application to win prizes
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button className="bg-primary text-background hover:bg-primary/90 border-0">
                      View Past Projects
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-xl -z-10" />
                    <div className="relative rounded-xl border border-secondary/10 overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt="Collaboration Dashboard"
                        width={600}
                        height={400}
                        className="w-full"
                      />
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialsRef} className="relative py-24">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isTestimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              We Support Innovative Teams
            </h2>
            <p className="text-textColor/70 text-lg">
              See what our past participants have to say about their experience with our platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isTestimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.2 }}
                className="relative p-8 rounded-xl border border-secondary/10 bg-gradient-to-br from-secondary/5 to-secondary/[0.02] backdrop-blur-sm"
              >
                <div className="absolute -top-3 -left-3 w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg blur-xl" />

                <div className="mb-6">
                  <Image
                    src={testimonial.logo || "/placeholder.svg"}
                    alt={`${testimonial.name}'s company logo`}
                    width={120}
                    height={40}
                    className="h-8 w-auto"
                  />
                </div>

                <p className="text-textColor/80 mb-6 italic">"{testimonial.quote}"</p>

                <div className="flex items-center">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-textColor/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="outline" className="border-secondary/20 hover:bg-secondary/10">
              View All Case Studies
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              Ready to get started?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-textColor/70 mb-8"
            >
              Join hundreds of like minded individuals and make something impactful
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <a
                href="https://docs.google.com/document/d/e/2PACX-1vT0Az-qRC0CQTj1-VgrA-IW8wecHqU_ofC9Mus_V1mHwsddm1FKzk4FJkWXeWxIwBzk2gX-oIAHi85Q/pub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background text-lg px-8 py-6"
              >
              <Button className="bg-primary text-background hover:bg-primary/90 text-lg px-8 py-6">
                Sign Up
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              </a>
              <a
                href="https://docs.google.com/document/d/e/2PACX-1vQ73w2nkn0c_fRw6D8APzHfaxkgziWoHO3GKK1rsb4v55Gn7cDS395VYwGEgzQJR0KMMWMG2jMmkBi8/pub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg px-8 py-6 border-secondary/20"
              >
              <Button variant="outline" className="text-lg px-8 py-6 border-secondary/20 hover:bg-secondary/10">
                FAQ
              </Button>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * -100 - 50],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-secondary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <div className="relative h-8 w-8">
                  <div className="absolute inset-0 bg-primary rounded-sm transform rotate-45"></div>
                  <div className="absolute inset-0.5 bg-background rounded-sm transform rotate-45"></div>
                </div>
                <span className="font-bold text-xl">Accelrt</span>
              </Link>
              <p className="text-textColor/60 mb-6">
                Building the future of web development with cutting-edge tools and infrastructure.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 00-.555 2.066 4.107 4.107 0 001.827 3.415 4.072 4.072 0 01-1.858-.513v.052a4.106 4.106 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                    Enterprise
                  </a>
                </li>
                <li>
                  <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                    Partners
                  </a>
                </li>
                <li>
                  <a href="#" className="text-textColor/60 hover:text-textColor transition-colors">
                    Legal
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-secondary/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-textColor/40 text-sm">
              &copy; {new Date().getFullYear()} Accelrt Platform. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-textColor/40 hover:text-textColor transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-textColor/40 hover:text-textColor transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-textColor/40 hover:text-textColor transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
