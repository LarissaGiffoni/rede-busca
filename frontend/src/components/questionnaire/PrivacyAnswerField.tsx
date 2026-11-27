import type { ChangeEvent } from 'react'
import type { SensitiveAnswer } from '../../types/questionnaire'
import FormField from './FormField'

type PrivacyAnswerFieldProps = {
  id: string
  label: string
  answer: SensitiveAnswer
  onChange: (answer: SensitiveAnswer) => void
}

function PrivacyAnswerField({
  id,
  label,
  answer,
  onChange,
}: PrivacyAnswerFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...answer, value: event.target.value })
  }

  return (
    <FormField label={label} htmlFor={id}>
      <textarea
        id={id}
        className="question-control question-textarea"
        rows={3}
        value={answer.value}
        disabled={answer.preferNotToSay}
        onChange={handleChange}
      />
      <label className="question-check-line private-answer-toggle">
        <input
          type="checkbox"
          checked={answer.preferNotToSay}
          onChange={(event) =>
            onChange({
              value: event.target.checked ? '' : answer.value,
              preferNotToSay: event.target.checked,
            })
          }
        />
        <span>Prefiro não informar</span>
      </label>
    </FormField>
  )
}

export default PrivacyAnswerField
