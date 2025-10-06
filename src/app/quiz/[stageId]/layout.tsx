import { getAllStages } from '@/content/stages'

export async function generateStaticParams() {
  const stages = getAllStages()
  
  // Only generate params for stages that have quizzes
  return stages
    .filter((stage) => stage.quiz !== null)
    .map((stage) => ({
      stageId: stage.id,
    }))
}

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
