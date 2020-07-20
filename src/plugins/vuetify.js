// Import Awesome Font 5 Icon Font
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);


export default new Vuetify({
    icons: {
        iconfont: 'fa',
      },
    theme: {
        themes:{
            light:{
                primary: '#00897B'
            },
            dark:{
                primary:'#00897B'
            }
        }     
    }
});