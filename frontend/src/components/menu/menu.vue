<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        small
        variant="text"
        icon="mdi-dots-vertical"
        v-bind="props"
      ></v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(item, index) in items" :key="index">
        <v-list-item-title>
          <v-btn
            small
            :color="item.color"
            variant="text"
            @click="(event) => item.callback(item, event)"
          >
            {{ item.label }}
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
const props = defineProps({
  items: {
    required: true,
  },
});
</script>
