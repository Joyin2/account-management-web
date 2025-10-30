'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import HeroSection from '@/components/careers/HeroSection'
// TODO: Create and import CompanyCulture component
// import CompanyCulture from '@/components/careers/CompanyCulture'
const CompanyCulture = () => <div>Company Culture Section</div>
// TODO: Create JobListings component
const JobListings = () => <div>Job Listings Section</div>
import Benefits from '@/components/careers/Benefits'
import EmployeeTestimonials from '@/components/careers/EmployeeTestimonials'
import ApplicationProcess from '@/components/careers/ApplicationProcess'
import ContactSection from '@/components/careers/ContactSection'

const CareersPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic'
    })
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSection />
        <CompanyCulture />
        <JobListings />
        <Benefits />
        <EmployeeTestimonials />
        <ApplicationProcess />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}

export default CareersPage