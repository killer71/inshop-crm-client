<template>
  <div>
    <section class="content-header">
      <h1>{{ $t('project_status_edit', {entity: item && item.name}) }}</h1>
    </section>
    <ProjectStatusForm
      :handle-submit="onSendForm"
      :item="item"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ProjectStatusForm from './Form'

export default {
  components: {
    ProjectStatusForm
  },
  computed: {
    ...mapGetters({
      item: 'projectStatus/item'
    })
  },
  created() {
    this.getItem(this.$route.params.id)
  },
  methods: {
    ...mapActions({
      getItem: 'projectStatus/getItem',
      update: 'projectStatus/update'
    }),
    onSendForm() {
      this.update().then(item => {
        this.$router.push({name: 'ProjectStatusShow', params: {id: item.id}})
      }).catch()
    }
  }
}
</script>
