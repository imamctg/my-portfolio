'use client'

import React from 'react'

// Define question type
export type QuestionType = {
  questionText: string
  options: string[]
  correctAnswer: number
  marks: number
  explanation?: string
}

// Updated props: remove index parameter
type QuestionEditorProps = {
  question: QuestionType
  onChange: (updated: QuestionType) => void
  onDelete: () => void
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onChange,
  onDelete,
}) => {
  const updateField = (field: keyof QuestionType, value: any) => {
    onChange({ ...question, [field]: value })
  }

  const updateOption = (optIndex: number, value: string) => {
    const newOptions = [...question.options]
    newOptions[optIndex] = value
    onChange({ ...question, options: newOptions })
  }

  return (
    <div className='border rounded p-4 mt-4 bg-gray-50'>
      <div className='flex justify-between items-center mb-2'>
        <label className='font-medium'>Question</label>
        <button onClick={onDelete} className='text-red-500 text-sm'>
          ❌ Remove
        </button>
      </div>

      <input
        value={question.questionText}
        onChange={(e) => updateField('questionText', e.target.value)}
        className='w-full border p-2 rounded mb-2'
        placeholder='Enter question text'
      />

      {question.options.map((opt, i) => (
        <div key={i} className='flex items-center gap-2 mb-1'>
          <input
            type='radio'
            checked={question.correctAnswer === i}
            onChange={() => updateField('correctAnswer', i)}
          />
          <input
            value={opt}
            onChange={(e) => updateOption(i, e.target.value)}
            className='w-full border p-2 rounded'
            placeholder={`Option ${String.fromCharCode(65 + i)}`}
          />
        </div>
      ))}

      <div className='grid grid-cols-2 gap-4 mt-2'>
        <div>
          <label className='block text-sm'>Marks</label>
          <input
            type='number'
            value={question.marks}
            onChange={(e) =>
              updateField('marks', parseInt(e.target.value || '0'))
            }
            className='w-full border p-2 rounded'
          />
        </div>

        <div>
          <label className='block text-sm'>Explanation (optional)</label>
          <input
            value={question.explanation || ''}
            onChange={(e) => updateField('explanation', e.target.value)}
            className='w-full border p-2 rounded'
          />
        </div>
      </div>
    </div>
  )
}

export default QuestionEditor
