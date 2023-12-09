import { userKeys } from '@/services/user/user.query'
import { Avatar, Box, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'

export const ListStudent = () => {
  const userInstance = userKeys.member()
  const { data } = useQuery(userInstance)

  return (
    <Box display='flex' flexDirection='column' gap={1} overflow='auto' maxHeight={700}>
      {data?.content.map((student) => (
        <Box
          key={student.fullName}
          display='flex'
          alignItems='center'
          gap={2}
          p={1}
          sx={{
            ':hover': {
              bgcolor: '#ddd',
              cursor: 'pointer',
              borderRadius: 3,
            },
          }}
        >
          <Avatar src={student.avatarPath} alt={student.fullName} />
          <Box>
            <Typography fontWeight={500}>{student.fullName}</Typography>
            <Typography variant='body2'>{student.email}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
