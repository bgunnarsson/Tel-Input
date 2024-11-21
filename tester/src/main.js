// Import the Toaster library
import TelInput from '@bgunnarsson/tel-input'

// Initialize the Toaster
const telinput = new TelInput({
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

console.log('telinput', telinput)

document.addEventListener('TelInput:CountryClick', (e) => {
  console.log('[Heard] TelInput:CountryClick', e)
})

document.addEventListener('TelInput:TriggerClick', (e) => {
  console.log('[Heard] TelInput:TriggerClick', e)
})
