import {
    Navbar,
    HeroSection,
    FeaturesSection,
    PricingSection,
    TestimonialsSection,
    HowItWorksSection,
    CtaSection,
    Footer,
} from './components'

export function Landing() {
    return (
        <div className='min-h-screen bg-background'>
            <Navbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <PricingSection />
                <TestimonialsSection />
                <CtaSection />
            </main>
            <Footer />
        </div>
    )
}
