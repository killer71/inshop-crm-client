<template>
  <div class="user-groups">
    <section class="content-header">
      <h1>{{ $t('group_edit', {entity: item && item.name}) }}</h1>
    </section>
    <GroupForm
      :handle-submit="onSendForm"
      :item="item"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import GroupForm from './Form'

export default {
  components: {
    GroupForm
  },
  computed: {
    ...mapGetters({
      item: 'group/item'
    })
  },
  created() {
    this.getItem(this.$route.params.id)
  },
  methods: {
    ...mapActions({
      getItem: 'group/getItem',
      update: 'group/update'
    }),
    onSendForm() {
      this.update().then(item => {
        this.$router.push({name: 'GroupShow', params: {id: item.id}})
      }).catch()
    }
  }
}
</script>

<style>
  .user-groups .inshop-form {
    padding: 0;
  }
  .user-groups .form-group {
    display: inline-block;
    margin: 15px;
    width: 22%;
    vertical-align: top;
  }
  .user-groups .form-group h2 {
    font-size: 20px;
    font-weight: bold;
  }
  .user-groups #roles h2 {
    font-size: 20px;
  }
  .user-groups .inshop-form label.checkbox {
    font-size: 17px;
    font-weight: normal;
  }
</style>