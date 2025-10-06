import { getAllStages } from '@/content/stages'

export async function generateStaticParams() {
  const stages = getAllStages()
  
  return stages.map((stage) => ({
    stageId: stage.id,
  }))
}

export default function StageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
