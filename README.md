
# TelInput Documentation

TelInput is a customizable telephone input field with dropdown country selection.

## Features

- Automatic dropdown with country codes and flags.
- Default country and code configuration.
- Priority and exclusion of specific countries.
- Searchable dropdown for quick country lookup.
- Pre-filled input field with country code.

## Installation

1. Include the `TelInput` class in your project.
2. Ensure the `loadModules` function provides country and flag data.

## Usage

### Basic Setup

```javascript
import TelInput from './path/to/tel-input.js';

const telInput = new TelInput({
  target: '.tel-input',
  wrapper: '.tel-input-wrapper',
  country: 'us', // Default country ISO code
  code: '+1', // Default country code
  exclude: ['fr', 'de'], // Countries to exclude
  priority: ['us', 'ca'], // Priority countries
  search: {
    placeholder: 'Search countries...'
  }
});
```

### HTML Structure

```html
<div class="tel-input">
  <div class="tel-input-wrapper">
    <input type="text" placeholder="Enter phone number">
  </div>
</div>
```

### Config Options

| Option           | Type       | Default        | Description                                      |
|-------------------|------------|----------------|--------------------------------------------------|
| `target`         | `string`   | `.bg-telinput` | CSS selector for the target input container.     |
| `wrapper`        | `string`   | `.bg-telinput__input-wrap` | CSS selector for the input wrapper.             |
| `country`        | `string`   | `is`           | Default country ISO code.                       |
| `code`           | `string`   | `+354`         | Default country code.                           |
| `exclude`        | `array`    | `[]`           | Array of ISO codes to exclude.                  |
| `priority`       | `array`    | `[]`           | Array of priority ISO codes.                    |
| `search.placeholder` | `string` | `''`          | Placeholder text for the search input.          |


## Example

```html
<div class="tel-input">
  <div class="tel-input-wrapper">
    <input type="text" placeholder="Enter phone number">
  </div>
</div>
```  

```javascript
const telInput = new TelInput({
  target: '.tel-input',
  wrapper: 'tel-input-wrapper',
  country: 'is',
  code: '+354',
  priority: ['is', 'us', 'gb'],
  exclude: ['al', 'af'],
  search: {
    placeholder: 'Search countries...'
  }
});
```

## License

This project is licensed under the MIT License.
