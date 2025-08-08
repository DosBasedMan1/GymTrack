# GymTrack
Gym progress tracking app.

## Project Overview
This repository contains an example implementation of a simple workout tracker built with Node.js, Express, Passport authentication and SQLite. See [docs/design.md](docs/design.md) for the initial design document.

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Create user accounts manually:
   ```bash
   node create-user.js <email> <password>
   ```
4. Visit `http://localhost:3000` in your browser and log in.

Data will be stored locally in `gymtrack.db`.

## License
This project is released under the MIT License. See [LICENSE](LICENSE) for details.
