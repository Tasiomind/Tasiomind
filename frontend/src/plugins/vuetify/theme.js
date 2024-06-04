import { appConfig } from '@appConfig'

export default {
  defaultTheme: appConfig.theme.value,
  themes: {
    light: {
      colors: {
        'primary': localStorage.getItem('app-preset') || '#0D9394',
        'on-primary': '#fff',
        'secondary': '#A9B2BC',
        'on-secondary': '#fff',
        'info': '#00B8D9',
        'success': '#22C55E',
        'on-success': '#fff',
        'warning': '#FFAB00',
        'on-warning': '#fff',
        'error': '#FF5630',
        'background': '#f9fafb',
        'on-background': '#212b36',
        'on-surface': '#212b36',
      },
      variables: {
        'border-color': '#919eab',
        'border-opacity': '0.24',
        'table-header-color': '#F4F6F8',
        'scrollbar-thumb': '#dbdade',

        // Shadows
        'shadow-key-umbra-opacity': 'rgba(var(--v-border-color), 0.2)',
        'shadow-key-penumbra-opacity': 'rgba(var(--v-border-color), 0.14)',
        'shadow-key-ambient-opacity': 'rgba(var(--v-border-color), 0.12)',
      },
    },
    dark: {
      colors: {
        'primary': localStorage.getItem('app-preset') || '#0D9394',
        'on-primary': '#fff',
        'secondary': '#A9B2BC',
        'on-secondary': '#fff',
        'info': '#00B8D9',
        'success': '#36B37E',
        'warning': '#FFAB00',
        'on-warning': '#fff',
        'error': '#FF5630',
        'background': '#151521',
        'surface': '#1e1e2d',
      },
      variables: {
        'border-color': '#eaeaff',
        'border-opacity': '0.12',
        'table-header-color': '#2F3944',
        'scrollbar-thumb': '#4a5062',

        // Shadows
        'shadow-key-umbra-opacity': 'rgba(0, 0, 0, 0.2)',
        'shadow-key-penumbra-opacity': 'rgba(0, 0, 0, 0.14)',
        'shadow-key-ambient-opacity': 'rgba(0, 0, 0, 0.12)',
      },
    },
  },
}
