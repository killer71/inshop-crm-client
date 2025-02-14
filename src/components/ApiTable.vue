<template>
  <div id="list-table">
    <v-server-table
      :columns="columns"
      :options="options()"
    >
      <template
        slot="actions"
        slot-scope="props"
      >
        <div
          class="btn-group"
          role="group"
        >
          <router-link
            v-if="isGranted(role_show)"
            :to="{name: showRoute, params: { id: props.row.id }}"
            tag="button"
            class="btn btn-info"
          >
            <span
              class="fa fa-eye"
              aria-hidden="true"
            />
            <span class="sr-only">{{ $t('show') }}</span>
          </router-link>

          <router-link
            v-if="isGranted(role_show) && isGranted(role_edit)"
            :to="{name: updateRoute, params: { id: props.row.id }}"
            style="padding-left: 10px;"
            tag="button"
            class="btn btn-info"
          >
            <span
              class="fa fa-pencil"
              aria-hidden="true"
            />
            <span class="sr-only">{{ $t('edit') }}</span>
          </router-link>
        </div>
      </template>

      <div
        v-for="customFilter in customFilters"
        :key="customFilter"
        :slot="'filter__' + customFilter"
      >
        <slot :name="'filter__' + customFilter" />
      </div>
    </v-server-table>
  </div>
</template>

<script>
import axios from '../interceptor'
import decamelize from '../utils/decamelize'

export default {
  name: 'ApiTable',
  props: {
    entity: {
      type: String,
      default: null
    },
    path: {
      type: String,
      default: null
    },
    route: {
      type: String,
      default: null
    },
    columns: {
      type: Array,
      default: function() {
        return []
      }
    },
    sortable: {
      type: Array,
      default: function() {
        return []
      }
    },
    filterable: {
      type: Array,
      default: function() {
        return []
      }
    },
    customFilters: {
      type: Array,
      default: function() {
        return []
      }
    },
    templates: {
      type: Object,
      default: function() {
        return {}
      }
    },
    listColumns: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data: function () {
    return {
      orderBy: {},
      initFilters: {},
      initialPage	: 1,
      dateColumns: {
        'columnCreatedAt': 'createdAt',
        'columnUpdatedAt': 'updatedAt',
        'columnDeadline': 'deadline'
      },
      customColumns: {
        'columnTranslatedName': 'translations.name',
        'columnParentTranslatedName': 'parent.translations.name'
      },
    }
  },
  created () {
    let query = this.$route.query

    this.initFilters = query

    if (query.page) {
      this.initialPage = query.page
    }

    if (query['orderBy.ascending']) {
      this.orderBy.ascending = query['orderBy.ascending']
    }

    if (query['orderBy.column']) {
      this.orderBy.column = query['orderBy.column']
    }
  },
  computed: {
    role_show () {
      return 'ROLE_' + this.path.toUpperCase() + '_SHOW'
    },
    role_edit () {
      return 'ROLE_' + this.path.toUpperCase() + '_UPDATE'
    },
    headings () {
      let headings = {};

      this.columns.forEach(key => {
        let _key = key.split('.').join('_');

        headings[key] = this.$t(_key)
      })

      return headings
    },
    showRoute () {
      return this.entity + 'Show'
    },
    updateRoute () {
      return this.entity + 'Update'
    }
  },
  methods: {
    options() {
      return {
        dateColumns: Object.keys(this.dateColumns),
        datepickerOptions: {
          opens: 'left'
        },
        filterByColumn: true,
        filterable: this.filterable,
        customFilters: this.customFilters,
        listColumns: this.listColumns,
        sortable: this.sortable,
        perPage: 30,
        perPageValues: [],
        templates: this.templates,
        headings: this.headings,
        initFilters: this.initFilters,
        initialPage: this.initialPage,
        orderBy: this.orderBy,
        texts: {
          filterBy: "{column}",
        },
        requestFunction: (params) => {
          return new Promise(resolve => {
            let queryParams = {}

            if (params.page !== 1) {
              queryParams.page = params.page
            }

            // filtering
            this.columns.forEach(key => {
              if (typeof params.query[key] !== 'undefined') {
                if (Object.keys(this.dateColumns).indexOf(key) !== -1) {
                  queryParams[this.dateColumns[key] + '[after]'] = this.$moment(params.query[key].start).format('YYYY/M/D')
                  queryParams[this.dateColumns[key] + '[before]'] = this.$moment(params.query[key].end).add(1, 'day').format('YYYY/M/D')
                } else if (Object.keys(this.customColumns).indexOf(key) !== -1) {
                  queryParams[this.customColumns[key]] = params.query[key]
                } else {
                  queryParams[key] = params.query[key]
                }
              }
            })

            // custom filtering
            this.options().customFilters.forEach(key => {
              if (typeof params[key] !== 'undefined' && params[key] !== '') {
                queryParams[key] = params[key]
              }
            })

            let queryParamsUrl = Object.assign({}, queryParams)

            // Sorting
            if (typeof params.orderBy !== 'undefined') {
              let key

              if (Object.keys(this.dateColumns).indexOf(params.orderBy) !== -1) {
                key = this.dateColumns[params.orderBy]
              } else if (Object.keys(this.customColumns).indexOf(params.orderBy) !== -1) {
                key = this.customColumns[params.orderBy]
              } else {
                key = params.orderBy
              }

              queryParams['order[' + key + ']'] = params.ascending === 1 ? 'ASC' : 'DESC'

              queryParamsUrl['orderBy.ascending'] = params.ascending
              queryParamsUrl['orderBy.column'] = key
            }

            // clear error
            this.$store.commit(
              this.path + '/' + decamelize(this.entity).toUpperCase() + '_SET_ERROR',
              null
            )

            this.$router.push({query: queryParamsUrl})

            axios.get(process.env.VUE_APP_API_URL + '/' + this.route, {params: queryParams})
              .then(response => {
                let data = {
                  data: response.data['hydra:member'],
                  count: response.data['hydra:totalItems']
                }

                resolve(data)
              })
              .catch((e) => {
                this.$store.commit(
                  this.path + '/' + decamelize(this.entity).toUpperCase() + '_SET_ERROR',
                  e.message
                )
              })
          })
        }
      }
    }
  }
}
</script>

<style>
  .VueTables__table th:last-child {
    width: 95px;
  }
  .float-right {
    float: right!important;
  }
  .VuePagination .text-center {
    float: right;
  }
</style>
