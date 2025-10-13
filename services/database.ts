import { Platform } from 'react-native';

// Import the appropriate database service based on platform
const { databaseService } = Platform.select({
    web: () => require('./database.web'),
    default: () => require('./database.mobile'),
})();

export { databaseService };

