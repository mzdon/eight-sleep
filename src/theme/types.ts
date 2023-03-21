import {MD3Theme, ThemeBase} from 'react-native-paper';

// layer of abstraction in case we want to change the Theme or UX lib in the future
// we won't have to update every import statement that consumes the Theme type
export type Theme = ThemeBase & MD3Theme;
