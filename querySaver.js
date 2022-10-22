// this vue.js mixin for serialize generate and auto deserialize route queries 
// v-model pagination: filter.page
// v-model filter: filter
// for pagination bug show after fetchItems from server -> isLoaded = true

export const querySaver = {
  data() {
    return {
      isLoaded: false
    }
  },
  computed: {
    route() {
      return this.$route.name
    },
    clonedFilter: function () {
      return JSON.parse(JSON.stringify(this.filter))
    }
  },
  watch: {
    clonedFilter: {
      handler(new_val, old_val) {
        let similar = serialize(clean(this.filter)) === serialize(this.$route.query);
        if (!similar) {
          this.setDefaultPageQuery({ ...new_val }, { ...old_val })
          this.$router.replace({ name: this.route, query: clean(this.filter) });
          this.$forceUpdate();
        }

      },
      deep: true
    },
  },
  mounted() {
    let filterFromQuery = {};
    if (this.$route.query) {
      filterFromQuery = { ...this.$route.query, ...this.filter };
    }
    if (filterFromQuery) {
      this.filter = filterFromQuery;
      this.$forceUpdate();
    }
  },
  methods: {
    setDefaultPageQuery(new_val, old_val) {
      let temp = new_val.page || 1;

      if (new_val.page) {
        delete new_val.page
      }
      if (old_val.page) {
        delete old_val.page
      }
      console.log(new_val, old_val)
      if (serialize(clean(new_val)) !== serialize(clean(old_val))) {
        this.filter.page = 1;
      } else {
        this.filter.page = temp;
      }
    }
  }
};



// NESSISARY FUNCTIONS

// clean.js:
function clean(obj) {
  for (var propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === ""
    ) {
      delete obj[propName];
    }
  }
  return obj;
}
// export default clean;

// serialize.js:
const serialize = function (obj) {
  var str = [];
  if (obj) {
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        if (encodeURIComponent(obj[p]) && encodeURIComponent(p) && (obj[p] !== null))
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
}
// export default serialize;

// deserialize.js:
const deserialize = function (search) {
  if (search) {

    let a_1 = JSON.parse(
      '{"' +
      decodeURI(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
    );
    Object.keys(a_1).filter(resp => {
      if (!isNaN(a_1[resp])) {
        a_1[resp] = Number(a_1[resp])
      }
    })
    return a_1;
  }
}
// export default deserialize;