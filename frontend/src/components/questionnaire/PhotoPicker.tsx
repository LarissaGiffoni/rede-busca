import { useRef, type ChangeEvent } from 'react'
import { ImagePlus, Star, Trash2 } from 'lucide-react'
import type { InMemoryPhoto } from '../../types/questionnaire'
import FormField from './FormField'

type PhotoPickerProps = {
  photos: InMemoryPhoto[]
  mainPhotoId: string | null
  error: string
  onAdd: (files: FileList | null) => void
  onRemove: (id: string) => void
  onSelectMain: (id: string) => void
}

function PhotoPicker({
  photos,
  mainPhotoId,
  error,
  onAdd,
  onRemove,
  onSelectMain,
}: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onAdd(event.target.files)
    event.target.value = ''
  }

  return (
    <div className="photo-picker">
      <FormField
        label="Fotografias recentes"
        hint="JPEG, PNG ou WebP · até 5 MB por imagem · máximo de 3. Os arquivos ficam somente nesta sessão e não serão enviados."
        error={error}
      >
        <input
          ref={inputRef}
          className="visually-hidden"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          tabIndex={-1}
          onChange={handleChange}
          aria-label="Selecionar fotografias"
        />
        <button
          className="photo-add-button"
          type="button"
          disabled={photos.length >= 3}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus size={18} aria-hidden="true" />
          Selecionar imagens
        </button>
      </FormField>

      {photos.length > 0 && (
        <ul className="photo-list" aria-label="Imagens selecionadas">
          {photos.map((photo, index) => (
            <li className="photo-item" key={photo.id}>
              <img src={photo.previewUrl} alt={`Prévia da imagem ${index + 1}`} />
              <div className="photo-item-info">
                <span className="photo-item-name">{photo.file.name}</span>
                <span className="photo-item-size">
                  {(photo.file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
              <label className="photo-main-choice">
                <input
                  type="radio"
                  name="main-photo"
                  checked={mainPhotoId === photo.id}
                  onChange={() => onSelectMain(photo.id)}
                />
                <Star size={15} aria-hidden="true" />
                <span>Principal</span>
              </label>
              <button
                className="photo-remove-button"
                type="button"
                onClick={() => onRemove(photo.id)}
                aria-label={`Remover ${photo.file.name}`}
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PhotoPicker
