import {useI18n} from "vue-i18n";

export const useFormat = () => {
  const { t } = useI18n()
  return {
    format: (value) => {
      if (!value) {
        return null
      }

      return `${value.value}${t(`units.${value.unit}`)}`
    }
  }
}

