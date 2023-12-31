import { BoxContent, Show } from '@/components'
import { useBoolean, useMenu } from '@/hooks'
import { AddOutlined, AttachFileOutlined, LinkOutlined, TextFormatOutlined } from '@mui/icons-material'
import { Button, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from '@mui/material'
import { UploadPopup, TextPopup, LinkPopup, FileCard, ReviewSubmissionText, TextCard } from '../components'
import { assignmentSubmissionKeys } from '@/services/assignmentSubmission/assignmentSubmission.query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UploadFileData } from '@/services/file/file.dto'
import { assignmentSubmissionService } from '@/services/assignmentSubmission/assignmentSubmission.service'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { Assignment } from '@/services/assignment/assignment.dto'
import { courseKeys } from '@/services/course/course.query'

export type SubmissionContentProps = {
  assignment: Assignment
  courseId: number
}

export enum StatusSubmissionEnum {
  Expired = 'Expired',
  NotSubmit = 'Not Submit',
  Submitted = 'Submitted',
}

const currentDate = dayjs()

export const SubmissionContent = ({ assignment, courseId }: SubmissionContentProps) => {
  const queryClient = useQueryClient()

  const { value: isOpenUpload, setTrue: openUpload, setFalse: closeUpload } = useBoolean()
  const { value: isOpenText, setTrue: openText, setFalse: closeText } = useBoolean()
  const { value: isOpenLink, setTrue: openLink, setFalse: closeLink } = useBoolean()
  const { value: isOpenReviewText, setTrue: openReviewText, setFalse: closeReviewText } = useBoolean()

  const { anchorEl, isOpen, onClose, onOpen } = useMenu()

  const submissionInstance = assignmentSubmissionKeys.list({ assignmentId: assignment.id })
  const { data: submissions, refetch: refetchSubmissions } = useQuery(submissionInstance)

  const { mutate: mutateSubmit } = useMutation({
    mutationFn: assignmentSubmissionService.create,
    onSuccess: () => {
      refetchSubmissions()
      toast.success('Upload successfully!')
      closeUpload()
      closeText()
      queryClient.invalidateQueries({ queryKey: courseKeys.all })
    },
  })

  const { mutate: mutateDeleteSubmit } = useMutation({
    mutationFn: assignmentSubmissionService.delete,
    onSuccess: () => {
      toast.success('Delete your submission successfully!')
      queryClient.setQueryData(submissionInstance.queryKey, null)
      queryClient.invalidateQueries({ queryKey: courseKeys.all })
    },
  })

  const { mutate: mutateUpdateSubmit } = useMutation({
    mutationFn: assignmentSubmissionService.update,
    onSuccess: (data) => {
      toast.success('Update your submission successfully!')
      console.log('dataaa', data)
      closeReviewText()
      queryClient.invalidateQueries({ queryKey: submissionInstance.queryKey })
    },
  })

  const handleSubmit = (values: UploadFileData) => {
    mutateSubmit({ assignmentId: assignment.id, fileSubmissionUrl: values.filePath, courseId })
  }

  const handleSubmitText = (values: string) => {
    mutateSubmit({ assignmentId: assignment.id, textSubmission: values, courseId })
  }

  const handleSubmitLink = (link: string) => {
    console.log(link)
  }

  const checkStatusSubmission =
    submissions &&
    (!submissions.content.length
      ? currentDate > dayjs(assignment.endDate)
        ? StatusSubmissionEnum.Expired
        : StatusSubmissionEnum.NotSubmit
      : StatusSubmissionEnum.Submitted)

  const handleClickItem = {
    file: () => {
      onClose()
      openUpload()
    },
    text: () => {
      onClose()
      openText()
    },
    link: () => {
      onClose()
      openLink()
    },
  }

  const handleDelete = () => {
    submissions && mutateDeleteSubmit(submissions.content[0].id)
  }

  const handleUpdateText = (values: string) => {
    mutateUpdateSubmit({ id: Number(submissions?.content[0].id), textSubmission: values })
  }

  return (
    <>
      <BoxContent>
        <Stack gap={2}>
          <Stack direction='row' justifyContent='space-between'>
            <Typography variant='h5'>Bài tập của bạn</Typography>
            <Typography color={checkStatusSubmission === StatusSubmissionEnum.Expired ? 'error' : ''}>
              {checkStatusSubmission}
            </Typography>
          </Stack>
          {submissions && submissions.content[0]?.fileSubmissionUrl && (
            <FileCard filePath={submissions.content[0]?.fileSubmissionUrl} onDelete={handleDelete} />
          )}
          {submissions && submissions.content[0]?.textSubmission && (
            <TextCard onReview={openReviewText} onDelete={handleDelete} />
          )}

          {submissions && submissions.content[0]?.textSubmission && (
            <ReviewSubmissionText
              content={submissions.content[0].textSubmission}
              isOpen={isOpenReviewText}
              onClose={closeReviewText}
              onUpdate={handleUpdateText}
            />
          )}

          <Show when={!submissions?.content.length}>
            <Button fullWidth variant='outlined' onClick={onOpen}>
              <AddOutlined />
              <Typography>Thêm hoặc tạo</Typography>
            </Button>
          </Show>
        </Stack>
      </BoxContent>

      <UploadPopup isOpen={isOpenUpload} onClose={closeUpload} onSubmit={handleSubmit} />
      <TextPopup isOpen={isOpenText} onClose={closeText} onSubmit={handleSubmitText} />
      <LinkPopup isOpen={isOpenLink} onClose={closeLink} onSubmit={handleSubmitLink} />
      <Menu anchorEl={anchorEl} open={isOpen} onClose={onClose}>
        <MenuItem onClick={handleClickItem.text}>
          <ListItemIcon>
            <TextFormatOutlined />
          </ListItemIcon>
          <ListItemText>Text</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClickItem.link}>
          <ListItemIcon>
            <LinkOutlined />
          </ListItemIcon>
          <ListItemText>Link</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClickItem.file}>
          <ListItemIcon>
            <AttachFileOutlined />
          </ListItemIcon>
          <ListItemText>File</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
