import DefaultTheme from 'vitepress/theme'
import QuestionList from './components/QuestionList.vue'
import QuestionMeta from './components/QuestionMeta.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('QuestionList', QuestionList)
    app.component('QuestionMeta', QuestionMeta)
  },
}
