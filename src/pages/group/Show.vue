<template>
  <div>
    <section class="content-header">
      <h1>{{ item && item.name }}</h1>
    </section>
    <section class="content">
      <item-errors entity="group" />
      <div class="nav-tabs-custom">
        <ul class="nav nav-tabs">
          <li class="active">
            <a
              href="#general"
              data-toggle="tab"
              aria-expanded="false"
            >{{ $t('tabs_general') }}</a>
          </li>
          <li>
            <a
              href="#roles"
              data-toggle="tab"
              aria-expanded="false"
            >{{ $t('tabs_roles') }}</a>
          </li>
          <li>
            <a
              href="#history"
              data-toggle="tab"
              aria-expanded="false"
            >{{ $t('tabs_history') }}</a>
          </li>
        </ul>
        <div class="tab-content">
          <div
            class="tab-pane active"
            id="general"
          >
            <div
              v-if="item"
              class="table-responsive"
            >
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th width="20%">
                      {{ $t('field') }}
                    </th>
                    <th>{{ $t('value') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ $t('name') }}</td>
                    <td>{{ item.name }}</td>
                  </tr>
                  <tr>
                    <td>{{ $t('createdAt') }}</td>
                    <td>{{ crmDateFormat(item.createdAt) }}</td>
                  </tr>
                  <tr>
                    <td>{{ $t('updatedAt') }}</td>
                    <td>{{ crmDateFormat(item.updatedAt) }}</td>
                  </tr>
                  <tr>
                    <td>{{ $t('updatedBy') }}</td>
                    <td>{{ item.updatedBy }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            class="tab-pane"
            id="roles"
          >
            <div
              v-for="module in modules"
              :key="module.id"
              class="role"
            >
              <h2>{{ $t(module.name.replace(/\s+/g, '_').toLowerCase()) }}</h2>
              <ul v-if="item && item.roles">
                <li
                  v-for="role in roles(module)"
                  :key="role.id"
                >
                  {{ $t(role.name.toLowerCase()) }}
                </li>
              </ul>
            </div>
          </div>
          <div
            class="tab-pane"
            id="history"
          >
            <history
              :id="parseInt($route.params.id)"
              entity="Group"
              path="group"
              :key="historyKey"
            />
          </div>
        </div>
      </div>
      <item-show-actions
        path="group"
        :item="item"
        entity="Group"
      />
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ItemShowActions from '../../components/layout/ItemShowActions'
import ItemErrors from '../../components/layout/errors/ItemErrors'
import History from '../../components/History'

export default {
  components: { History, ItemErrors, ItemShowActions },
  data () {
    return {
      historyKey: 1
    }
  },
  computed: {
    ...mapGetters({
      item: 'group/item'
    }),
    modules() {
      return this.$store.getters['module/items'] || []
    }
  },
  created() {
    this.getItem(this.$route.params.id)
    this.getModules({
      itemsPerPage: 500
    })
  },
  beforeDestroy() {
    this.reset()
  },
  methods: {
    ...mapActions({
      getItem: 'group/getItem',
      reset: 'group/reset',
      getModules: 'module/getItems'
    }),
    roles(module) {
      return this.item.roles.filter(role => role.module.id === module.id)
    }
  }
}
</script>

<style>
  .role {
    display: inline-block;
    margin: 15px;
    width: 22%;
    vertical-align: top;
  }
  .role h2 {
    font-size: 18px;
    font-weight: bold;
  }
  .role ul {
    padding-left: 18px;
  }
</style>
