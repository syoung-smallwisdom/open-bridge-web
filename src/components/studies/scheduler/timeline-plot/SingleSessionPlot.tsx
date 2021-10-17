import {makeStyles} from '@material-ui/core/styles'
import moment from 'moment'
import React from 'react'
import SessionIcon from '../../../widgets/SessionIcon'
import {TimelineScheduleItem, TimelineZoomLevel} from './types'

const useStyles = makeStyles(theme => ({
  sessionLine: {
    backgroundColor: 'black',
    height: '1px',
    position: 'absolute',
    zIndex: 100,
  },

  dailyIntervalLine: {
    borderLeft: '1px solid black',
    borderRight: '1px solid black',

    padding: '3px 0',
    position: 'absolute',
    zIndex: 100,
  },
  dailyIntervalInner: {
    backgroundColor: '#000',
    height: '1px',
    textAlign: 'center',
  },
}))

export interface SingleSessionPlotProps {
  sessionIndex: number
  zoomLevel: TimelineZoomLevel
  sessionGuid: string
  schedulingItems: TimelineScheduleItem[]
  scheduleLength?: number
  graphSessionHeight: number
  unitPixelWidth: number
  displayIndex: number
  xCoords: number[]
}

export interface SingleSessionLinePlotProps {
  containerWidth: number
  sessionIndex: number
  scheduleLength: number
  zoomLevel: TimelineZoomLevel
  graphSessionHeight: number
  unitPixelWidth: number
  hasSessionLines?: boolean
}

/*export function getSingleSessionX(
  studySessionGuid: string,

  schedulingItems: TimelineScheduleItem[],
  interval?: {start: number; end: number}
): number[] {
  let result: number[] = []

  const grouppedStartDays = _.groupBy(
    getTimesForSession(studySessionGuid, schedulingItems),
    Math.floor
  )
  const startDays = interval
    ? _.pickBy(grouppedStartDays, function (value, key) {
        return Number(key) >= interval.start && Number(key) < interval.end
      })
    : grouppedStartDays

  Object.values(startDays).forEach(groupArray => {
    const fraction = 1 / groupArray.length
    groupArray.forEach((item, index) => {
      result.push(item + fraction * index)
    })
  })

  return result
}*/

export function getSingleSessionDayX(
  studySessionGuid: string,
  schedulingItems: TimelineScheduleItem[],
  scheduleLength: number
): {day: number; startTime: number; expire: number}[] {
  let result: number[] = []

  const times = schedulingItems
    .filter(i => i.refGuid === studySessionGuid)
    .map(i => {
      const startTimeAsTime = moment(i.startTime, ['h:m a', 'H:m'])
      var stHrAsMin = startTimeAsTime.get('hours') * 60
      var stMin = startTimeAsTime.get('minutes')
      var fractionOfDay = (stHrAsMin + stMin) / (24 * 60)

      const expiration = i.expiration ? i.expiration : `P${scheduleLength}D`

      const duration = moment.duration(expiration).asMinutes()
      let expire = duration / 1440

      if (!i.expiration) {
        expire = expire - fractionOfDay
      }
      return {day: i.startDay, startTime: fractionOfDay, expire: expire}
    })

  return times
}

const NonDailySessionPlot: React.FunctionComponent<SingleSessionPlotProps> = ({
  // schedulingItems,
  // sessionGuid,
  sessionIndex,
  displayIndex,
  graphSessionHeight,
  unitPixelWidth,
  xCoords,
}) => {
  const days = [...new Array(8)].map((i, index) => (
    <div
      key={`session${i}`}
      style={{
        // width: '20px',
        width: '1px',
        height: '16px',
        backgroundColor: 'black',
        position: 'absolute',
        zIndex: 100,
        top: `0`,
        left: `${index * unitPixelWidth}px`,
      }}></div>
  ))
  const sessionGraph =
    /*getSingleSessionX(sessionGuid, schedulingItems)*/ xCoords.map(i => (
      <SessionIcon
        key={`session${i}`}
        index={sessionIndex}
        style={{
          // width: '20px',
          position: 'absolute',
          zIndex: 100,
          top: `${graphSessionHeight * displayIndex}px`,
          left: `${i * unitPixelWidth - 6}px`,
        }}></SessionIcon>
    ))
  return (
    <>
      {days}
      {sessionGraph}
    </>
  )
}

export const SessionPlot: React.FunctionComponent<
  SingleSessionPlotProps & SingleSessionLinePlotProps
> = ({
  schedulingItems,
  sessionGuid,
  zoomLevel,
  sessionIndex,
  displayIndex,

  graphSessionHeight,
  unitPixelWidth,
  hasSessionLines = true,
  xCoords,
}) => {
  return (
    <div style={{position: 'relative'}}>
      <NonDailySessionPlot
        sessionIndex={sessionIndex}
        displayIndex={displayIndex}
        zoomLevel={zoomLevel}
        xCoords={xCoords}
        schedulingItems={schedulingItems}
        graphSessionHeight={graphSessionHeight}
        sessionGuid={sessionGuid}
        unitPixelWidth={unitPixelWidth}
      />
    </div>
  )
}

export default SessionPlot
