<template>
  <div>
    <section class="content-header">
      <h1>{{ $t('language_add') }}</h1>
    </section>
    <LanguageForm
      :handle-submit="onSendForm"
      :item="item"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import LanguageForm from './Form'

export default {
  components: {
    LanguageForm
  },
  computed: {
    ...mapGetters({
      item: 'language/item'
    })
  },
  methods: {
    ...mapActions({
      create: 'language/create'
    }),
    onSendForm() {
      this.create().then(item => {
        this.$router.push({name: 'LanguageShow', params: {id: item.id}})
      }).catch()
    }
  }
}
</script>
