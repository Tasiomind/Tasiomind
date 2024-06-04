import { config } from '@/composable/useConfig';

// default settings
export const appConfig = config({
  title: ref('Tasiomind'),
  theme: ref('light'),
  clientID: ref('f078d36a-b15a-4387-a0e3-726b7e48b777'),
  navigationMenu: ref('vertical'), // horizontal or vertical
  isBoxLayout: ref(false),
  isVerticalMenuMini: ref(true),
  defaultLocale: ref('de'), // en | de
  isRtl: ref(false),
  isSemiDark: ref(false),
  skins: ref('modern'), // classic | modern | decent | bordered
  isNavbarFixed: ref(true),
});
