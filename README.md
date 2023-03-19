# eight-sleep
Eight Sleep Take Home Project

## Quick Start Guide
- `yarn install`
- `cd ios && pod install --repo-update && cd ..` (iOS only)
- `yarn start --reset-cache` (optional)
- `yarn ios [--simulator="<simulator name>"]` (iOS)
- `yarn android` (Android)

## Slow Start Guide

### Environment Setup
In order to run React Native projects locally, you will need to ensure your environment has the necessary tooling installed. Please go to `https://reactnative.dev/docs/environment-setup?guide=native`, select the appropriate Development OS and follow the instructions for desired Target OS options (Android and/or iOS).

### Install dependencies
In order to compile and run this application several dependencies must be installed for the React Native JS bundle and iOS native dependencies. The iOS dependencies are only necessary if you plan to run the iOS simulator. To install the JS dependencies run `yarn install` from the root project directory (where the package.json file exists). To install the iOS dependencies, change directories to the `ios/` directory with `cd ios` and run `pod install --repo-update`. Then change directories back to the root directory with `cd ..`.

### Start the JS metro bundler (optional)
Mobile pplications built with React Native typically retrieve the compiled JS bundle to execute from a small JS bundler server called Metro when running on a local simulator/emulator for development. To start the Metro bundler, run `yarn start --reset-cache` from the root project directory. This will start a bundler process in the terminal window where the command was executed. Leave this bundler running in the terminal window and execute all subequent commands in a separate terminal. This step is optional. If you start either the iOS or Android application, it will open a new terminal window with the Metro bundler running for you.

### Run the simulator (iOS)
To compile, install, and start the native iOS application, run `yarn ios [--simulator="<simulator name>"]` from the root project directory. This will start the default or specified simulator, compile the application, install the application, and start the application on the simulator. The Metro bundler will also be started in a new terminal window if an instance of the bundler is not running already.

### Run the emulator (Android)
To compile, install, and start the native Android application, run `yarn android` from the root project directory. This will start a Android Virtual Device (emulator) that has been created in Android Studio, compile the application, install the application, and start the application on the emulator. The Metro bundler will also be started in a new terminal window if an instance of the bundler is not running already.

## Testing
In order to execute unit tests, ensure the JS dependencies are all installed and run `yarn test` from the root project directory.
