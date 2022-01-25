import {useUserSessionDataState} from '@helpers/AuthContext'
import AdherenceService from '@services/adherence.service'
import {
  AdherenceWeeklyReport,
  EventStreamAdherenceReport,
  ExtendedError,
} from '@typedefs/types'
import {useQuery} from 'react-query'

export const ADHERENCE_KEYS = {
  all: ['adherence'] as const,
  list: (studyId: string) => [...ADHERENCE_KEYS.all, 'list', studyId] as const,

  detail: (studyId: string, userId: string) =>
    [...ADHERENCE_KEYS.list(studyId), userId] as const,
}

export const useAdherence = (studyId: string, userId: string | undefined) => {
  const {token} = useUserSessionDataState()

  return useQuery<EventStreamAdherenceReport, ExtendedError>(
    ADHERENCE_KEYS.detail(studyId, userId!),
    () => AdherenceService.getAdherenceForParticipant(studyId, userId!, token!),
    {
      enabled: !!studyId && !!userId && !!token,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}
export const useAdherenceForWeek = (studyId: string, userIds: string[]) => {
  const {token} = useUserSessionDataState()

  return useQuery<AdherenceWeeklyReport[], ExtendedError>(
    ADHERENCE_KEYS.list(studyId),
    () => AdherenceService.getAdherenceForWeek(studyId, userIds, token!),
    {
      enabled: !!studyId && userIds.length > 0 && !!token,
      retry: true,
      refetchOnWindowFocus: true,
    }
  )
}