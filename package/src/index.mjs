import countries from './countries.mjs'

export default class TelInput {
  constructor(options) {
    if (!options) {
      console.error('[@bgunnarsson/tel-input] No options provided.')
      return
    }

    this.config = {
      target: options?.target || '.bg-telinput',
      wrapper: options?.wrapper || '.bg-telinput__input-wrap',
      country: options?.country || '',
      code: options?.code || '',
      exclude: options?.exclude || [],
      priority: options?.priority || [],
      fillInput: 'fillInput' in options ? options.fillInput : true,
      search: {
        placeholder: options?.search?.placeholder || '',
      },
    }

    this.init()
  }

  async init() {
    // Prepare sorted country list
    this.sortedCountries = this.getSortedCountries(countries)

    // Initialize inputs
    document.querySelectorAll(this.config.target).forEach((target) => {
      this.initializeTarget(target)
    })
  }

  initializeTarget(target) {
    const wrapper = target.querySelector(this.config.wrapper)
    const input = target.querySelector('input')
    const telInput = this.buildTelInput(input)
    wrapper.appendChild(telInput)
  }

  // Dynamically import the JS module for the flag
  async loadFlag(iso) {
    try {
      const mod = await import(`./flags-optimized/${iso}.js`)
      return mod.default
    } catch {
      return '🌍'
    }
  }

  getSortedCountries(countries) {
    if (!Array.isArray(countries)) {
      console.error('[@bgunnarsson/tel-input] Invalid countries data: Expected an array.')
      return []
    }

    const valid = countries.filter((c) => c.name && c.iso)
    const filtered = valid.filter((c) => !this.config.exclude.includes(c.iso.toLowerCase()))

    const priority = filtered
      .filter((c) => this.config.priority.includes(c.iso.toLowerCase()))
      .sort(
        (a, b) => this.config.priority.indexOf(a.iso.toLowerCase()) - this.config.priority.indexOf(b.iso.toLowerCase())
      )

    const nonPriority = filtered.filter((c) => !this.config.priority.includes(c.iso.toLowerCase()))

    return [...priority, ...nonPriority].map((c) => ({
      name: c.name,
      countryCode: c.countryCode,
      iso: c.iso.toLowerCase(),
    }))
  }

  buildTelInput(input) {
    const container = document.createElement('div')
    container.classList.add('bg-telinput__tel')

    const trigger = document.createElement('button')
    trigger.type = 'button'
    trigger.classList.add('bg-telinput__trigger')
    trigger.innerHTML = '…'
    if (this.config.country) {
      this.loadFlag(this.config.country.toLowerCase()).then((svg) => {
        trigger.innerHTML = svg
      })
    }
    container.appendChild(trigger)

    if (this.config.fillInput && this.config.code) {
      input.value = `+${this.config.code} `
    }

    const dropdown = this.createDropdownSkeleton(trigger, input)
    container.appendChild(dropdown)

    return container
  }

  createDropdownSkeleton(trigger, input) {
    const dropdown = document.createElement('div')
    dropdown.classList.add('bg-telinput__dropdown')
    dropdown.style.display = 'none'

    const searchContainer = document.createElement('div')
    searchContainer.classList.add('bg-telinput__search')
    const searchInput = document.createElement('input')
    searchInput.type = 'text'
    searchInput.placeholder = this.config.search.placeholder
    searchContainer.appendChild(searchInput)
    dropdown.appendChild(searchContainer)

    searchInput.addEventListener('input', (e) => this.handleSearch(e, dropdown))
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
    if (!this.sortedCountries) return
    this.renderVirtualizedDropdown(dropdown, input, trigger, 0, 10)
    dropdown.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight, clientHeight } = dropdown
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        const current = dropdown.querySelectorAll('.bg-telinput__dropdown-item').length
        this.renderVirtualizedDropdown(dropdown, input, trigger, current, 10)
      }
    })
  }

  renderVirtualizedDropdown(dropdown, input, trigger, start, count) {
    const fragment = document.createDocumentFragment()
    this.sortedCountries.slice(start, start + count).forEach(({ name, countryCode, iso }) => {
      const item = this.createDropdownItem(name, countryCode, input, trigger, dropdown, iso)
      fragment.appendChild(item)
    })
    dropdown.appendChild(fragment)
  }

  createDropdownItem(name, code, input, trigger, dropdown, iso) {
    const item = document.createElement('button')
    item.type = 'button'
    item.classList.add('bg-telinput__dropdown-item')
    item.dataset.country = name
    item.dataset.code = code
    item.dataset.iso = iso

    const flagEl = document.createElement('span')
    flagEl.classList.add('bg-telinput__dropdown-flag')
    flagEl.innerHTML = '…'
    this.loadFlag(iso).then((svg) => {
      flagEl.innerHTML = svg
    })
    item.appendChild(flagEl)

    const textEl = document.createElement('span')
    textEl.textContent = name
    item.appendChild(textEl)

    item.addEventListener('click', () => {
      if (this.config.fillInput) input.value = `+${code} `
      this.loadFlag(iso).then((svg) => {
        dropdown.previousSibling.innerHTML = svg
      })
      dropdown.style.display = 'none'
      this.dispatchEvent('CountryClick', { country: name, code, iso })
    })

    return item
  }

  handleSearch(e, dropdown) {
    const query = e.target.value.toLowerCase()
    const filtered = this.getSortedCountries(countries).filter((c) => c.name.toLowerCase().includes(query))
    dropdown.querySelectorAll('.bg-telinput__dropdown-item').forEach((i) => i.remove())
    filtered.forEach(({ name, countryCode, iso }) => {
      const trigger = dropdown.previousSibling
      const input = dropdown.parentNode.querySelector('input')
      const item = this.createDropdownItem(name, countryCode, input, trigger, dropdown, iso)
      dropdown.appendChild(item)
    })
  }

  dispatchEvent(name, detail = {}) {
    document.dispatchEvent(new CustomEvent(`TelInput:${name}`, { detail }))
  }
}
