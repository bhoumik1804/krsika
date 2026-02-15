import { z } from 'zod'

export const createPaddySaleSchema = z.object({
    body: z.object({
        date: z.string().min(1, 'Date is required'),
        saleType: z.string().min(1, 'Sale Type is required'),
        doNumber: z.string().optional(),
        dhanMotaQty: z.number().min(0).default(0),
        dhanPatlaQty: z.number().min(0).default(0),
        dhanSarnaQty: z.number().min(0).default(0),
        dhanType: z.string().optional(),
        dhanQty: z.number().min(0).default(0),
        paddyRatePerQuintal: z.number().min(0).default(0),
        deliveryType: z.string().optional(),
        partyName: z.string().optional(),
        brokerName: z.string().optional(),
        discountPercent: z.number().min(0).max(100).default(0),
        brokerage: z.number().min(0).default(0),
        gunnyOption: z.string().optional(),
        newGunnyRate: z.number().min(0).default(0),
        oldGunnyRate: z.number().min(0).default(0),
        plasticGunnyRate: z.number().min(0).default(0),
    }),
})

export const updatePaddySaleSchema = z.object({
    params: z.object({
        id: z.string().length(24, 'Invalid ID'),
    }),
    body: z.object({
        date: z.string().min(1).optional(),
        saleType: z.string().min(1).optional(),
        doNumber: z.string().optional(),
        dhanMotaQty: z.number().min(0).optional(),
        dhanPatlaQty: z.number().min(0).optional(),
        dhanSarnaQty: z.number().min(0).optional(),
        dhanType: z.string().optional(),
        dhanQty: z.number().min(0).optional(),
        paddyRatePerQuintal: z.number().min(0).optional(),
        deliveryType: z.string().optional(),
        partyName: z.string().optional(),
        brokerName: z.string().optional(),
        discountPercent: z.number().min(0).max(100).optional(),
        brokerage: z.number().min(0).optional(),
        gunnyOption: z.string().optional(),
        newGunnyRate: z.number().min(0).optional(),
        oldGunnyRate: z.number().min(0).optional(),
        plasticGunnyRate: z.number().min(0).optional(),
    }),
})

export const getPaddySaleByIdSchema = z.object({
    params: z.object({
        id: z.string().length(24, 'Invalid ID'),
    }),
})

export const getPaddySaleListSchema = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        search: z.string().optional(),
        sortBy: z.string().optional(),
        order: z.enum(['asc', 'desc']).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    }),
})

export const getPaddySaleSummarySchema = z.object({
    query: z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    }),
})

export const deletePaddySaleSchema = z.object({
    params: z.object({
        id: z.string().length(24, 'Invalid ID'),
    }),
})

export const bulkDeletePaddySaleSchema = z.object({
    body: z.object({
        ids: z
            .array(z.string().length(24, 'Invalid ID'))
            .min(1, 'At least one ID is required'),
    }),
})
