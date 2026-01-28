export interface Testimonial {
    id: string
    name: string
    role: string
    company: string
    location: string
    content: string
    rating: number
    avatar?: string
}

export const testimonialsData = {
    badge: 'Testimonials',
    title: 'Loved by Mill Owners Across India',
    description:
        "Don't just take our word for it. Here's what our customers have to say.",
    fallbackTestimonials: [
        {
            id: '1',
            name: 'Rajesh Sharma',
            role: 'Owner',
            company: 'Sharma Rice Mills',
            location: 'Punjab',
            content:
                'This software has transformed how we manage our mill. Earlier we used to maintain 5 different registers, now everything is in one place. Our efficiency has improved by at least 40%.',
            rating: 5,
        },
        {
            id: '2',
            name: 'Priya Patel',
            role: 'Manager',
            company: 'Patel Agro Industries',
            location: 'Gujarat',
            content:
                'The inventory tracking is incredibly accurate. We never run into stock discrepancies anymore. The reports help us make better business decisions.',
            rating: 5,
        },
        {
            id: '3',
            name: 'Suresh Kumar',
            role: 'Owner',
            company: 'Krishna Rice Exports',
            location: 'Andhra Pradesh',
            content:
                'Customer support is excellent. They helped us onboard our entire staff within a week. The mobile app lets me monitor operations even when I am traveling.',
            rating: 5,
        },
        {
            id: '4',
            name: 'Meena Devi',
            role: 'Accountant',
            company: 'Gupta Mills',
            location: 'Uttar Pradesh',
            content:
                'GST billing has become so easy. Earlier it used to take hours, now I can generate invoices in minutes. The payment tracking feature is a lifesaver.',
            rating: 5,
        },
        {
            id: '5',
            name: 'Arun Reddy',
            role: 'Operations Head',
            company: 'Tamil Grains Pvt Ltd',
            location: 'Tamil Nadu',
            content:
                'We manage 3 mills using this platform. The multi-mill feature is fantastic. I can see real-time data from all locations in one dashboard.',
            rating: 5,
        },
        {
            id: '6',
            name: 'Vijay Singh',
            role: 'Owner',
            company: 'Haryana Rice Co.',
            location: 'Haryana',
            content:
                'The gate entry module has reduced our manual work significantly. Farmers are happy because payments are tracked properly. Highly recommended!',
            rating: 5,
        },
    ] as Testimonial[],
}
