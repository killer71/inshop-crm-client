<template>
  <div>
    <section class="content-header">
      <h1>{{ $t('order_header_add') }}</h1>
    </section>
    <OrderHeaderForm
      :handle-submit="onSendForm"
      :item="item"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import OrderHeaderForm from './Form'

export default {
  components: {
    OrderHeaderForm
  },
  computed: {
    ...mapGetters({
      item: 'orderHeader/item'
    })
  },
  methods: {
    ...mapActions({
      create: 'orderHeader/create'
    }),
    onSendForm() {
      this.create().then(item => {
        this.$router.push({name: 'OrderHeaderShow', params: {id: item.id}})
      }).catch()
    }
  }
}
</script>
