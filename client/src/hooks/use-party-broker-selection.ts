import { useState, useEffect, useCallback, UIEvent } from 'react'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'
import { useBrokerList } from '@/pages/mill-admin/input-reports/broker-report/data/hooks'

export function usePartyBrokerSelection(
    millId: string,
    open: boolean,
    initialParty?: string,
    initialBroker?: string
) {
    // Party State
    const [partyPage, setPartyPage] = useState(1)
    const [allParties, setAllParties] = useState<string[]>([])
    const [hasMoreParties, setHasMoreParties] = useState(true)
    const [isLoadingMoreParties, setIsLoadingMoreParties] = useState(false)

    // Broker State
    const [brokerPage, setBrokerPage] = useState(1)
    const [allBrokers, setAllBrokers] = useState<string[]>([])
    const [hasMoreBrokers, setHasMoreBrokers] = useState(true)
    const [isLoadingMoreBrokers, setIsLoadingMoreBrokers] = useState(false)

    const limit = (page: number) => (page === 1 ? 10 : 5)

    // Party Query
    const { data: partyListData } = usePartyList(
        millId || '',
        {
            page: partyPage,
            limit: limit(partyPage),
            sortBy: 'partyName',
            sortOrder: 'asc',
        },
        { enabled: open && !!millId }
    )

    // Broker Query
    const { data: brokerListData } = useBrokerList({
        millId: open && millId ? millId : '',
        page: brokerPage,
        pageSize: limit(brokerPage),
    })

    // Accumulate Parties
    useEffect(() => {
        if (open && partyListData?.parties) {
            const newParties = partyListData.parties.map((p) => p.partyName)

            if (partyPage === 1) {
                setAllParties(Array.from(new Set([initialParty, ...newParties].filter(Boolean) as string[])))
            } else {
                setAllParties((prev) => Array.from(new Set([...prev, ...newParties])))
            }

            setHasMoreParties(partyListData.parties.length === limit(partyPage))
            setIsLoadingMoreParties(false)
        }
    }, [partyListData, partyPage, open, initialParty])

    // Accumulate Brokers
    useEffect(() => {
        if (open && brokerListData?.brokers) {
            const newBrokers = brokerListData.brokers.map((b) => b.brokerName)

            if (brokerPage === 1) {
                setAllBrokers(Array.from(new Set([initialBroker, ...newBrokers].filter(Boolean) as string[])))
            } else {
                setAllBrokers((prev) => Array.from(new Set([...prev, ...newBrokers])))
            }

            setHasMoreBrokers(brokerListData.brokers.length === limit(brokerPage))
            setIsLoadingMoreBrokers(false)
        }
    }, [brokerListData, brokerPage, open, initialBroker])

    // Reset and Seed Logic
    useEffect(() => {
        if (open) {
            // When opening, seed the initial values if provided
            setAllParties((prev) => {
                if (initialParty && !prev.includes(initialParty)) {
                    return [initialParty, ...prev]
                }
                return prev.length === 0 && initialParty ? [initialParty] : prev
            })
            setAllBrokers((prev) => {
                if (initialBroker && !prev.includes(initialBroker)) {
                    return [initialBroker, ...prev]
                }
                return prev.length === 0 && initialBroker ? [initialBroker] : prev
            })
        } else {
            // When closing, reset pagination but keep data to prevent flickering
            setPartyPage(1)
            setBrokerPage(1)
            setHasMoreParties(true)
            setHasMoreBrokers(true)
            setIsLoadingMoreParties(false)
            setIsLoadingMoreBrokers(false)
        }
    }, [open, initialParty, initialBroker])

    const handlePartyScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
        const { scrollHeight, scrollTop, clientHeight } = e.currentTarget
        if (scrollHeight - scrollTop <= clientHeight + 5 && hasMoreParties && !isLoadingMoreParties) {
            setIsLoadingMoreParties(true)
            setPartyPage((prev) => prev + 1)
        }
    }, [hasMoreParties, isLoadingMoreParties])

    const handleBrokerScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
        const { scrollHeight, scrollTop, clientHeight } = e.currentTarget
        if (scrollHeight - scrollTop <= clientHeight + 5 && hasMoreBrokers && !isLoadingMoreBrokers) {
            setIsLoadingMoreBrokers(true)
            setBrokerPage((prev) => prev + 1)
        }
    }, [hasMoreBrokers, isLoadingMoreBrokers])

    return {
        party: {
            items: allParties,
            onScroll: handlePartyScroll,
            isLoadingMore: isLoadingMoreParties,
        },
        broker: {
            items: allBrokers,
            onScroll: handleBrokerScroll,
            isLoadingMore: isLoadingMoreBrokers,
        },
    }
}
