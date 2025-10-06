import { getAllStages } from '@/content/stages'

export async function generateStaticParams() {
  const stages = getAllStages()
  const params: { moduleId: string }[] = []
  
  for (const stage of stages) {
    // Add all regular modules
    for (const module of stage.modules) {
      params.push({ moduleId: module.id })
    }
    
    // Add quiz module if it exists
    if (stage.quiz) {
      params.push({ moduleId: stage.quiz.id })
    }
  }
  
  return params
}

export default function ModuleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
