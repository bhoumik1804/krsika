import { z } from 'zod'

export const formSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    description: z.string().min(1, 'Description is required.'),
    price: z.string().min(1, 'Price is required.'),
    duration: z.string().min(1, 'Duration is required.'),
    features: z.string().min(1, 'At least one feature is required.'),
})

export type SubscriptionForm = z.infer<typeof formSchema>
