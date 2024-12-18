async function loadModules() {
  if (typeof require === 'function') {
    // CommonJS environment
    return {
      countries: require('./countries.mjs'),
      flags: require('./flags.mjs'),
    }
  }

  throw new Error('Unsupported environment: Cannot load countries and flags')
}

export default class TelInput {
  constructor(options) {
    if (!options) {
      console.error('[@bgunnarsson/tel-input] No options provided.')
      return
    }

    this.config = {
      target: options?.target || '.bg-telinput',
      wrapper: options?.wrapper || '.bg-telinput__input-wrap',
      country: options?.country || '', // Default country ISO
      code: options?.code || '', // Default country code
      exclude: options?.exclude || [], // List of ISO codes to exclude
      priority: options?.priority || [], // List of priority ISO codes
      fillInput: 'fillInput' in options ? options.fillInput : true, // Explicitly check if `fillInput` is provided
      search: {
        placeholder: options?.search?.placeholder || '',
      },
    }

    this.init()
  }

  async init() {
    // console.time('TelInput Initialization')

    const { countries, flags } = await loadModules()

    // Cache flags
    this.cachedFlags = Object.fromEntries(Object.entries(flags).map(([key, value]) => [key.toLowerCase(), value]))

    // Prepare sorted countries asynchronously
    setTimeout(() => {
      this.sortedCountries = this.getSortedCountries(countries)
    }, 0)

    // Initialize all targets
    const targets = document.querySelectorAll(this.config.target)
    targets.forEach((target) => this.initializeTarget(target))

    // console.timeEnd('TelInput Initialization')
  }

  initializeTarget(target) {
    const wrapper = target.querySelector(this.config.wrapper)
    const input = target.querySelector('input')

    // Build TelInput structure
    const telInput = this.buildTelInput(input)
    wrapper.appendChild(telInput)
  }

  getSortedCountries(countries) {
    if (!countries) {
      console.error('[@bgunnarsson/tel-input] No countries provided.')
      return
    }
    const filteredCountries = countries?.filter((data) => !this.config.exclude.includes(data.iso.toLowerCase()))

    const priorityCountries = filteredCountries
      .filter((data) => this.config.priority.includes(data.iso.toLowerCase()))
      .sort(
        (a, b) => this.config.priority.indexOf(a.iso.toLowerCase()) - this.config.priority.indexOf(b.iso.toLowerCase())
      )

    const nonPriorityCountries = filteredCountries.filter(
      (data) => !this.config.priority.includes(data.iso.toLowerCase())
    )

    return [...priorityCountries, ...nonPriorityCountries].map((data) => ({
      name: data.name,
      countryCode: data.countryCode,
      iso: data.iso.toLowerCase(),
      flag: this.cachedFlags[data.iso.toLowerCase()] || '🌍',
    }))
  }

  buildTelInput(input) {
    const container = document.createElement('div')
    container.classList.add('bg-telinput__tel')

    // Trigger button
    const trigger = document.createElement('button')
    trigger.type = 'button'
    trigger.classList.add('bg-telinput__trigger')
    trigger.innerHTML = this.cachedFlags[this.config.country.toLowerCase()] || '🌍'
    container.appendChild(trigger)

    // Pre-fill input
    if (this.config.fillInput && this.config.code) {
      input.value = `${this.config.code} `
    }

    // Dropdown menu (virtualized and lazy-loaded)
    const dropdown = this.createDropdownSkeleton(trigger, input)
    container.appendChild(dropdown)

    return container
  }

  createDropdownSkeleton(trigger, input) {
    const dropdown = document.createElement('div')
    dropdown.classList.add('bg-telinput__dropdown')
    dropdown.style.display = 'none'

    // Search field
    const searchContainer = document.createElement('div')
    searchContainer.classList.add('bg-telinput__search')

    const searchInput = document.createElement('input')
    searchInput.type = 'text'
    searchInput.placeholder = this.config.search.placeholder
    searchContainer.appendChild(searchInput)
    dropdown.appendChild(searchContainer)

    // Add search functionality
    searchInput.addEventListener('input', (e) => this.handleSearch(e, dropdown))

    // Lazy-load dropdown content on first trigger click
    trigger.addEventListener('click', () => {
      if (!dropdown.dataset.loaded) {
        this.lazyLoadDropdown(dropdown, input, trigger)
        dropdown.dataset.loaded = 'true'
      }
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block'

      this.dispatchEvent('TriggerClick')
    })

    return dropdown
  }

  lazyLoadDropdown(dropdown, input, trigger) {
    if (!this.sortedCountries) {
      console.warn('Sorted countries not ready yet.')
      return
    }

    // Virtualized rendering: only render the top 10 items
    this.renderVirtualizedDropdown(dropdown, input, trigger, 0, 10)

    // Add scroll event for lazy rendering
    dropdown.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight, clientHeight } = dropdown
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        const currentCount = dropdown.querySelectorAll('.bg-telinput__dropdown-item').length
        this.renderVirtualizedDropdown(dropdown, input, trigger, currentCount, 10)
      }
    })
  }

  renderVirtualizedDropdown(dropdown, input, trigger, startIndex, count) {
    const fragment = document.createDocumentFragment()
    const itemsToRender = this.sortedCountries.slice(startIndex, startIndex + count)

    itemsToRender.forEach(({ name, countryCode, flag }) => {
      const item = this.createDropdownItem(name, countryCode, flag, input, trigger, dropdown)
      fragment.appendChild(item)
    })

    dropdown.appendChild(fragment)
  }

  createDropdownItem(name, countryCode, flag, input, trigger, dropdown) {
    const item = document.createElement('button')
    item.classList.add('bg-telinput__dropdown-item')
    item.dataset.country = name
    item.dataset.code = countryCode
    item.dataset.flag = flag

    const flagElement = document.createElement('span')
    flagElement.classList.add('bg-telinput__dropdown-flag')
    flagElement.innerHTML = flag
    item.appendChild(flagElement)

    const textElement = document.createElement('span')
    textElement.textContent = name
    item.appendChild(textElement)

    item.addEventListener('click', () => {
      if (this.config?.fillInput) {
        input.value = `+${countryCode} `
      }
      trigger.innerHTML = flag
      dropdown.style.display = 'none'

      this.dispatchEvent('CountryClick', {
        country: name,
        code: countryCode,
        // flag: flag,
      })
    })

    return item
  }

  handleSearch(e, dropdown) {
    const query = e.target.value.toLowerCase()
    const items = dropdown.querySelectorAll('.bg-telinput__dropdown-item')

    items.forEach((item) => {
      const country = item.dataset.country.toLowerCase()
      item.style.display = country.includes(query) ? 'flex' : 'none'
    })
  }

  dispatchEvent(name, data = {}) {
    const customEvent = new CustomEvent(`TelInput:${name}`, {
      detail: {
        ...data,
      },
    })

    document.dispatchEvent(customEvent)
  }
}
