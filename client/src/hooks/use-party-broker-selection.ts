import { useBrokerList } from '@/pages/mill-admin/input-reports/broker-report/data/hooks'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'
import { usePaginatedList } from './use-paginated-list'

/**
 * Convenience wrapper that provides paginated party + broker
 * selection for Combobox dropdowns in action dialogs.
 *
 * Under the hood it composes two `usePaginatedList` calls.
 */
export function usePartyBrokerSelection(
    millId: string,
    open: boolean,
    initialParty?: string,
    initialBroker?: string
) {
    const party = usePaginatedList(
        millId,
        open,
        {
            useListHook: usePartyList,
            extractItems: (data) => data.parties.map((p) => p.partyName),
            hookParams: { sortBy: 'partyName', sortOrder: 'asc' },
        },
        initialParty
    )

    const broker = usePaginatedList(
        millId,
        open,
        {
            useListHook: useBrokerList,
            extractItems: (data) => data.brokers.map((b) => b.brokerName),
        },
        initialBroker
    )

    return { party, broker }
}
