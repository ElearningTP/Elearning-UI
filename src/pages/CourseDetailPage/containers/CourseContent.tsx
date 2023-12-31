import actions from '@/assets/images/icons/actions'
import { BoxContent, NoData } from '@/components'
import { Course } from '@/services/course/course.dto'
import { ArticleOutlined, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { Box, Button, Collapse, Divider, Stack, Typography } from '@mui/material'
import { ContentItem } from '../components'
import { downloadFileByLink, getResourceType } from '@/utils'
import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Module } from '@/services/module/module.dto'

export type CourseContentProps = {
  data: Course
}
export const CourseContent = ({ data }: CourseContentProps) => {
  const { pathname } = useLocation()
  const { courseId } = useParams()
  const navigate = useNavigate()

  const [expandModuleList, setExpandModuleList] = useState<Number[]>([])

  const handleDownloadResource = (urlDocument: string) => {
    downloadFileByLink(urlDocument)
    // mutateDownloadFile(urlDocument)
  }

  const handleExpandModuleList = (moduleId: number) => {
    if (expandModuleList.includes(moduleId)) {
      setExpandModuleList((prev) => prev.filter((item) => item !== moduleId))
    } else {
      setExpandModuleList((prev) => [...prev, moduleId])
    }
  }

  const handleToggleModuleListAll = () => {
    if (data.lessonPlanInfo?.modulesInfo.length === expandModuleList.length) {
      setExpandModuleList([])
    } else {
      const moduleIdList = data.lessonPlanInfo?.modulesInfo.map((module) => module.id) || []
      setExpandModuleList(moduleIdList)
    }
  }
  console.log(data.lessonPlanInfo?.modulesInfo?.[0].assignmentInfo[0].assignmentSubmissionInfo)

  const isNotEmptyModule = (module: Module) => {
    return module.lectureInfo?.length || module.resourceInfo?.length || module.assignmentInfo?.length
  }

  return (
    <BoxContent>
      <Typography variant='h5' fontWeight={500}>
        Course content
      </Typography>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
        {data.lessonPlanInfo?.modulesInfo.length ? (
          <>
            <Typography variant='body2'>{data.lessonPlanInfo?.modulesInfo.length || 0} Sections</Typography>
            <Button variant='text' onClick={handleToggleModuleListAll}>
              {data.lessonPlanInfo?.modulesInfo.length === expandModuleList.length ? (
                <>
                  Collapse All <KeyboardArrowUp />
                </>
              ) : (
                <>
                  Expand all <KeyboardArrowDown />
                </>
              )}
            </Button>
          </>
        ) : (
          <NoData title='No content about course yet!' />
        )}
      </Box>
      <Stack gap={2}>
        {data.lessonPlanInfo?.modulesInfo.map((module) => (
          <Stack border={1} borderRadius={3} padding={2} gap={2} key={module.id}>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
              sx={{ cursor: 'pointer' }}
              onClick={() => handleExpandModuleList(module.id)}
            >
              <Box display='flex' alignItems='center' gap={2}>
                <KeyboardArrowDown />
                <Typography fontWeight={500}>{module.modulesName}</Typography>
              </Box>
              <Stack direction='row' gap={3}>
                <Box display='flex' alignItems='center' gap={1}>
                  <ArticleOutlined color='primary' />
                  <Typography>{module.lectureInfo.length}</Typography>
                </Box>
                <Box display='flex' alignItems='center' gap={1}>
                  <Box component='img' src={actions.assignment} alt='assignment' width={25} />
                  <Typography>{module.assignmentInfo.length}</Typography>
                </Box>
                <Box display='flex' alignItems='center' gap={1}>
                  <Box component='img' src={actions.quiz} alt='assignment' width={25} />
                  <Typography>{module.quizInfo.length}</Typography>
                </Box>
              </Stack>
            </Box>
            <Collapse in={expandModuleList.includes(module.id)} timeout='auto' unmountOnExit>
              <Divider />
              {isNotEmptyModule(module) ? (
                <Stack gap={1} mt={1}>
                  {module.lectureInfo.map((lecture) => (
                    <ContentItem
                      title={lecture.lectureName}
                      type='lecture'
                      onClick={() => navigate(`${pathname}/${lecture.id}`)}
                      status='done'
                      key={lecture.id}
                    />
                  ))}
                  {module.assignmentInfo.map((assignment) => (
                    <ContentItem
                      title={assignment.assignmentTitle}
                      iconUrl={actions.assignment}
                      type='assignment'
                      onClick={() => navigate(`/courses/${courseId}/assign/${assignment.id}`)}
                      key={assignment.id}
                      status={assignment.assignmentSubmissionInfo.length ? 'done' : 'pending'}
                    />
                  ))}
                  {module.quizInfo.map((quiz) => (
                    <ContentItem
                      title={quiz.quizTitle}
                      iconUrl={actions.quiz}
                      type='quiz'
                      onClick={() => navigate(`/courses/${courseId}/quiz/${quiz.id}`)}
                      key={quiz.id}
                      status={quiz.quizSubmissionInfo.length ? 'done' : 'pending'}
                    />
                  ))}
                  {module.resourceInfo.map((resource) => (
                    <ContentItem
                      title={resource.title}
                      iconUrl={getResourceType(resource.urlDocument)}
                      type='resource'
                      onClick={() => handleDownloadResource(resource.urlDocument)}
                      key={resource.id}
                    />
                  ))}
                </Stack>
              ) : (
                <NoData title='No content in this module' />
              )}
            </Collapse>
          </Stack>
        ))}
      </Stack>
    </BoxContent>
  )
}
