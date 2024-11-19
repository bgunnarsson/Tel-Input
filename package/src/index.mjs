import loadModules from './runtime-loader.js'

export default class TelInput {
  constructor(options) {
    if (!options) {
      console.error('[@bgunnarsson/tel-input] No options provided.')
      return
    }

    this.config = {
      target: options?.target || '.bg-telinput',
      wrapper: options?.wrapper || '.bg-telinput__input-wrap',
      country: options?.country || 'is', // Default country ISO
      code: options?.code || '+354', // Default country code
      exclude: options?.exclude || [], // List of ISO codes to exclude
      priority: options?.priority || [], // List of priority ISO codes
      search: {
        placeholder: options?.search?.placeholder || '',
      },
    }

    this.init()
  }

  async init() {
    console.time()
    const { countries, flags } = await loadModules()

    const targets = document.querySelectorAll(this.config.target)

    targets.forEach((target) => {
      target.classList += ' bg-telinput'

      const getInput = target.querySelector('input')

      const el = document.createElement('div')
      el.classList.add('bg-telinput__tel')

      const trigger = document.createElement('button')
      trigger.type = 'button'
      trigger.classList.add('bg-telinput__trigger')

      // Set trigger flag based on config.country
      const countryFlag = flags[this.config.country.toLowerCase()] || '🌍'
      trigger.innerHTML = countryFlag

      // Pre-fill input with config.code if set
      if (this.config.code) {
        getInput.value = `${this.config.code} `
      }

      const dropdown = document.createElement('div')
      dropdown.classList.add('bg-telinput__dropdown')

      const search = document.createElement('div')
      search.classList.add('bg-telinput__search')

      const searchInput = document.createElement('input')
      searchInput.type = 'text'
      searchInput.placeholder = this.config.search?.placeholder
      search.appendChild(searchInput)
      dropdown.appendChild(search)

      const getDropdown = target.querySelector('.bg-telinput__dropdown') || dropdown

      // Filter out excluded countries
      const filteredCountries = countries.filter((data) => !this.config.exclude.includes(data.iso.toLowerCase()))

      // Separate priority countries and sort by config.priority order
      const priorityCountries = filteredCountries
        .filter((data) => this.config.priority.includes(data.iso.toLowerCase()))
        .sort(
          (a, b) =>
            this.config.priority.indexOf(a.iso.toLowerCase()) - this.config.priority.indexOf(b.iso.toLowerCase())
        )

      // Remaining countries (not in priority list)
      const nonPriorityCountries = filteredCountries.filter(
        (data) => !this.config.priority.includes(data.iso.toLowerCase())
      )

      // Concatenate priority countries followed by the rest
      const sortedCountries = [...priorityCountries, ...nonPriorityCountries]

      sortedCountries.forEach((data) => {
        const item = document.createElement('button')
        item.classList.add('bg-telinput__dropdown-item')
        item.dataset.country = data.name
        item.dataset.code = data.countryCode
        item.dataset.iso = data.iso.toLowerCase()

        try {
          const itemIcon = document.createElement('span')
          itemIcon.classList.add('bg-telinput__dropdown-flag')
          itemIcon.innerHTML = flags[data.iso.toLowerCase()] || '🌍'
          item.appendChild(itemIcon)
        } catch (error) {
          console.error('Failed to load icon for:', data.iso.toLowerCase(), error)
        }

        const itemText = document.createElement('span')
        itemText.textContent = data.name || 'N/A'

        item.appendChild(itemText)
        dropdown.appendChild(item)

        item.addEventListener('click', (e) => {
          getInput.value = `+${e.target.dataset.code} `

          getDropdown.style.display = 'none'
        })
      })

      el.appendChild(trigger)
      el.appendChild(dropdown)

      const wrapper = target.querySelector(this.config.wrapper)
      wrapper.appendChild(el)

      // Fuzzy search implementation
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase()
        const items = dropdown.querySelectorAll('.bg-telinput__dropdown-item')

        items.forEach((item) => {
          const country = item.dataset.country.toLowerCase()
          // Check if the country name includes the search query
          if (country.includes(query)) {
            item.style.display = 'flex'
          } else {
            item.style.display = 'none'
          }
        })
      })

      const getTrigger = target.querySelector('.bg-telinput__trigger')
      getTrigger.addEventListener('click', () => {
        if (getDropdown.style.display === 'none') {
          getDropdown.style.display = 'block'
        } else {
          getDropdown.style.display = 'none'
        }
      })
    })

    console.log('TelInput initialized for targets:', targets)

    console.timeEnd()
  }
}
