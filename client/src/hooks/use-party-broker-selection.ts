import { useState, useEffect, useCallback, UIEvent } from 'react'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'
import { useBrokerList } from '@/pages/mill-admin/input-reports/broker-report/data/hooks'

export function usePartyBrokerSelection(millId: string, open: boolean) {
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
        if (partyListData?.parties) {
            const newParties = partyListData.parties.map((p) => p.partyName)
            setAllParties((prev) => Array.from(new Set([...prev, ...newParties])))
            setHasMoreParties(partyListData.parties.length === limit(partyPage))
            setIsLoadingMoreParties(false)
        }
    }, [partyListData, partyPage])

    // Accumulate Brokers
    useEffect(() => {
        if (brokerListData?.brokers) {
            const newBrokers = brokerListData.brokers.map((b) => b.brokerName)
            setAllBrokers((prev) => Array.from(new Set([...prev, ...newBrokers])))
            setHasMoreBrokers(brokerListData.brokers.length === limit(brokerPage))
            setIsLoadingMoreBrokers(false)
        }
    }, [brokerListData, brokerPage])

    // Reset on Open
    useEffect(() => {
        if (open) {
            setAllParties([])
            setAllBrokers([])
            setPartyPage(1)
            setBrokerPage(1)
            setHasMoreParties(true)
            setHasMoreBrokers(true)
            setIsLoadingMoreParties(false)
            setIsLoadingMoreBrokers(false)
        }
    }, [open])

    const handlePartyScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
        const { scrollHeight, scrollTop, clientHeight } = e.currentTarget
        if (scrollHeight - scrollTop <= clientHeight + 5 && hasMoreParties && !isLoadingMoreParties) {
            setIsLoadingMoreParties(true)
            setPartyPage((prev) => prev + 1)
        }
    }, [hasMoreParties, isLoadingMoreParties, partyPage])

    const handleBrokerScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
        const { scrollHeight, scrollTop, clientHeight } = e.currentTarget
        if (scrollHeight - scrollTop <= clientHeight + 5 && hasMoreBrokers && !isLoadingMoreBrokers) {
            setIsLoadingMoreBrokers(true)
            setBrokerPage((prev) => prev + 1)
        }
    }, [hasMoreBrokers, isLoadingMoreBrokers, brokerPage])

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
