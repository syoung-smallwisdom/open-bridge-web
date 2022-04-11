import SelectWithEnum from '@components/widgets/SelectWithEnum'
import SmallTextBox from '@components/widgets/SmallTextBox'
import Utility from '@helpers/utility'
import { IconButton, StandardTextFieldProps } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ClearIcon from '@mui/icons-material/HighlightOff'
import moment from 'moment'
import React from 'react'
import {getValueFromPeriodString} from './utility'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  clear: {
    minWidth: 'auto',
    padding: 0,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(-0.75),
  },
}))

export interface DurationProps {
  onChange: Function
  durationString: string | undefined
  unitData: any
  unitLabel: string
  numberLabel: string
  isIntro?: boolean
  unitDefault?: any
  maxDurationDays?: number
  disabled?: boolean
  isShowClear?: boolean
  placeHolder? :string
}

const Duration: React.FunctionComponent<
  DurationProps & StandardTextFieldProps
> = ({
  durationString,
  unitData,
  onChange,
  unitLabel,
  numberLabel,
  isIntro,
  unitDefault,
  maxDurationDays,
  disabled,
  placeHolder,
  isShowClear = true,
  ...props
}: DurationProps) => {
  const classes = useStyles()
  const [unt, setUnit] = React.useState<string | undefined>(undefined)
  const [num, setNum] = React.useState<number | undefined>(undefined)

  const unitDefaultValue = Utility.getEnumKeyByEnumValue(unitData, unitDefault)

  React.useEffect(() => {
    try {
      if (!durationString /*|| !durationString.includes('P')*/) {
        throw new Error(durationString + 'no value!')
      }

      let unit = durationString[durationString.length - 1]
      const n = getValueFromPeriodString(durationString)

      setUnit(unit)
      setNum(n)
    } catch (e) {
      setUnit(undefined)
      setNum(undefined)
    }
  }, [durationString])

  const validate = (value: number, unit: string) => {
    if (!maxDurationDays) {
      return true
    }
    const days = unit === 'W' ? value * 7 : value
    return days <= maxDurationDays
  }

  const changeValue = (value?: number, unit?: string) => {
    if (unit) {
      if (validate(value || num || 0, unit)) {
        setUnit(unit)
      }
    }
    if (value !== undefined) {
      if (validate(value, unit || unitDefaultValue || 'D')) {
        setNum(value)
        if (!unit && unitDefault) {
          unit = unitDefaultValue
          setUnit(unitDefaultValue)
        }
      }
    }
  }

  const triggerChange = (e: any) => {
    const time = unt === 'H' || unt === 'M' ? 'T' : ''
    const p =
      unt === undefined || num === undefined
        ? undefined
        : `P${time}${num}${unt}`

    onChange({target: {value: p}})
  }

  return (
    <div className={classes.root} onBlur={triggerChange}>
      <SmallTextBox
        disabled={!!disabled}
        style={{width: '60px'}}
        value={num || ''}
        aria-label={numberLabel}
        type="number"
        {...props}
        id={numberLabel.replace(' ', '')}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          changeValue(Number(e.target.value as string), unt)
        }}
        inputWidth={isIntro ? 10 : undefined}></SmallTextBox>

      <SelectWithEnum
        disabled={!!disabled}
        aria-label={unitLabel}
        {...props}
        value={unt}
        label={placeHolder}
        sourceData={unitData}
        id={unitLabel.replace(' ', '')}
        onChange={e =>
          changeValue(num, e.target.value as moment.unitOfTime.Base)
        }
        style={{width: '100px'}}>

        </SelectWithEnum>
      {isShowClear && (
        <IconButton
          className={classes.clear}
          onClick={_e => onChange({target: {value: undefined}})}
          size="large">
          <ClearIcon />
        </IconButton>
      )}
    </div>
  );
}

export default Duration
