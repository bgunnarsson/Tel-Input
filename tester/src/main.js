// Import the Toaster library
import TelInput from '@bgunnarsson/tel-input'

// Initialize the Toaster
const telinput = new TelInput({
  target: '.bg-telinput',
  country: 'is',
  code: '+354',
  exclude: ['af', 'al', 'ru'],
  priority: ['is', 'us', 'ca'],
  search: {
    placeholder: 'Search...',
  },
})

console.log('telinput', telinput)
