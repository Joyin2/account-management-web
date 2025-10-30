'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import HeroSection from '@/components/about/HeroSection'
import CompanyStory from '@/components/about/CompanyStory'
import Timeline from '@/components/about/Timeline'
import Values from '@/components/about/Values'
import Team from '@/components/about/Team'
import Stats from '@/components/about/Stats'

export default function AboutPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100
    })
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <CompanyStory />
      <Stats />
      <Timeline />
      <Values />
      <Team />
      <Footer />
    </main>
  )
}