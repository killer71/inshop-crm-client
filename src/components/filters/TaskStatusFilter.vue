<template>
  <field-select
    :item="{value: value}"
    property="value"
    id="taskStatus"
    :options="options"
    option-label="name"
    :multiple="true"
    @fieldUpdated="filterTable"
  />
</template>

<script>
import {mapActions} from 'vuex'
import {Event} from 'vue-tables-2'

export default {
  name: 'TaskStatusFilter',
  data: function () {
    return {
      value: [],
    }
  },
  created() {
    this.getOptions()
      .then(options => {
        let selected = []

        if (this.$route.query['status.id']) {
          let params = []

          if (this.$route.query['status.id'].length > 1) {
            params = this.$route.query['status.id']
          } else {
            params.push(this.$route.query['status.id'])
          }

          params.forEach(id => {
            options.some(element => {
              if (element.id === parseInt(id)) {
                selected.push(element)
              }
            })
          })
        }

        this.value = selected
      })
  },
  computed: {
    options() {
      return this.$store.getters['taskStatus/items'] || []
    }
  },
  methods: {
    ...mapActions({
      getOptions: 'taskStatus/getItems',
    }),
    filterTable(property, data) {
      let ids = []

      if (data.length) {
        data.forEach(item => {
          ids.push(item.id)
        })
      }

      Event.$emit('vue-tables.filter::status.id', ids)
    }
  }
}
</script>
