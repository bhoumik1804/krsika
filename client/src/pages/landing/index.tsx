import {
    Navbar,
    HeroSection,
    FeaturesSection,
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
                <TestimonialsSection />
                <CtaSection />
            </main>
            <Footer />
        </div>
    )
}
