import { config } from '@/composable/useConfig';

// default settings
export const appConfig = config({
  title: ref('Tasiomind'),
  theme: ref('light'),
  clientID: ref(
    '1d24aea168c810d957612b7ce730ce22387754cc560ba8c9d3cd5fa0dea7495e1fc287b96b21211263609ef7b8fc41d8',
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
