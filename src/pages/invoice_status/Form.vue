<template>
  <form @submit.prevent="handleSubmit(item)">
    <section class="content">
      <item-errors entity="invoiceStatus" />
      <div class="box box-primary">
        <div class="box-body">
          <form-input
            :item="item"
            :errors="errors"
            property="name"
            label="name"
            @formUpdated="updateValue"
          />
        </div>
      </div>
      <item-edit-actions
        :item="item"
        entity="InvoiceStatus"
        path="invoice_status"
      />
    </section>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ItemEditActions from '../../components/layout/ItemEditActions'
import ItemErrors from '../../components/layout/errors/ItemErrors'

export default {
  components: {
    ItemErrors,
    ItemEditActions
  },
  props: {
    handleSubmit: {
      type: Function,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  beforeDestroy () {
    this.reset()
  },
  computed: {
    ...mapGetters({
      errors: 'invoiceStatus/errors'
    })
  },
  methods: {
    ...mapActions({
      reset: 'invoiceStatus/reset'
    }),
    updateValue(property, value) {
      this.$store.commit('invoiceStatus/INVOICE_STATUS_UPDATE_ITEM', {[property]: value})
    }
  }
}
</script>
