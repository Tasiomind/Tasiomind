<script setup>
import { useAppConfig } from "@/composable/useAppConfig";
import horizontalItem from "@/menus/horizontal";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import { useLocale } from "vuetify";
import HorizontalNavGroup from "./HorizontalNavGroup.vue";
import HorizontalNavLink from "./HorizontalNavLink.vue";
import { isAnyChildActive } from "./utils";

const { t } = useLocale();
const { isNavbarFixed } = useAppConfig();

const resolveNavLinkGroup = computed(() => {
  return (navItem) => {
    if ("children" in navItem) return HorizontalNavGroup;

    return HorizontalNavLink;
  };
});
</script>

<template>
  <div
    class="layout-horizontal-nav"
    :style="!isNavbarFixed ? 'position:absolute' : ''"
  >
    <PerfectScrollbar
      :options="{ wheelPropagation: false, suppressScrollY: true }"
      class="horizontal-nav d-flex gap-2"
    >
      <template v-for="item in horizontalItem" :key="item.name">
        <VBtn
          v-if="item.children"
          variant="text"
          append-icon="mdi-chevron-down"
          class="nav-item"
          :class="{ active: isAnyChildActive(item) }"
        >
          <VIcon :icon="item.icon" size="20" />
          <span>{{ t(item.name) }}</span>

          <VMenu
            activator="parent"
            location="bottom"
            class="nav-content"
            content-class="horizontal-nav-menu-content"
            offset="10"
            open-on-hover
          >
            <VList>
              <template
                v-for="(childItem, index) in item.children"
                :key="index"
              >
                <Component
                  :is="resolveNavLinkGroup(childItem)"
                  :nav-item="childItem"
                />
              </template>
            </VList>
          </VMenu>
        </VBtn>

        <template v-else>
          <VBtn
            v-if="item.to"
            :to="item.to"
            variant="text"
            class="nav-item"
            :target="item.target ? '_blank' : ''"
          >
            <VIcon size="20" :icon="item.icon" />
            <span>{{ t(item.name) }}</span>
          </VBtn>

          <VBtn
            v-else
            :href="item.href"
            variant="text"
            class="nav-item"
            :target="item.target ? '_blank' : ''"
          >
            <VIcon size="20" :icon="item.icon" class="me-2" />
            <span>{{ t(item.name) }}</span>
          </VBtn>
        </template>
      </template>
    </PerfectScrollbar>
  </div>
</template>
