import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AlertTriangle, ArrowLeft, ArrowRight, Check, LockKeyhole } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import FormField from '../components/questionnaire/FormField'
import PhotoPicker from '../components/questionnaire/PhotoPicker'
import PrivacyAnswerField from '../components/questionnaire/PrivacyAnswerField'
import QuestionnaireHeader from '../components/questionnaire/QuestionnaireHeader'
import {
  initialQuestionnaire,
  questionnaireSteps,
  type InMemoryPhoto,
  type MissingPersonQuestionnaire,
  type SensitiveAnswer,
  type TransportMode,
  type YesNoPrefer,
} from '../types/questionnaire'

type FieldErrors = Record<string, string>

const stateOptions = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
]

function localDateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function displayDate(value: string) {
  if (!value) return 'Não informado'
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-BR').format(new Date(year, month - 1, day))
}

function displayAnswer(answer: SensitiveAnswer) {
  if (answer.preferNotToSay) return 'Preferiu não informar'
  return answer.value.trim() || 'Não informado'
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="review-line">
      <dt>{label}</dt>
      <dd>{value || 'Não informado'}</dd>
    </div>
  )
}

function ReviewSection({
  title,
  description,
  onEdit,
  children,
}: {
  title: string
  description?: string
  onEdit: () => void
  children: ReactNode
}) {
  return (
    <section className="review-section">
      <div className="review-section-heading">
        <div>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        <button className="review-edit-button" type="button" onClick={onEdit}>
          Editar
        </button>
      </div>
      {children}
    </section>
  )
}

function MissingPersonFormPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] =
    useState<MissingPersonQuestionnaire>(initialQuestionnaire)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [photos, setPhotos] = useState<InMemoryPhoto[]>([])
  const [mainPhotoId, setMainPhotoId] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState('')
  const photosRef = useRef<InMemoryPhoto[]>([])
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    photosRef.current = photos
  }, [photos])

  useEffect(() => {
    stepHeadingRef.current?.focus()
  }, [step])

  useEffect(
    () => () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl))
    },
    [],
  )

  const updateAnswer = <K extends keyof MissingPersonQuestionnaire>(
    key: K,
    value: MissingPersonQuestionnaire[K],
  ) => {
    setAnswers((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  const updateSensitiveAnswer = (
    key:
      | 'healthConditions'
      | 'continuousMedication'
      | 'mobilityDifficulty'
      | 'memoryOrDisorientation'
      | 'disappearanceHistory'
      | 'otherRelevantInformation',
    value: SensitiveAnswer,
  ) => updateAnswer(key, value)

  const validateStep = () => {
    const nextErrors: FieldErrors = {}
    if (step === 0) {
      if (!answers.personName.trim()) nextErrors.personName = 'Informe o nome completo.'
      const age = Number(answers.age)
      if (!answers.age.trim()) {
        nextErrors.age = 'Informe a idade.'
      } else if (!Number.isInteger(age) || age < 0 || age > 120) {
        nextErrors.age = 'Informe uma idade válida entre 0 e 120 anos.'
      }
    }

    if (step === 1) {
      if (!answers.lastContactDate) {
        nextErrors.lastContactDate = 'Informe a data do último contato.'
      } else if (answers.lastContactDate > localDateValue(new Date())) {
        nextErrors.lastContactDate = 'A data do desaparecimento não pode ser futura.'
      }
      if (!answers.lastContactTime) nextErrors.lastContactTime = 'Informe o horário aproximado.'
      if (!answers.state) nextErrors.state = 'Selecione o estado.'
      if (!answers.city.trim()) nextErrors.city = 'Informe a cidade.'
      if (!answers.neighborhood.trim()) nextErrors.neighborhood = 'Informe o bairro.'

      if (
        answers.lastContactDate === localDateValue(new Date()) &&
        answers.lastContactTime
      ) {
        const [hour, minute] = answers.lastContactTime.split(':').map(Number)
        const selected = new Date()
        selected.setHours(hour, minute, 0, 0)
        if (selected > new Date()) {
          nextErrors.lastContactTime = 'O horário não pode estar no futuro.'
        }
      }
    }

    if (step === 3) {
      if (!answers.responsibilityConfirmed) {
        nextErrors.responsibilityConfirmed =
          'É necessário confirmar a responsabilidade pelas informações.'
      }
      if (
        Number(answers.age) < 18 &&
        !answers.legalGuardianConsent
      ) {
        nextErrors.legalGuardianConsent =
          'Para menores de 18 anos, confirme a autorização do responsável legal.'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleContinue = () => {
    if (!validateStep()) return
    setStep((current) => Math.min(current + 1, questionnaireSteps.length - 1))
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setStep((current) => Math.max(current - 1, 0))
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToStep = (target: number) => {
    if (target >= step) return
    setStep(target)
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddPhotos = (fileList: FileList | null) => {
    if (!fileList) return
    const selected = Array.from(fileList)
    const availableSlots = 3 - photos.length
    const accepted: File[] = []
    let message = ''

    for (const file of selected) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        message = 'Formato não aceito. Escolha arquivos JPEG, PNG ou WebP.'
        continue
      }
      if (file.size > 5 * 1024 * 1024) {
        message = 'Cada imagem deve ter no máximo 5 MB.'
        continue
      }
      if (accepted.length >= availableSlots) {
        message = 'É possível selecionar até três imagens.'
        continue
      }
      accepted.push(file)
    }

    const newPhotos = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    if (newPhotos.length > 0) {
      setPhotos((current) => [...current, ...newPhotos])
      setMainPhotoId((current) => current ?? newPhotos[0].id)
    }
    setPhotoError(message)
  }

  const handleRemovePhoto = (id: string) => {
    const photo = photos.find((item) => item.id === id)
    if (photo) URL.revokeObjectURL(photo.previewUrl)
    const remaining = photos.filter((item) => item.id !== id)
    setPhotos(remaining)
    if (mainPhotoId === id) setMainPhotoId(remaining[0]?.id ?? null)
  }

  const currentDate = localDateValue(new Date())
  const age = Number(answers.age)
  const isMinor = answers.age !== '' && age < 18
  const mainPhoto = photos.find((photo) => photo.id === mainPhotoId)

  const privateLocation = [answers.neighborhood, answers.city, answers.state]
    .filter(Boolean)
    .join(' · ')

  const handleExit = () => {
    navigate('/dashboard')
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <FormField
              label="Nome completo da pessoa desaparecida"
              htmlFor="person-name"
              required
              error={errors.personName}
            >
              <input
                id="person-name"
                className="question-control"
                autoComplete="off"
                required
                value={answers.personName}
                onChange={(event) => updateAnswer('personName', event.target.value)}
                aria-invalid={Boolean(errors.personName)}
                aria-describedby={errors.personName ? 'person-name-error' : undefined}
              />
            </FormField>
            <div className="question-grid question-grid-two">
              <FormField
                label="Idade"
                htmlFor="person-age"
                required
                error={errors.age}
              >
                <input
                  id="person-age"
                  className="question-control"
                  type="number"
                  min="0"
                  max="120"
                  inputMode="numeric"
                  required
                  value={answers.age}
                  onChange={(event) => updateAnswer('age', event.target.value)}
                  aria-invalid={Boolean(errors.age)}
                  aria-describedby={errors.age ? 'person-age-error' : undefined}
                />
              </FormField>
              <FormField label="Altura aproximada" htmlFor="person-height" hint="Ex.: 1,70 m">
                <input
                  id="person-height"
                  className="question-control"
                  maxLength={20}
                  value={answers.height}
                  onChange={(event) => updateAnswer('height', event.target.value)}
                />
              </FormField>
            </div>
            <FormField label="Características físicas" htmlFor="physical-characteristics">
              <textarea
                id="physical-characteristics"
                className="question-control question-textarea"
                rows={3}
                value={answers.physicalCharacteristics}
                onChange={(event) =>
                  updateAnswer('physicalCharacteristics', event.target.value)
                }
                placeholder="Descreva, por exemplo, cabelo, olhos ou compleição."
              />
            </FormField>
            <FormField
              label="Sinais particulares"
              htmlFor="distinguishing-marks"
              hint="Tatuagens, cicatrizes, marcas de nascença ou outros detalhes."
            >
              <textarea
                id="distinguishing-marks"
                className="question-control question-textarea"
                rows={3}
                value={answers.distinguishingMarks}
                onChange={(event) =>
                  updateAnswer('distinguishingMarks', event.target.value)
                }
              />
            </FormField>
          </>
        )
      case 1:
        return (
          <>
            <div className="question-grid question-grid-two">
              <FormField
                label="Data do último contato"
                htmlFor="last-contact-date"
                required
                error={errors.lastContactDate}
              >
                <input
                  id="last-contact-date"
                  className="question-control"
                  type="date"
                  max={currentDate}
                  required
                  value={answers.lastContactDate}
                  onChange={(event) => updateAnswer('lastContactDate', event.target.value)}
                  aria-invalid={Boolean(errors.lastContactDate)}
                  aria-describedby={errors.lastContactDate ? 'last-contact-date-error' : undefined}
                />
              </FormField>
              <FormField
                label="Horário aproximado"
                htmlFor="last-contact-time"
                required
                error={errors.lastContactTime}
              >
                <input
                  id="last-contact-time"
                  className="question-control"
                  type="time"
                  required
                  value={answers.lastContactTime}
                  onChange={(event) => updateAnswer('lastContactTime', event.target.value)}
                  aria-invalid={Boolean(errors.lastContactTime)}
                  aria-describedby={errors.lastContactTime ? 'last-contact-time-error' : undefined}
                />
              </FormField>
            </div>
            <div className="question-grid question-grid-three">
              <FormField label="Estado" htmlFor="location-state" required error={errors.state}>
                <select
                  id="location-state"
                  className="question-control"
                  required
                  value={answers.state}
                  onChange={(event) => updateAnswer('state', event.target.value)}
                  aria-invalid={Boolean(errors.state)}
                  aria-describedby={errors.state ? 'location-state-error' : undefined}
                >
                  <option value="">Selecione</option>
                  {stateOptions.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Cidade" htmlFor="location-city" required error={errors.city}>
                <input
                  id="location-city"
                  className="question-control"
                  required
                  value={answers.city}
                  onChange={(event) => updateAnswer('city', event.target.value)}
                  aria-invalid={Boolean(errors.city)}
                  aria-describedby={errors.city ? 'location-city-error' : undefined}
                />
              </FormField>
              <FormField
                label="Bairro"
                htmlFor="location-neighborhood"
                required
                error={errors.neighborhood}
              >
                <input
                  id="location-neighborhood"
                  className="question-control"
                  required
                  value={answers.neighborhood}
                  onChange={(event) => updateAnswer('neighborhood', event.target.value)}
                  aria-invalid={Boolean(errors.neighborhood)}
                  aria-describedby={errors.neighborhood ? 'location-neighborhood-error' : undefined}
                />
              </FormField>
            </div>
            <div className="question-private-box">
              <LockKeyhole size={16} aria-hidden="true" />
              <div>
                <strong>Endereço conhecido — informação privada</strong>
                <p>Este dado não será exibido na prévia pública.</p>
              </div>
            </div>
            <FormField label="Último endereço conhecido" htmlFor="last-address">
              <input
                id="last-address"
                className="question-control"
                autoComplete="off"
                value={answers.lastKnownAddress}
                onChange={(event) => updateAnswer('lastKnownAddress', event.target.value)}
              />
            </FormField>
            <FormField label="Roupa utilizada" htmlFor="clothing">
              <textarea
                id="clothing"
                className="question-control question-textarea"
                rows={2}
                value={answers.clothing}
                onChange={(event) => updateAnswer('clothing', event.target.value)}
              />
            </FormField>
            <FormField label="Descrição das circunstâncias" htmlFor="circumstances">
              <textarea
                id="circumstances"
                className="question-control question-textarea"
                rows={4}
                value={answers.circumstances}
                onChange={(event) => updateAnswer('circumstances', event.target.value)}
              />
            </FormField>
            <FormField label="Meio de deslocamento provável" htmlFor="likely-transport">
              <select
                id="likely-transport"
                className="question-control"
                value={answers.likelyTransport}
                onChange={(event) =>
                  updateAnswer('likelyTransport', event.target.value as TransportMode | '')
                }
              >
                <option value="">Selecione, se souber</option>
                <option value="walking">A pé</option>
                <option value="vehicle">Veículo</option>
                <option value="public-transport">Transporte público</option>
                <option value="unknown">Desconhecido</option>
              </select>
            </FormField>
          </>
        )
      case 2:
        return (
          <>
            <div className="question-private-notice" role="note">
              <LockKeyhole size={17} aria-hidden="true" />
              <p>
                <strong>Informações privadas.</strong> O conteúdo desta etapa não será publicado
                nem exibido na prévia pública.
              </p>
            </div>
            <PrivacyAnswerField
              id="health-conditions"
              label="Condições de saúde"
              answer={answers.healthConditions}
              onChange={(value) => updateSensitiveAnswer('healthConditions', value)}
            />
            <PrivacyAnswerField
              id="continuous-medication"
              label="Uso de medicamentos contínuos"
              answer={answers.continuousMedication}
              onChange={(value) => updateSensitiveAnswer('continuousMedication', value)}
            />
            <PrivacyAnswerField
              id="mobility-difficulty"
              label="Dificuldade de locomoção"
              answer={answers.mobilityDifficulty}
              onChange={(value) => updateSensitiveAnswer('mobilityDifficulty', value)}
            />
            <PrivacyAnswerField
              id="memory-orientation"
              label="Problemas de memória ou desorientação"
              answer={answers.memoryOrDisorientation}
              onChange={(value) => updateSensitiveAnswer('memoryOrDisorientation', value)}
            />
            <PrivacyAnswerField
              id="disappearance-history"
              label="Histórico de desaparecimento"
              answer={answers.disappearanceHistory}
              onChange={(value) => updateSensitiveAnswer('disappearanceHistory', value)}
            />
            <PrivacyAnswerField
              id="other-relevant"
              label="Outras informações relevantes"
              answer={answers.otherRelevantInformation}
              onChange={(value) => updateSensitiveAnswer('otherRelevantInformation', value)}
            />
          </>
        )
      case 3:
        return (
          <>
            <div className="question-emergency" role="note">
              <AlertTriangle size={19} aria-hidden="true" />
              <p>
                <strong>Procure as autoridades imediatamente.</strong> Não é necessário esperar
                24 horas para registrar um desaparecimento.
              </p>
            </div>
            <FormField label="Nome do informante" htmlFor="informant-name">
              <input
                id="informant-name"
                className="question-control"
                autoComplete="name"
                value={answers.informantName}
                onChange={(event) => updateAnswer('informantName', event.target.value)}
              />
            </FormField>
            <div className="question-grid question-grid-two">
              <FormField label="Grau de parentesco ou vínculo" htmlFor="relationship">
                <input
                  id="relationship"
                  className="question-control"
                  value={answers.relationship}
                  onChange={(event) => updateAnswer('relationship', event.target.value)}
                />
              </FormField>
              <FormField
                label="Telefone de contato"
                htmlFor="contact-phone"
                hint="Privado — não será exibido publicamente."
              >
                <input
                  id="contact-phone"
                  className="question-control"
                  type="tel"
                  autoComplete="tel"
                  value={answers.contactPhone}
                  onChange={(event) => updateAnswer('contactPhone', event.target.value)}
                />
              </FormField>
            </div>
            <FormField label="Possui boletim de ocorrência?" htmlFor="police-report">
              <select
                id="police-report"
                className="question-control"
                value={answers.hasPoliceReport}
                onChange={(event) =>
                  updateAnswer('hasPoliceReport', event.target.value as YesNoPrefer | '')
                }
              >
                <option value="">Selecione, se desejar</option>
                <option value="yes">Sim</option>
                <option value="no">Não</option>
                <option value="prefer-not-to-say">Prefiro não informar</option>
              </select>
            </FormField>
            {answers.hasPoliceReport === 'yes' && (
              <FormField
                label="Número do boletim"
                htmlFor="police-report-number"
                hint="Opcional e privado."
              >
                <input
                  id="police-report-number"
                  className="question-control"
                  value={answers.policeReportNumber}
                  onChange={(event) =>
                    updateAnswer('policeReportNumber', event.target.value)
                  }
                />
              </FormField>
            )}
            <label className="question-check-line declaration-line">
              <input
                type="checkbox"
                checked={answers.responsibilityConfirmed}
                onChange={(event) =>
                  updateAnswer('responsibilityConfirmed', event.target.checked)
                }
                aria-invalid={Boolean(errors.responsibilityConfirmed)}
              />
              <span>
                Declaro que as informações fornecidas são verdadeiras e assumo responsabilidade
                por elas. <span className="question-required">*</span>
              </span>
            </label>
            {errors.responsibilityConfirmed && (
              <p className="question-error" role="alert">{errors.responsibilityConfirmed}</p>
            )}
            {isMinor && (
              <>
                <label className="question-check-line declaration-line">
                  <input
                    type="checkbox"
                    checked={answers.legalGuardianConsent}
                    onChange={(event) =>
                      updateAnswer('legalGuardianConsent', event.target.checked)
                    }
                    aria-invalid={Boolean(errors.legalGuardianConsent)}
                  />
                  <span>
                    Sou responsável legal pela pessoa menor de 18 anos e autorizo este registro.
                    <span className="question-required"> *</span>
                  </span>
                </label>
                {errors.legalGuardianConsent && (
                  <p className="question-error" role="alert">{errors.legalGuardianConsent}</p>
                )}
              </>
            )}
          </>
        )
      case 4:
        return (
          <>
            <p className="question-intro">
              As imagens ficam somente na memória desta página. Nenhum arquivo será enviado nesta
              etapa do desenvolvimento.
            </p>
            <PhotoPicker
              photos={photos}
              mainPhotoId={mainPhotoId}
              error={photoError}
              onAdd={handleAddPhotos}
              onRemove={handleRemovePhoto}
              onSelectMain={setMainPhotoId}
            />
          </>
        )
      default:
        return (
          <div className="question-review">
            <div className="question-private-notice" role="note">
              <LockKeyhole size={17} aria-hidden="true" />
              <p>
                Revise as informações. Os dados privados estão separados e não fazem parte da
                prévia pública.
              </p>
            </div>
            <ReviewSection
              title="Identificação"
              description="Informações públicas sobre a pessoa."
              onEdit={() => goToStep(0)}
            >
              <dl className="review-list">
                <SummaryLine label="Nome" value={answers.personName} />
                <SummaryLine label="Idade" value={`${answers.age} anos`} />
                <SummaryLine label="Altura" value={answers.height} />
                <SummaryLine label="Características físicas" value={answers.physicalCharacteristics} />
                <SummaryLine label="Sinais particulares" value={answers.distinguishingMarks} />
              </dl>
            </ReviewSection>
            <ReviewSection
              title="Circunstâncias"
              description="Informações públicas sobre o último contato."
              onEdit={() => goToStep(1)}
            >
              <dl className="review-list">
                <SummaryLine
                  label="Último contato"
                  value={`${displayDate(answers.lastContactDate)}${answers.lastContactTime ? ` · ${answers.lastContactTime}` : ''}`}
                />
                <SummaryLine label="Localidade" value={privateLocation} />
                <SummaryLine label="Roupa utilizada" value={answers.clothing} />
                <SummaryLine label="Circunstâncias" value={answers.circumstances} />
                <SummaryLine
                  label="Deslocamento provável"
                  value={{
                    walking: 'A pé',
                    vehicle: 'Veículo',
                    'public-transport': 'Transporte público',
                    unknown: 'Desconhecido',
                  }[answers.likelyTransport as TransportMode] ?? 'Não informado'}
                />
              </dl>
              {mainPhoto && (
                <figure className="review-main-photo">
                  <img src={mainPhoto.previewUrl} alt="Fotografia principal selecionada" />
                  <figcaption>Fotografia principal · {mainPhoto.file.name}</figcaption>
                </figure>
              )}
            </ReviewSection>
            <ReviewSection
              title="Informações complementares privadas"
              description="Visíveis somente nesta revisão local. Não serão publicadas."
              onEdit={() => goToStep(2)}
            >
              <dl className="review-list">
                <SummaryLine label="Condições de saúde" value={displayAnswer(answers.healthConditions)} />
                <SummaryLine label="Medicamentos contínuos" value={displayAnswer(answers.continuousMedication)} />
                <SummaryLine label="Dificuldade de locomoção" value={displayAnswer(answers.mobilityDifficulty)} />
                <SummaryLine label="Memória ou desorientação" value={displayAnswer(answers.memoryOrDisorientation)} />
                <SummaryLine label="Histórico de desaparecimento" value={displayAnswer(answers.disappearanceHistory)} />
                <SummaryLine label="Outras informações" value={displayAnswer(answers.otherRelevantInformation)} />
              </dl>
              <div className="review-local-note">
                <LockKeyhole size={15} aria-hidden="true" />
                Este resumo existe apenas na memória desta página e será descartado ao sair.
              </div>
            </ReviewSection>
            <ReviewSection
              title="Endereço conhecido — privado"
              description="Este endereço não será exibido publicamente."
              onEdit={() => goToStep(1)}
            >
              <dl className="review-list">
                <SummaryLine label="Último endereço conhecido" value={answers.lastKnownAddress} />
              </dl>
            </ReviewSection>
            <ReviewSection
              title="Informações do responsável"
              description="Dados de contato privados, não incluídos na prévia pública."
              onEdit={() => goToStep(3)}
            >
              <dl className="review-list">
                <SummaryLine label="Nome do informante" value={answers.informantName} />
                <SummaryLine label="Vínculo" value={answers.relationship} />
                <SummaryLine label="Telefone" value={answers.contactPhone} />
                <SummaryLine
                  label="Boletim de ocorrência"
                  value={{
                    yes: 'Sim',
                    no: 'Não',
                    'prefer-not-to-say': 'Preferiu não informar',
                  }[answers.hasPoliceReport as YesNoPrefer] ?? 'Não informado'}
                />
                <SummaryLine label="Número do boletim" value={answers.policeReportNumber} />
                <SummaryLine
                  label="Declaração de responsabilidade"
                  value={answers.responsibilityConfirmed ? 'Confirmada' : 'Não confirmada'}
                />
                {isMinor && (
                  <SummaryLine
                    label="Consentimento do responsável legal"
                    value={answers.legalGuardianConsent ? 'Confirmado' : 'Não confirmado'}
                  />
                )}
              </dl>
            </ReviewSection>
            <ReviewSection
              title="Fotografias"
              description={`${photos.length} imagem(ns) selecionada(s), mantidas nesta sessão.`}
              onEdit={() => goToStep(4)}
            >
              {photos.length > 0 ? (
                <ul className="review-photo-list">
                  {photos.map((photo) => (
                    <li key={photo.id}>
                      <img src={photo.previewUrl} alt={`Prévia de ${photo.file.name}`} />
                      <span>
                        {photo.file.name}
                        {photo.id === mainPhotoId ? ' · Principal' : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="question-hint">Nenhuma fotografia selecionada.</p>
              )}
            </ReviewSection>
            <section className="review-preview" aria-labelledby="publication-preview-heading">
              <p className="question-step-kicker">Prévia da publicação</p>
              <h3 id="publication-preview-heading">
                {answers.personName || 'Nome da pessoa'}
                {answers.age ? `, ${answers.age} anos` : ''}
              </h3>
              <p>
                {[answers.city, answers.state].filter(Boolean).join(' · ') || 'Localidade não informada'}
                {answers.lastContactDate
                  ? ` · último contato em ${displayDate(answers.lastContactDate)}`
                  : ''}
              </p>
              <p className="publication-unavailable">
                A publicação ainda não está disponível nesta fase do desenvolvimento. Nenhuma
                informação será enviada ou publicada.
              </p>
              <button className="question-submit-disabled" type="button" disabled>
                Publicação indisponível
              </button>
            </section>
          </div>
        )
    }
  }

  return (
    <main className="questionnaire-shell">
      <QuestionnaireHeader />
      <div className="questionnaire-container">
        <div className="questionnaire-title-row">
          <div>
            <p className="dashboard-eyebrow">Registro responsável</p>
            <h1 className="questionnaire-title">Registrar desaparecimento</h1>
            <p className="questionnaire-lede">
              Compartilhe as informações com cuidado. Campos privados estão identificados e não
              serão publicados.
            </p>
          </div>
          <button className="questionnaire-exit" type="button" onClick={handleExit}>
            Voltar ao painel
          </button>
        </div>

        <nav className="question-progress" aria-label="Progresso do questionário">
          <ol>
            {questionnaireSteps.map((label, index) => (
              <li
                key={label}
                className={index === step ? 'is-current' : index < step ? 'is-complete' : ''}
                aria-current={index === step ? 'step' : undefined}
              >
                <span className="progress-number">
                  {index < step ? <Check size={14} aria-hidden="true" /> : `0${index + 1}`}
                </span>
                <span className="progress-label">{label}</span>
              </li>
            ))}
          </ol>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Progresso do questionário"
            aria-valuemin={1}
            aria-valuemax={questionnaireSteps.length}
            aria-valuenow={step + 1}
          >
            <span style={{ width: `${((step + 1) / questionnaireSteps.length) * 100}%` }} />
          </div>
        </nav>

        <section className="questionnaire-panel" aria-labelledby="step-heading">
          <header className="questionnaire-step-heading">
            <div>
              <p className="question-step-kicker">Etapa 0{step + 1} de 06</p>
              <h2 id="step-heading" ref={stepHeadingRef} tabIndex={-1}>
                {questionnaireSteps[step]}
              </h2>
            </div>
            {step < 5 && (
              <p className="question-step-required">
                <span className="question-required">*</span> Campos obrigatórios
              </p>
            )}
          </header>

          <div className="questionnaire-fields" key={step}>
            {renderStep()}
          </div>

          <div className="questionnaire-actions">
            <button
              className="question-back"
              type="button"
              onClick={handleBack}
              disabled={step === 0}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Voltar
            </button>
            {step < 5 && (
              <button className="question-continue" type="button" onClick={handleContinue}>
                Continuar
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </section>

        <p className="questionnaire-footer-note">
          <LockKeyhole size={14} aria-hidden="true" />
          Suas respostas permanecem nesta página e não são salvas no dispositivo.
        </p>
        <footer className="dashboard-footer">
          <span>Rede Busca</span>
          <span>Informação e apoio</span>
        </footer>
      </div>
      <span className="visually-hidden" aria-live="polite">
        Etapa {step + 1} de {questionnaireSteps.length}: {questionnaireSteps[step]}
      </span>
    </main>
  )
}

export default MissingPersonFormPage
