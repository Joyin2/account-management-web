'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import HeroSection from '@/components/partner/HeroSection'
import PartnershipBenefits from '@/components/partner/PartnershipBenefits'
import PartnerTypes from '@/components/partner/PartnerTypes'
import PartnerProgram from '@/components/partner/PartnerProgram'
import SuccessStories from '@/components/partner/SuccessStories'
import PartnerResources from '@/components/partner/PartnerResources'
import ContactForm from '@/components/partner/ContactForm'

export default function PartnerPage() {
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
      <PartnershipBenefits />
      <PartnerTypes />
      <PartnerProgram />
      <SuccessStories />
      <PartnerResources />
      <ContactForm />
      <Footer />
    </main>
  )
}