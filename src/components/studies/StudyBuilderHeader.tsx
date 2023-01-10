import StudyWithPhaseImage from '@components/widgets/StudyWithPhaseImage'
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone'
import {Box, Button, SxProps} from '@mui/material'
import constants from '@typedefs/constants'
import {DisplayStudyPhase, Study} from '@typedefs/types'

import Utility from '@helpers/utility'
import {styled} from '@mui/material'
import StudyService from '@services/study.service'
import {useHistory} from 'react-router-dom'

const BG_COLOR: Record<DisplayStudyPhase, string> = {
  DRAFT: 'rgba(194, 46, 73, .1)',
  LIVE: 'rgba(71, 164, 221, .1)',
  COMPLETED: 'rgba(99, 166, 80, .1)',
  WITHDRAWN: 'rgba(135, 142, 149, .1)',
}

const StyledStudyHeader = styled(Box, {label: 'StyledStudyHeader'})(({theme}) => ({
  display: 'flex',
  marginLeft: '-3px',
  padding: theme.spacing(3, 8, 2, 8),
  justifyContent: 'space-between',
  alignItems: 'center',
  //marginBottom: theme.spacing(4),
}))

const StudyBuilderHeader: React.FunctionComponent<{study: Study; sx?: SxProps}> = ({study, sx = {}}) => {
  const history = useHistory()
  return (
    <StyledStudyHeader
      sx={{
        ...sx,
        backgroundColor: BG_COLOR[StudyService.getDisplayStatusForStudyPhase(study.phase)],
      }}>
      <StudyWithPhaseImage study={study} />

      {(Utility.isInAdminRole() || true) /* enable all aggess*/ && (
        <Button
          variant="text"
          onClick={() => history.push(constants.restrictedPaths.ACCESS_SETTINGS.replace(':id', study.identifier))}
          startIcon={<SettingsTwoToneIcon />}>
          Access settings
        </Button>
      )}
    </StyledStudyHeader>
  )
}

export default StudyBuilderHeader