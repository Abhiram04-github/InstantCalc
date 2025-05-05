# InstantCalc Chrome Extension

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/your-extension-id?label=Chrome%20Web%20Store)](https://chrome.google.com/webstore/detail/your-extension-id)
[![GitHub license](https://img.shields.io/github/license/yourusername/InstantCalc)](https://github.com/yourusername/InstantCalc)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> A dynamic inline calculator that evaluates mathematical expressions as you type

![Demo](screenshots/demo.gif) <!-- Add actual demo gif later -->

## Features ✨

- **Instant Calculations** - Evaluate expressions like `=(25+30)` while typing
- **Nested Operations** - Support for complex expressions `=(=(20*5)/2)`
- **Privacy First** - No data collection, all processing happens locally
- **Cross-Platform** - Works on all websites with text inputs
- **Smart Formatting** - Auto-convert percentages and decimal values
- **Error Handling** - Clear `ERROR` indication for invalid expressions
- **Cursor Preservation** - Maintains typing position after evaluation

## Installation ⚙️

### From Source
1. Clone repository:
   ```bash
   git clone https://github.com/yourusername/InstantCalc.git
   ```
2. Open Chrome:
   - Navigate to `chrome://extensions`
   - Enable **Developer mode** (top-right toggle)
   - Click **Load unpacked** and select the `InstantCalc` directory

### From Chrome Web Store
Coming soon! [Submit request](mailto:your@email.com) for early access.

## Usage 🚀

Type mathematical expressions wrapped in `=(...)`:
```text
The bill total is =(200 + 35 + 45).  # Becomes "The bill total is 280."
20% discount: =(500 * 0.2)          # Converts to "20% discount: 100"
Nested example: =(=(100/4)*3)       # Results in "Nested example: 75"
```

## Development 🛠️

### Prerequisites
- Chrome browser (v90+)
- Basic understanding of Chrome extensions

### Build Setup
```bash
git clone https://github.com/yourusername/InstantCalc.git
cd InstantCalc
# No build required - pure JS implementation
```

### File Structure
```
InstantCalc/
├── content.js       # Core calculation logic
├── manifest.json    # Extension configuration
├── README.md        # This documentation
└── screenshots/     # Marketing assets
```

## Contributing 🤝

We welcome contributions! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Roadmap 🗺️

- [x] Basic arithmetic operations
- [ ] Currency conversion support
- [ ] Calculation history
- [ ] Unit conversions
- [ ] Dark mode support

## Privacy 🔒

**InstantCalc** operates with strict privacy guidelines:
- No user data collection
- No tracking of any kind
- All calculations processed locally
- No third-party dependencies

## Support ❤️

Found a bug or have a feature request?  
[Open an issue](https://github.com/yourusername/InstantCalc/issues)

## License 📄

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

**Created with ❤️ by Your Name**  
[![Twitter](https://img.shields.io/twitter/follow/yourhandle?style=social)](https://twitter.com/yourhandle)
