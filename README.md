# IP Address Checker

A modern web application that provides detailed information about IP addresses. This lightweight, client-side application offers real-time IP detection and comprehensive network information.

## Features

- 🔍 Automatic IP detection (IPv4 and IPv6 support)
- 🌐 Detailed IP address information lookup
- 💻 Browser and system information detection
- 📋 One-click copy to clipboard functionality
- 📱 Responsive design for all devices
- ♿ Accessibility-friendly

## Live Demo

Access the live application at: [IP Checker Demo](https://ip.zee.im)

## Quick Start

### Using Docker

```bash
# Pull the image
docker pull zeeemughal/ip-checker:latest

# Run the container
docker run -d -p 8000:80 zeeemughal/ip-checker:latest
```

### Using Docker Compose

1. Create a `docker-compose.yml` file:
```yaml
version: '3.8'
services:
  ip-checker:
    image: zeeemughal/ip-checker:latest
    ports:
      - "8000:80"
    restart: unless-stopped
```

2. Run with Docker Compose:
```bash
docker-compose up -d
```

The application will be available at `http://localhost:8000`

## Manual Setup

1. Clone the repository
2. Open `index.html` in your web browser
3. No build process required!

## Technologies Used

- Vanilla JavaScript
- Custom CSS
- HTML5
- Docker
- Nginx (Alpine-based)

## API Dependencies

The application uses the following free APIs:
- ipify.org - IP address detection
- ipapi.co - IP details retrieval

## Features in Detail

- **IP Detection**: Automatically detects both IPv4 and IPv6 addresses
- **Detailed Information**: Provides comprehensive IP details including:
  - Location data
  - Network information
  - Organization details
- **Copy Feature**: Easy one-click copy of IP address
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Zeeshan Mughal

## Acknowledgments

- ipify.org for IP detection API
- ipapi.co for IP details API
