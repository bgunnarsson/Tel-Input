// Import the Toaster library
import TelInput from '@bgunnarsson/tel-input'

document.addEventListener('DOMContentLoaded', () => {
  new TelInput({
    target: '.bg-telinput',
    country: 'is',
    code: '+354',
    exclude: ['af', 'al', 'ru'],
    priority: ['is', 'us', 'ca'],
    fillInput: true,
    search: {
      placeholder: 'Search...',
    },
  })

  document.addEventListener('TelInput:CountryClick', (e) => {
    console.log('[Heard] TelInput:CountryClick', e)
  })

  document.addEventListener('TelInput:TriggerClick', (e) => {
    console.log('[Heard] TelInput:TriggerClick', e)
  })
})
