<template>
  <div>
    <section class="content-header">
      <h1>{{ $t('channel_list') }}</h1>
    </section>
    <section class="content">
      <div class="box box-primary">
        <div class="box-header with-border">
          <router-link
            :to="{ name: 'ChannelCreate' }"
            class="btn btn-primary pull-right"
          >
            {{ $t('channel_add') }}
          </router-link>
        </div>
        <div class="box-body">
          <item-errors entity="channel" />
          <api-table
            entity="Channel"
            route="channels"
            path="channel"
            :filterable="filterable"
            :sortable="sortable"
            :columns="columns"
            :templates="templates"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ItemErrors from '../../components/layout/errors/ItemErrors'
import ApiTable from '../../components/ApiTable'
import columnCreatedAt from './../../table/ColumnCreatedAt'
import columnUpdatedAt from './../../table/ColumnUpdatedAt'

export default {
  components: { ItemErrors, ApiTable },
  data: function () {
    return {
      columns: ['id', 'name', 'currency.name', 'columnCreatedAt', 'columnUpdatedAt', 'actions'],
      filterable: ['id', 'name', 'currency.name', 'columnCreatedAt', 'columnUpdatedAt'],
      sortable: ['id', 'name', 'currency.name', 'columnCreatedAt', 'columnUpdatedAt'],
      templates: {
        columnCreatedAt,
        columnUpdatedAt
      }
    }
  },
}
</script>
