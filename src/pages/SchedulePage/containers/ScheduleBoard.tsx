import { BoxContent, WeekPicker } from '@/components'
import { ArrowBack, ArrowForward, CalendarMonth } from '@mui/icons-material'
import { Box, Divider, IconButton, Menu, MenuItem, Select, Stack, Typography } from '@mui/material'
import { DateBox } from '../components'
import { useMenu } from '@/hooks'

export const ScheduleBoard = () => {
  const { anchorEl, isOpen, onClose, onOpen: openWeekPicker } = useMenu()

  return (
    <BoxContent>
      <Stack gap={4}>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <Stack direction='row' alignItems='center' gap={2}>
            <Typography variant='h5'>October 2023</Typography>
            <IconButton sx={{ borderRadius: '50%' }} onClick={openWeekPicker}>
              <CalendarMonth />
            </IconButton>
            <Menu anchorEl={anchorEl} onClose={onClose} open={isOpen} sx={{}}>
              <BoxContent borderRadius={3}>
                <WeekPicker />
              </BoxContent>
            </Menu>
          </Stack>
          <Select defaultValue='weekly' size='small' sx={{ borderRadius: 3, paddingRight: 4 }}>
            <MenuItem value='weekly'>Weekly</MenuItem>
          </Select>
        </Stack>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <IconButton>
            <ArrowBack />
          </IconButton>
          <Stack direction='row' gap={3}>
            {Array(7)
              .fill(null)
              .map((_, index) => (
                <DateBox isActive={index == 2} />
              ))}
          </Stack>
          <IconButton>
            <ArrowForward />
          </IconButton>
        </Stack>
      </Stack>
      <Stack
        direction='row'
        width={1000}
        position='relative'
        height='48vh'
        sx={{ overflowX: 'scroll', overflowY: 'scroll' }}
        // px={4}
        mx={4}
        my={4}
      >
        {Array(24)
          .fill(true)
          .map(() => (
            <Stack direction='row' position='relative' pt={4}>
              <Divider orientation='vertical' />
              <Typography position='absolute' top={0} left={0} zIndex={10}>
                09:00
              </Typography>
              <Box width={400} height='100%'></Box>
            </Stack>
          ))}
        <BoxContent border={1} height={150} width={(45 / 60) * 400} position='absolute' left={0} top={40}>
          <Typography>Assignment 1</Typography>
        </BoxContent>
      </Stack>
    </BoxContent>
  )
}
