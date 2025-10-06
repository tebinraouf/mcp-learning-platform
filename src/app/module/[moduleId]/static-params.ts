import { getAllStages } from '@/content/stages'

export function generateStaticParams() {
    const stages = getAllStages()
    const params: { moduleId: string }[] = []

    for (const stage of stages) {
        for (const module of stage.modules) {
            params.push({ moduleId: module.id })
        }

        // Also include the quiz module if it exists
        if (stage.quiz) {
            params.push({ moduleId: stage.quiz.id })
        }
    }

    return params
}

export const dynamic = 'force-static'
