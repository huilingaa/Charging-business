import { defineStore } from 'pinia';

export const systemStore = defineStore('system', {
  state: () => ({
    isLoading: false,
	  loadNumber:0
  }),
  actions: {
	addLoadNumber(){
	  this.loadNumber++  
	},
    showLoading() {
      this.isLoading = true;
    },
    hideLoading() {
      this.isLoading = false;
    },
  },
});

