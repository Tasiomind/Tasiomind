<template>
  <v-container fluid>
    <v-row justify="end" class="py-7 px-3">
      <v-spacer></v-spacer>
      <slot name="additionalButtonsAbove" />
      <v-btn
        v-for="createItem in createItems"
        :key="createItem.label"
        :prepend-icon="createItem.icon"
        color="primary"
        @click="createItem.callback(createItem)"
      >
        {{ createItem.label || t("defaultCreate") }}
      </v-btn>
    </v-row>
    <v-card flat class="rounded-lg w-100">
      <v-card-title class="d-flex align-center pe-2">
        {{ tableTitle }}
        <v-spacer></v-spacer>
        <v-text-field
          v-if="!isSearchHidden"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          :placeholder="t('Search')"
          hide-details
          class="pa-2"
        ></v-text-field>
        <Menu v-if="!isMenuHidden && menuItems" :items="menuItems" />
        <v-btn
          @click="isCellsSearchHidden = !isCellsSearchHidden"
          v-if="isCellsSearchHiddenBTN"
          class="pa-2"
          color="primary"
          elevation="0"
          variant="text"
          icon
        >
          <v-icon v-if="isCellsSearchHidden">mdi-filter</v-icon>
          <v-icon v-else>mdi-filter-off</v-icon>
        </v-btn>
      </v-card-title>
      <v-data-table
        :items="filteredData()"
        :headers="headers"
        :loading="!filteredData()"
        :sort-by="sortBy"
        :search="search"
        @click:row="onRowClick"
        :loading-text="t('loading')"
        :no-data-text="t('noData')"
        :no-results-text="t('noResults')"
        :items-per-page-options="itemsPerPageOptions"
        :items-per-page-text="t('itemsPerPage')"
        :footer-props="{
          showFirstLastPage: true,
          firstIcon: 'mdi-chevron-left',
          lastIcon: 'mdi-chevron-right',
          prevIcon: 'mdi-chevron-left',
          nextIcon: 'mdi-chevron-right',
        }"
        return-object
      >
        <template
          v-for="(header, i) in headers"
          v-slot:[`header.${header.key}`]="{}"
        >
          <div
            :key="i"
            class="column"
            @click="header.sortable == false ? '' : changeSort(header)"
          >
            {{ header.title }}
            <v-icon
              class="sortable-icon"
              small
              v-bind:class="pagination.sortBy == header.title ? 'active' : ''"
              >{{
                pagination.descending ? "mdi-chevron-down" : "mdi-chevron-up"
              }}</v-icon
            >

            <div v-if="!isCellsSearchHidden" @click.stop :key="i">
              <v-text-field
                v-model="searchResults[header.key]"
                v-if="!header.cellSearchHidden"
                :key="i"
                variant="underlined"
                hide-details
                type="text"
                :placeholder="`${t('Search')} ${t(header.key)}`"
              ></v-text-field>
            </div>
          </div>
        </template>

        <!-- ITEM SLOTS -->
        <!-- ID ITEM -->
        <template v-slot:item.id="{ item }">
          <v-tooltip :text="t('copy', { id: item.id })">
            <template #activator="{ props }">
              <v-btn
                variant="text"
                size="small"
                icon="mdi-identifier"
                v-bind="props"
                @click="item.callback(item.id)"
              >
              </v-btn>
            </template>
          </v-tooltip>
        </template>

        <!-- status ITEM -->
        <template v-slot:item.status="{ value }">
          <status :status="value" />
        </template>

        <!-- icon ITEM -->
        <template v-slot:item.icon="{ value }">
          <v-icon
            v-if="value"
            :color="value.color"
            :icon="value.icon"
            class="pl-3"
          />
        </template>

        <!-- status ITEM -->
        <template v-slot:item.state="{ item }">
          <div class="text-center">
            <v-chip
              :color="item.status.color"
              :text="item.status.title"
              class="text-uppercase"
              label
              size="small"
            ></v-chip>
          </div>
        </template>

        <!-- button ITEM -->
        <template v-slot:item.button="{ item }">
          <v-btn
            @click.stop="item.button.callback(item)"
            :icon="item.button.icon"
            :variant="item.button.variant"
          />
        </template>

        <!-- LOADING -->
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5" />
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import Menu from "@/components/menu/menu.vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const idCopiedInfo = ref(false);
const loading = ref(false);

const props = defineProps({
  headers: {
    required: true,
  },
  rows: {
    required: true,
  },
  sortBy: {
    type: String,
  },
  error: {},
  itemsPerPage: {
    default: 10,
  },
  tableTitle: {
    default: "",
  },
  sortHidden: {
    type: Boolean,
    default: true,
  },
  itemsPerPageOptions: {
    type: Array,
    default: () => [10, 20, 30, 40, 50, 100],
  },
  searchHidden: {
    type: Boolean,
    default: true,
  },
  cellSearchHidden: {
    type: Boolean,
    default: false,
  },
  isCellsSearchHiddenBTN: {
    type: Boolean,
    default: true,
  },
  menuHidden: {
    type: Boolean,
    default: false,
  },
  menuItems: {
    type: Array,
    default: null,
  },
  showCurrentPage: {
    type: Boolean,
    default: false,
  },
  editRouteName: {},
  editRouteFn: {},
  copyRouteName: {},
  copyRouteFn: {},
  onRowClick: {},
  createItems: {
    type: Array,
    default: null,
  },
  lastEvaluatedKey: {},
  loadMore: {},
});

const itemsPerPageOptions = ref(props.itemsPerPageOptions);

let pagination = {
  sortBy: null,
  descending: false,
};
const changeSort = (column) => {
  if (pagination.sortBy === column.title) {
    pagination.descending = !pagination.descending;
  } else {
    pagination.sortBy = column.title;
    pagination.descending = false;
  }
};
const isSearchHidden = ref(props.searchHidden);
const isCellsSearchHidden = ref(props.cellSearchHidden);
const isMenuHidden = ref(props.menuHidden);

const search = ref("");
const searchResults = ref({});

const filteredData = () => {
  if (searchResults && props.rows) {
    return props.rows.filter((item) => {
      return Object.entries(searchResults.value).every(([key, value]) => {
        if (value.includes("|") && !value.includes("!")) {
          let el = value.split("|");
          return el.some((elem) =>
            (item[key] || "")
              .toString()
              .toUpperCase()
              .startsWith(elem.toString().toUpperCase())
          );
        }
        if (value.substring(0, 1) === "!" && !value.includes("|")) {
          let el = value.split("!");
          return el.some(
            (elem) =>
              !(item[key] || "")
                .toString()
                .toUpperCase()
                .startsWith(elem.toString().toUpperCase())
          );
        }
        if (value.includes("|") && value.substring(0, 1) === "!") {
          let el = value.split("!")[1].split("|");
          return !el.some((elem) =>
            (item[key] || "")
              .toString()
              .toUpperCase()
              .startsWith(elem.toString().toUpperCase())
          );
        }
        if (value.substring(0, 1) === ">") {
          let el = value.split(">");
          if (item[key] !== " ") {
            return Number(item[key] || "") > el[1];
          }
        }
        if (value.substring(0, 1) === "<") {
          let el = value.split("<");
          if (item[key] !== " ") {
            return Number(item[key] || "") < el[1];
          }
        }
        if (value.substring(0, 1) === "=") {
          let el = value.split("=");
          return (
            (item[key] || "").toString().toUpperCase() ===
            el[1].toString().toUpperCase()
          );
        }
        return (item[key] || "")
          .toString()
          .toUpperCase()
          .includes(value.toString().toUpperCase());
      });
    });
  } else {
    return props.rows;
  }
};
</script>

<style>
.no-pointer {
  cursor: auto;
}

.v-table td.v-data-table__td {
  white-space: pre-wrap;
}

.v-data-table .v-table__wrapper > table > thead > tr > th {
  vertical-align: bottom;
  padding-bottom: 1em !important;
  padding-top: 0.9em !important;
  height: auto !important;
}
.column {
  cursor: pointer;
}

.sortable-icon {
  opacity: 0.1;
  cursor: pointer;
  margin-left: 5px;
  margin-right: 5px;
  transition: opacity 0.3s ease;
}
.column:hover .sortable-icon {
  opacity: 0.8;
}

.column.sortable-icon:hover {
  opacity: 0.8;
}

.sortable-icon.active {
  opacity: 1;
}
</style>
