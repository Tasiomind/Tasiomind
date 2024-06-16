import { config } from '@/composable/useConfig';

// default settings
export const appConfig = config({
  title: ref('Tasiomind'),
  theme: ref('light'),
  clientID: ref(
    'af682232ba4e871aa7c6bcf10b02634b999db6f4d2bd71471b5788c17df8d560463b5e85f211338a296a6c9da80d997b',
  ),
  iv: ref('4c9f0051424de04dc72074ad3506701b'),
  navigationMenu: ref('vertical'), // horizontal or vertical
  isBoxLayout: ref(false),
  isVerticalMenuMini: ref(true),
  defaultLocale: ref('de'), // en | de
  isRtl: ref(false),
  isSemiDark: ref(false),
  skins: ref('modern'), // classic | modern | decent | bordered
  isNavbarFixed: ref(true),
});
