import { defineStore } from 'pinia';

export const useWidgetStore = defineStore('widgetStore', {
  state: () => ({
    widgets: JSON.parse(localStorage.getItem('widgets')) || [],
    isEditing: false,
  }),
  actions: {
    addWidget(widget) {
      const widgetExists = this.widgets.some(existingWidget => existingWidget.id === widget.id);
      if (!widgetExists) {
        this.widgets.push(widget);
        localStorage.setItem('widgets', JSON.stringify(this.widgets));
      }
    },
    deleteWidget(widgetId) {
      const widgetExists = this.widgets.some(widget => widget.id === widgetId);
      if (widgetExists) {
        this.widgets = this.widgets.filter(widget => widget.id !== widgetId);
        localStorage.setItem('widgets', JSON.stringify(this.widgets));
      }
    },
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
  },
});
